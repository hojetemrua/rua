/**
 * Zonas de esforço.
 *
 * A cor nunca aparece sozinha: toda zona carrega um rótulo textual, porque
 * quem não distingue as cores precisa ler a zona. O handoff fixa apenas
 * Z3 = "FIRME"; os outros quatro rótulos são propostos aqui e devem ser
 * confirmados com o design antes de irem para produção.
 */

export type NumeroDeZona = 1 | 2 | 3 | 4 | 5;

export type Zona = {
  zona: NumeroDeZona;
  /** Sigla curta usada na interface: `Z3`. */
  sigla: string;
  /** Rótulo textual que acompanha a cor. */
  rotulo: string;
  /** Classe de preenchimento Tailwind mapeada nos tokens. */
  fundo: string;
};

export const ZONAS: Record<NumeroDeZona, Zona> = {
  1: { zona: 1, sigla: "Z1", rotulo: "LEVE", fundo: "bg-z1" },
  2: { zona: 2, sigla: "Z2", rotulo: "SOLTO", fundo: "bg-z2" },
  3: { zona: 3, sigla: "Z3", rotulo: "FIRME", fundo: "bg-z3" },
  4: { zona: 4, sigla: "Z4", rotulo: "FORTE", fundo: "bg-z4" },
  5: { zona: 5, sigla: "Z5", rotulo: "MÁXIMO", fundo: "bg-z5" },
};

export function zona(numero: NumeroDeZona): Zona {
  return ZONAS[numero];
}
