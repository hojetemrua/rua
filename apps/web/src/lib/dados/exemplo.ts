/**
 * DADOS DE EXEMPLO — não é banco.
 *
 * As telas do corredor e do assessor existem antes da autenticação (fase 3) e
 * das tabelas de treino, atividade e turma. Em vez de deixar as telas vazias
 * ou inventar dados dentro de cada componente, tudo vive aqui, tipado no
 * formato que as tabelas vão ter.
 *
 * Quando a autenticação e o schema entrarem, este arquivo é substituído por
 * consultas — as telas não mudam, porque só conhecem os tipos abaixo.
 *
 * Os nomes e números vêm do protótipo "App logado" no Claude Design.
 */

import type { NumeroDeZona } from "@/lib/zonas";
import type { EstadoDoDia } from "@/componentes/base/pontos-da-semana";

/* -------------------------------------------------------------------------- */
/* Tipos                                                                       */
/* -------------------------------------------------------------------------- */

export type FatiaDeZona = { zona: NumeroDeZona; fracao: number };

export type Pessoa = {
  id: string;
  nome: string;
  /** "Sumaré, São Paulo · desde março de 2026" */
  descricao?: string;
};

export type Treino = {
  id: string;
  nome: string;
  descricao: string;
  /** Quem publicou a planilha. */
  publicadoPor?: string;
};

export type Atividade = {
  id: string;
  /** "SEXTA, 06:51 · PACAEMBU" */
  cabecalho: string;
  nomeDoTreino: string;
  distanciaKm: number;
  duracaoSegundos: number;
  paceSegundosPorKm: number;
  zonas: FatiaDeZona[];
  /** "MELHOR: KM 5" */
  melhor?: string;
  /** Polilinha do traçado, em graus [lng, lat]. */
  tracado: ReadonlyArray<readonly [number, number]>;
  recado?: { autor: string; texto: string };
};

export type DiaDoPlano = {
  sigla: string;
  dia: number;
  estado: EstadoDoDia;
  nomeDoTreino: string;
  /** "Feito · 5,12 km · 6:22/km" ou "Hoje · 6:30–7:10/km" */
  resultado: string;
  zonas?: FatiaDeZona[];
};

export type Encontro = {
  id: string;
  titulo: string;
  hora: string;
  local: string;
  confirmados: number;
  vou: boolean;
};

export type Grupo = {
  id: string;
  nome: string;
  detalhe: string;
  tipo: "grupo" | "assessoria";
};

export type AtletaDaTurma = {
  id: string;
  nome: string;
  semana: EstadoDoDia[];
  volumeKm: number;
  sinal: string;
};

export type AtletaSumido = {
  id: string;
  nome: string;
  contexto: string;
  diasParado: number;
};

export type TreinoDaBiblioteca = {
  id: string;
  nome: string;
  faixa: string;
  descricao: string;
  usos: number;
  zonas: FatiaDeZona[];
  categoria: "leve" | "intervalado" | "longao";
};

/* -------------------------------------------------------------------------- */
/* Corredor                                                                    */
/* -------------------------------------------------------------------------- */

export const CORREDOR: Pessoa = {
  id: "rafael",
  nome: "Rafael Fontes",
  descricao: "Sumaré, São Paulo · desde março de 2026",
};

export const ASSESSORA: Pessoa = {
  id: "camila",
  nome: "Camila Ferraz",
  descricao: "Sua assessora desde abril",
};

/** Data de referência das telas. Fixa: sem relógio, a página prerenderiza. */
export const HOJE_ISO = "2026-07-26";

export const TREINO_DE_HOJE: Treino = {
  id: "longao-14",
  nome: "Longão 14 km",
  descricao: "Sem pressa: 6:30–7:10/km. Leva água e volta inteiro.",
  publicadoPor: "Camila Ferraz",
};

export const SEMANA_DO_CORREDOR = {
  rotulo: "Semana 21–27 jul",
  feitoKm: 18.4,
  metaKm: 32,
  feitos: 4,
  perdidos: 1,
  previstos: 2,
  dias: [
    "feito",
    "feito",
    "nao-rolou",
    "feito",
    "feito",
    "previsto",
    "hoje",
  ] as EstadoDoDia[],
};

export const PLANO_DA_SEMANA: DiaDoPlano[] = [
  {
    sigla: "SEG",
    dia: 21,
    estado: "feito",
    nomeDoTreino: "5 km leve",
    resultado: "Feito · 5,12 km · 6:22/km",
  },
  {
    sigla: "TER",
    dia: 22,
    estado: "feito",
    nomeDoTreino: "8 × 400 m forte",
    resultado: "Feito · 7,20 km · média 4:41/km",
    zonas: [
      { zona: 1, fracao: 0.08 },
      { zona: 2, fracao: 0.24 },
      { zona: 3, fracao: 0.22 },
      { zona: 4, fracao: 0.32 },
      { zona: 5, fracao: 0.14 },
    ],
  },
  {
    sigla: "QUA",
    dia: 23,
    estado: "nao-rolou",
    nomeDoTreino: "6 km leve",
    resultado: "Não rolou. Sem problema.",
  },
  {
    sigla: "SEX",
    dia: 25,
    estado: "feito",
    nomeDoTreino: "6 km leve",
    resultado: "Feito · 8,04 km · 5:10/km",
  },
  {
    sigla: "DOM",
    dia: 26,
    estado: "hoje",
    nomeDoTreino: "Longão 14 km",
    resultado: "Hoje · 6:30–7:10/km",
  },
];

export const ULTIMA_ATIVIDADE: Atividade = {
  id: "sexta-pacaembu",
  cabecalho: "Sexta, 06:51 · Pacaembu",
  nomeDoTreino: "6 km leve",
  distanciaKm: 8.04,
  duracaoSegundos: 2496,
  paceSegundosPorKm: 310,
  zonas: [
    { zona: 1, fracao: 0.06 },
    { zona: 2, fracao: 0.41 },
    { zona: 3, fracao: 0.34 },
    { zona: 4, fracao: 0.15 },
    { zona: 5, fracao: 0.04 },
  ],
  melhor: "Melhor: km 5",
  // Volta pelo Pacaembu, em graus. O traçado é desenhado em SVG puro.
  tracado: [
    [-46.6702, -23.5401],
    [-46.6688, -23.5372],
    [-46.6631, -23.5366],
    [-46.6622, -23.5335],
    [-46.6541, -23.5331],
    [-46.6522, -23.5307],
    [-46.6438, -23.5312],
    [-46.6392, -23.5341],
    [-46.6397, -23.5375],
    [-46.6470, -23.5380],
    [-46.6480, -23.5401],
    [-46.6589, -23.5404],
    [-46.6688, -23.5401],
  ],
  recado: {
    autor: "Camila Ferraz",
    texto: "Km 5 voou. Domingo, segura o passo no longão. Bora.",
  },
};

/** Gravação em andamento — a tela Correr. Fase 5 troca por GPS de verdade. */
export const GRAVACAO = {
  nomeDoTreino: "Longão 14 km",
  distanciaKm: 7.42,
  duracaoSegundos: 2294,
  paceSegundosPorKm: 309,
  zonaAgora: 3 as NumeroDeZona,
  bpm: 168,
  percentualMaximo: 86,
  cadencia: 176,
  subidaMetros: 84,
  ultimoKm: { pace: "5:04", bpm: 171 },
};

export const VOLUME_8_SEMANAS = [
  { rotulo: "1/6", km: 22.4, destaque: "antigo" },
  { rotulo: "8/6", km: 29.5, destaque: "antigo" },
  { rotulo: "15/6", km: 26.4, destaque: "antigo" },
  { rotulo: "22/6", km: 36.1, destaque: "antigo" },
  { rotulo: "29/6", km: 32.5, destaque: "antigo" },
  { rotulo: "6/7", km: 43.7, destaque: "recente" },
  { rotulo: "13/7", km: 50.8, destaque: "recente" },
  { rotulo: "20/7", km: 29.0, destaque: "atual" },
] as const;

export const PERFIL_DO_CORREDOR = {
  noMes: "112 km",
  semParar: "14 sem",
  melhor10k: "49:12",
  apoio: {
    nivel: 1,
    valor: "R$ 15 por mês",
    nota: "A turma está em 64% do nível 1. Cancelar quando quiser não muda nada no seu app.",
    percentualDaTurma: 64,
  },
};

/* -------------------------------------------------------------------------- */
/* Comunidade                                                                  */
/* -------------------------------------------------------------------------- */

export const CIDADE = "São Paulo · perto de você";

/**
 * Contador de presença. É o recurso mais caro e mais sensível do projeto:
 * entra por último, opt-in, em canal efêmero, e só o total da cidade.
 */
export const CORRENDO_AGORA = 128;

export const ENCONTROS: Encontro[] = [
  {
    id: "ibirapuera",
    titulo: "Terça no Ibirapuera",
    hora: "19:00",
    local: "Portão 7 · 8 km leve, ritmo de conversa",
    confirmados: 12,
    vou: true,
  },
  {
    id: "minhocao",
    titulo: "Sábado no Minhocão",
    hora: "07:00",
    local: "Largada na Amaral Gurgel · 10 km",
    confirmados: 31,
    vou: false,
  },
];

export const GRUPOS: Grupo[] = [
  {
    id: "corre-sumare",
    nome: "Corre Sumaré",
    detalhe: "64 pessoas · 3 encontros por semana",
    tipo: "grupo",
  },
  {
    id: "pe-no-chao",
    nome: "Assessoria Pé no Chão",
    detalhe: "14 atletas · Camila Ferraz",
    tipo: "assessoria",
  },
];

/* -------------------------------------------------------------------------- */
/* Assessor                                                                    */
/* -------------------------------------------------------------------------- */

export const ASSESSORIA = {
  nome: "Pé no Chão",
  assessora: ASSESSORA,
  atletas: 14,
  semana: "Semana 21–27 jul",
  aderencia: 78,
};

export const TURMA: AtletaDaTurma[] = [
  {
    id: "aline",
    nome: "Aline Souto",
    semana: ["feito", "feito", "feito", "feito", "feito", "previsto", "hoje"],
    volumeKm: 31.2,
    sinal: "hoje",
  },
  {
    id: "rafael",
    nome: "Rafael Fontes",
    semana: ["feito", "feito", "nao-rolou", "feito", "feito", "previsto", "hoje"],
    volumeKm: 18.4,
    sinal: "hoje",
  },
  {
    id: "diego",
    nome: "Diego Nakamura",
    semana: ["feito", "nao-rolou", "feito", "feito", "feito", "previsto", "hoje"],
    volumeKm: 24.8,
    sinal: "ontem",
  },
  {
    id: "priscila",
    nome: "Priscila Damasceno",
    semana: ["feito", "feito", "feito", "feito", "feito", "feito", "hoje"],
    volumeKm: 42.6,
    sinal: "hoje",
  },
  {
    id: "elton",
    nome: "Elton Ribeiro",
    semana: [
      "nao-rolou",
      "feito",
      "nao-rolou",
      "feito",
      "nao-rolou",
      "previsto",
      "hoje",
    ],
    volumeKm: 12.1,
    sinal: "terça",
  },
  {
    id: "wagner",
    nome: "Wagner Tobias",
    semana: ["feito", "nao-rolou", "feito", "feito", "feito", "previsto", "hoje"],
    volumeKm: 26.4,
    sinal: "ontem",
  },
];

export const QUEM_NAO_APARECEU: AtletaSumido[] = [
  {
    id: "jussara",
    nome: "Jussara Lima",
    contexto: "Vinha 4×/semana em junho",
    diasParado: 11,
  },
  {
    id: "bruna",
    nome: "Bruna Alcântara",
    contexto: "Última: 10 km em 1:02:40",
    diasParado: 8,
  },
  {
    id: "henrique",
    nome: "Henrique Sá",
    contexto: "Entrou na turma em maio",
    diasParado: 6,
  },
];

export const TREINOS_SEM_PLANILHA = 4;

export const FICHA_DO_ATLETA = {
  pessoa: { id: "rafael", nome: "Rafael Fontes" },
  contexto: "Na turma desde abril · meta: 10 km abaixo de 48:00",
  semanaKm: 18.4,
  aderencia: "4 / 5",
  paceMedio: "5:24",
  semParar: "14 sem",
  ultimasAtividades: [
    {
      id: "25jul",
      data: "25 jul",
      nome: "6 km leve",
      resumo: "8,04 km · 41:36 · 5:10/km",
      zonas: [
        { zona: 1, fracao: 0.06 },
        { zona: 2, fracao: 0.41 },
        { zona: 3, fracao: 0.34 },
        { zona: 4, fracao: 0.15 },
        { zona: 5, fracao: 0.04 },
      ] as FatiaDeZona[],
    },
    {
      id: "22jul",
      data: "22 jul",
      nome: "8 × 400 m forte",
      resumo: "7,20 km · 33:44 · 4:41/km",
      zonas: [
        { zona: 1, fracao: 0.08 },
        { zona: 2, fracao: 0.24 },
        { zona: 3, fracao: 0.22 },
        { zona: 4, fracao: 0.32 },
        { zona: 5, fracao: 0.14 },
      ] as FatiaDeZona[],
    },
    {
      id: "21jul",
      data: "21 jul",
      nome: "5 km leve",
      resumo: "5,12 km · 32:38 · 6:22/km",
      zonas: [
        { zona: 1, fracao: 0.22 },
        { zona: 2, fracao: 0.58 },
        { zona: 3, fracao: 0.2 },
      ] as FatiaDeZona[],
    },
  ],
  semanaPublicada: {
    dias: [
      "feito",
      "feito",
      "nao-rolou",
      "feito",
      "feito",
      "previsto",
      "hoje",
    ] as EstadoDoDia[],
    nota: "Domingo tem longão de 14 km publicado. Quarta não rolou — sem reposição automática.",
  },
  recado: "Km 5 voou. Domingo, segura o passo no longão. Bora.",
};

export const BIBLIOTECA: TreinoDaBiblioteca[] = [
  {
    id: "longao-progressivo",
    nome: "Longão progressivo",
    faixa: "14–18 km · 1h30–2h",
    descricao: "Primeira metade em conversa, última em firme. Sem sprint no fim.",
    usos: 9,
    categoria: "longao",
    zonas: [
      { zona: 1, fracao: 0.2 },
      { zona: 2, fracao: 0.46 },
      { zona: 3, fracao: 0.34 },
    ],
  },
  {
    id: "8x400",
    nome: "8 × 400 m",
    faixa: "7 km · 40 min",
    descricao: "Tiro curto com 200 m de trote. Aquecimento de 15 minutos antes.",
    usos: 22,
    categoria: "intervalado",
    zonas: [
      { zona: 2, fracao: 0.14 },
      { zona: 3, fracao: 0.22 },
      { zona: 4, fracao: 0.44 },
      { zona: 5, fracao: 0.2 },
    ],
  },
  {
    id: "regenerativo",
    nome: "Regenerativo",
    faixa: "5 km · 35 min",
    descricao: "Dia seguinte ao forte. Se apertar, andou errado.",
    usos: 31,
    categoria: "leve",
    zonas: [
      { zona: 1, fracao: 0.62 },
      { zona: 2, fracao: 0.38 },
    ],
  },
];

export const BIBLIOTECA_RESUMO = {
  total: 14,
  compartilhados: 3,
  rodape:
    "Treino compartilhado entra na biblioteca pública do Rua com o seu nome. " +
    "Nenhum assessor paga para publicar, e ninguém paga para usar.",
};
