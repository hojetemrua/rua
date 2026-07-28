-- =============================================================================
-- RUA · Sinal Aberto: escada de capacidade, não de funcionalidade
--
-- POR QUE ESTA MIGRAÇÃO EXISTE
--
-- A escada anterior veio do protótipo e prometia recurso: "Mapa e traçado sem
-- limite", "Painel do assessor liberado". Isso é paywall custeado
-- coletivamente — a página que promete "nenhum recurso trancado" estava
-- vendendo recurso trancado logo abaixo. O §4 do handoff manda substituir.
--
-- A escada nova compra capacidade, independência e permanência. Tudo funciona
-- desde o nível 1.
--
-- As metas publicadas são BRUTAS porque o Catarse retém 13%. Elas são os
-- custos líquidos do §6 divididos por 0,87 — a mesma conta vista pelos dois
-- lados: R$ 1.150 bruto menos a taxa dá exatamente os R$ 1.000 de custo real.
-- O painel mostra as três linhas para ninguém precisar fazer essa conta de
-- cabeça.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Níveis de apoio
-- -----------------------------------------------------------------------------

create table if not exists public.niveis_apoio (
  ordem smallint primary key check (ordem between 1 and 99),
  nome text not null,
  /** Meta BRUTA do mês, antes da taxa da plataforma de apoio. */
  meta_centavos integer not null check (meta_centavos > 0),
  /** O que este nível compra. Nunca "libera". */
  descricao text not null,
  alcancado_em date
);

comment on table public.niveis_apoio is
  'Escada de sustentação. Nível compra capacidade, independência e permanência — nunca funcionalidade.';
comment on column public.niveis_apoio.meta_centavos is
  'Meta BRUTA: antes dos 13% retidos pela plataforma de apoio.';

insert into public.niveis_apoio (ordem, nome, meta_centavos, descricao) values
  (1, 'A rua de pé',            115000,
      'Servidor, banco, e-mail e mapas no ar para os primeiros milhares.'),
  (2, 'Cabe mais gente',        290000,
      'Escala para dezenas de milhares sem engasgo.'),
  (3, 'Fora do bolso de um',    520000,
      'Associação, contabilidade, jurídico e marca. A Rua para de depender de uma pessoa.'),
  (4, 'Um ano na frente',       800000,
      'Reserva de 12 meses. A rua não fecha em ano magro.'),
  (5, 'Mais gente construindo', 1380000,
      'Remunerar quem constrói: código, acessibilidade, suporte.')
on conflict (ordem) do update
  set nome = excluded.nome,
      meta_centavos = excluded.meta_centavos,
      descricao = excluded.descricao;

alter table public.niveis_apoio enable row level security;

create policy "niveis_apoio: leitura publica"
  on public.niveis_apoio for select to anon, authenticated using (true);

revoke all on table public.niveis_apoio from anon, authenticated;
grant select on table public.niveis_apoio to anon, authenticated;

-- -----------------------------------------------------------------------------
-- Transparência mensal: as três linhas
-- -----------------------------------------------------------------------------

alter table public.transparencia_meses
  add column if not exists apoio_bruto_centavos integer,
  add column if not exists taxa_centavos integer,
  add column if not exists nota text;

comment on column public.transparencia_meses.apoio_bruto_centavos is
  'Total bruto do mês FECHADO, do extrato real. Nulo enquanto o mês corre.';
comment on column public.transparencia_meses.taxa_centavos is
  'Taxa retida no mês FECHADO, do extrato real — não uma estimativa de 13%.';

-- O nível deixa de morar aqui: quem manda é `niveis_apoio.alcancado_em`.
-- A descrição também sai, porque era a do nível, não a do mês.
alter table public.transparencia_meses
  drop column if exists nivel,
  drop column if exists descricao;

-- -----------------------------------------------------------------------------
-- Apoios: mês, recorrência, fundador e anonimato
-- -----------------------------------------------------------------------------

alter table public.apoios
  add column if not exists mes date,
  add column if not exists recorrente boolean not null default true,
  add column if not exists fundador boolean not null default false,
  add column if not exists anonimo boolean not null default true;

-- Apoio vindo da plataforma de apoio não tem necessariamente conta na Rua.
alter table public.apoios alter column usuario_id drop not null;

comment on column public.apoios.fundador is
  'Apoio de quem começou o projeto. O painel mostra essa fatia em tom próprio: exibir como "arrecadado" sem distinguir seria tecnicamente verdade e moralmente esticado.';
comment on column public.apoios.mes is
  'Mês de competência. Nulo em apoio recorrente ativo, que vale para o mês corrente.';

-- O índice de um-ativo-por-pessoa precisa tolerar usuario_id nulo.
drop index if exists apoios_um_ativo_por_usuario;
create unique index if not exists apoios_um_ativo_por_usuario
  on public.apoios (usuario_id)
  where ativo and usuario_id is not null;

-- -----------------------------------------------------------------------------
-- Agregado público
-- -----------------------------------------------------------------------------

/**
 * Resumo do Sinal Aberto para o mês corrente.
 *
 * Devolve o nível CORRENTE — o primeiro ainda não alcançado — e não sempre o
 * nível 1: assim que o 1 é coberto, o alvo passa a ser o 2, e o 1 aparece na
 * lista de alcançados com a data.
 *
 * A fatia do fundador vem separada da da comunidade para o painel poder
 * desenhar a barra em dois tons.
 *
 * A taxa aqui é ESTIMADA em 13% porque o mês está aberto. O número real vem do
 * extrato e entra em `transparencia_meses` quando o mês fecha — é o que a
 * página de contas mostra. Estimar durante o mês e corrigir depois seria pior
 * que esperar: contas abertas com número que muda não são contas abertas.
 */
-- `create or replace` não altera tipo de retorno: a assinatura muda de seis
-- colunas para doze, então a função antiga precisa sair primeiro.
drop function if exists public.resumo_sinal_aberto();

create function public.resumo_sinal_aberto()
returns table (
  mes date,
  nivel smallint,
  nome text,
  descricao text,
  meta_bruta_centavos integer,
  bruto_centavos bigint,
  fundador_centavos bigint,
  comunidade_centavos bigint,
  taxa_estimada_centavos bigint,
  liquido_estimado_centavos bigint,
  apoiadores integer,
  custo_do_mes_centavos integer
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  with agora as (
    select date_trunc('month', (now() at time zone 'America/Sao_Paulo'))::date as mes
  ),
  soma as (
    select
      coalesce(sum(valor_centavos), 0)::bigint as bruto,
      coalesce(sum(valor_centavos) filter (where fundador), 0)::bigint as de_quem_comecou,
      coalesce(sum(valor_centavos) filter (where not fundador), 0)::bigint as da_comunidade,
      count(*)::integer as apoiadores
    from public.apoios
    where ativo
  ),
  alvo as (
    select ordem, nome, descricao, meta_centavos
    from public.niveis_apoio
    where alcancado_em is null
    order by ordem
    limit 1
  ),
  custo as (
    select t.custo_centavos
    from public.transparencia_meses t, agora
    where t.publicado and t.mes <= agora.mes
    order by t.mes desc
    limit 1
  )
  select
    agora.mes,
    alvo.ordem,
    alvo.nome,
    alvo.descricao,
    alvo.meta_centavos,
    soma.bruto,
    soma.de_quem_comecou,
    soma.da_comunidade,
    round(soma.bruto * 0.13)::bigint,
    (soma.bruto - round(soma.bruto * 0.13))::bigint,
    soma.apoiadores,
    custo.custo_centavos
  from agora, soma, alvo
  left join custo on true;
$$;

revoke all on function public.resumo_sinal_aberto() from public, anon, authenticated;
grant execute on function public.resumo_sinal_aberto() to anon, authenticated;

-- -----------------------------------------------------------------------------
-- A tabela antiga sai
-- -----------------------------------------------------------------------------

drop table if exists public.niveis_sinal_aberto;
