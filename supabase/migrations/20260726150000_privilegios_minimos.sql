-- =============================================================================
-- RUA · privilégios mínimos para os papéis da Data API
--
-- POR QUE ESTA MIGRAÇÃO EXISTE
--
-- O projeto hospedado concede automaticamente o conjunto completo de
-- privilégios (SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER)
-- a `anon` e `authenticated` em toda tabela nova de `public`. No ambiente local
-- isso não acontece, então a migração anterior — que só fazia GRANT do que
-- precisava — passava despercebida: o que ela concedia era um subconjunto do
-- que o host já tinha dado.
--
-- Depender só de RLS para segurar isso é frágil por dois motivos:
--
--   1. TRUNCATE **não** passa por RLS. Com o privilégio concedido, basta
--      qualquer caminho que execute TRUNCATE para zerar a tabela.
--   2. Uma policy nova escrita com escopo largo demais passaria a valer sobre
--      um privilégio que nunca deveria existir. A RLS vira a única barreira,
--      em vez da segunda.
--
-- Aqui os privilégios voltam ao mínimo, de forma explícita e independente do
-- comportamento do host — o resultado é o mesmo em local e em produção.
--
-- ATENÇÃO PARA AS PRÓXIMAS MIGRAÇÕES: toda tabela nova em `public` nasce com o
-- conjunto completo concedido em produção. Repita o REVOKE ALL + GRANT do
-- mínimo ao criar tabela.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tabelas: zera e devolve só o necessário
-- -----------------------------------------------------------------------------

revoke all on table public.lista_espera from anon, authenticated;
revoke all on table public.apoios from anon, authenticated;
revoke all on table public.niveis_sinal_aberto from anon, authenticated;
revoke all on table public.transparencia_meses from anon, authenticated;

-- Lista de espera: ninguém toca direto. A porta é entrar_na_lista().
-- (sem grant nenhum, de propósito)

-- Sinal Aberto: o que é público é público, e só para leitura.
grant select on table public.niveis_sinal_aberto to anon, authenticated;
grant select on table public.transparencia_meses to anon, authenticated;

-- Apoios: cada pessoa cuida do próprio, e a RLS confere de quem é.
-- Sem DELETE: cancelamento é `ativo = false`, o histórico não se apaga.
grant select, insert, update on table public.apoios to authenticated;

-- -----------------------------------------------------------------------------
-- Funções: idem
-- -----------------------------------------------------------------------------

revoke all on function public.entrar_na_lista(text, text) from public, anon, authenticated;
revoke all on function public.resumo_sinal_aberto() from public, anon, authenticated;

grant execute on function public.entrar_na_lista(text, text) to anon, authenticated;
grant execute on function public.resumo_sinal_aberto() to anon, authenticated;
