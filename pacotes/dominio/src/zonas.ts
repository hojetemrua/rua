import type { NumeroDeZona, TempoPorZona } from "./tipos";

export type Zona = {
  numero: NumeroDeZona;
  /** Sigla curta: `Z3`. */
  sigla: string;
  /** Rótulo textual que ACOMPANHA a cor, nunca a substitui. */
  rotulo: string;
  /** Faixa de percentual da frequência cardíaca máxima. */
  minimo: number;
  maximo: number;
};

/**
 * Cinco zonas por percentual de FC máxima.
 *
 * Cada zona carrega um rótulo textual porque a cor nunca é o único portador da
 * informação — quem não distingue vermelho de laranja precisa ler "FORTE".
 * Faixas clássicas de cinco zonas; o handoff fixa Z3 = "FIRME".
 */
export const ZONAS: Record<NumeroDeZona, Zona> = {
  1: { numero: 1, sigla: "Z1", rotulo: "LEVE", minimo: 0, maximo: 0.6 },
  2: { numero: 2, sigla: "Z2", rotulo: "SOLTO", minimo: 0.6, maximo: 0.7 },
  3: { numero: 3, sigla: "Z3", rotulo: "FIRME", minimo: 0.7, maximo: 0.8 },
  4: { numero: 4, sigla: "Z4", rotulo: "FORTE", minimo: 0.8, maximo: 0.9 },
  5: { numero: 5, sigla: "Z5", rotulo: "MÁXIMO", minimo: 0.9, maximo: 1.1 },
};

export function zona(numero: NumeroDeZona): Zona {
  return ZONAS[numero];
}

/** Zona de um batimento, dada a FC máxima da pessoa. */
export function zonaPorFc(fc: number, fcMaxima: number): NumeroDeZona {
  if (fcMaxima <= 0) return 1;
  const fracao = fc / fcMaxima;
  if (fracao < ZONAS[2].minimo) return 1;
  if (fracao < ZONAS[3].minimo) return 2;
  if (fracao < ZONAS[4].minimo) return 3;
  if (fracao < ZONAS[5].minimo) return 4;
  return 5;
}

/**
 * FC máxima estimada pela idade, quando a pessoa não informou a dela.
 * Tanaka: mais fiel que a regra dos 220 menos a idade, sobretudo acima dos 40.
 */
export function fcMaximaEstimada(idade: number): number {
  return Math.round(208 - 0.7 * idade);
}

export type AmostraDeFc = { fc: number; segundos: number };

/** Soma o tempo em cada zona a partir das amostras de batimento. */
export function tempoPorZona(
  amostras: readonly AmostraDeFc[],
  fcMaxima: number,
): TempoPorZona {
  const total: TempoPorZona = { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 };
  for (const { fc, segundos } of amostras) {
    const n = zonaPorFc(fc, fcMaxima);
    total[`z${n}`] += segundos;
  }
  return total;
}

/** Fração de cada zona sobre o total, para desenhar a barra. */
export function fracoesPorZona(
  tempo: TempoPorZona,
): Array<{ zona: NumeroDeZona; fracao: number }> {
  const soma = Object.values(tempo).reduce((a, b) => a + b, 0);
  if (soma === 0) return [];
  return ([1, 2, 3, 4, 5] as NumeroDeZona[])
    .map((n) => ({ zona: n, fracao: tempo[`z${n}`] / soma }))
    .filter((f) => f.fracao > 0);
}
