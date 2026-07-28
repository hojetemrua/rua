-- =============================================================================
-- RUA · subtítulo dos níveis do Sinal Aberto
--
-- O design do painel mostra uma linha de apoio abaixo do título de cada nível
-- ("para todo mundo, todo dia"). Como todo número e todo texto do painel saem
-- do banco, o subtítulo também precisa sair — e não ficar fixado no código.
--
-- Opcional de propósito: nível sem subtítulo simplesmente não desenha a linha.
-- =============================================================================

alter table public.niveis_sinal_aberto
  add column if not exists subtitulo text;

comment on column public.niveis_sinal_aberto.subtitulo is
  'Linha de apoio exibida abaixo do título no painel. Opcional.';
