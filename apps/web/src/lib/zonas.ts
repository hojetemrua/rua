import { TEXTO_SOBRE_ZONA } from "@rua/marca";
import { zona as zonaDoNucleo, ZONAS as ZONAS_DO_NUCLEO } from "@rua/dominio";
import type { NumeroDeZona } from "@rua/dominio";

export type { NumeroDeZona };

/**
 * Zonas na web: o núcleo define número, sigla, rótulo e faixa de FC; aqui só
 * entram as classes Tailwind, que são específicas deste cliente.
 *
 * `texto` sai de `@rua/marca`, onde a cor legível sobre cada zona foi medida:
 * Z1 15,4 · Z2 8,2 · Z3 8,0 · Z4 5,2 com tinta; a Z5 só passa com branco.
 */
export type ZonaNaWeb = {
  zona: NumeroDeZona;
  sigla: string;
  rotulo: string;
  /** Classe de preenchimento. */
  fundo: string;
  /** Classe de cor de texto que atinge AA sobre este fundo. */
  texto: string;
};

const FUNDO: Record<NumeroDeZona, string> = {
  1: "bg-z1",
  2: "bg-z2",
  3: "bg-z3",
  4: "bg-z4",
  5: "bg-z5",
};

function classeDeTexto(n: NumeroDeZona): string {
  return TEXTO_SOBRE_ZONA[`z${n}`] === "#FFFFFF" ? "text-branco" : "text-tinta";
}

export const ZONAS: Record<NumeroDeZona, ZonaNaWeb> = Object.fromEntries(
  ([1, 2, 3, 4, 5] as NumeroDeZona[]).map((n) => [
    n,
    {
      zona: n,
      sigla: ZONAS_DO_NUCLEO[n].sigla,
      rotulo: ZONAS_DO_NUCLEO[n].rotulo,
      fundo: FUNDO[n],
      texto: classeDeTexto(n),
    },
  ]),
) as Record<NumeroDeZona, ZonaNaWeb>;

export function zona(numero: NumeroDeZona): ZonaNaWeb {
  // Garante que web e núcleo nunca divirjam no rótulo.
  void zonaDoNucleo;
  return ZONAS[numero];
}
