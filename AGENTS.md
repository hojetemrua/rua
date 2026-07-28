<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Rua — instruções para quem escreve código aqui

## Leitura obrigatória antes de qualquer linha

1. `docs/rua-especificacao.md` — produto, arquitetura, dados, RLS, regras.
2. `docs/rua-handoff-design.md` — tokens, telas, copy.
3. `design/LEIA-ME.md` — onde vivem os protótipos e o que não abrir.

Em conflito: a especificação vence em dados, regras e arquitetura; o handoff
vence em visual e conteúdo de tela.

## Três armadilhas do Next 16 que já morderam aqui

- Metadados em rota dinâmica contam como leitura de `params`. Página estática
  com metadados dinâmicos não compila — use `MarcadorDinamico`.
- `usePathname` não prerenderiza em rota dinâmica. Separe o desenho do gancho.
- Arquivo `"use server"` só pode exportar função assíncrona. Exportar um objeto
  derruba o módulo em execução, e nem `tsc` nem `next build` avisam.

## Estrutura

```
/apps/movel       Expo — app do corredor (iOS + Android)
/apps/web         Next.js — site público + plataforma do assessor
/pacotes/dominio  regras puras, com teste. NENHUMA fórmula fora daqui.
/pacotes/dados    cliente Supabase, tipos gerados, consultas
/pacotes/marca    tokens: CSS vars (web) e objeto JS (nativo)
/supabase         migrations, policies
/docs             especificação, handoff, infraestrutura
/design           protótipos
```

**Regra de ouro:** se o pace é calculado em dois lugares, está errado. Cálculo
e formatação vivem em `@rua/dominio`, com teste unitário.

## Comandos

```bash
pnpm install            # workspace inteiro
pnpm dev                # todos os apps
pnpm --filter @rua/web dev
pnpm --filter @rua/movel dev
pnpm tipos              # tsc --noEmit em todos os pacotes
pnpm teste              # testes do domínio
pnpm build              # build de produção
```

Banco local (portas 544xx, para conviver com outro projeto na máquina):

```bash
npx supabase start
npx supabase db reset   # migrations + seed
pnpm --filter @rua/dados gerar-tipos
```

## Infraestrutura — conta própria da Rua, nunca reutilizar refs de outro projeto

| Serviço | Referência |
|---|---|
| Supabase | projeto `meqlshmxfzvpctaieopj` · org `Rua` · região `sa-east-1` |
| Vercel | `rua4/rua` · `prj_yKADfiOXYiWKBrTcaw7SEuqSxFcg` · raiz `apps/web` |
| GitHub | `hojetemrua/rua` (público, AGPL-3.0) |
| Resend | domínio `rua.run` verificado · remetente `oi@rua.run` |
| Domínio | `rua.run` na Namecheap · DNS documentado em `docs/infraestrutura.md` |

Tokens de infraestrutura ficam em `.env.deploy` (ignorado pelo git). **Não**
rode `supabase login` nem `gh auth login` nesta máquina: as duas sobrescrevem
credenciais de outro projeto. O runbook está em `docs/infraestrutura.md`.

## Regras invioláveis

Sem paywall, plano, trial, limite artificial ou anúncio — nunca, em nenhum
cliente. Sem as palavras premium / assinar / desbloquear / upgrade. Sem ranking
individual por pace. Constância em semanas, nunca dias. Sem sombra, gradiente
ou dark mode. Sem fonte proprietária no bundle. Exportar dados é um clique.
Perfil e atividade privados por padrão; zonas de privacidade aplicadas antes de
persistir o traçado. Fuso `America/Sao_Paulo`, semana começa na segunda,
números em pt-BR. Máximo 7 alvos de toque por tela. Nenhum PR sem
`git commit -s` (DCO).
