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
-- Níveis do Sinal Aberto
-- -----------------------------------------------------------------------------

insert into public.niveis_sinal_aberto (nivel, titulo, meta_centavos) values
  (1, 'Servidor de pé para 5.000 corredores', 100000),
  (2, 'Mapa e traçado sem limite',            240000),
  (3, 'Painel do assessor liberado',          430000),
  (4, 'Um ano garantido na frente',           700000)
on conflict (nivel) do update
  set titulo = excluded.titulo,
      meta_centavos = excluded.meta_centavos;

-- -----------------------------------------------------------------------------
-- Mês corrente
-- -----------------------------------------------------------------------------

insert into public.transparencia_meses (mes, nivel, descricao, custo_centavos)
values (
  date_trunc('month', (now() at time zone 'America/Sao_Paulo'))::date,
  1,
  'Servidor de pé para 5.000 corredores',
  100000
)
on conflict (mes) do update
  set nivel = excluded.nivel,
      descricao = excluded.descricao,
      custo_centavos = excluded.custo_centavos;

-- -----------------------------------------------------------------------------
-- 41 pessoas apoiando, somando R$ 640,00
-- 40 × R$ 15,00 + 1 × R$ 40,00 = R$ 640,00
-- -----------------------------------------------------------------------------

with contas as (
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data
  )
  select
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    format('apoio%s@exemplo.rua.run', n),
    -- Marcador: não é hash de senha nenhuma, estas contas não fazem login.
    'semente-local-sem-senha',
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb
  from generate_series(1, 41) as n
  returning id, email
)
insert into public.apoios (usuario_id, valor_centavos)
select
  id,
  case when email = 'apoio41@exemplo.rua.run' then 4000 else 1500 end
from contas;
