-- =============================================================================
-- RUA · Fase 2 — lista de espera e painel Sinal Aberto
--
-- Duas regras moldam este arquivo:
--   1. Os números do painel são o custo real do mês. Nada de valor fixado no
--      código: a home lê daqui.
--   2. Quem apoia não fica exposto. O total e a contagem são públicos; a linha
--      de cada apoio, não. Por isso o agregado sai de função SECURITY DEFINER
--      e a tabela `apoios` não tem leitura para `anon`.
--
-- As tabelas novas em `public` não são expostas automaticamente à Data API
-- (ver auto_expose_new_tables em supabase/config.toml), então cada permissão
-- aparece aqui de forma explícita.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Lista de espera
-- -----------------------------------------------------------------------------

create table if not exists public.lista_espera (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  origem text not null default 'home',
  criado_em timestamptz not null default now(),
  confirmado_em timestamptz,
  constraint lista_espera_email_normalizado check (email = lower(btrim(email))),
  constraint lista_espera_email_plausivel check (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]{2,}$'),
  constraint lista_espera_origem_curta check (char_length(origem) between 1 and 40)
);

comment on table public.lista_espera is
  'E-mails que pediram aviso quando o Rua abrir. Escrita só pela função entrar_na_lista.';

create unique index if not exists lista_espera_email_unico
  on public.lista_espera (email);

alter table public.lista_espera enable row level security;

-- Sem policy nenhuma, de propósito: nem `anon` nem `authenticated` leem ou
-- escrevem direto. A porta de entrada é entrar_na_lista(), logo abaixo.

/**
 * Entrada na lista de espera.
 *
 * SECURITY DEFINER e retorno vazio nos dois caminhos: quem chama não descobre
 * se o e-mail já estava cadastrado. Isso evita usar a tabela como oráculo de
 * "esta pessoa se inscreveu no Rua?".
 */
create or replace function public.entrar_na_lista(
  p_email text,
  p_origem text default 'home'
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_origem text := coalesce(nullif(btrim(coalesce(p_origem, '')), ''), 'home');
begin
  if v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]{2,}$' then
    raise exception 'email_invalido' using errcode = '22023';
  end if;

  if char_length(v_email) > 320 then
    raise exception 'email_invalido' using errcode = '22023';
  end if;

  insert into public.lista_espera (email, origem)
  values (v_email, left(v_origem, 40))
  on conflict (email) do nothing;
end;
$$;

revoke all on function public.entrar_na_lista(text, text) from public;
grant execute on function public.entrar_na_lista(text, text) to anon, authenticated;

-- -----------------------------------------------------------------------------
-- Sinal Aberto: níveis, custo do mês e apoios
-- -----------------------------------------------------------------------------

create table if not exists public.niveis_sinal_aberto (
  nivel smallint primary key check (nivel between 1 and 99),
  titulo text not null,
  meta_centavos integer not null check (meta_centavos > 0),
  alcancado_em date
);

comment on table public.niveis_sinal_aberto is
  'Cada nível alcançado fica publicado na home, com o número real.';

create table if not exists public.transparencia_meses (
  mes date primary key,
  nivel smallint not null references public.niveis_sinal_aberto (nivel),
  descricao text not null,
  -- Custo real do mês. Sem meta escondida.
  custo_centavos integer not null check (custo_centavos > 0),
  publicado boolean not null default true,
  constraint transparencia_mes_no_primeiro_dia check (extract(day from mes) = 1)
);

comment on column public.transparencia_meses.custo_centavos is
  'Custo real de operação do mês, em centavos. É o número que a home mostra.';

create table if not exists public.apoios (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users (id) on delete cascade,
  valor_centavos integer not null check (valor_centavos > 0),
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  cancelado_em timestamptz,
  constraint apoio_cancelamento_coerente check (
    (ativo and cancelado_em is null) or (not ativo and cancelado_em is not null)
  )
);

comment on table public.apoios is
  'Apoio mensal, cancelável a qualquer hora. Não destrava recurso nenhum.';

-- Um apoio ativo por pessoa; os cancelados ficam no histórico.
create unique index if not exists apoios_um_ativo_por_usuario
  on public.apoios (usuario_id)
  where ativo;

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------

alter table public.niveis_sinal_aberto enable row level security;

create policy "niveis: leitura publica"
  on public.niveis_sinal_aberto
  for select
  to anon, authenticated
  using (true);

alter table public.transparencia_meses enable row level security;

create policy "transparencia: leitura publica do que esta publicado"
  on public.transparencia_meses
  for select
  to anon, authenticated
  using (publicado);

alter table public.apoios enable row level security;

create policy "apoios: cada um le o proprio"
  on public.apoios
  for select
  to authenticated
  using (auth.uid() = usuario_id);

create policy "apoios: cada um cria o proprio"
  on public.apoios
  for insert
  to authenticated
  with check (auth.uid() = usuario_id);

create policy "apoios: cada um altera o proprio"
  on public.apoios
  for update
  to authenticated
  using (auth.uid() = usuario_id)
  with check (auth.uid() = usuario_id);

grant select on public.niveis_sinal_aberto to anon, authenticated;
grant select on public.transparencia_meses to anon, authenticated;
grant select, insert, update on public.apoios to authenticated;

-- -----------------------------------------------------------------------------
-- Agregado público do painel
-- -----------------------------------------------------------------------------

/**
 * Resumo do mês corrente para a home.
 *
 * Soma os apoios ativos: o modelo é apoio mensal recorrente, então "quem está
 * apoiando agora" é exatamente o que sustenta o mês corrente. Devolve o mês
 * publicado mais recente que não seja futuro, para a home nunca ficar vazia
 * quando o registro do mês ainda não foi criado.
 */
create or replace function public.resumo_sinal_aberto()
returns table (
  mes date,
  nivel smallint,
  descricao text,
  custo_centavos integer,
  arrecadado_centavos bigint,
  apoiadores integer
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    m.mes,
    m.nivel,
    m.descricao,
    m.custo_centavos,
    coalesce(sum(a.valor_centavos), 0)::bigint as arrecadado_centavos,
    count(a.id)::integer as apoiadores
  from public.transparencia_meses m
  left join public.apoios a on a.ativo
  where m.publicado
    and m.mes <= date_trunc('month', (now() at time zone 'America/Sao_Paulo'))::date
  group by m.mes, m.nivel, m.descricao, m.custo_centavos
  order by m.mes desc
  limit 1;
$$;

revoke all on function public.resumo_sinal_aberto() from public;
grant execute on function public.resumo_sinal_aberto() to anon, authenticated;
