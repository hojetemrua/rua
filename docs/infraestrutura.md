# RUA — infraestrutura

Tudo em conta própria do RUA, no e-mail `hojetemrua@gmail.com`. Nada é
compartilhado com outro projeto: nem projeto do Supabase, nem projeto do
Vercel, nem chave do Resend, nem porta local.

## Estado atual

| serviço | estado | identificação |
|---|---|---|
| Supabase | no ar, migrações aplicadas | `meqlshmxfzvpctaieopj` · org `Rua` · `sa-east-1` |
| Vercel | no ar em **rua.run** | `rua4/rua` · `www` redireciona 308 para a raiz |
| Resend | MX e SPF verificados, **DKIM pendente** | `rua.run` · `sa-east-1` |
| GitHub | repo criado, **push bloqueado** | token sem acesso ao repositório |

Verificado ponta a ponta em produção: o painel lê o banco
(`R$ 0 de R$ 1.000`, 0 apoiadores), o formulário grava a inscrição e o Resend
entrega o e-mail de confirmação. Lighthouse na produção: 93 / 100 / 100 / 100.

## ⚠️ Regressão em aberto: oi@rua.run não recebe mais

Ao trocar *Mail Settings* de "Email Forwarding" para "Custom MX", os cinco MX
`eforward1..5` e o TXT de SPF da raiz foram removidos. Confirmado no
autoritativo: `rua.run` está **sem MX e sem TXT**.

Consequência: **`oi@rua.run` — o endereço de contato publicado no rodapé do
site que já está no ar — não recebe e-mail nenhum.** Quem escrever recebe
devolução.

Para restaurar, em *Mail Settings → Custom MX*, adicionar ao lado do `send`:

| tipo | host | valor | prioridade |
|---|---|---|---|
| MX | `@` | `eforward1.registrar-servers.com` | 10 |
| MX | `@` | `eforward2.registrar-servers.com` | 10 |
| MX | `@` | `eforward3.registrar-servers.com` | 10 |
| MX | `@` | `eforward4.registrar-servers.com` | 15 |
| MX | `@` | `eforward5.registrar-servers.com` | 20 |

E em *Host Records*, o SPF do encaminhamento:

| tipo | host | valor |
|---|---|---|
| TXT | `@` | `v=spf1 include:spf.efwd.registrar-servers.com ~all` |

Este SPF na raiz **não** conflita com o do Resend, que fica em `send`. São
hosts diferentes; o que quebraria seria dois SPF no mesmo host.

## DNS de rua.run (Namecheap → Advanced DNS)

O domínio está na Namecheap, hoje numa página de estacionamento. Abaixo o que
muda. **Não mexa nos MX `eforward*` nem no TXT de SPF da raiz** — são o
encaminhamento de e-mail que faz `oi@rua.run` funcionar.

### Remover

| tipo | host | valor atual |
|---|---|---|
| A | `@` | `162.255.119.168` (estacionamento) |
| CNAME | `www` | `parkingpage.namecheap.com` |

### Adicionar — Vercel

| tipo | host | valor |
|---|---|---|
| A | `@` | `216.198.79.1` |
| A | `@` | `64.29.17.1` |
| CNAME | `www` | `ec59b7f9eba4221c.vercel-dns-017.com.` |
| TXT | `_vercel` | `vc-domain-verify=rua.run,fdc7052b7f285e35f26f` |
| TXT | `_vercel` | `vc-domain-verify=www.rua.run,fb499c2d68578221808f` |

Dois TXT no mesmo host `_vercel` é correto e permitido.

### Adicionar — Resend

| tipo | host | valor | prioridade |
|---|---|---|---|
| TXT | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDnruiD8BbQZcHbsgJn1oXJEwB7ciXSQ4WEjUG9juNuV23Wxb10uE1LkADIBXnkvv7rQvCdmzEVYEtvZm0GUz7lgUX8m3iiSwvfP6si/I/ftVFE2cnQi2aGxGRJ/PNLGbBaMSrGas+ukbWKLmVVDuwNyCRiiOArIpQco5jAYuypoQIDAQAB` | — |
| MX | `send` | `feedback-smtp.sa-east-1.amazonses.com` | 10 |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` | — |

O Resend usa o subdomínio `send`, então **não conflita** com o SPF que já
existe na raiz. Dois registros SPF no mesmo host quebrariam os dois — por isso
o SPF novo vai em `send`, e não em `@`.

**Atenção na Namecheap:** se *Mail Settings* estiver em "Email Forwarding", a
interface pode recusar o MX de `send`. Nesse caso, troque para "Custom MX" e
recadastre à mão os cinco `eforward1..5` com as prioridades originais
(10, 10, 10, 15, 20) antes de adicionar o de `send`.

### Depois que propagar

```bash
set -a; . ./.env.deploy; set +a
curl -s -X POST https://api.resend.com/domains/8e1726e7-6819-4b3a-b5bd-dd4ee697936a/verify \
  -H "Authorization: Bearer $RESEND_API_KEY"
```

E trocar o remetente para o domínio próprio:

```bash
npx vercel env rm  RUA_EMAIL_REMETENTE production --yes --token "$VERCEL_TOKEN"
printf '%s' "Rua <oi@rua.run>" | npx vercel env add RUA_EMAIL_REMETENTE production --token "$VERCEL_TOKEN"
npx vercel deploy --prod --yes --token "$VERCEL_TOKEN"
```

`metadataBase` já aponta para `https://rua.run`, então não precisa mudar.

### Pendências

1. **Token do GitHub sem acesso ao repositório.** O repo `hojetemrua/rua` já
   existe (público, vazio), mas o token fine-grained foi criado *antes* dele e
   não o inclui na seleção — o push volta 403. Em
   <https://github.com/settings/tokens?type=beta>, editar o token: em
   *Repository access* marcar `rua` (ou "All repositories") e confirmar
   *Contents: Read and write*. Depois: `git push -u origin main`.
2. **Resend aguardando DNS.** Domínio `rua.run` já cadastrado
   (`8e1726e7-6819-4b3a-b5bd-dd4ee697936a`, região `sa-east-1`), estado
   `not_started` até os registros subirem. Enquanto isso só entrega para
   `hojetemrua@gmail.com`; qualquer outro destinatário volta 403. Quem se
   inscrever hoje **entra na lista mas não recebe o e-mail** — a inscrição não
   quebra, por desenho.
3. **Licença.** O repositório é público, e sem arquivo `LICENSE` o padrão legal
   é "todos os direitos reservados" — o oposto do que o rodapé promete em
   "Código e licença" e "De todos, para sempre". Escolher a licença é decisão
   de dono, não minha.
4. **Copy em rascunho no ar.** O manifesto do herói e o texto de origem são
   rascunho meu, não o texto do protótipo — e estão públicos em
   `rua-ten.vercel.app`. Trocar em `src/conteudo/home.ts` antes de divulgar.
5. **Custo do mês.** `transparencia_meses` tem só julho/2026, com
   `custo_centavos = 100000`. É o número do handoff, não uma conta real
   conferida — e **todo mês precisa de uma linha nova**, senão a home passa a
   mostrar o mês anterior.
6. **Sem limite de taxa** em `entrar_na_lista`. Turnstile antes de divulgar.

## Portas locais

A faixa padrão do Supabase (`543xx`) já pertence a outro projeto desta máquina.
O RUA usa **`544xx`**, então as duas pilhas sobem juntas sem conflito:

| serviço | porta |
|---|---|
| API (Kong) | `54421` |
| Postgres | `54422` |
| shadow (db diff) | `54420` |
| pooler | `54429` |
| Studio | `54423` |
| e-mails de teste | `54424` |
| analytics | `54427` |
| inspector (edge) | `8183` |

```bash
npx supabase start          # sobe a pilha do RUA
npx supabase status         # imprime URL e chaves
```

`NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54421`

---

## O que só você pode fazer

Criar conta exige confirmar link no inbox, resolver CAPTCHA e aceitar os Termos
de Uso — não há como eu fazer isso no seu lugar. As quatro, com
`hojetemrua@gmail.com`:

1. **GitHub** — <https://github.com/signup>
2. **Supabase** — <https://supabase.com/dashboard/sign-up> (entrar com o GitHub
   já criado deixa uma credencial a menos para administrar)
3. **Vercel** — <https://vercel.com/signup> (idem: entrar com o GitHub)
4. **Resend** — <https://resend.com/signup>

### Depois de criar: use token, não sessão de CLI

Esta máquina já tem credenciais de **outro** dono:

- Keychain `Supabase CLI` → organização **Lity Pro** (projeto `xlkfyeudpfhrjdawheko`)
- `gh` → conta **`davility`**

`supabase login` **sobrescreve** o token do Lity no Keychain, e `gh auth login`
troca a conta ativa. Autenticar o RUA pelo caminho óbvio quebraria o acesso ao
outro projeto.

Por isso os tokens vão para `.env.deploy` (ignorado pelo git, não lido pela
aplicação). Nada da máquina muda e cada token é revogável sozinho.

Logado no navegador como `hojetemrua`, gerar:

| variável | onde | permissão |
|---|---|---|
| `SUPABASE_ACCESS_TOKEN` | <https://supabase.com/dashboard/account/tokens> | token de conta |
| `VERCEL_TOKEN` | <https://vercel.com/account/tokens> | escopo da conta `hojetemrua` |
| `GITHUB_TOKEN` | <https://github.com/settings/tokens?type=beta> | fine-grained, dono `hojetemrua`, `Contents: RW` + `Administration: RW` |
| `RESEND_API_KEY` | <https://resend.com/api-keys> | envio |

Também preciso saber:

- **Região do Supabase** — recomendo `sa-east-1` (São Paulo), onde estão os corredores.
- **Se `rua.run` já é seu** — sem o domínio, o Resend fica preso em
  `onboarding@resend.dev` e o Vercel usa o subdomínio `.vercel.app`.

Os comandos abaixo carregam o arquivo em vez de depender de sessão:

```bash
set -a; . ./.env.deploy; set +a
```

Sobre cota: o plano gratuito do Supabase permite dois projetos ativos por
organização. Se o outro projeto já ocupa uma vaga na mesma organização, vale
criar o RUA numa **organização separada** — mantém cobrança, limites e acessos
sem cruzamento.

---

## O que eu faço quando isso existir

```bash
set -a; . ./.env.deploy; set +a          # tokens do RUA, sem tocar no Keychain

# GitHub — repositório próprio do RUA
gh repo create hojetemrua/rua --private --source=. --remote=origin --push

# Supabase — projeto próprio e o schema já testado
npx supabase projects create rua --org-id <org-do-hojetemrua> --region sa-east-1
npx supabase link --project-ref <ref-do-rua>
npx supabase db push                     # migração do Sinal Aberto e da lista

# Vercel — projeto próprio e variáveis
npx vercel link --scope hojetemrua
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
npx vercel env add RESEND_API_KEY production
npx vercel env add RUA_EMAIL_REMETENTE production
npx vercel deploy --prod
```

Note que `db push` sobe **só a migração** — `seed.sql` é semente de
desenvolvimento (41 apoiadores fictícios em `@exemplo.rua.run`) e não deve
existir em produção. O painel em produção começa zerado, com o custo real do
mês vindo de `transparencia_meses`.

Depois do primeiro deploy, dois ajustes que dependem da URL de produção:

- **Supabase → Auth → URL Configuration**: `Site URL` e `Redirect URLs` com o
  domínio do RUA. Sem isso o login da fase 3 volta para o lugar errado.
- **`metadataBase`** em [src/app/layout.tsx](../src/app/layout.tsx) já aponta
  para `https://rua.run`; se o domínio final for outro, muda ali.

## Resend: o remetente

Enquanto `rua.run` não estiver verificado, o Resend só aceita enviar de
`onboarding@resend.dev`. É o valor que está em `.env.example` de propósito, para
não parecer que já dá para enviar de `oi@rua.run`.

Para verificar o domínio: Resend → Domains → Add Domain → `rua.run`, e publicar
os registros que ele mostrar (SPF e DKIM) no registrador. Depois disso,
`RUA_EMAIL_REMETENTE="Rua <oi@rua.run>"`.

A ausência de chave do Resend **não** derruba a lista de espera: a inscrição
grava e o e-mail é só ignorado, sem erro para quem se inscreveu — ver
[src/acoes/lista-espera.ts](../src/acoes/lista-espera.ts).

## Antes de abrir para o público

`entrar_na_lista` é escrita pública sem limite de taxa. Antes de divulgar,
ligar CAPTCHA (`[auth.captcha]` no `config.toml` cobre o Auth; a lista precisa
de Turnstile no formulário). Está anotado como pendência, não como pronto.
