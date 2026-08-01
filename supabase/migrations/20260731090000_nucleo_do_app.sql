-- Núcleo do app: perfis, atividades, grupos, treinos, comunidade.
--
-- Ordem importa por causa das chaves estrangeiras: perfis antes de tudo,
-- treinos_prescritos antes de atividades.
--
-- Duas decisões que atravessam o arquivo:
--
-- 1. `atividades.id_local` com unique (user_id, id_local) é a espinha da
--    deduplicação. O app gera o id no dispositivo antes de sincronizar, e a
--    importação de relógio usa o id do próprio registro de saúde. Reenviar a
--    mesma corrida é `on conflict do nothing`, não uma linha nova.
--
-- 2. Policy que consulta outra tabela protegida por RLS pode devolver menos do
--    que devia, porque a RLS da tabela consultada também vale ali. Por isso
--    toda pergunta de pertencimento passa por função `security definer` com
--    `search_path` fixo.

-- ─────────────────────────────────────────────────────────── perfis

create table if not exists public.perfis (
  id uuid primary key references auth.users on delete cascade,
  apelido text unique not null check (apelido ~ '^[a-z0-9_]{3,30}$'),
  nome text not null check (length(trim(nome)) > 0),
  cidade text,
  uf text check (uf is null or uf ~ '^[A-Z]{2}$'),
  foto_path text,
  bio text check (bio is null or length(bio) <= 500),
  -- Privado por padrão. A regra inviolável não admite o contrário.
  perfil_publico boolean not null default false,
  unidade text not null default 'km' check (unidade in ('km', 'mi')),
  criado_em timestamptz not null default now()
);

create table if not exists public.zonas_privacidade (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.perfis on delete cascade,
  lat numeric(9, 6) not null check (lat between -90 and 90),
  lng numeric(9, 6) not null check (lng between -180 and 180),
  raio_m int not null default 200 check (raio_m between 50 and 2000),
  criado_em timestamptz not null default now()
);
create index if not exists zonas_privacidade_user on public.zonas_privacidade (user_id);

create table if not exists public.tenis (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.perfis on delete cascade,
  nome text not null,
  marca text,
  km_inicial numeric(8, 2) not null default 0 check (km_inicial >= 0),
  ativo boolean not null default true,
  aposentado_em date,
  criado_em timestamptz not null default now()
);
create index if not exists tenis_user on public.tenis (user_id);

-- ─────────────────────────────────────────────────────────── grupos

create table if not exists public.grupos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  slug text unique not null check (slug ~ '^[a-z0-9-]{3,40}$'),
  tipo text not null check (tipo in ('assessoria', 'clube')),
  cidade text,
  uf text check (uf is null or uf ~ '^[A-Z]{2}$'),
  bio text,
  foto_path text,
  publico boolean not null default true,
  criado_por uuid not null references public.perfis on delete restrict,
  criado_em timestamptz not null default now()
);

create table if not exists public.grupo_membros (
  id uuid primary key default gen_random_uuid(),
  grupo_id uuid not null references public.grupos on delete cascade,
  user_id uuid not null references public.perfis on delete cascade,
  papel text not null check (papel in ('assessor', 'auxiliar', 'corredor')),
  status text not null default 'pendente' check (status in ('ativo', 'pendente', 'inativo')),
  entrou_em timestamptz not null default now(),
  unique (grupo_id, user_id)
);
create index if not exists grupo_membros_user on public.grupo_membros (user_id, status);
create index if not exists grupo_membros_grupo on public.grupo_membros (grupo_id, status);

create table if not exists public.turmas (
  id uuid primary key default gen_random_uuid(),
  grupo_id uuid not null references public.grupos on delete cascade,
  nome text not null,
  descricao text,
  criado_em timestamptz not null default now()
);
create index if not exists turmas_grupo on public.turmas (grupo_id);

create table if not exists public.turma_membros (
  turma_id uuid not null references public.turmas on delete cascade,
  user_id uuid not null references public.perfis on delete cascade,
  entrou_em timestamptz not null default now(),
  primary key (turma_id, user_id)
);

create table if not exists public.convites (
  id uuid primary key default gen_random_uuid(),
  grupo_id uuid not null references public.grupos on delete cascade,
  token text unique not null,
  papel text not null check (papel in ('assessor', 'auxiliar', 'corredor')),
  expira_em timestamptz not null,
  usos_max int not null default 1 check (usos_max > 0),
  usos int not null default 0 check (usos >= 0),
  criado_em timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────── treinos

create table if not exists public.treinos_modelo (
  id uuid primary key default gen_random_uuid(),
  grupo_id uuid references public.grupos on delete cascade,
  autor_id uuid not null references public.perfis on delete restrict,
  nome text not null,
  tipo text not null check (tipo in ('leve', 'intervalado', 'longao', 'ritmo', 'regenerativo', 'forca')),
  faixa_volume text,
  estrutura jsonb not null,
  notas text,
  -- Biblioteca pública da Rua: custo zero nas duas pontas.
  publico boolean not null default false,
  usos int not null default 0 check (usos >= 0),
  criado_em timestamptz not null default now()
);
create index if not exists treinos_modelo_grupo on public.treinos_modelo (grupo_id);
create index if not exists treinos_modelo_publicos on public.treinos_modelo (publico) where publico;

create table if not exists public.treinos_prescritos (
  id uuid primary key default gen_random_uuid(),
  grupo_id uuid not null references public.grupos on delete cascade,
  -- Sempre resolvido por corredor, mesmo quando prescrito para a turma.
  user_id uuid not null references public.perfis on delete cascade,
  turma_id uuid references public.turmas on delete set null,
  modelo_id uuid references public.treinos_modelo on delete set null,
  data date not null,
  estrutura jsonb not null,
  notas text,
  status text not null default 'previsto' check (status in ('previsto', 'realizado', 'perdido', 'ajustado')),
  criado_por uuid not null references public.perfis on delete restrict,
  criado_em timestamptz not null default now()
);
create index if not exists treinos_prescritos_user on public.treinos_prescritos (user_id, data);
create index if not exists treinos_prescritos_grupo on public.treinos_prescritos (grupo_id, data);

-- ─────────────────────────────────────────────────────────── atividades

create table if not exists public.atividades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.perfis on delete cascade,
  inicio timestamptz not null,
  duracao_s int not null check (duracao_s > 0),
  duracao_movimento_s int check (duracao_movimento_s is null or duracao_movimento_s >= 0),
  distancia_m numeric(10, 2) not null check (distancia_m >= 0),
  ganho_m numeric(8, 2),
  pace_medio_s_km int,
  fc_media int check (fc_media is null or fc_media between 20 and 260),
  fc_max int check (fc_max is null or fc_max between 20 and 260),
  cadencia_media int,
  fonte text not null check (fonte in ('gps', 'manual', 'importacao', 'saude')),
  -- Codificada e JÁ recortada por zona de privacidade. Nunca guardar o traçado
  -- cru: a regra é aplicar a zona ANTES de persistir, sem exceção para dado
  -- que veio de relógio ou de arquivo.
  polilinha text,
  splits jsonb,
  tempo_por_zona jsonb,
  arquivo_path text,
  tenis_id uuid references public.tenis on delete set null,
  percepcao int check (percepcao is null or percepcao between 1 and 10),
  comentario text,
  treino_prescrito_id uuid references public.treinos_prescritos on delete set null,
  privacidade text not null default 'privado' check (privacidade in ('privado', 'grupo', 'publico')),
  -- Id gerado no dispositivo, ou o id do registro de saúde/arquivo de origem.
  -- É o que torna a sincronização idempotente.
  id_local text not null,
  criado_em timestamptz not null default now(),
  unique (user_id, id_local)
);
create index if not exists atividades_user_inicio on public.atividades (user_id, inicio desc);
create index if not exists atividades_treino on public.atividades (treino_prescrito_id);

create table if not exists public.comentarios (
  id uuid primary key default gen_random_uuid(),
  atividade_id uuid not null references public.atividades on delete cascade,
  autor_id uuid not null references public.perfis on delete cascade,
  texto text not null check (length(trim(texto)) > 0),
  criado_em timestamptz not null default now()
);
create index if not exists comentarios_atividade on public.comentarios (atividade_id);

-- ─────────────────────────────────────────────────────────── comunidade

create table if not exists public.encontros (
  id uuid primary key default gen_random_uuid(),
  grupo_id uuid references public.grupos on delete cascade,
  titulo text not null,
  descricao text,
  inicio timestamptz not null,
  local_nome text,
  lat numeric(9, 6) check (lat is null or lat between -90 and 90),
  lng numeric(9, 6) check (lng is null or lng between -180 and 180),
  publico boolean not null default true,
  criado_por uuid not null references public.perfis on delete restrict,
  criado_em timestamptz not null default now()
);
create index if not exists encontros_inicio on public.encontros (inicio);

create table if not exists public.encontro_presencas (
  encontro_id uuid not null references public.encontros on delete cascade,
  user_id uuid not null references public.perfis on delete cascade,
  status text not null check (status in ('vou', 'talvez', 'nao')),
  criado_em timestamptz not null default now(),
  primary key (encontro_id, user_id)
);

create table if not exists public.metas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.perfis on delete cascade,
  tipo text not null check (tipo in ('distancia_semanal', 'distancia_mensal', 'presenca_semanal', 'prova')),
  alvo numeric(10, 2),
  periodo_inicio date,
  periodo_fim date,
  prova_nome text,
  prova_data date,
  criado_em timestamptz not null default now()
);
create index if not exists metas_user on public.metas (user_id);

-- ─────────────────────────────────────────── funções de pertencimento
--
-- `security definer` de propósito: a policy precisa ver a linha de
-- grupo_membros mesmo quando a RLS de grupo_membros esconderia. Sem isso, a
-- policy de atividades devolveria menos do que devia — e um assessor deixaria
-- de ver o treino do próprio aluno sem nenhum erro aparecer.
--
-- `search_path` fixo para ninguém trocar o significado de `grupo_membros` por
-- um schema no caminho.

create or replace function public.e_membro(p_grupo uuid)
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.grupo_membros m
    where m.grupo_id = p_grupo and m.user_id = auth.uid() and m.status = 'ativo'
  );
$$;

create or replace function public.e_assessor(p_grupo uuid)
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.grupo_membros m
    where m.grupo_id = p_grupo and m.user_id = auth.uid()
      and m.status = 'ativo' and m.papel in ('assessor', 'auxiliar')
  );
$$;

/** Verdadeiro quando quem pergunta e o outro corredor dividem algum grupo. */
create or replace function public.compartilha_grupo(p_user uuid)
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.grupo_membros meu
    join public.grupo_membros dele on dele.grupo_id = meu.grupo_id
    where meu.user_id = auth.uid() and meu.status = 'ativo'
      and dele.user_id = p_user and dele.status = 'ativo'
  );
$$;

/**
 * Verdadeiro quando quem pergunta assessora o grupo do treino prescrito.
 *
 * É o que dá ao assessor leitura da atividade vinculada ao treino que ele
 * prescreveu, mesmo com a atividade privada — sem abrir o resto do histórico
 * do corredor.
 */
create or replace function public.e_assessor_do_treino(p_treino uuid)
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.treinos_prescritos t
    join public.grupo_membros m on m.grupo_id = t.grupo_id
    where t.id = p_treino and m.user_id = auth.uid()
      and m.status = 'ativo' and m.papel in ('assessor', 'auxiliar')
  );
$$;

-- ─────────────────────────────────────────────────────────── RLS

alter table public.perfis              enable row level security;
alter table public.zonas_privacidade   enable row level security;
alter table public.tenis               enable row level security;
alter table public.grupos              enable row level security;
alter table public.grupo_membros       enable row level security;
alter table public.turmas              enable row level security;
alter table public.turma_membros       enable row level security;
alter table public.convites            enable row level security;
alter table public.treinos_modelo      enable row level security;
alter table public.treinos_prescritos  enable row level security;
alter table public.atividades          enable row level security;
alter table public.comentarios         enable row level security;
alter table public.encontros           enable row level security;
alter table public.encontro_presencas  enable row level security;
alter table public.metas               enable row level security;

-- Toda policy declara o papel a que se aplica.
--
-- Não é decoração. Policy sem `to` vale para TODOS os papéis, inclusive `anon`
-- — e quando ela chama uma função que o anônimo não pode executar, o `select`
-- inteiro falha. O anônimo perdia até o perfil público, que a policy ao lado
-- liberava. Papel explícito evita a classe toda.

-- perfis
create policy perfis_le_proprio on public.perfis
  for select to authenticated using (id = auth.uid());
create policy perfis_le_publico on public.perfis
  for select to anon, authenticated using (perfil_publico);
create policy perfis_le_do_grupo on public.perfis
  for select to authenticated using (public.compartilha_grupo(id));
create policy perfis_cria_proprio on public.perfis
  for insert to authenticated with check (id = auth.uid());
create policy perfis_altera_proprio on public.perfis
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy perfis_apaga_proprio on public.perfis
  for delete to authenticated using (id = auth.uid());

-- Zonas de privacidade: só do dono, nunca de terceiro, nem do assessor. É o
-- dado mais sensível do app — diz onde a pessoa mora.
create policy zonas_do_dono on public.zonas_privacidade
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy tenis_do_dono on public.tenis
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- grupos
create policy grupos_le_publico on public.grupos
  for select to anon, authenticated using (publico);
create policy grupos_le_membro on public.grupos
  for select to authenticated using (public.e_membro(id));
create policy grupos_cria on public.grupos
  for insert to authenticated with check (criado_por = auth.uid());
create policy grupos_altera_assessor on public.grupos
  for update to authenticated using (public.e_assessor(id)) with check (public.e_assessor(id));

-- grupo_membros
create policy membros_le_proprio on public.grupo_membros
  for select to authenticated using (user_id = auth.uid());
create policy membros_le_do_grupo on public.grupo_membros
  for select to authenticated using (public.e_membro(grupo_id));
create policy membros_assessor_gerencia on public.grupo_membros
  for all to authenticated using (public.e_assessor(grupo_id)) with check (public.e_assessor(grupo_id));
-- O corredor pode sair: mexe só na própria linha.
create policy membros_sai_sozinho on public.grupo_membros
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- turmas
create policy turmas_le_membro on public.turmas
  for select to authenticated using (public.e_membro(grupo_id));
create policy turmas_assessor on public.turmas
  for all to authenticated using (public.e_assessor(grupo_id)) with check (public.e_assessor(grupo_id));

create policy turma_membros_le on public.turma_membros
  for select to authenticated using (
    user_id = auth.uid()
    or exists (select 1 from public.turmas t where t.id = turma_id and public.e_membro(t.grupo_id))
  );
create policy turma_membros_assessor on public.turma_membros
  for all to authenticated using (
    exists (select 1 from public.turmas t where t.id = turma_id and public.e_assessor(t.grupo_id))
  ) with check (
    exists (select 1 from public.turmas t where t.id = turma_id and public.e_assessor(t.grupo_id))
  );

-- Convites: só quem assessora vê o token. Nem o corredor do próprio grupo —
-- token de convite é credencial, não informação de grupo.
create policy convites_assessor on public.convites
  for all to authenticated using (public.e_assessor(grupo_id)) with check (public.e_assessor(grupo_id));

-- treinos_modelo: a biblioteca pública é para quem tem conta, não para anônimo.
create policy modelos_le_publico on public.treinos_modelo
  for select to authenticated using (publico);
create policy modelos_le_do_grupo on public.treinos_modelo
  for select to authenticated using (grupo_id is not null and public.e_membro(grupo_id));
create policy modelos_escreve_assessor on public.treinos_modelo
  for all to authenticated using (grupo_id is not null and public.e_assessor(grupo_id))
  with check (autor_id = auth.uid() and (grupo_id is null or public.e_assessor(grupo_id)));

-- treinos_prescritos
create policy prescritos_le_corredor on public.treinos_prescritos
  for select to authenticated using (user_id = auth.uid());
create policy prescritos_assessor on public.treinos_prescritos
  for all to authenticated using (public.e_assessor(grupo_id)) with check (public.e_assessor(grupo_id));

-- atividades
create policy atividades_do_dono on public.atividades
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy atividades_le_publica on public.atividades
  for select to anon, authenticated using (privacidade = 'publico');
create policy atividades_le_do_grupo on public.atividades
  for select to authenticated
  using (privacidade in ('grupo', 'publico') and public.compartilha_grupo(user_id));
-- O assessor sempre lê a atividade vinculada ao treino que prescreveu — e só
-- essa. O resto do histórico do corredor continua fechado.
create policy atividades_le_assessor on public.atividades
  for select to authenticated using (
    treino_prescrito_id is not null and public.e_assessor_do_treino(treino_prescrito_id)
  );

-- Comentários: quem pode ler a atividade pode ler o recado. Aqui a RLS da
-- tabela consultada VALE de propósito — é o que faz a regra ser a mesma.
create policy comentarios_le on public.comentarios
  for select to authenticated using (
    exists (select 1 from public.atividades a where a.id = atividade_id)
  );
create policy comentarios_escreve on public.comentarios
  for insert to authenticated with check (
    autor_id = auth.uid()
    and exists (select 1 from public.atividades a where a.id = atividade_id)
  );
create policy comentarios_apaga_autor on public.comentarios
  for delete to authenticated using (autor_id = auth.uid());

-- encontros
create policy encontros_le_publico on public.encontros
  for select to anon, authenticated using (publico);
create policy encontros_le_do_grupo on public.encontros
  for select to authenticated using (grupo_id is not null and public.e_membro(grupo_id));
create policy encontros_escreve on public.encontros
  for all to authenticated
  using (criado_por = auth.uid() or (grupo_id is not null and public.e_assessor(grupo_id)))
  with check (criado_por = auth.uid() or (grupo_id is not null and public.e_assessor(grupo_id)));

create policy presencas_le on public.encontro_presencas
  for select to authenticated using (
    exists (select 1 from public.encontros e where e.id = encontro_id)
  );
create policy presencas_do_proprio on public.encontro_presencas
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy metas_do_dono on public.metas
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ─────────────────────────────────────────── privilégios mínimos
--
-- O projeto hospedado concede tudo por padrão, TRUNCATE incluído — e TRUNCATE
-- ignora RLS. Revogar e reconceder o mínimo, como já foi feito para as tabelas
-- do Sinal Aberto.

do $$
declare t text;
begin
  for t in select unnest(array[
    'perfis', 'zonas_privacidade', 'tenis', 'grupos', 'grupo_membros', 'turmas',
    'turma_membros', 'convites', 'treinos_modelo', 'treinos_prescritos',
    'atividades', 'comentarios', 'encontros', 'encontro_presencas', 'metas'
  ])
  loop
    execute format('revoke all on public.%I from anon, authenticated', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
  end loop;
end $$;

-- Anônimo só lê o que as rotas públicas da web precisam: /@apelido, /g/:slug e
-- /e/:id. A biblioteca de treinos fica de fora — a especificação diz "leitura
-- para qualquer autenticado", e autenticado não é anônimo.
grant select on public.perfis to anon;
grant select on public.grupos to anon;
grant select on public.encontros to anon;

-- Revogar de `public` também, não só de `anon`. O Postgres concede EXECUTE a
-- PUBLIC em toda função nova, e `revoke ... from anon` não desfaz isso: o
-- anônimo continua executando pela herança de PUBLIC. Aqui as funções são
-- SECURITY DEFINER, então deixar a porta aberta é o pior lugar para esquecer.
revoke all on function public.e_membro(uuid) from public, anon, authenticated;
revoke all on function public.e_assessor(uuid) from public, anon, authenticated;
revoke all on function public.compartilha_grupo(uuid) from public, anon, authenticated;
revoke all on function public.e_assessor_do_treino(uuid) from public, anon, authenticated;
grant execute on function public.e_membro(uuid) to authenticated;
grant execute on function public.e_assessor(uuid) to authenticated;
grant execute on function public.compartilha_grupo(uuid) to authenticated;
grant execute on function public.e_assessor_do_treino(uuid) to authenticated;
