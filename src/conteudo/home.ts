/**
 * Todo o texto da home em um só lugar.
 *
 * ⚠️ DOIS BLOCOS ESTÃO EM RASCUNHO
 *
 * O handoff descreve "o manifesto completo" (herói) e "o texto de origem"
 * (seção Por que gratuito) sem transcrevê-los, e os protótipos HTML não estão
 * no repositório. Os campos marcados com RASCUNHO abaixo foram escritos na voz
 * do restante da copy para a página não ficar com buraco — mas NÃO são o texto
 * definitivo. Substituir pelos originais de Home_rua_run.html antes de publicar.
 *
 * Todo o resto é literal do handoff.
 */

export const NAVEGACAO = [
  { rotulo: "Quem corre nela", href: "#quem-corre-nela" },
  { rotulo: "Por que gratuito", href: "#por-que-gratuito" },
  { rotulo: "Como funciona", href: "#como-funciona" },
  { rotulo: "Me avisa", href: "#me-avisa" },
] as const;

export const HEROI = {
  selo: "ABRE EM 2026 · LISTA ABERTA",
  titulo: ["LIVRE PARA", "CORRER."],
  // RASCUNHO — substituir pelo manifesto completo do protótipo.
  manifesto:
    "A rua não cobra pedágio. Não tem catraca, não tem plano melhor, não tem " +
    "versão que corre mais rápido se você pagar. O Rua é o aplicativo dessa " +
    "rua: o treino registrado, a planilha do assessor e a turma do bairro no " +
    "mesmo lugar, de graça para todo mundo, para sempre. Não porque é " +
    "promoção — porque cobrar de alguém para correr nunca fez sentido.",
  apoioDoCampo: "Um aviso quando abrir. Nada além disso.",
  // Crédito da foto do herói. Fica visível na página, como no protótipo, e
  // aponta para a origem — o Unsplash não exige atribuição, mas creditar
  // quem fez é o mínimo.
  creditoDaFoto: "Foto: Pierre-Antoine FRANCK",
  creditoDaFotoFonte: "Unsplash",
} as const;

export const QUEM_CORRE_NELA = {
  titulo: "A rua é nossa.",
  subtitulo:
    "Corredor, assessor e comunidade no mesmo lugar — e ninguém paga para estar nele.",
  blocos: [
    {
      titulo: "Corredor",
      texto:
        "Registra o treino, vê o pace, acompanha a constância. Tudo, de graça. " +
        "Nenhum recurso trancado — hoje nem em 2030.",
    },
    {
      titulo: "Assessor",
      texto:
        "Monta planilha e acompanha a turma inteira sem mensalidade e sem " +
        "comissão. O que você cobra do aluno é seu, inteiro.",
    },
    {
      titulo: "Comunidade",
      texto:
        "Encontro marcado, grupo aberto, ponto de partida no mapa. Quem chegar, corre.",
    },
  ],
} as const;

export const POR_QUE_GRATUITO = {
  rotulo: "Por que gratuito?",
  titulo: "Começou com um corredor querendo dividir o que achou.",
  // RASCUNHO — substituir pelo texto de origem do protótipo (Davi X Rodrigues).
  origem:
    "Eu comecei a correr sozinho, com um aplicativo que guardava metade das " +
    "coisas atrás de um plano pago. Fui atrás de montar o que eu queria ver na " +
    "tela e, quando ficou de pé, achei mais sentido dividir do que vender. O " +
    "Rua nasceu daí. Manter isso no ar tem um custo, e esse custo está logo " +
    "abaixo, aberto, mês a mês — é a única coisa que eu peço.",
  assinatura: "Davi X Rodrigues",
  marcadores: [
    "apoio mensal do valor que der, cancelável a qualquer hora",
    "quem apoia não ganha recurso extra, ganha o app de pé",
    "cada nível alcançado fica publicado aqui, com o número real",
  ],
} as const;

export const SINAL_ABERTO = {
  rotuloDoQueVemDepois: "O que vem depois",
  botao: "Apoiar todo mês",
  rodape: "Sem meta escondida: o número acima é o custo real do mês.",
} as const;

export const COMO_FUNCIONA = {
  titulo: "Abrir, correr, fechar.",
  passos: [
    {
      numero: "01",
      titulo: "Abrir",
      texto: "O treino do dia já está na tela. Um botão só: Bora.",
    },
    {
      numero: "02",
      titulo: "Correr",
      texto:
        "Número gigante, nada piscando, legível no sol. Guarda o celular.",
    },
    {
      numero: "03",
      titulo: "Fechar",
      texto: "Traçado, splits e zonas na hora. E o recado do assessor.",
    },
  ],
} as const;

export const FECHO = {
  titulo: "A rua está aberta.",
  texto:
    "Entra na lista e te chamamos quando abrir. Sem fila paga, sem convite especial.",
} as const;

export const RODAPE = {
  lema: "Feito no Brasil, na rua.",
  subLema: "De todos, para sempre.",
  ondeAGenteFala: {
    rotulo: "Onde a gente fala",
    perfil: "@hojetemrua",
    redes: [
      { rotulo: "Instagram", href: "https://instagram.com/hojetemrua" },
      { rotulo: "TikTok", href: "https://tiktok.com/@hojetemrua" },
      { rotulo: "YouTube", href: "https://youtube.com/@hojetemrua" },
    ],
  },
  transparencia: {
    rotulo: "Transparência",
    // Contas do mês e Roadmap ganham página própria mais adiante; hoje o dado
    // real dos dois vive no painel Sinal Aberto, então é para lá que apontam.
    links: [
      { rotulo: "Contas do mês", href: "#sinal-aberto" },
      { rotulo: "Roadmap público", href: "#sinal-aberto" },
      {
        rotulo: "Código e licença",
        href: "https://github.com/hojetemrua/rua",
        externo: true,
      },
    ],
  },
  contato: {
    rotulo: "Contato",
    email: "oi@rua.run",
  },
  souAssessor: { rotulo: "Sou assessor", href: "/assessor/turma" },
  assinatura: "rua.run · 2026",
} as const;

export const LISTA_ESPERA = {
  rotuloDoCampo: "Seu e-mail",
  placeholder: "voce@email.com",
  botao: "Me avisa",
  sucesso: "Pronto. Te chamamos quando abrir.",
  erroGenerico: "Não deu para gravar agora. Tenta de novo em um instante.",
  erroEmail: "Confere o e-mail e tenta de novo.",
} as const;
