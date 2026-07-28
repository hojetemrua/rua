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
  /**
   * Cor de texto que atinge AA sobre esta zona. Medida, não estimada:
   * Z1 15,4 · Z2 8,2 · Z3 8,0 · Z4 5,2 com tinta; Z5 só passa com branco
   * (6,9 contra 2,9 da tinta). O limiar "escura a partir da Z4" erra na Z4.
   */
  texto: string;
};

export const ZONAS: Record<NumeroDeZona, Zona> = {
  1: { zona: 1, sigla: "Z1", rotulo: "LEVE", fundo: "bg-z1", texto: "text-tinta" },
  2: { zona: 2, sigla: "Z2", rotulo: "SOLTO", fundo: "bg-z2", texto: "text-tinta" },
  3: { zona: 3, sigla: "Z3", rotulo: "FIRME", fundo: "bg-z3", texto: "text-tinta" },
  4: { zona: 4, sigla: "Z4", rotulo: "FORTE", fundo: "bg-z4", texto: "text-tinta" },
  5: { zona: 5, sigla: "Z5", rotulo: "MÁXIMO", fundo: "bg-z5", texto: "text-branco" },
};

export function zona(numero: NumeroDeZona): Zona {
  return ZONAS[numero];
}
