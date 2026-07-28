# RUA — linha do tempo de lançamento

**Lançamento: sábado, 19 de setembro de 2026.** Aniversário de Emil Zátopek e
Dia do Software Livre. Livre nos dois sentidos.

Este documento existe para amarrar o que o marketing promete ao que o código
precisa ter de pé, com data. Toda entrega técnica abaixo tem um post que
depende dela.

---

## Fase 0 — Fundação silenciosa (1 a 16 de agosto)

**Objetivo:** de zero para 300–500 e-mails na lista de espera.

- **Sáb 1/8 — post de estreia.** Wordmark em preto sobre papel + manifesto
  inteiro. Sem explicação. Legenda: "Livre para correr. rua.run"
- **Sex 7/8 — Abebe Bikila faria 94 anos.** Correu a maratona olímpica descalço
  porque os tênis novos machucaram, e venceu com recorde mundial. "Correr nunca
  precisou de dinheiro. Do chinelo ao carbono."
- **Bastidores #01** e semanal a partir daqui: vídeo vertical, cru, numerado.
  "Construindo um app de corrida 100% gratuito · #01". A numeração é o que
  segura a audiência até o próximo.
- **Cartões de princípio,** um por vez: "Sem paywall. Nunca." · "Contas
  abertas." · "Não rolou. Sem problema."

**O que o código precisa ter em 31/7 — véspera:**

| Entrega | Estado |
|---|---|
| Home com manifesto e lista de espera | ✅ no ar |
| E-mail de confirmação de `oi@rua.run` | ✅ no ar |
| **Painel Sinal Aberto conforme §4** | ❌ **bloqueia o post de 1/8** |

O post de estreia manda gente para `rua.run`. Hoje o painel exibe a escada
antiga — "Mapa e traçado sem limite", "Painel do assessor liberado" — que o §4
classifica como paywall custeado coletivamente, e mostra `R$ 0 · 0% · 0 pessoas
apoiando`, que o §4 proíbe. **É o único item que precisa estar pronto antes de
1º de agosto.**

---

## Fase 1 — O porquê (17 a 31 de agosto)

**Objetivo:** preparar o terreno da campanha antes de pedir dinheiro.

- **Carrossel "Por que gratuito?"** — a conta real: quanto custa manter no ar,
  quanto custa por corredor.
- **Post do assessor** — hoje o treinador paga mensalidade para trabalhar; na
  Rua não paga. Feito para ser encaminhado no WhatsApp de assessorias.
- **Bastidores #03 e #04** — o painel do assessor tomando forma; e a decisão da
  constância em semanas, não dias, com o porquê: sequência diária empurra para
  lesão.

**O que o código precisa:** página `/sinal-aberto` própria, com o mês fechado e
as três linhas (bruto, taxa, líquido). Hoje o painel só existe como seção da
home, e o rodapé aponta "Contas do mês" para a âncora `#por-que-gratuito`.

> **Cuidado com o número do carrossel.** "R$ 0,05–0,15 por corredor/mês" só é
> verdade a partir de ~6.700 corredores. Com R$ 1.000 líquidos:
>
> | corredores | custo/corredor |
> |---|---|
> | 2.000 | R$ 0,50 |
> | 5.000 | R$ 0,20 |
> | 10.000 | R$ 0,10 |
> | 20.000 | R$ 0,05 |
>
> No lançamento a base é zero. Sugestão: publicar o número **projetado** com a
> base explícita ("a R$ 1.000/mês, com 10 mil corredores dá R$ 0,10 cada"), em
> vez de um intervalo sem denominador. A página Sinal Aberto pode calcular isso
> ao vivo depois, e aí o número é real.

---

## Fase 2 — Contagem (1 a 18 de setembro)

- **Ter 1/9 — Dia do Profissional de Educação Física.** Abre a campanha no
  Catarse e o convite nominal aos assessores. "A Rua abre para assessores
  primeiro — sem mensalidade, sem comissão. O que você cobra do seu aluno é
  seu, inteiro."
- **Qui 10/9 — 66 anos da vitória descalço.** Reels de Bikila cortando para o
  manifesto. Nove dias para abrir.
- **14 a 18/9** — contagem diária nos stories, um valor por dia: de todos ·
  sinal aberto · pé no chão · mão dupla · calçada larga. E o post revelando a
  data com o motivo.

**O que o código precisa em 1/9:**

| Entrega | Por quê |
|---|---|
| Botão `Apoiar todo mês` apontando para o Catarse | Hoje aponta para `/apoiar`, que é um aviso de "ainda não dá" |
| Sincronização Catarse → `apoios` | Sem isso o painel não se move quando alguém apoia, e a campanha vira promessa vazia |
| Acesso antecipado para assessor | O convite de 1/9 promete "assessores primeiro" |

O terceiro item é o mais pesado: prometer acesso antecipado exige autenticação
(fase 3) e o painel do assessor com dado real (fase 8).

---

## Fase 3 — 19 de setembro, sábado: o lançamento

O post âncora do ano: Zátopek, o menino da fábrica de sapatos que disseram ser
fraco demais, três ouros em Helsinque, a Praça Venceslau contra os tanques, a
mina de urânio como castigo. Fecho: "Hoje é aniversário dele. Hoje é o Dia do
Software Livre. A Rua abre hoje, livre nos dois sentidos."

No mesmo dia, de manhã: **a primeira corrida da Rua**, mesmo que sejam três
cidades e dez pessoas em cada. É a prova viva de que "hoje tem rua" não é
slogan.

---

## Fase 4 — Tração (20 de setembro a 12 de outubro)

- **Ter 22/9, primavera:** "começou a temporada". Quem vai correr a São
  Silvestre começa o ciclo agora — e a Rua tem planilha de assessor de graça.
- **Ter 29/9, Dia Mundial do Coração:** post de saúde, sem tom clínico.
- **Início de outubro:** primeiro relatório Sinal Aberto público, com número
  real de apoiadores e custo. Mesmo que seja pequeno. Especialmente se for
  pequeno.
- **Feriado de 10 a 12/10:** apps nas lojas + segundo "hoje tem rua"
  presencial.

---

## Duas tensões entre o plano técnico e esta linha do tempo

### 1. A ordem das fases da §9 não serve a este calendário

A §9 da especificação constrói o Expo (fases 4, 5, 6) **antes** da web (fases 7,
8). Mas o calendário precisa de web em agosto (`/sinal-aberto`), de web em
setembro (campanha, acesso do assessor) e coloca **apps nas lojas em 10–12 de
outubro** — três semanas depois do lançamento.

Ordem que serve ao calendário:

```
3  Auth (Google)                    → antes de 1/9
7  Web: público + Sinal Aberto      → antes de 17/8
8  Web: Turma → Atleta → Biblioteca → antes de 1/9
4  Expo: shell das cinco abas       → setembro
5  Expo: motor de corrida           → setembro
6  Expo: Hoje, Atividade, Plano     → início de outubro
10 Builds EAS e submissão           → 10–12/10
```

### 2. O que "abre" significa em 19 de setembro

Se os apps só entram nas lojas em outubro, o lançamento de 19/9 não pode ser a
abertura dos apps. Três leituras possíveis, com consequências técnicas
diferentes:

| Leitura | O que precisa estar pronto em 19/9 |
|---|---|
| **(a) Abre a web** — corredor e assessor usam pelo navegador; apps vêm em outubro | Fases 3, 7, 8 + as telas do corredor na web com dado real |
| **(b) Abre a beta** — TestFlight e faixa de testes do Google | Fases 3, 4, 5, 6 + EAS build de preview |
| **(c) Abre o cadastro** — conta criada, produto chega em outubro | Fase 3 e nada mais |

**A leitura (a) é a que mais aproveita o que já existe:** as nove telas logadas
estão construídas na web, faltando só a troca de `exemplo.ts` por dado real.
Ela também é a mais coerente com o Dia do Software Livre — abre no navegador,
sem loja de aplicativo no caminho.

Isto precisa de decisão antes de começar a fase 2 do plano técnico.

---

## Caminho proposto para o §4 — Sinal Aberto

### O que está errado hoje, em produção

```
NÍVEL 1 · APOIO MENSAL              JULHO 2026
Servidor de pé para 5.000 corredores
R$ 0 de R$ 1.000 por mês
0% do nível 1                    0 pessoas apoiando

O QUE VEM DEPOIS
02  Mapa e traçado sem limite            R$ 2.400
03  Painel do assessor liberado          R$ 4.300
04  Um ano garantido na frente           R$ 7.000
```

Três problemas: os níveis 2 e 3 prometem **funcionalidade**, o que é paywall
custeado coletivamente; não há linha de taxa nem de líquido; e a barra exibe
exatamente o `R$ 0 · 0% · 0 pessoas` que o §4 proíbe.

### A escada nova, e por que os números fecham

As metas do §4 são as do §6 divididas por 0,87 — o Catarse retém 13%. Isso não
é coincidência, é a mesma conta vista pelos dois lados, e permite ao painel
mostrar bruto e líquido a partir da mesma linha:

| Nível | Nome | Meta bruta | Taxa (13%) | Líquido | Compra |
|---|---|---|---|---|---|
| 1 | A rua de pé | R$ 1.150 | R$ 150 | R$ 1.000 | Servidor, banco, e-mail e mapas no ar para os primeiros milhares. |
| 2 | Cabe mais gente | R$ 2.900 | R$ 377 | R$ 2.523 | Escala para dezenas de milhares sem engasgo. |
| 3 | Fora do bolso de um | R$ 5.200 | R$ 676 | R$ 4.524 | Associação, contabilidade, jurídico e marca. A Rua para de depender de uma pessoa. |
| 4 | Um ano na frente | R$ 8.000 | R$ 1.040 | R$ 6.960 | Reserva de 12 meses. A rua não fecha em ano magro. |
| 5 | Mais gente construindo | R$ 13.800 | R$ 1.794 | R$ 12.006 | Remunerar quem constrói: código, acessibilidade, suporte. |

Nenhum nível libera nada. Todos compram capacidade, independência ou
permanência — e tudo funciona desde o nível 1.

### Como a barra deixa de começar em zero, sem mentir

O §4 diz que o nível 1 já entra parcialmente coberto pelo fundador. A forma
honesta de fazer isso é **registrar o apoio do fundador como um apoio de
verdade**, com `fundador = true`, e a barra em dois tons:

```
NÍVEL 1 · A RUA DE PÉ                          AGOSTO 2026
Servidor, banco, e-mail e mapas no ar.

R$ 1.150  de R$ 1.150 bruto por mês
████████████████████████████████████  100%
└─ quem começou ─┘└─ a comunidade ─┘

arrecadado  R$ 1.150     taxa Catarse  −R$ 150     na operação  R$ 1.000
1 pessoa apoiando

Os primeiros R$ 1.000 são de quem começou. O nível 2 é com a gente.
```

Duas consequências de desenho:

1. **O painel mostra o nível corrente, não sempre o nível 1.** Assim que o
   nível 1 é alcançado, o alvo passa a ser o 2, e o 1 aparece na lista de
   alcançados com a data. É o que o §4 pede em "cada nível alcançado fica
   publicado aqui, com o número real".
2. **A fatia do fundador tem tom próprio.** `--ink-3` para quem começou,
   `--trace` para a comunidade. Sem isso, mostrar o dinheiro do fundador como
   "arrecadado" seria tecnicamente verdade e moralmente esticado.

### Mudanças de banco

Três migrações, na ordem:

**1. `niveis_apoio` substitui `niveis_sinal_aberto`.** A tabela atual guarda
título e subtítulo do protótipo; a nova guarda o que o §2 pede — `ordem`,
`nome`, `meta_centavos` (bruta), `descricao` (pública), `alcancado_em`.

**2. `transparencia_meses` ganha as três linhas.** Hoje tem `custo_centavos` e
um acoplamento com `nivel`/`descricao` que sai. Entram
`apoio_bruto_centavos`, `taxa_centavos` e `nota` — os valores **reais** do
extrato do Catarse, não uma estimativa de 13%.

**3. `apoios` ganha o que a campanha exige.** `mes`, `recorrente`, `fundador`,
`anonimo`, e `usuario_id` passa a aceitar nulo: apoio vindo do Catarse não tem
necessariamente conta na Rua.

E `resumo_sinal_aberto()` é reescrita para devolver o nível corrente, as três
linhas e a fatia do fundador separada da comunidade.

### Divisão de fontes, para não misturar mês aberto com mês fechado

| Fonte | Serve | Onde aparece |
|---|---|---|
| `apoios` | mês em curso, ao vivo | painel na home |
| `transparencia_meses` | mês fechado, com a taxa real do extrato | `/sinal-aberto`, "Contas do mês" |
| `niveis_apoio` | a escada e o que já foi alcançado | os dois |

Sem essa separação, o painel teria que estimar a taxa em 13% durante o mês e
depois corrigir — e "contas abertas" com número que muda depois é pior que
número que demora.

### Prazo

**Até 31 de julho.** É véspera do post de estreia, e é o único item da Fase 0
que ainda não está no ar. Sem ele, o primeiro post do projeto manda gente para
uma página que contradiz o manifesto que o próprio post publica.
