# Rua

**Plataforma de corrida livre. De todos, para sempre.**

Rua é um app de corrida e uma plataforma para assessorias — 100% gratuito, sem
plano pago, sem recurso trancado, sem anúncio, sem comissão. Sustentado por
quem corre nela.

🌐 [rua.run](https://rua.run) · 📣 [@hojetemrua](https://instagram.com/hojetemrua) · ✉️ oi@rua.run

> **Estado:** em construção, abre em 2026. A home e a lista de espera estão no
> ar; o aplicativo do corredor e o painel do assessor ainda são cascas de
> navegação. Ver [docs/infraestrutura.md](docs/infraestrutura.md).

## Por que existe

A rua nunca cobrou nada de ninguém. É o único espaço esportivo verdadeiramente
público que existe: sem catraca, sem mensalidade, aberto a qualquer hora para
qualquer pessoa. O mercado de apps de corrida foi cercando esse espaço com
assinaturas e paywalls — inclusive cobrando do treinador para que ele possa
treinar seus alunos.

A Rua herda a promessa do asfalto. Três públicos, um lugar, ninguém paga para
estar nele:

- **Corredor** — registra o treino, vê o pace, acompanha a constância. Tudo, de graça.
- **Assessor** — monta planilha e acompanha a turma inteira sem mensalidade e sem comissão. O que você cobra do aluno é seu, inteiro.
- **Comunidade** — encontro marcado, grupo aberto, ponto de partida no mapa. Quem chegar, corre.

## Princípios não negociáveis

Estes valem para qualquer contribuição. Pull requests que os violem não são
aceitos:

1. **Sem paywall, nunca.** Não existe flag de plano, trial, limite artificial ou recurso pago no código.
2. **Sem anúncio e sem venda de dados.**
3. **Seus dados são seus.** Exportação completa em formato aberto, a um clique.
4. **Privado por padrão.** Perfil e atividade nascem fechados; zonas de privacidade são aplicadas antes de persistir o traçado.
5. **Sem cobrança emocional.** Não existe ranking individual por pace, nem sequência diária de treino (que empurra corredor para lesão). Constância é medida em semanas.
6. **Contas abertas.** O custo real da operação é público no painel Sinal Aberto, na home.

## Stack

- **Next.js** (App Router) + **TypeScript** + **Tailwind**
- **Supabase** — Postgres, Auth, Storage, Realtime
- **Resend** — e-mail transacional
- **Vercel** — deploy
- **MapLibre + OpenStreetMap** — mapas *(ainda não integrado; o traçado é SVG puro, sem tiles, e assim continua em listas e miniaturas)*

Tipografia: Archivo, Inter e Overpass — todas open source, carregadas via
`next/font` e auto-hospedadas.

## Rodando localmente

Pré-requisitos: **Node 20+**, **Docker** (para a pilha Supabase local) e o
**Supabase CLI** (já vem como dependência de desenvolvimento).

```bash
git clone https://github.com/hojetemrua/rua.git
cd rua
npm install

npx supabase start          # sobe Postgres, Auth e API locais
cp .env.example .env.local  # preencha com o que o start imprimir
npm run dev
```

Abra <http://localhost:3000>.

> A pilha local do Rua usa a faixa de portas **544xx** (API em `54421`), e não
> a padrão `543xx`. Isso permite rodar outro projeto Supabase na mesma máquina
> sem conflito. `npx supabase status` imprime as URLs e chaves.

Sem Supabase configurado a home continua de pé: o painel Sinal Aberto cai numa
semente e avisa na tela que os números são de exemplo, em vez de apresentar
dado falso como real.

### Variáveis de ambiente

| Variável | Para quê |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública (respeita RLS) |
| `RESEND_API_KEY` | Envio de e-mail — opcional em desenvolvimento |
| `RUA_EMAIL_REMETENTE` | Remetente, ex.: `Rua <oi@rua.run>` |

**Não há chave de service role.** A aplicação nunca usa privilégio que ignore
RLS: a escrita na lista de espera passa por uma função `SECURITY DEFINER` no
banco, com escopo restrito ao que ela precisa fazer. Se um dia aparecer uma
`SUPABASE_SERVICE_ROLE_KEY` no código da aplicação, é bug.

### Banco

```bash
npx supabase db reset       # aplica migrações e semente, no local
npx supabase db push        # aplica migrações no projeto remoto vinculado
```

Todas as tabelas têm Row Level Security **e privilégio mínimo por papel** — uma
coisa não substitui a outra, porque `TRUNCATE` não passa por RLS. Ao criar
tabela nova, faça `revoke all` e conceda só o necessário; ver
[a migração de privilégios](supabase/migrations/20260726150000_privilegios_minimos.sql).

Teste as policies com três usuários (corredor A, corredor B, assessor) antes de
abrir PR.

## Estrutura

```
src/app          rotas (App Router) e layouts
src/componentes  UI compartilhada — base/, home/, navegacao/
src/conteudo     todo o texto da interface, separado do código
src/acoes        server actions
src/lib          formatação pt-BR, zonas, cliente Supabase, leitura de dados
supabase         migrations e seed
docs             infraestrutura e handoff de design
```

Ainda não existem, e entram junto com as fases correspondentes: `src/dominio`
(regras puras e testáveis — pace, splits, aderência, constância) e `src/gps`
(captura, filtro e fila offline).

Tudo em português: código, rotas, tabelas, textos.

## Contribuindo

Toda contribuição é bem-vinda — código, tradução, acessibilidade, documentação,
teste.

- Abra uma issue antes de PRs grandes.
- Assine seus commits com `git commit -s` (DCO) — é o que mantém a licença administrável.
- Antes do PR: `npx tsc --noEmit` e `npm run build` precisam passar.

> Ainda não há suíte de testes automatizados nem `docs/rua-especificacao.md` no
> repositório. Quando existirem, passam a ser exigência de PR.

## Licença

Código sob **AGPL-3.0-or-later** — veja [LICENSE](LICENSE). Na prática: você
pode usar, estudar, modificar e redistribuir; se rodar uma versão modificada
como serviço na rede, precisa abrir o código dela também. Foi escolhida de
propósito: garante que a Rua não vire produto fechado de ninguém.

**A marca não está licenciada.** O nome Rua, o logotipo e a identidade visual
são marca registrada — veja [TRADEMARK.md](TRADEMARK.md). Você pode forkar o
código; não pode chamar de Rua. Os arquivos em `public/marca/` são derivados de
fonte licenciada e estão excluídos da licença do código.

---

Feito no Brasil, na rua.
