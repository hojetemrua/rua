/**
 * Todo o texto da home em um só lugar.
 *
 * Transcrito de "Home rua.run" no Claude Design. O manifesto e o texto de
 * origem que antes estavam marcados como RASCUNHO foram substituídos pelos
 * definitivos.
 */

export const NAVEGACAO = [
  { rotulo: "Quem corre nela", href: "#quem-corre-nela" },
  { rotulo: "Por que gratuito", href: "#por-que-gratuito" },
  { rotulo: "Como funciona", href: "#como-funciona" },
] as const;

export const HEROI = {
  /**
   * O selo é montado com a data de `projeto.lanca_em`, não escrito à mão:
   * data errada na home do projeto de contas abertas custa mais que o trabalho
   * de buscar do banco.
   */
  seloSufixo: "LISTA ABERTA",
  /** Usado só quando o banco não responde. */
  seloSemente: "ABRE EM SETEMBRO · LISTA ABERTA",
  seloDepoisDeAbrir: "NO AR · DE TODOS, PARA SEMPRE",
  titulo: ["LIVRE PARA", "CORRER."],
  manifesto:
    "A rua nunca te cobrou nada. Nunca pediu cadastro, nunca trancou " +
    "recurso, nunca chamou ninguém de usuário. A rua é de todos: do primeiro " +
    "km ao recorde, do chinelo ao carbono. Livre para correr. Livre para " +
    "evoluir. Livre para se conectar. Sustentada por quem corre nela. De " +
    "todos, para sempre.",
  /** Fecha o manifesto, em Archivo 900. */
  assinaturaDoManifesto: "Rua.",
  apoioDoCampo: "Um aviso quando abrir. Nada além disso.",
  fotoDe: "Foto de",
  fotoEm: "na",
  fotografo: "Pierre-Antoine FRANCK",
  fonteDaFoto: "Unsplash",
} as const;

export const QUEM_CORRE_NELA = {
  titulo: "A rua é nossa.",
  subtitulo:
    "Corredor, assessor e comunidade no mesmo lugar — e ninguém paga para estar nele.",
  blocos: [
    {
      icone: "corredor",
      titulo: "Corredor",
      texto:
        "Registra o treino, vê o pace, acompanha a constância. Tudo, de graça. " +
        "Nenhum recurso trancado — hoje nem em 2030.",
    },
    {
      icone: "assessor",
      titulo: "Assessor",
      texto:
        "Monta planilha e acompanha a turma inteira sem mensalidade e sem " +
        "comissão. O que você cobra do aluno é seu, inteiro.",
    },
    {
      icone: "comunidade",
      titulo: "Comunidade",
      texto:
        "Encontro marcado, grupo aberto, ponto de partida no mapa. Quem chegar, corre.",
    },
  ],
} as const;

export const POR_QUE_GRATUITO = {
  rotulo: "Por que gratuito?",
  titulo: "Começou com um corredor querendo dividir o que achou.",
  origem:
    "Davi X Rodrigues começou sozinho, sem relógio e sem ninguém esperando na " +
    "esquina. Depois achou um grupo, e o grupo virou rotina. Hoje treina com " +
    "assessor e sabe o quanto isso mudou a corrida dele. Só que quanto mais " +
    "fundo ele entrava nesse mundo, mais crescia uma vontade meio teimosa: " +
    "colocar mais gente na rua sentindo essa mesma liberdade — do jeito que " +
    "der, sem depender de quanto cada um pode investir. O Rua é isso, e nada " +
    "além disso.",
  marcadores: [
    "Apoio mensal, do valor que der, cancelável a qualquer hora",
    "Quem apoia não ganha recurso extra — ganha o app de pé",
    "Cada nível alcançado fica publicado aqui, com o número real",
  ],
} as const;

export const SINAL_ABERTO = {
  rotuloDoQueVemDepois: "O que vem depois",
  rotuloAlcancados: "Já alcançado",
  rodape: "Sem meta escondida: o número acima é o custo real do mês.",

  /* Depois de a campanha abrir */
  botao: "Apoiar todo mês",
  /**
   * Onde o apoio recorrente é recebido. Trocar pelo endereço real da campanha
   * quando ela for publicada — ver docs/lancamento.md.
   */
  hrefApoiar: "https://www.catarse.me/hojetemrua",
  deQuemComecou:
    "Os primeiros R$ 1.000 são de quem começou. O nível 2 é com a gente.",

  /* Antes de a campanha abrir */
  rotuloAntesDeAbrir: "Contas abertas · custo do mês",
  tituloAntesDeAbrir: "As contas já estão abertas. O pedido ainda não.",
  antesDeAbrir:
    "A conta acima é a de hoje, e fica publicada aqui todo mês, com o número " +
    "real. O apoio abre no dia em que a Rua abrir — não faz sentido pedir para " +
    "sustentar uma coisa que você ainda não pode usar.",
  botaoAntesDeAbrir: "Quero apoiar quando abrir",
} as const;

export const COMO_FUNCIONA = {
  titulo: "Abrir, correr, fechar.",
  passos: [
    {
      numero: "01",
      icone: "abrir",
      titulo: "Abrir",
      texto: "O treino do dia já está na tela. Um botão só: Bora.",
    },
    {
      numero: "02",
      icone: "correr",
      titulo: "Correr",
      texto:
        "Número gigante, nada piscando, legível no sol. Guarda o celular.",
    },
    {
      numero: "03",
      icone: "fechar",
      titulo: "Fechar",
      texto: "Traçado, splits e zonas na hora. E o recado do assessor.",
    },
  ],
} as const;

export const FECHO = {
  titulo: "A rua está aberta.",
  texto:
    "Entra na lista e te chamamos no dia. Abre no navegador e nas lojas, " +
    "de uma vez. Sem fila paga, sem convite especial.",
  botao: "Me avisa",
} as const;

export const RODAPE = {
  lema: "Feito no Brasil, na rua.",
  subLema: "De todos, para sempre.",
  ondeAGenteFala: {
    rotulo: "Onde a gente fala",
    perfis: [
      {
        icone: "instagram",
        rotulo: "@hojetemrua",
        href: "https://instagram.com/hojetemrua",
      },
      {
        icone: "tiktok",
        rotulo: "@hojetemrua",
        href: "https://tiktok.com/@hojetemrua",
      },
      {
        icone: "youtube",
        rotulo: "@hojetemrua",
        href: "https://youtube.com/@hojetemrua",
      },
    ],
  },
  transparencia: {
    rotulo: "Transparência",
    // Contas do mês e Roadmap ganham página própria mais adiante; hoje o dado
    // real dos dois vive no painel Sinal Aberto, então é para lá que apontam.
    links: [
      { icone: "contas", rotulo: "Contas do mês", href: "#por-que-gratuito" },
      { icone: "roadmap", rotulo: "Roadmap público", href: "#por-que-gratuito" },
      {
        icone: "codigo",
        rotulo: "Código e licença",
        href: "https://github.com/hojetemrua/rua",
        externo: true,
      },
    ],
  },
  contato: {
    rotulo: "Contato",
    links: [
      { icone: "email", rotulo: "oi@rua.run", href: "mailto:oi@rua.run" },
      { icone: "assessor", rotulo: "Sou assessor", href: "/assessor/turma" },
    ],
  },
  assinatura: "rua.run · 2026",
} as const;

export const LISTA_ESPERA = {
  rotuloDoCampo: "Seu e-mail",
  placeholder: "seu e-mail",
  botao: "Me avisa",
  sucesso: "Pronto. Te chamamos quando abrir.",
  erroGenerico: "Não deu para gravar agora. Tenta de novo em um instante.",
  erroEmail: "Confere o e-mail e tenta de novo.",
} as const;
