# Relógios — o que é necessário para 19 de setembro

## A troca de enquadramento

Não se integra com relógio. Integra-se com os **dois cofres de saúde do
sistema operacional** — HealthKit no iOS, Health Connect no Android. Uma
integração por plataforma em vez de uma por marca, e de uma vez ficam cobertos
Garmin, Apple Watch, Polar, Coros, Suunto, Wahoo e Amazfit.

Isso não é atalho: é o único desenho que cabe no calendário, e é o mesmo que
Strava e TrainingPeaks usam para a maior parte da base. Integração direta com
fabricante é exceção, não regra.

No Android o Google Fit saiu de cena e o Health Connect é o caminho único.

## O que cada caminho entrega de verdade

| Caminho | Traz | Não traz | Portão |
|---|---|---|---|
| **Apple Watch → HealthKit** | Treino inteiro, **com traçado** | — | Nenhum: capability self-serve |
| **Garmin → Apple Health** | Resumo, FC, sono, passos | **O traçado GPS não** | Nenhum |
| **Garmin → Health Connect** | Sessão, distância, FC | Rota *talvez* — exige teste | Declaração no Play Console |
| **Importar GPX/TCX** | Traçado completo, histórico inteiro | Exige um ato do corredor | Nenhum |
| **API Garmin (nuvem)** | Tudo, inclusive rota e push | — | **Uso empresarial apenas** |
| **Connect IQ** (app no relógio) | Gravar direto na Rua | Monkey C: terceiro código | Conta Garmin comum, grátis |
| **App watchOS** | Gravar no Apple Watch | Swift puro: RN não faz watchOS | Segundo app, App Groups |

## A pegadinha que decide o desenho

**A Garmin não escreve o traçado GPS no Apple Health.** Está confirmado no
fórum da própria Garmin, é comportamento antigo e não há sinal de mudança.

Consequência direta: no iOS, quem usa Garmin traz distância, duração, pace e
frequência cardíaca — e **não traz mapa**. Como a Rua mostra traçado com zona de
privacidade aplicada, isso precisa estar escrito na tela de conexão, não
descoberto pelo corredor depois. A saída para quem quer o mapa é importar o GPX,
e a tela tem que dizer isso.

No Android a situação é melhor no papel: o Health Connect tem `ExerciseRoute`,
com permissão própria (`READ_EXERCISE_ROUTE`, separada da permissão de sessão).
A Garmin entrou no Health Connect a partir de junho de 2025. **Se ela escreve a
rota, ninguém documentou** — é teste em aparelho real, com relógio real, e é a
primeira coisa a fazer.

## iOS — o que configurar

1. **Conta Apple Developer.** Já era o item nº 1 do caminho crítico; agora
   também destrava o HealthKit.
2. **Capability HealthKit** no App ID e entitlement `com.apple.developer.healthkit`.
3. **`NSHealthShareUsageDescription`** e **`NSHealthUpdateUsageDescription`** em
   pt-BR, no `app.json`.
4. **`@kingstinct/react-native-healthkit`** — tem plugin de config do Expo,
   expõe `getWorkoutRoutes` (é o que traz o traçado do Apple Watch) e aceita
   `background: true` para entrega em segundo plano.
5. **Build de desenvolvimento.** Nada disso roda no Expo Go.
6. **Política de privacidade publicada**, dizendo com essas palavras que o dado
   de saúde **não é usado para publicidade**. A Apple exige a frase, e a Rua não
   tem anúncio de qualquer jeito — é só escrever.
7. **Pedir só os tipos que se usa.** Pedir categoria de saúde que o app não usa
   é o que mais aumenta o rigor da revisão.

Não existe fila de aprovação da Apple para HealthKit: é capability, não
entitlement negociado. O custo é **revisão mais rigorosa**, não espera.

## Android — o que configurar

1. **Conta no Play Console.**
2. **`react-native-health-connect`** com o plugin de config.
3. **Permissões no manifesto:** `READ_EXERCISE`, `READ_DISTANCE`,
   `READ_HEART_RATE`, `READ_TOTAL_CALORIES_BURNED` e, para o mapa,
   `READ_EXERCISE_ROUTE`.
4. **`PERMISSION_READ_HEALTH_DATA_HISTORY`.** Sem ela, o Health Connect só
   entrega os **30 dias** anteriores à concessão. Quem chega com dois anos de
   corrida não traz nada além do último mês — e o corredor vai achar que a Rua
   perdeu o histórico dele.
5. **Formulário de declaração no Play Console**, justificando cada tipo de dado:
   por que o app precisa, que benefício traz, que proteção existe. **Isto é
   revisão com prazo**, e é o único portão real de calendário do lado Android.
6. **Intent-filter de racional de permissão** e política de privacidade.

## O que já está pronto no repositório

- `atividades.fonte` já aceita `'saude'` e `'importacao'`; `arquivo_path` já
  guarda o arquivo original no Storage. O modelo de dados previu isto.
- `recortarZonasDePrivacidade` em `@rua/dominio` — **obrigatório rodar antes de
  persistir, inclusive em dado importado.** A regra inviolável não abre exceção
  para traçado que veio de fora.
- `polilinha.ts` codifica e simplifica; `pace.ts` fatia em splits.
- `sinal.ts` filtra ponto ruim de GPS. **Dado de relógio já vem filtrado** —
  filtrar de novo remove ponto bom. A importação não passa por `filtrarPontos`.

## O problema que só aparece depois

**Duplicata.** Se o corredor gravar na Rua e o relógio também escrever no cofre,
a mesma corrida entra duas vezes — e a constância em semanas, a aderência ao
plano e o volume todos contam errado.

Precisa de regra de deduplicação antes de a primeira conexão existir: mesma
janela de tempo mais distância próxima é a mesma corrida, e a fonte com traçado
ganha. Isso é regra de domínio, com teste, em `@rua/dominio`.

## O que a especificação diz hoje

A especificação coloca HealthKit/Health Connect na **fase 9** e põe "apps de
relógio · integração Strava/Garmin" em **depois do MVP**. O pedido de ter
relógio funcionando em 19/9 move a fase 9 para dentro do lançamento.

Vale registrar: os termos da API do Strava restringem uso por serviço
concorrente, e a Rua é um. Antes de investir uma hora nisso, ler os termos.

## Recomendação

**Levar em 19/9:** leitura de HealthKit, leitura de Health Connect e importação
de GPX/TCX. Isso é honestamente "conecta com Garmin e Apple Watch" para a
maioria do que um corredor precisa.

**Deixar fora:** app watchOS, Connect IQ, API Garmin na nuvem, arquivo FIT.
Cada um é um caminho próprio de código, revisão e loja.

Por que a API da Garmin fica fora, mesmo sendo a melhor tecnicamente: o programa
é **para uso empresarial**, e a Rua hoje é uma pessoa física — constituir a
associação é o nível 3 da escada de apoio, não uma tarefa de agosto. A Garmin
responde o status em dois dias úteis e a integração leva de uma a quatro
semanas, mas nada disso começa sem CNPJ. O endereço público do formulário de
acesso está fora do ar, e as páginas da Garmin não dizem se o programa está
aberto — só "stay tuned". Depender disso para 19/9 é apostar.

### A tensão que precisa da sua decisão

Somar permissão de saúde à submissão de 5/9 aumenta o rigor da revisão **no
build que já é o caminho crítico**. Existem dois jeitos:

- **Tudo em 19/9.** Mais risco na submissão que não pode ser rejeitada duas
  vezes.
- **Importação GPX/TCX no lançamento** — zero risco de revisão, porque não pede
  permissão nenhuma — e **os cofres de saúde na primeira atualização**, dias
  depois. O corredor de Garmin e de Apple Watch já traz corrida no dia 19; a
  conexão automática chega em uma semana.

A segunda protege a data. A primeira entrega a promessa inteira no dia.

## Cronograma, se for tudo em 19/9

| Data | O que |
|---|---|
| 01/08 | Teste em aparelho: a Garmin escreve `ExerciseRoute` no Health Connect? |
| 04/08 | Política de privacidade publicada, com a frase sobre publicidade |
| 08/08 | Importador de GPX/TCX, com zona de privacidade aplicada |
| 12/08 | Regra de deduplicação em `@rua/dominio`, com teste |
| 15/08 | HealthKit lendo treino e traçado do Apple Watch |
| 20/08 | Health Connect lendo sessão, FC e rota |
| **22/08** | **Formulário de declaração submetido no Play Console** |
| 29/08 | Congelamento de código |
| 05/09 | Submissão às lojas |

O formulário do Play é o item com data própria: se ele voltar com pedido de
esclarecimento em setembro, o Android atrasa e o iOS não. Submeter em 22/08 dá
duas semanas de folga.

---

Fontes: [Garmin Connect Developer Program FAQ](https://developer.garmin.com/gc-developer-program/program-faq/)
· [Garmin: rotas não sincronizam para o Apple Health](https://forums.garmin.com/apps-software/mobile-apps-web/f/garmin-connect-mobile-ios/352961/garmin-connect-does-not-sync-workout-routes-i-e-gps-data-to-apple-health-app)
· [Health Connect: tipos de dado e permissões](https://developer.android.com/health-and-fitness/guides/health-connect/plan/data-types)
· [Declarar acesso a dado de saúde no Play](https://developer.android.com/health-and-fitness/guides/health-connect/publish/declare-access)
· [react-native-healthkit](https://github.com/kingstinct/react-native-healthkit)
· [react-native-health-connect](https://github.com/matinzd/react-native-health-connect)
· [expo-apple-targets: apps de relógio](https://mintlify.wiki/EvanBacon/expo-apple-targets/guides/watch-apps)
· [Connect IQ SDK](https://developer.garmin.com/connect-iq/sdk/)
