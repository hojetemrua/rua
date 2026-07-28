import fs from "node:fs";
import path from "node:path";

/**
 * Foto do herói.
 *
 * Arquivo original: 5152x7728, 6,8 MB, direto do Unsplash. Aqui ele entra
 * redimensionado para 2400px de largura e reencodado com mozjpeg em qualidade
 * 74, o que leva a 497 KB sem perda visível — a imagem tem desfoque de
 * movimento, então quase não tem alta frequência para preservar.
 *
 * O que o visitante baixa é menor ainda: o next/image gera AVIF e WebP no
 * tamanho da tela a partir deste arquivo.
 *
 * O nome do arquivo é o do Unsplash de propósito: carrega o autor e o
 * identificador da foto, então a procedência não depende de ninguém lembrar.
 */

const NOME_DO_ARQUIVO = "pierre-antoine-franck-W2pBsQaT6FQ-unsplash.jpg";

export const CAMINHO_FOTO_HEROI = `/heroi/${NOME_DO_ARQUIVO}`;

export const LARGURA_FOTO_HEROI = 2400;
export const ALTURA_FOTO_HEROI = 3600;

/** Identificador da foto no Unsplash, para o crédito apontar para a origem. */
export const FOTO_HEROI_NO_UNSPLASH =
  "https://unsplash.com/photos/W2pBsQaT6FQ";

/**
 * Miniatura de 12px embutida, exibida enquanto a foto carrega. Evita o salto
 * de um retângulo vazio para a imagem no elemento mais pesado da página.
 */
export const BLUR_FOTO_HEROI =
  "data:image/jpeg;base64,/9j/2wBDAA4ODg4PDhASEhAXGBYYFyEfHBwfITIkJyQnJDJNMDgwMDgwTURSQz5DUkR6X1VVX3qMdnB2jKqYmKrWy9b/////2wBDAQ4ODg4PDhASEhAXGBYYFyEfHBwfITIkJyQnJDJNMDgwMDgwTURSQz5DUkR6X1VVX3qMdnB2jKqYmKrWy9b/////wgARCAASAAwDASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAUBAwb/xAAVAQEBAAAAAAAAAAAAAAAAAAACAf/aAAwDAQACEAMQAAAATaZHY5KEEf/EACEQAAIBAwMFAAAAAAAAAAAAAAECAwAEEQUSMRMjQVJx/9oACAEBAAE/AI5lN/uff04gHUryG8U80+QSmcj3NWd7JFBGN6knkgYPw1LekOcGrBFeTVCyg9gmiTX/xAAWEQEBAQAAAAAAAAAAAAAAAAABACH/2gAIAQIBAT8AAdi//8QAGBEAAwEBAAAAAAAAAAAAAAAAAAECIUH/2gAIAQMBAT8AdNYXw//Z";

/**
 * A foto pode não estar presente num checkout limpo. A checagem é síncrona e
 * de escopo de módulo de propósito: roda uma vez, na prerenderização, e entra
 * na casca estática. Sem o arquivo, o herói é desenhado só em papel e tinta em
 * vez de apontar para uma imagem inexistente.
 */
export const temFotoDeHeroi = fs.existsSync(
  path.join(process.cwd(), "public", "heroi", NOME_DO_ARQUIVO),
);
