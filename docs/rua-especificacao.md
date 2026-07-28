# RUA — Especificação de Produto e Desenvolvimento

> Fonte de verdade do projeto: **produto, arquitetura, dados, regras de negócio**.
> Documento irmão: `docs/rua-handoff-design.md` — fonte de verdade **visual e de telas**.
> Em conflito: este documento vence em dados, regras e arquitetura; o handoff vence em visual e conteúdo de tela.
> Idioma de todo o produto e do código (tabelas, rotas, textos): **português brasileiro**.

**Versão 2 · julho de 2026** — substitui a v1, que assumia PWA único em Vite.

---

## 0. Leia isto antes de escrever qualquer linha

**O que é a Rua.** Plataforma de corrida — apps nativos iOS e Android + plataforma web — que conecta três públicos: o **corredor**, o **assessor** (treinador/assessoria) e a **comunidade** (grupos, encontros, provas).

**A promessa que define todas as decisões:** a Rua é **100% gratuita, para sempre, sustentada pela comunidade**. Sem plano premium, sem recurso trancado, sem comissão sobre a mensalidade do assessor, sem anúncio, sem venda de dados.

**Consequências práticas no código:**
1. Não existe nenhuma flag `is_premium`, `plano`, `trial` ou paywall em nenhuma tabela ou componente. Nunca.
2. Não existe limite artificial (número de alunos, de treinos, de histórico, de rotas).
3. Todo dado do usuário é exportável por ele em um clique, em formato aberto (JSON + GPX).
4. Custo de infraestrutura é restrição de arquitetura real: preferir sempre a solução aberta e o menor custo por usuário.
5. **Os níveis de apoio nunca liberam funcionalidade.** Compram capacidade, independência e permanência. Tudo funciona desde o nível 1.

**Cinco valores, e o que cada um obriga:**
- **De todos** — nenhum recurso pago; nenhuma hierarquia de acesso além do necessário para privacidade.
- **Sinal aberto** — página pública de contas e roadmap, alimentada por dados reais do banco.
- **Pé no chão** — simplicidade como princípio moral. Na dúvida, corta. Experiência-alvo: **abrir, correr, fechar**.
- **Mão dupla** — o assessor trabalha de graça na plataforma e não paga pedágio sobre o que cobra dos alunos.
- **Calçada larga** — acessibilidade real (VoiceOver, TalkBack, tipografia dinâmica), funciona em celular fraco e internet ruim, sem julgamento de ritmo em nenhuma tela.

**Marca e licença.** Código sob **AGPL-3.0-or-later**. A marca **não** está licenciada (ver `TRADEMARK.md`): pedido de registro em curso no INPI para a expressão **HOJE TEM RUA** (classes 9 e 41); "Rua" é o nome curto de uso corrente. Ativos em `public/marca/` (logo derivado da fonte Grama, licenciada da Plau) estão **excluídos** da licença do código — nunca embarcar arquivos da fonte, apenas SVG em curvas. Contribuições exigem **DCO** (`git commit -s`), o que preserva a possibilidade de duplo licenciamento para as lojas de aplicativo.

---

## 1. Arquitetura — dois clientes, um núcleo

Nenhuma tecnologia entrega a melhor experiência nos três destinos ao mesmo tempo. A divisão é por necessidade, não por preferência:

| Cliente | Tecnologia | Por quê |
|---|---|---|
| **App do corredor** (iOS + Android) | Expo / React Native | GPS em segundo plano, HealthKit/Health Connect, voz e gestão de bateria só existem em nativo. É requisito. |
| **Plataforma do assessor + site público** | Next.js (App Router) na Vercel | Painel denso, tabelas, teclado, telão. Assessor trabalha sentado. |
| **Núcleo** | pacotes TypeScript | Regras e acesso a dados escritos uma vez, usados nos dois. |

**Backend:** Supabase (Postgres, Auth, Storage, Realtime, Edge Functions).
**E-mail:** Resend, via server action ou edge function, domínio próprio com subdomínio remetente.
**Mapas:** MapLibre + OpenStreetMap; tiles próprios no médio prazo (ver §7).
**Testes:** Vitest no domínio; Playwright nos fluxos críticos da web.

### Monorepo (pnpm + Turborepo)

```
/apps
  /movel          Expo (iOS + Android) — app do corredor
  /web            Next.js — site público + plataforma do assessor
/pacotes
  /dominio        TypeScript puro, zero UI: pace, splits, zonas, constância,
                  aderência, recordes, recorte de privacidade, polilinha
  /dados          cliente Supabase, tipos gerados, consultas
  /marca          tokens exportados como CSS vars (web) e objeto JS (nativo)
/supabase         migrations, policies, edge functions
/docs             esta especificação + handoff de design
/design           protótipos
```

**Regra de ouro:** nenhuma fórmula de cálculo dentro de componente. Tudo em `pacotes/dominio`, com teste unitário. Se o pace é calculado em dois lugares, está errado.

### Ambiente

```
NEXT_PUBLIC_SUPABASE_URL      / EXPO_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY / EXPO_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY     (somente servidor)
RESEND_API_KEY                (somente servidor)
RUA_APPLE_ATIVO=false         (liga o login Apple quando a conta Developer existir)
```

Infraestrutura na conta própria da Rua — nunca reutilizar refs de outros projetos. Registrar no `AGENTS.md`: project ref do Supabase, projeto na Vercel, org do GitHub.

---

## 2. Modelo de dados (Supabase / Postgres)

Migrations SQL versionadas. Todas as tabelas com `id uuid default gen_random_uuid()` e `criado_em timestamptz default now()`.

> Usar `gen_random_uuid()` — nunca `gen_random_bytes()`, que exige pgcrypto e falha.

```sql
-- PERFIL
perfis (
  id uuid pk references auth.users on delete cascade,
  apelido text unique not null,          -- handle público [a-z0-9_]
  nome text not null,
  cidade text, uf text,
  foto_path text, bio text,
  perfil_publico boolean default false,  -- privado por padrão
  unidade text default 'km',
  criado_em timestamptz default now()
)

zonas_privacidade (id, user_id fk perfis, lat numeric, lng numeric, raio_m int default 200)

tenis (id, user_id, nome, marca, km_inicial numeric default 0,
       ativo boolean default true, aposentado_em date)

-- ATIVIDADES
atividades (
  id uuid pk,
  user_id fk perfis,
  inicio timestamptz not null,
  duracao_s int not null,
  duracao_movimento_s int,
  distancia_m numeric not null,
  ganho_m numeric,
  pace_medio_s_km int,
  fc_media int, fc_max int,
  cadencia_media int,
  fonte text check (fonte in ('gps','manual','importacao','saude')),
  polilinha text,                        -- codificada, JÁ recortada por privacidade
  splits jsonb,                          -- [{km:1,tempo_s:305,ganho_m:4,fc:162}]
  tempo_por_zona jsonb,                  -- {z1:120,z2:900,z3:1100,z4:220,z5:0}
  arquivo_path text,                     -- gpx/tcx original no Storage
  tenis_id fk tenis null,
  percepcao int check (percepcao between 1 and 10),
  comentario text,
  treino_prescrito_id fk treinos_prescritos null,
  privacidade text default 'privado' check (privacidade in ('privado','grupo','publico')),
  id_local text,                         -- id gerado no dispositivo: evita duplicata
  criado_em timestamptz default now()
)
-- índices: (user_id, inicio desc), (treino_prescrito_id), unique (user_id, id_local)

-- GRUPOS
grupos (id, nome, slug unique, tipo check (tipo in ('assessoria','clube')),
        cidade, uf, bio, foto_path, publico boolean default true, criado_por fk perfis)

grupo_membros (id, grupo_id, user_id,
               papel check (papel in ('assessor','auxiliar','corredor')),
               status check (status in ('ativo','pendente','inativo')), entrou_em)
-- unique (grupo_id, user_id)

turmas (id, grupo_id, nome, descricao)
turma_membros (turma_id, user_id)         -- pk composta
convites (id, grupo_id, token unique, papel, expira_em, usos_max int, usos int default 0)

-- TREINOS
treinos_modelo (id, grupo_id, autor_id, nome,
                tipo check (tipo in ('leve','intervalado','longao','ritmo','regenerativo','forca')),
                faixa_volume text,        -- "14–18 km · 1h30–2h" (exibição)
                estrutura jsonb not null, notas text,
                publico boolean default false,   -- biblioteca pública da Rua
                usos int default 0)
-- estrutura: {blocos:[{tipo:'aquecimento',duracao_s:900},
--   {tipo:'serie',repeticoes:8,esforco:{distancia_m:400,pace_alvo_s_km:255},
--    intervalo:{distancia_m:200,tipo:'trote'}},
--   {tipo:'volta_calma',duracao_s:600}]}

treinos_prescritos (
  id, grupo_id, user_id,                  -- sempre resolvido por corredor
  turma_id null, modelo_id null,
  data date not null,
  estrutura jsonb not null,               -- cópia congelada na prescrição
  notas text,
  status default 'previsto' check (status in ('previsto','realizado','perdido','ajustado')),
  criado_por fk perfis
)
-- índices: (user_id, data), (grupo_id, data)

comentarios (id, atividade_id, autor_id, texto, criado_em)    -- recado do assessor

-- COMUNIDADE
encontros (id, grupo_id, titulo, descricao, inicio timestamptz,
           local_nome, lat, lng, publico boolean default true, criado_por)
encontro_presencas (encontro_id, user_id, status check (status in ('vou','talvez','nao')))

metas (id, user_id, tipo check (tipo in ('distancia_semanal','distancia_mensal',
       'presenca_semanal','prova')), alvo numeric,
       periodo_inicio date, periodo_fim date, prova_nome text, prova_data date)

-- SINAL ABERTO E LANÇAMENTO
transparencia_meses (id, mes date unique, custo_centavos int,
                     apoio_bruto_centavos int, taxa_centavos int, nota text)
apoios (id, user_id null, valor_centavos int, mes date,
        recorrente boolean, fundador boolean default false, anonimo boolean default true)
niveis_apoio (id, ordem int, nome text, meta_centavos int, descricao text, alcancado_em date)
lista_espera (id, email text unique, origem text, criado_em)
```

### 2.1 RLS — obrigatória em todas as tabelas

- `perfis`: leitura pública só se `perfil_publico = true`; escrita só do próprio.
- `atividades`: dono lê/escreve sempre. Terceiros leem se `privacidade='publico'`; membros do mesmo grupo leem se `privacidade in ('grupo','publico')`; **assessor do grupo sempre lê as atividades vinculadas a treinos prescritos daquele grupo**.
- `treinos_prescritos`: corredor lê os seus; assessor e auxiliar leem e escrevem os do grupo.
- `treinos_modelo`: do grupo para o grupo; se `publico=true`, leitura para qualquer autenticado.
- `grupo_membros`: assessor gerencia; corredor pode sair (update do próprio status).
- `transparencia_meses` e `niveis_apoio`: **leitura pública inclusive para anônimos**. Escrita só por `service_role`.
- `apoios`: agregados públicos via view; registros individuais só do próprio (respeitar `anonimo`).
- `lista_espera`: insert público, leitura só `service_role`.

Criar funções `é_membro(grupo uuid)` e `é_assessor(grupo uuid)` em SQL (`security definer`, `search_path` fixo) para não repetir subconsultas nas policies.

**Teste obrigatório:** script que autentica corredor A, corredor B e assessor e verifica leitura/escrita cruzada. Nenhuma fase é pronta sem ele.

---

## 3. Regras de domínio (`pacotes/dominio`, funções puras com teste)

```ts
paceSKm(distancia_m, duracao_s) => Math.round(duracao_s / (distancia_m/1000))
formatarPace(s) => "5:10/km"               // sempre m:ss
formatarDistancia(m) => "8,04 km"          // pt-BR, vírgula decimal

// SPLITS: fatiar por km acumulado interpolando o ponto que cruza a marca.

// FILTRO DE SINAL: descartar accuracy > 25 m; descartar salto com velocidade
// implícita > 8 m/s; pausa automática < 0,5 m/s por 20 s.

// PRIVACIDADE: antes de PERSISTIR a polilinha, remover trechos dentro das
// zonas de privacidade (início e fim). Nunca recortar apenas na renderização.
// A distância total do esforço permanece intacta.

// CONSTÂNCIA (métrica-herói): SEMANAS consecutivas com ≥1 atividade.
// Nunca dias consecutivos — sequência diária empurra corredor para lesão.
// Semana começa segunda, fuso America/Sao_Paulo.

// ADERÊNCIA (assessor): na semana, realizados / prescritos.
// Vínculo automático: mesma data (±1 dia) e distância dentro de ±20%.
// Senão, vínculo manual pelo corredor.

// ZONAS: z1..z5 por percentual de FC máxima, sempre com rótulo textual
// (ex.: Z3 "FIRME"). Cor nunca é o único portador da informação.

// RECORDES: melhor tempo em 1k, 5k, 10k, 21k, 42k por janela deslizante
// sobre os splits; maior distância, maior duração, maior ganho.
```

**Regra de produto sobre bem-estar:** em nenhuma tela a Rua sugere aumento de volume, exibe ranking por pace entre pessoas diferentes, ou pressiona sequência diária. Rankings de comunidade são por **presença** e por **km somados do grupo**.

---

## 4. App do corredor (Expo) — requisitos não negociáveis

**Navegação:** cinco abas de mesmo peso — **Hoje · Plano · Correr · Comunidade · Perfil**. "Correr" é aba, não botão flutuante. Perfil também abre pelo avatar no topo. Máximo de **7 alvos de toque** por tela.

**Motor de corrida:**
- `expo-location` com permissão de segundo plano (`UIBackgroundModes: ["location"]` no iOS; serviço de primeiro plano no Android) e `expo-task-manager`.
- Textos de permissão honestos, em português: *"A Rua usa sua localização durante a corrida para medir distância, pace e traçado. Nada é gravado quando você não está correndo."*
- **`expo-sqlite` é a fonte da verdade local.** Cada ponto grava em disco na hora. A corrida funciona 100% em modo avião; o Supabase é apenas destino de sincronização.
- Fila de sincronização idempotente por `id_local` — nunca duplicar atividade.
- `expo-keep-awake` durante a gravação; precisão adaptativa para poupar bateria.
- Avisos por voz a cada km (`expo-speech`), em português, com áudio em modo "duck" — não interromper a música.
- **Recuperação de queda:** se o app morrer, ao reabrir oferecer retomar a corrida a partir do SQLite. Nunca perder treino de ninguém.

**Saúde:** HealthKit (iOS) e Health Connect (Android) — ler FC do relógio, escrever o treino concluído. Importação de GPX/TCX por compartilhamento de arquivo.

**Notificações:** `expo-notifications`, **opt-in**, somente para recado do assessor, encontro do grupo e treino publicado. Nunca para cobrar treino, lembrar sequência ou provocar culpa.

**Acessibilidade:** tipografia dinâmica, rótulos em todos os controles (VoiceOver/TalkBack), alvos ≥ 48pt, contraste alto, e a tela de Correr legível sob sol — números enormes, nada fino, nada piscando.

---

## 5. Plataforma do assessor (web) — três níveis e nada mais

**Turma → Atleta → Biblioteca.**

- **Turma:** aderência da semana, grade `S·T·Q·Q·S·S·D` com quatro estados (feito / hoje / não rolou / previsto), volume, coluna "sinal", bloco `QUEM AINDA NÃO APARECEU` com contexto humano e botão `Mandar um oi`, bloco `PUBLICAR NA SEMANA`.
- **Atleta:** semana, aderência, pace médio, constância; últimas atividades; volume de 8 semanas; semana publicada; campo de recado no treino.
- **Biblioteca:** modelos com faixa de volume/tempo, contador de uso, filtros, publicar para a turma ou para a biblioteca pública da Rua — custo zero nas duas pontas.

**Princípios do painel:** sem ranking de atleta, sem alerta vermelho, sem número de cobrança. Dia perdido é registro, não bronca — copy fixa: **"Não rolou. Sem problema."** Sem reposição automática de treino.

**Ergonomia:** navegação por teclado na tabela, atalho de prescrição, seleção múltipla para publicar em lote, sem modal aninhado.

**Rotas web públicas:** `/` (manifesto + lista de espera), `/sinal-aberto`, `/roadmap`, `/g/:slug`, `/e/:id`, `/@:apelido`.

---

## 6. Sustentação — como os níveis funcionam

Níveis são metas coletivas de custo, **nunca desbloqueio de recurso**:

| Nível | Nome | Meta/mês | Compra |
|---|---|---|---|
| 1 | A rua de pé | R$ 1.000 | Infra completa no ar. **Coberto pelo fundador no lançamento.** |
| 2 | Cabe mais gente | R$ 2.500 | Escala para dezenas de milhares: tiles próprios, storage, tempo real. |
| 3 | Fora do bolso de um | R$ 4.500 | Associação, contabilidade, jurídico, marca. A Rua deixa de depender de uma pessoa. |
| 4 | Um ano na frente | R$ 7.000 | Fundo de reserva de 12 meses. |
| 5 | Mais gente construindo | R$ 12.000 | Remunerar desenvolvimento, acessibilidade, suporte e moderação. |

Apoio recorrente via Catarse Assinaturas, que retém 13% de cada apoio confirmado. **As metas publicadas são valores brutos**; a página Sinal Aberto mostra bruto, taxa e líquido separadamente. Planos individuais: R$ 10 Trote · R$ 25 Ritmo · R$ 50 Firme · R$ 100 Longão · R$ 300 Pelotão (assessorias, lojas, empresas). Recompensas são **simbólicas, nunca funcionais** — a linha oficial é: *"Quem apoia não ganha recurso extra — ganha o app de pé."*

---

## 7. Custo como decisão de arquitetura

- **Traçado sem tile.** Em listas, cartões e miniaturas, renderizar a polilinha como **SVG puro** sobre papel (`react-native-svg` no app; SVG inline na web), traço `--trace` de 3px. Tile de mapa só na tela de Atividade em tela cheia, sob toque explícito. É o maior corte de custo da operação.
- **Tiles próprios** (OpenStreetMap + Protomaps em object storage com egress gratuito) quando o volume justificar; até lá, provedor cujo plano gratuito **para em vez de cobrar** ao estourar a cota.
- **Storage:** polilinha codificada + splits no banco; arquivo original comprimido no Storage. Não criar tabela por trackpoint.
- **"Correndo agora"** (Realtime presence) é o recurso mais caro e sensível: implementar por último, **opt-in**, canal efêmero, exibindo só o total da cidade — nunca posição individual.

---

## 8. Privacidade, LGPD e segurança

Perfil e atividade **privados por padrão**. Zonas de privacidade aplicadas **antes de persistir**. Dado agregado para mapa da comunidade é **opt-in** explícito. Exclusão de conta apaga tudo em cascata, incluindo Storage, com confirmação por digitação do apelido. Nenhuma chave de serviço no cliente; segredos só no servidor. Rate limit e validação de payload no servidor. Rótulos de privacidade da Apple e formulário de Segurança de Dados do Google declarando localização precisa vinculada à conta, usada para funcionalidade do app, **sem rastreamento de terceiros e sem venda de dados**.

---

## 9. Ordem de construção

| Fase | Entrega |
|---|---|
| 1 | Monorepo, `pacotes/marca`, `pacotes/dominio` com testes, `pacotes/dados` com tipos gerados |
| 2 | Migrations + RLS + funções auxiliares + seeds + teste de policies com três usuários |
| 3 | Auth nos dois clientes: Google agora, Apple cabeado por env |
| 4 | Expo: shell das cinco abas, tokens, componentes base |
| 5 | Expo: motor de corrida (SQLite, GPS em segundo plano, pausa, voz, recuperação, resumo) |
| 6 | Expo: Hoje, Atividade (traçado SVG + zonas), Plano |
| 7 | Web: site público + lista de espera + Sinal Aberto com dados reais |
| 8 | Web: Turma → Atleta → Biblioteca, prescrição em lote, recado |
| 9 | Expo: Comunidade e Perfil; exportação total; HealthKit/Health Connect |
| 10 | Builds EAS, metadados de loja, política de privacidade, submissão |
| 11 | "Correndo agora" (Realtime), opt-in |

**Depois do MVP, sem fechar portas agora:** rotas salvas e trechos com ranking · plano adaptativo transparente · áudio-guia em português gravado pela comunidade · cobrança do assessor via Pix **sem comissão da plataforma** · apps de relógio · integração Strava/Garmin · selos de marcos · calendário de provas · rede de 5k semanais gratuitos com cronometragem por QR · diretório de assessores · corrida-guia acessível para corredores cegos · governança comunitária.

---

## 10. Definição de pronto

`tsc --noEmit` limpo nos dois apps · testes do domínio passando · teste de RLS com três usuários passando · web em 360px e 1280px · contraste AA mínimo (meta AAA) · navegação por teclado no painel · VoiceOver e TalkBack navegáveis nas telas do corredor · nenhuma cor fora dos tokens · `npm run build` e `eas build --profile preview` sem aviso · Lighthouse mobile na web ≥ 90 performance e 100 acessibilidade.

## 11. O que NÃO fazer

Não criar plano pago, limite de uso, recurso trancado ou anúncio — nem "por enquanto". Não usar as palavras premium / assinar / desbloquear / upgrade. Não expor ranking individual por pace nem sequência diária. Não pedir dado que a Rua não usa (peso, foto de corpo, medidas). Não usar `localStorage`/`AsyncStorage` para dados de corrida — SQLite no app, IndexedDB na web. Não criar tabela por trackpoint. Não embarcar a fonte Grama. Não usar gradiente nem dark mode, e nenhuma sombra além da de contato dos cartões (`--sh`, só na web). Não aceitar PR sem `git commit -s`. Não adicionar dependência que resolva algo que 30 linhas resolvem. Não colocar mais de 7 alvos de toque numa tela.
