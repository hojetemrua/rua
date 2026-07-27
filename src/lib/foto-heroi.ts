import fs from "node:fs";
import path from "node:path";

export const CAMINHO_FOTO_HEROI = "/heroi/corredores.jpg";

/**
 * A foto do herói vive no protótipo de design (~7 MB) e não está no
 * repositório. Enquanto o arquivo não for colocado em
 * `public/heroi/corredores.jpg`, o herói é desenhado só em papel e tinta —
 * em vez de apontar para uma imagem inexistente e quebrar o layout.
 *
 * A checagem é síncrona e de escopo de módulo de propósito: roda uma vez, na
 * prerenderização, e entra na casca estática da página.
 */
export const temFotoDeHeroi = fs.existsSync(
  path.join(process.cwd(), "public", "heroi", "corredores.jpg"),
);
