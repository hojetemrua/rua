/**
 * Tokens da marca Rua — fonte única.
 *
 * Nenhum hex escrito à mão em componente, nos dois clientes. A web consome
 * `cssDosTokens()` como custom properties; o app nativo consome o objeto
 * direto, porque React Native não tem variável CSS.
 *
 * Valores do handoff de design v2, §1.
 */

export const CORES = {
  /* superfícies */
  papel: "#FAFAF8", // fundo dominante — off-white quente, não branco puro
  branco: "#FFFFFF", // cartões e superfícies elevadas

  /* tinta */
  tinta: "#0A0A0A", // texto principal, números-herói, traço
  tinta2: "#3D3D3A", // texto secundário

  /**
   * DESVIO REGISTRADO DO HANDOFF.
   *
   * O valor do documento é #77776F. Sobre `papel` ele dá 4,32:1, abaixo do
   * mínimo AA de 4,5:1 para texto pequeno — e este é justamente o tom dos
   * rótulos de 11px e dos metadados de 13px. A §9 do handoff exige AA.
   *
   * #74746C é o valor mais claro que atinge AA mantendo o cinza quente:
   * 4,51:1 sobre papel, 4,71:1 sobre branco. Três passos de escurecimento.
   * Para reverter, trocar aqui — e assumir a reprovação de contraste.
   */
  tinta3: "#74746C", // rótulos, metadados, desabilitado

  /* linhas */
  linha: "#E4E4DE", // bordas de cartão
  linha2: "#F0EFEA", // divisores internos

  /* cor funcional — SÓ onde há dado */
  tracado: "#00A650", // traçado da corrida

  /**
   * O mesmo verde, escurecido, para quando o traçado vira TEXTO.
   *
   * #00A650 tem 3,20:1 sobre branco: basta para objeto gráfico, que precisa
   * de 3:1, e reprova para texto pequeno, que exige 4,5:1. Este tom dá 4,74:1
   * sobre branco e 4,54:1 sobre papel, mesmo matiz.
   */
  tracadoTexto: "#008540",

  z1: "#B6ECF5",
  z2: "#2FB3E0",
  z3: "#F58A00",
  z4: "#F0402C",
  z5: "#B3103F",
} as const;

/**
 * Cor de texto legível sobre cada zona. Medida, não estimada:
 * Z1 15,4 · Z2 8,2 · Z3 8,0 · Z4 5,2 com tinta; a Z5 só passa com branco
 * (6,9 contra 2,9 da tinta). O limiar "escura a partir da Z4" erra na Z4.
 */
export const TEXTO_SOBRE_ZONA = {
  z1: CORES.tinta,
  z2: CORES.tinta,
  z3: CORES.tinta,
  z4: CORES.tinta,
  z5: CORES.branco,
} as const;

/**
 * Sombra de contato dos cartões.
 *
 * Duas camadas: 1px de assentamento e um halo largo e muito difuso. A elevação
 * continua vindo principalmente da borda de 1px — a sombra só descola o cartão
 * do papel, sem virar profundidade decorativa.
 *
 * Só existe na web. Em React Native, sombra é `shadowOffset`/`elevation` e não
 * traduz uma string CSS; quando o app precisar, o valor nativo entra aqui ao
 * lado, não no lugar.
 */
export const SOMBRA_CARTAO =
  "0 1px 2px rgba(18, 18, 22, 0.04), 0 16px 40px -26px rgba(18, 18, 22, 0.22)";

export const RAIOS = {
  cartao: 22,
  pequeno: 14,
  /** Blocos grandes da home usam 24/16. */
  cartaoHome: 24,
  pequenoHome: 16,
  bloco: 32,
  foto: 28,
  pilula: 999,
} as const;

export const FONTES = {
  /** Interface, títulos, rótulos. Eixo wdth carregado: os títulos usam 90–96%. */
  ui: "Archivo",
  /** Texto corrido. */
  texto: "Inter",
  /** TODOS os números, sempre com tabular-nums. */
  numero: "Overpass",
} as const;

/** Pesos usados no projeto. Nenhum outro. */
export const PESOS = [400, 500, 600, 800, 900] as const;

export const ESPACO = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 22,
  xl: 32,
} as const;

/** Alvo de toque mínimo, em pontos. Requisito de acessibilidade. */
export const ALVO_MINIMO = 48;

export const FUSO = "America/Sao_Paulo";

export const TOKENS = {
  cores: CORES,
  textoSobreZona: TEXTO_SOBRE_ZONA,
  sombraCartao: SOMBRA_CARTAO,
  raios: RAIOS,
  fontes: FONTES,
  pesos: PESOS,
  espaco: ESPACO,
  alvoMinimo: ALVO_MINIMO,
  fuso: FUSO,
} as const;

export type Tokens = typeof TOKENS;
