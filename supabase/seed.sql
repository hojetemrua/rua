-- =============================================================================
-- RUA · semente de desenvolvimento
--
-- Reproduz os números de exemplo do handoff de design para que a home tenha o
-- que mostrar no ambiente local: nível 1, R$ 640 de R$ 1.000, 41 pessoas
-- apoiando.
--
-- Roda em `supabase db reset`. Nada aqui deve ir para produção: os apoiadores
-- são contas fictícias em @exemplo.rua.run, sem senha utilizável.
-- =============================================================================

-- Idempotente: derruba os apoiadores de exemplo (e, em cascata, os apoios
-- deles) antes de recriar.
delete from auth.users where email like '%@exemplo.rua.run';

-- -----------------------------------------------------------------------------
-- Mês corrente: só o custo real. Os níveis vêm da migração, não da semente.
-- -----------------------------------------------------------------------------

insert into public.transparencia_meses (mes, custo_centavos, nota)
values (
  date_trunc('month', (now() at time zone 'America/Sao_Paulo'))::date,
  100000,
  'Custo de operação: servidor, banco, e-mail e mapas.'
)
on conflict (mes) do update
  set custo_centavos = excluded.custo_centavos,
      nota = excluded.nota;

-- -----------------------------------------------------------------------------
-- O apoio de quem começou
--
-- Cobre o nível 1 e é o que impede a barra de exibir R$ 0 · 0% · 0 pessoas, o
-- que o §4 proíbe. Não é maquiagem: é apoio real, registrado com
-- `fundador = true`, e o painel mostra essa fatia em tom próprio com a linha
-- "Os primeiros R$ 1.000 são de quem começou."
-- -----------------------------------------------------------------------------

with fundador as (
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data
  )
  values (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated', 'authenticated',
    'fundador@exemplo.rua.run',
    'semente-local-sem-senha',
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"nome":"Davi X Rodrigues"}'::jsonb
  )
  returning id
)
insert into public.apoios (usuario_id, valor_centavos, recorrente, fundador, anonimo)
select id, 115000, true, true, false from fundador;

-- Nível 1 alcançado: o alvo do painel passa a ser o 2.
update public.niveis_apoio
   set alcancado_em = current_date
 where ordem = 1;

-- -----------------------------------------------------------------------------
-- Apoiadores de exemplo, para o ambiente local ter movimento no nível 2
-- -----------------------------------------------------------------------------

with contas as (
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data
  )
  select
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated', 'authenticated',
    format('apoio%s@exemplo.rua.run', n),
    'semente-local-sem-senha',
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb
  from generate_series(1, 41) as n
  returning id, email
)
insert into public.apoios (usuario_id, valor_centavos, recorrente, fundador)
select id, case when email = 'apoio41@exemplo.rua.run' then 5000 else 2500 end, true, false
from contas;
