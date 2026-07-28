-- =============================================================================
-- RUA · datas do projeto
--
-- Uma linha só, leitura pública. Guarda as duas datas que a home precisa e que
-- não deveriam viver no código:
--
--   lanca_em     — quando a plataforma e os apps abrem
--   apoio_abre_em — quando a campanha de apoio começa a receber
--
-- Por que em tabela e não constante: a home muda de estado nessas datas — o
-- selo passa de contagem para "no ar", e o painel Sinal Aberto passa de "aqui
-- está o custo" para "aqui está quanto já veio". Trocar data por deploy é
-- convidar a esquecer, e uma data errada na home do projeto de contas abertas
-- custa mais que o trabalho de fazer isto direito.
-- =============================================================================

create table if not exists public.projeto (
  id boolean primary key default true check (id),
  lanca_em date not null,
  apoio_abre_em date not null,
  atualizado_em timestamptz not null default now()
);

comment on table public.projeto is
  'Linha única com as datas do lançamento. A checagem em `id` garante que não exista uma segunda.';

insert into public.projeto (id, lanca_em, apoio_abre_em)
values (true, '2026-09-19', '2026-09-19')
on conflict (id) do update
  set lanca_em = excluded.lanca_em,
      apoio_abre_em = excluded.apoio_abre_em,
      atualizado_em = now();

alter table public.projeto enable row level security;

create policy "projeto: leitura publica"
  on public.projeto for select to anon, authenticated using (true);

revoke all on table public.projeto from anon, authenticated;
grant select on table public.projeto to anon, authenticated;
