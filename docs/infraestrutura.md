# RUA — infraestrutura

Tudo em conta própria do RUA, no e-mail `hojetemrua@gmail.com`. Nada é
compartilhado com outro projeto: nem projeto do Supabase, nem projeto do
Vercel, nem chave do Resend, nem porta local.

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
