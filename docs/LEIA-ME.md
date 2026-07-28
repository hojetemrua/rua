# Documentos do projeto

| Documento | Vence em |
|---|---|
| `rua-especificacao.md` | produto, arquitetura, modelo de dados, RLS, regras de negócio |
| `rua-handoff-design.md` | visual, tokens, conteúdo de tela, copy |
| `lancamento.md` | calendário de lançamento e os prazos que ele impõe ao código |
| `infraestrutura.md` | contas, portas locais, DNS, runbook de deploy |

Em conflito entre os dois primeiros: a especificação vence em dados, regras e
arquitetura; o handoff vence em visual e conteúdo de tela.

Os dois primeiros são **versão 2 · julho de 2026**. A v2 do handoff inclui as
telas logadas definitivas e corrige a estratégia de níveis de apoio; a v2 da
especificação substitui a v1, que assumia PWA único em Vite.

## Divergências registradas no código

Cada uma está comentada no arquivo onde vive, com a medição que a justifica:

| O que | Onde | Por quê |
|---|---|---|
| `--ink-3` é `#74746C`, não `#77776F` | `pacotes/marca/src/tokens.ts` | O valor do documento dá 4,32:1 sobre papel; a §9 exige AA (4,5:1) e este é o tom dos rótulos de 11px. |
| `--sh` e `a:hover` em verde | handoff §1 | Estavam registrados como divergência; foram **incorporados ao handoff**. O protótipo estava certo. |
| Existe `--trace-texto` (`#008540`) | `pacotes/marca/src/tokens.ts` | `--trace` tem 3,20:1 sobre branco: basta para linha e barra (3:1), reprova para texto (4,5:1). |
| Cor de texto por zona é medida | `pacotes/marca/src/tokens.ts` | Sobre a Z4 o branco dá 3,84:1 e a tinta 5,16:1. O limiar "escura a partir da Z4" erra ali. |

## Pendências abertas

1. **Níveis do Sinal Aberto em produção contradizem a §4 do handoff.** Prazo:
   31 de julho, véspera do primeiro post. Caminho proposto em `lancamento.md`.
2. **A ordem das fases da §9 não serve ao calendário de lançamento**, e falta
   decidir o que "abre" significa em 19 de setembro. Ver `lancamento.md`.
3. `TRADEMARK.md` afirma marca registrada; o pedido está em curso no INPI.
   Precisa de revisão jurídica antes de ser tratado como definitivo.
4. `entrar_na_lista` é escrita pública sem limite de taxa. Turnstile antes de
   divulgar.
5. `transparencia_meses` precisa de uma linha nova por mês, senão a home passa
   a mostrar o mês anterior.
