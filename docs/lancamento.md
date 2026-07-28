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
| Painel Sinal Aberto conforme §4 | ✅ no ar (28/7) |
| Página `/apoiar` capturando intenção | ✅ no ar (28/7) |

O bloqueio de 1/8 caiu: o painel não exibe mais a escada de recursos nem
`R$ 0 · 0% · 0 pessoas apoiando`. Enquanto o apoio não abre, mostra o custo do
mês — o número verdadeiro que o post de estreia pode citar.

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

- **Ter 1/9 — Dia do Profissional de Educação Física.** Convite nominal aos
  assessores, com acesso antecipado. "A Rua abre para assessores primeiro — sem
  mensalidade, sem comissão. O que você cobra do seu aluno é seu, inteiro."
  **Não abre a campanha de apoio** — ver a seção sobre o Catarse adiante.
- **Qui 10/9 — 66 anos da vitória descalço.** Reels de Bikila cortando para o
  manifesto. Nove dias para abrir.
- **14 a 18/9** — contagem diária nos stories, um valor por dia: de todos ·
  sinal aberto · pé no chão · mão dupla · calçada larga. E o post revelando a
  data com o motivo.

**O que o código precisa em 1/9:**

| Entrega | Por quê |
|---|---|
| Acesso antecipado para assessor | O convite de 1/9 promete "assessores primeiro" |
| Sincronização Catarse → `apoios` | Precisa estar pronta e testada em 19/9, não no dia |

O primeiro item é o mais pesado: prometer acesso antecipado exige autenticação
(fase 3) e o painel do assessor com dado real (fase 8). O botão de apoio não
entra aqui — continua levando para `/apoiar`, que captura quem já quer sustentar.

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
- **Feriado de 10 a 12/10:** segundo "hoje tem rua" presencial. Os apps já
  estão nas lojas desde 19/9.

---

## Decisão: tudo abre em 19 de setembro

Plataforma e apps nas lojas, 100% funcionando, no mesmo dia. Isso elimina a
dúvida sobre o que "abre" significa e reordena o plano técnico: as fases do
Expo deixam de poder esperar.

### A conta para trás, a partir de 19/9

| Data | Marco | Por quê |
|---|---|---|
| 15/09 | Apps aprovados, em "aguardando liberação" | Você aperta o botão no dia |
| 05/09 | Submissão final às lojas | Reserva para **dois** ciclos de rejeição — GPS em segundo plano é o item mais revisado pela Apple |
| 29/08 | Congelamento de código | Nada novo entra; só correção do que a beta achar |
| 15/08 | Beta em TestFlight e faixa de testes | Bug de GPS em segundo plano só aparece em campo, ao longo de horas, em aparelho alheio |
| 08/08 | Motor de corrida funcionando | SQLite, segundo plano, pausa, voz, recuperação de queda |
| 01/08 | Auth + shell das cinco abas | Pré-requisito de tudo no app |

**O maior risco não é código: é a conta Apple Developer.** Enrollment como
pessoa física sai em horas; como pessoa jurídica exige D-U-N-S e leva de duas a
quatro semanas. Se ela ainda não existe e o registro for pelo CNPJ, a data cai
por aí — não pelo software. Verificar isto é a tarefa mais urgente do projeto.

### Ordem de construção revisada

```
3  Auth (Google; Apple cabeado por env)   → 1/8
4  Expo: shell das cinco abas             → 1/8
5  Expo: motor de corrida                 → 8/8
6  Expo: Hoje, Atividade, Plano           → 15/8   (entra na beta)
7  Web: público + /sinal-aberto           → 17/8   (a Fase 1 do marketing pede)
8  Web: Turma → Atleta → Biblioteca       → 29/8
9  Expo: Comunidade, Perfil, exportação   → 29/8
10 Builds EAS e submissão                 → 5/9
11 "Correndo agora"                       → depois do lançamento
```

Fases 4, 5 e 6 sobem antes da web porque loja tem fila e navegador não.

---

## Quando abrir o Catarse: **19 de setembro, junto**

Cinco razões, em ordem de peso:

1. **Não se pede dinheiro por algo que ainda não existe.** O único ativo do
   projeto hoje é confiança. Cobrar antes de entregar gasta exatamente isso.
2. **Se a data escorregar, você atrasa um lançamento — não uma promessa que já
   cobrou.** Atrasar depois de receber é o único erro que "contas abertas" não
   sobrevive. E o calendário acima tem folga de dias, não de semanas.
3. **A barra não precisa da campanha para sair do zero.** O apoio de quem
   começou cobre o nível 1, e antes de 19/9 o painel mostra o custo em vez de
   uma barra vazia. O `R$ 0 · 0% · 0 pessoas` que o §4 proíbe já não acontece.
4. **19/9 é o maior alcance do ano.** Pôr o pedido ali converte no pico, não no
   aquecimento.
5. **Assinatura recorrente cobra no ciclo.** Abrir em 1/9 traria dinheiro para
   outubro, não para setembro — o mês do lançamento é coberto por quem começou
   de qualquer jeito. O ganho financeiro de antecipar é quase zero.

### O que fazer com o dia 1º de setembro

O gancho do Dia do Profissional de Educação Física é bom demais para perder — e
ele não precisa de dinheiro. Mantenha o post, trocando o pedido pelo **acesso
antecipado do assessor**: convite nominal, beta na mão, planilha montada antes
de o corredor chegar. Custa nada, pede nada, e dá ao assessor o que ele mais
valoriza — chegar antes.

### O que capturar até lá

O botão do painel não vira beco sem saída entre 1/8 e 19/9. Ele leva para
`/apoiar`, que explica a conta e captura quem já quer apoiar na mesma lista de
espera, com `origem = "apoio"`.

Isso dá a medida que decide o tom do post de lançamento: **quantas pessoas se
comprometeram antes de existir cobrança**. Se forem 200, o post de 19/9 pode
dizer "200 pessoas já disseram que sustentam". Se forem 12, é melhor saber em
agosto do que descobrir no dia.

### Preparar a campanha sem publicar

A página do Catarse é revisada pela plataforma antes de ir ao ar. Montar em
**início de setembro** e deixar agendada para 19/9 — não deixar a submissão
para a véspera.

---

## Caminho para o §4 — implementado em 28 de julho

O que estava no ar contradizia a promessa. Foi trocado.

### O que mudou

| Antes | Agora |
|---|---|
| "Mapa e traçado sem limite", "Painel do assessor liberado" | Cinco níveis que compram capacidade, independência e permanência |
| `R$ 0 de R$ 1.000 · 0% · 0 pessoas apoiando` | Antes de 19/9, o custo do mês. Depois, as três linhas. |
| Uma linha só (arrecadado) | Arrecadado · taxa da plataforma · na operação |
| Sempre o nível 1 | O nível corrente; os alcançados viram lista com data |
| Barra de um tom | Dois tons: quem começou em cinza, a comunidade no traçado |

### Por que as metas fecham

As metas do §4 são as do §6 divididas por 0,87 — a plataforma de apoio retém
13%. Não é coincidência: é a mesma conta pelos dois lados. R$ 1.150 bruto menos
a taxa dá exatamente os R$ 1.000 de custo real, e assim nos cinco níveis. O
painel mostra as três linhas para ninguém precisar fazer essa conta de cabeça.

| Nível | Nome | Meta bruta | Taxa | Na operação |
|---|---|---|---|---|
| 1 | A rua de pé | R$ 1.150 | R$ 150 | R$ 1.000 |
| 2 | Cabe mais gente | R$ 2.900 | R$ 377 | R$ 2.523 |
| 3 | Fora do bolso de um | R$ 5.200 | R$ 676 | R$ 4.524 |
| 4 | Um ano na frente | R$ 8.000 | R$ 1.040 | R$ 6.960 |
| 5 | Mais gente construindo | R$ 13.800 | R$ 1.794 | R$ 12.006 |

### Onde as datas moram

Tabela `projeto`, uma linha, leitura pública: `lanca_em` e `apoio_abre_em`. O
selo do herói e o estado do painel saem de lá. Trocar data por deploy é
convidar a esquecer, e data errada na home do projeto de contas abertas custa
mais que o trabalho de fazer isto direito.

### Ainda falta

1. **Registrar o apoio de quem começou** em produção, com o valor real e
   `fundador = true`. Sem isso, no dia 19/9 a barra abre em zero — o que o §4
   proíbe. Não inventei o valor: R$ 1.150 é o que cobre o nível 1, mas o número
   é seu.
2. **O endereço da campanha.** `SINAL_ABERTO.hrefApoiar` está apontando para um
   palpite (`catarse.me/hojetemrua`). Trocar pelo real quando existir.
3. **Sincronização Catarse → `apoios`.** Sem ela o painel não se move quando
   alguém apoia. Webhook ou importação periódica; decidir até 5/9.
4. **Fechamento mensal.** `transparencia_meses` precisa de `apoio_bruto_centavos`
   e `taxa_centavos` do extrato real quando o mês fecha — é o que a página de
   contas mostra, e é diferente da estimativa de 13% que o painel usa durante o
   mês.
