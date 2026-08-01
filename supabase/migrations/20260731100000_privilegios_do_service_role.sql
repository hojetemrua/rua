-- Conserta os privilégios de `service_role` e torna os três papéis explícitos.
--
-- O BUG
--
-- A migração 20260726150000 revogou tudo de `anon` e `authenticated` e devolveu
-- o mínimo — e nunca mencionou `service_role`. Parecia inofensivo. Não era:
-- `service_role` ficou com TRUNCATE, REFERENCES e TRIGGER e **sem SELECT,
-- INSERT, UPDATE ou DELETE**. O papel de confiança do servidor não conseguia
-- ler a própria tabela.
--
-- POR QUE NINGUÉM VIU
--
-- O schema `public` tem DOIS conjuntos de privilégio padrão para tabela, e o que
-- vale depende de quem cria:
--
--   dono supabase_admin → arwdDxtm  (tudo)
--   dono postgres       →    Dxtm   (TRUNCATE, REFERENCES, TRIGGER, MAINTAIN)
--
-- Migração roda como `postgres`. Então toda tabela criada por migração nasce,
-- para os três papéis, com TRUNCATE e sem leitura. Duas consequências:
--
--   1. `anon` recebe TRUNCATE de graça — e TRUNCATE ignora RLS. Era o achado
--      da migração anterior, e ele se confirma aqui pela raiz.
--   2. `service_role` não recebe leitura nenhuma. Passou despercebido porque
--      tudo até agora foi escrito pela Management API, que conecta como
--      `postgres`, não pela chave de serviço.
--
-- O que quebraria em produção, sem barulho: o fechamento mensal escrevendo
-- `transparencia_meses` e a sincronização do Catarse escrevendo `apoios` — as
-- duas coisas que a especificação manda serem feitas por `service_role`.
--
-- A CORREÇÃO
--
-- Ser explícito para os três papéis em todas as tabelas, em vez de herdar o
-- padrão. O resultado passa a ser idêntico em local e em produção,
-- independentemente de quem criou a tabela.
--
-- TRUNCATE não é concedido a ninguém, nem a `service_role`. Um trabalho de
-- servidor com bug não deve conseguir zerar tabela por um caminho que a RLS
-- não vê.

do $$
declare
  t text;
  publicas text[] := array['niveis_apoio', 'transparencia_meses', 'projeto'];
  todas text[] := array[
    -- Sinal Aberto e lançamento
    'lista_espera', 'apoios', 'niveis_apoio', 'transparencia_meses', 'projeto',
    -- núcleo do app
    'perfis', 'zonas_privacidade', 'tenis', 'grupos', 'grupo_membros', 'turmas',
    'turma_membros', 'convites', 'treinos_modelo', 'treinos_prescritos',
    'atividades', 'comentarios', 'encontros', 'encontro_presencas', 'metas'
  ];
begin
  for t in select unnest(todas)
  loop
    -- Zera os três. Nada de herança do padrão do schema.
    execute format('revoke all on table public.%I from anon, authenticated, service_role', t);

    -- A chave de serviço lê e escreve tudo; a RLS não se aplica a ela porque o
    -- papel tem BYPASSRLS. É o papel do servidor, e nunca vai para o cliente.
    execute format('grant select, insert, update, delete on table public.%I to service_role', t);
  end loop;

  -- Autenticado: as tabelas do app, com a RLS decidindo linha por linha.
  for t in select unnest(array[
    'perfis', 'zonas_privacidade', 'tenis', 'grupos', 'grupo_membros', 'turmas',
    'turma_membros', 'convites', 'treinos_modelo', 'treinos_prescritos',
    'atividades', 'comentarios', 'encontros', 'encontro_presencas', 'metas'
  ])
  loop
    execute format('grant select, insert, update, delete on table public.%I to authenticated', t);
  end loop;

  -- Apoios: sem DELETE. Cancelar apoio é registro, não apagamento.
  grant select, insert, update on table public.apoios to authenticated;

  -- Leitura pública de verdade, para anônimo e autenticado.
  for t in select unnest(publicas)
  loop
    execute format('grant select on table public.%I to anon, authenticated', t);
  end loop;

  -- Rotas públicas da web: /@apelido, /g/:slug, /e/:id e biblioteca pública.
  -- A RLS é que decide se a linha aparece; o GRANT só abre a porta.
  grant select on table public.perfis to anon;
  grant select on table public.grupos to anon;
  grant select on table public.encontros to anon;

  -- lista_espera continua sem grant para anon e authenticated: a porta é a
  -- função entrar_na_lista(), que é SECURITY DEFINER e idempotente.
end $$;
