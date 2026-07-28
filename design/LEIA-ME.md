# Protótipos de design

Os protótipos vivem no projeto **RUA Design System** no Claude Design:
<https://claude.ai/design/p/e035ea0f-bd4d-47ca-8958-5653447589bb>

| Arquivo lá | Tamanho | O que é |
|---|---|---|
| `App logado.dc.html` | 95 KB | **O definitivo das áreas logadas.** HTML puro com estilos inline: 6 telas do corredor + 3 do assessor, com todos os textos, números e estados. Exportar para cá como `App_logado_dc.html`. |
| `App logado standalone-src.html` | 96 KB | Mesmo conteúdo, com o wrapper do bundler. Serve igual. |
| `Home rua.run standalone-src.html` | 33 KB | Fonte legível da home. Foi de onde a home atual foi construída. |
| `Home rua.run (offline).html` | 10 MB | **Não abrir.** Bundle React com a foto embutida em base64. |
| `RUA app logado (offline).html` | 1 MB | **Não abrir.** Substituído pelo `App logado.dc.html`. |
| `uploads/pierre-antoine-franck-...jpg` | 6,8 MB | Foto do herói, original. A versão otimizada (497 KB) está em `apps/web/public/heroi/`. |
| `uploads/rua.svg` | 752 B | Logotipo em curvas. Já está em `apps/web/public/marca/rua.svg`. |

## Por que a pasta está quase vazia

Os arquivos são grandes e ficam fora do Git (ver `.gitignore`), com exceção do
`App_logado_dc.html`. Exportar do Claude Design é passo manual: o servidor
entrega o conteúdo para leitura, não para gravação em disco.

O conteúdo dos protótipos **já está implementado** — a home em
`apps/web/src/componentes/home/`, as nove telas logadas em
`apps/web/src/app/(app)/` e `apps/web/src/app/assessor/`, e os textos em
`apps/web/src/conteudo/`.

## Onde os documentos vencem o protótipo

Um ponto, e é o mais importante:

**Níveis do Sinal Aberto.** O protótipo mostra níveis que liberam
funcionalidade ("Mapa e traçado sem limite", "Painel do assessor liberado"). O
handoff §4 chama isso de paywall custeado coletivamente e manda substituir pela
escada de capacidade. Ver `docs/lancamento.md`.

A sombra de contato (`--sh`) e o `a:hover` em verde, que antes estavam
registrados aqui como divergência, foram **incorporados ao handoff §1** — o
protótipo estava certo nos dois casos.
