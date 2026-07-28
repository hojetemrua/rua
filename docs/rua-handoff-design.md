# RUA — Handoff de design → desenvolvimento

> Fonte de verdade **visual e de conteúdo de tela**, para os dois clientes (app Expo e web Next.js).
> Documento irmão: `docs/rua-especificacao.md` — vence em dados, RLS, regras de negócio e arquitetura.
> Tudo em português brasileiro: código, rotas, tabelas, textos.

**Versão 2 · julho de 2026** — inclui as telas logadas definitivas e a correção da estratégia de níveis de apoio.

---

## 0. OS ARQUIVOS DE DESIGN — o que ler e o que não ler

| Arquivo | Tamanho | Instrução |
|---|---|---|
| `design/App_logado_dc.html` | 95 KB, HTML puro | **LEIA ESTE.** Protótipo definitivo das áreas logadas: 6 telas do corredor + 3 do assessor, com todos os textos, números e estados. |
| `design/Home_rua_run.html` | 10 MB, bundle React | **NÃO ABRA.** Código minificado, destrói o contexto. O conteúdo está transcrito na §3. |
| `design/RUA_app_logado.html` | 1 MB, bundle React | **NÃO ABRA.** Substituído pelo `App_logado_dc.html`. |

Se os bundles pesarem no repositório, mantenha-os fora do Git (`.gitignore`) e guarde apenas o `App_logado_dc.html`.

---

## 1. TOKENS — valores finais, confirmados nos protótipos

```css
/* superfícies */
--paper:   #FAFAF8;   /* fundo dominante — off-white quente, não branco puro */
--white:   #FFFFFF;   /* cartões e superfícies elevadas */

/* tinta */
--ink:     #0A0A0A;   /* texto principal, números-herói, traço */
--ink-2:   #3D3D3A;   /* texto secundário */
--ink-3:   #77776F;   /* rótulos, metadados, desabilitado */

/* linhas */
--line:    #E4E4DE;   /* bordas de cartão */
--line-2:  #F0EFEA;   /* divisores internos */

/* cor funcional — SÓ onde há dado */
--trace:   #00A650;   /* traçado da corrida */
--z1:      #B6ECF5;
--z2:      #2FB3E0;
--z3:      #F58A00;
--z4:      #F0402C;
--z5:      #B3103F;

/* raio */
--r:       22px;      /* cartões (24px em blocos grandes da home) */
--r-sm:    14px;      /* elementos menores (16px na home) */

/* tipografia */
--ui:  'Archivo', system-ui, sans-serif;    /* interface, títulos, rótulos */
--txt: 'Inter', system-ui, sans-serif;      /* texto corrido */
--num: 'Overpass', system-ui, sans-serif;   /* TODOS os números */
```

Os mesmos valores vivem em `pacotes/marca`, exportados como CSS custom properties (web) e objeto JS (nativo). **Nenhum hex escrito à mão em componente.**

### Regras absolutas do visual

- **Zero `box-shadow`. Zero `gradient`.** Elevação se faz com borda `1px solid var(--line)` e fundo branco sobre papel.
- **Cor é dado, não decoração.** Chrome (navegação, cartões, botões, texto) usa só papel/tinta/linha. As seis cores funcionais aparecem exclusivamente em traçado e zonas.
- **Zona sempre com rótulo textual** junto da cor (`Z3 FIRME`) — acessibilidade para daltônicos.
- **Sem emoji e sem biblioteca de ícones colorida.** SVG inline, traço fino, monocromático.
- Pesos usados: **400, 500, 600, 800, 900**. Números-herói em Overpass 900 com `tabular-nums`.
- Rótulos de seção em Archivo, caixa-alta, corpo pequeno, cor `--ink-3` (`SUA SEMANA`, `TEMPO POR ZONA`, `QUEM AINDA NÃO APARECEU`).
- Fontes via `next/font/google` (web) e `expo-font` (nativo): Archivo, Inter, Overpass. **Nunca** embarcar a fonte Grama — logo só como SVG em curvas em `public/marca/`.
- **Sem dark mode.**

---

## 2. APP DO CORREDOR — 6 telas, 5 abas

Barra inferior: **Hoje · Plano · Correr · Comunidade · Perfil**. Correr é aba, não botão flutuante. Perfil abre também pelo avatar no topo. **Nenhuma tela passa de 7 alvos de toque.** O apoio mensal aparece **uma vez só**, no Perfil.

### 2.1 Hoje
Data por extenso (`DOMINGO, 26 DE JULHO`). Cartão do treino do dia: `Longão 14 km` · "Sem pressa: 6:30–7:10/km. Leva água e volta inteiro." · "Publicado por Camila Ferraz". Botão único **`Bora.`** Bloco `SUA SEMANA`: `18,4 / 32 km`. Cartão `Última corrida · sexta` — `8,04 km · 41:36 · 5:10/km` (abre a tela Atividade).

### 2.2 Plano
`SEMANA 21–27 JUL` · "Seu plano" · "4 feitos · 1 perdido · 2 previstos" · `18,4 / 32 km`. Lista por dia com sigla + número (`SEG 21`), nome do treino e estado:
- feito → "Feito · 5,12 km · 6:22/km"
- perdido → **"Não rolou. Sem problema."** (copy obrigatória)
- hoje → "Hoje · 6:30–7:10/km"

### 2.3 Correr
Cabeçalho `GRAVANDO · LONGÃO 14 KM`. Número-herói `7,42` + rótulo `QUILÔMETROS`. Grade: `TEMPO 38:14` · `PACE 5:09` · `ZONA AGORA Z3 FIRME` · `BPM 168 (86% MÁX)` · `CAD 176 PASSOS/MIN` · `SUBIDA 84 METROS` · `ÚLTIMO KM 5:04 · 171 bpm`. Botões `Pausar` e `Encerrar`. Contraste altíssimo, tudo grande, nada piscando, legível sob sol.

### 2.4 Atividade
`SEXTA, 06:51 · PACAEMBU` · "Treino fechado." Três números: `DISTÂNCIA 8,04` · `TEMPO 41:36` · `PACE 5:10`. Traçado. Barra `TEMPO POR ZONA` (Z2/Z3/Z4). Selo `MELHOR: KM 5`. Recado do assessor com avatar de iniciais: Camila Ferraz — "Km 5 voou. Domingo, segura o passo no longão. Bora."

### 2.5 Comunidade
`SÃO PAULO · PERTO DE VOCÊ` · "A rua hoje". Bloco `CORRENDO AGORA`: `128` + "pessoas na rua neste minuto". `PRÓXIMOS ENCONTROS`: "Terça no Ibirapuera · 19:00 · Portão 7 · 8 km leve, ritmo de conversa · 12 confirmados · aberto a todos" + botão `Vou`; "Sábado no Minhocão · 07:00 · Largada na Amaral Gurgel · 10 km · 31 confirmados". `SEUS GRUPOS`: "Corre Sumaré — 64 pessoas · 3 encontros por semana"; "Assessoria Pé no Chão — 14 atletas · Camila Ferraz".

### 2.6 Perfil
Avatar + nome + "Sumaré, São Paulo · desde março de 2026". Três números: `NO MÊS 112 km` · `SEM PARAR 14 sem` · `MELHOR 10K 49:12`. Gráfico `VOLUME · 8 SEMANAS` com a semana atual em `--ink` e a legenda "Semana atual em preto. Sem meta anual, sem medalha." Cartão da assessora + botão `Falar`. Cartão `SEU APOIO · NÍVEL 1 — R$ 15 por mês` + "A turma está em 64% do nível 1. Cancelar quando quiser não muda nada no seu app." Links `Ajustes e privacidade` e `Baixar meus dados`.

---

## 3. SITE PÚBLICO — rua.run

Navegação: `Quem corre nela · Por que gratuito · Como funciona · Me avisa`

1. **Herói** — selo `ABRE EM 2026 · LISTA ABERTA`; título em duas linhas **LIVRE PARA / CORRER.**; manifesto completo; campo de e-mail + `Me avisa` com apoio "Um aviso quando abrir. Nada além disso."; foto de fundo com crédito visível.

   Manifesto (texto final): *"A rua nunca te cobrou nada. Nunca pediu cadastro, nunca trancou recurso, nunca chamou ninguém de usuário. A rua é de todos: do primeiro km ao recorde, do chinelo ao carbono. Livre para correr. Livre para evoluir. Livre para se conectar. Sustentada por quem corre nela. De todos, para sempre. Rua."*

2. **A rua é nossa.** — "Corredor, assessor e comunidade no mesmo lugar — e ninguém paga para estar nele." Três blocos: **Corredor** ("Registra o treino, vê o pace, acompanha a constância. Tudo, de graça. Nenhum recurso trancado — hoje nem em 2030.") · **Assessor** ("Monta planilha e acompanha a turma inteira sem mensalidade e sem comissão. O que você cobra do aluno é seu, inteiro.") · **Comunidade** ("Encontro marcado, grupo aberto, ponto de partida no mapa. Quem chegar, corre.").

3. **POR QUE GRATUITO?** — "Começou com um corredor querendo dividir o que achou." + texto de origem. Três marcadores: apoio mensal do valor que der, cancelável a qualquer hora · quem apoia não ganha recurso extra, ganha o app de pé · cada nível alcançado fica publicado aqui, com o número real.

4. **Painel Sinal Aberto** — ver §4, que **substitui** o conteúdo do protótipo.

5. **Abrir, correr, fechar.** — 01 Abrir ("O treino do dia já está na tela. Um botão só: Bora.") · 02 Correr ("Número gigante, nada piscando, legível no sol. Guarda o celular.") · 03 Fechar ("Traçado, splits e zonas na hora. E o recado do assessor.").

6. **Fecho** — "A rua está aberta." / "Entra na lista e te chamamos quando abrir. Sem fila paga, sem convite especial." + `Me avisa`.

7. **Rodapé** — "Feito no Brasil, na rua." · "De todos, para sempre." · `@hojetemrua` (Instagram, TikTok, YouTube) · Contas do mês, Roadmap público, Código e licença · `oi@rua.run` · `Sou assessor` · `rua.run · 2026`.

**Implementação:** foto do herói otimizada com `next/image` (AVIF/WebP, `priority`, blur placeholder) mantendo o crédito. `Me avisa` grava em `lista_espera` e dispara confirmação via Resend.

---

## 4. SINAL ABERTO — correção obrigatória em relação ao protótipo

O protótipo mostra níveis que **liberam funcionalidade** ("Mapa e traçado sem limite", "Painel do assessor liberado"). Isso é paywall custeado coletivamente e **contradiz** a promessa da própria página. Substituir por esta escada, onde nível compra **capacidade, independência e permanência** — tudo funciona desde o nível 1:

| Nível | Nome | Meta bruta/mês | Descrição pública |
|---|---|---|---|
| 1 | A rua de pé | R$ 1.150 | Servidor, banco, e-mail e mapas no ar para os primeiros milhares. |
| 2 | Cabe mais gente | R$ 2.900 | Escala para dezenas de milhares sem engasgo. |
| 3 | Fora do bolso de um | R$ 5.200 | Associação, contabilidade, jurídico e marca. A Rua para de depender de uma pessoa. |
| 4 | Um ano na frente | R$ 8.000 | Reserva de 12 meses. A rua não fecha em ano magro. |
| 5 | Mais gente construindo | R$ 13.800 | Remunerar quem constrói: código, acessibilidade, suporte. |

**Regras de exibição:**
- Metas são **valores brutos** (o Catarse retém 13%). O painel mostra as três linhas: arrecadado, taxa da plataforma, líquido na operação.
- Todos os números vêm de `transparencia_meses`, `apoios` e `niveis_apoio`. **Nada hardcoded, nunca.**
- O nível 1 já entra parcialmente coberto pelo fundador. A barra nunca deve exibir `R$ 0 · 0% · 0 pessoas apoiando` no lançamento; a linha de contexto é: *"Os primeiros R$ 1.000 são de quem começou. O nível 2 é com a gente."*
- Planos individuais: `R$ 10 Trote` · `R$ 25 Ritmo` · `R$ 50 Firme` · `R$ 100 Longão` · `R$ 300 Pelotão`.
- Manter a linha: *"Sem meta escondida: o número acima é o custo real do mês."*

---

## 5. PLATAFORMA DO ASSESSOR (desktop) — 3 níveis

**Turma → Atleta → Biblioteca.** Três níveis e nada mais.

**Turma** — cabeçalho com assessora e "Pé no Chão · 14 atletas". `SEMANA 21–27 JUL` · "Aderência da turma **78%**" · `TREINOS` / `FEITOS`. Tabela `ATLETA | S·T·Q·Q·S·S·D | VOLUME | SINAL` com quatro estados (**feito · hoje · não rolou · previsto**) e coluna de sinal ("hoje", "ontem", "terça"). Bloco **`QUEM AINDA NÃO APARECEU`**: "Três pessoas sem treino esta semana. Talvez seja só a semana." — cada linha com contexto humano ("Vinha 4×/semana em junho", "Última: 10 km em 1:02:40", "Entrou na turma em maio"), dias parado e botão `Mandar um oi`. Bloco `PUBLICAR NA SEMANA`: "4 treinos ainda sem planilha para a semana que vem." + `Abrir biblioteca`. Rodapé: "Clique num atleta para abrir a ficha."

**Atleta** — nome + "Na turma desde abril · meta: 10 km abaixo de 48:00" + `Montar semana`. Quatro números: `SEMANA 18,4 km` · `ADERÊNCIA 4/5` · `PACE MÉDIO 5:24` · `SEM PARAR 14 sem`. `ÚLTIMAS ATIVIDADES` (data, treino, resultado). `VOLUME · 8 SEMANAS`. `SEMANA PUBLICADA` com "Domingo tem longão de 14 km publicado. Quarta não rolou — sem reposição automática." `RECADO NO TREINO` com campo e `Enviar recado`.

**Biblioteca** — `14 TREINOS · 3 COMPARTILHADOS COM A TURMA` · `Novo treino` · filtros `Todos · Leve · Intervalado · Longão`. Cartões: nome, faixa (`14–18 km · 1h30–2h`), descrição em linguagem de treinador, `usado 22×`, botão `Publicar`. Rodapé: "Treino compartilhado entra na biblioteca pública do Rua com o seu nome. Nenhum assessor paga para publicar, e ninguém paga para usar." + `Ver biblioteca pública`.

**Três princípios do painel:** três níveis e nada mais · **sem número de cobrança** (sem ranking de atleta, sem alerta vermelho) · biblioteca é mão dupla, custo zero nas duas pontas.

---

## 6. COMPONENTES COMPARTILHADOS

Mesmos nomes nos dois clientes, implementações separadas (web/nativo):

`Cartao` · `RotuloSecao` · `NumeroHeroi` · `TresNumeros` · `BarraZonas` (Z1–Z5 com rótulo) · `PontosDaSemana` (S·T·Q·Q·S·S·D, 4 estados) · `BarraProgresso` (SUA SEMANA e Sinal Aberto) · `GraficoVolume8Semanas` (**SVG puro, sem biblioteca**, semana atual em `--ink`) · `Tracado` · `CartaoTreino` · `LinhaAtleta` · `AvatarIniciais` (RF, CF) · `Botao`.

**`Tracado` — decisão de custo, obrigatória:** em listas, cartões e miniaturas, polilinha em **SVG puro** sobre papel, traço `--trace` 3px, **sem nenhum tile de mapa**. Tile só na Atividade em tela cheia, sob toque explícito.

---

## 7. FORMATAÇÃO E LOCALE

Vírgula decimal e ponto de milhar (`8,04 km`, `1.240 km`) · pace sempre `m:ss/km` · tempo `mm:ss` ou `h:mm:ss` · datas por extenso em caixa-alta nos cabeçalhos (`DOMINGO, 26 DE JULHO`) · siglas de dia em duas letras (`SEG`) · fuso `America/Sao_Paulo` · semana começa na segunda.

## 8. COPY — regras invioláveis

Fala como placa: curto, direto, generoso (`Bora.` · `A rua tá aí.` · `Treino publicado.` · `Nada por aqui ainda.` · `Sem sinal. Salvamos no aparelho.`).

Proibido: **premium, assinar, desbloquear, upgrade, grátis por tempo limitado** e qualquer motivacional genérico ("supere seus limites", "seja sua melhor versão"). Dia perdido nunca é falha: **"Não rolou. Sem problema."** Nenhuma notificação de cobrança ou de sequência.

## 9. DEFINIÇÃO DE PRONTO (visual)

Nenhuma cor fora dos tokens · nenhuma sombra ou gradiente · nenhuma fonte proprietária no bundle · zona sempre com rótulo textual · web funcional em 360px e 1280px · contraste AA mínimo · foco visível e navegação por teclado no painel · VoiceOver e TalkBack navegáveis nas telas do corredor · tela de Correr legível em brilho máximo, com alvos ≥ 48pt · nenhuma tela com mais de 7 alvos de toque.
