import { CORES, RAIOS } from "./tokens";

/**
 * Os tokens como custom properties CSS, nos nomes que o handoff usa.
 *
 * Os nomes em inglês (`--paper`, `--ink`) são a fonte compartilhada com o
 * design; a ponte para utilitários em português vive no CSS da web. Gerar isto
 * daqui garante que web e nativo nunca divirjam num hex.
 */
export function cssDosTokens(): string {
  const linhas = [
    "/* superfícies */",
    `--paper: ${CORES.papel};`,
    `--white: ${CORES.branco};`,
    "",
    "/* tinta */",
    `--ink: ${CORES.tinta};`,
    `--ink-2: ${CORES.tinta2};`,
    `--ink-3: ${CORES.tinta3};`,
    "",
    "/* linhas */",
    `--line: ${CORES.linha};`,
    `--line-2: ${CORES.linha2};`,
    "",
    "/* cor funcional — SÓ onde há dado */",
    `--trace: ${CORES.tracado};`,
    `--trace-texto: ${CORES.tracadoTexto};`,
    `--z1: ${CORES.z1};`,
    `--z2: ${CORES.z2};`,
    `--z3: ${CORES.z3};`,
    `--z4: ${CORES.z4};`,
    `--z5: ${CORES.z5};`,
    "",
    "/* raio */",
    `--r: ${RAIOS.cartao}px;`,
    `--r-sm: ${RAIOS.pequeno}px;`,
    `--r-home: ${RAIOS.cartaoHome}px;`,
    `--r-sm-home: ${RAIOS.pequenoHome}px;`,
    `--r-bloco: ${RAIOS.bloco}px;`,
    `--r-foto: ${RAIOS.foto}px;`,
  ];

  return `:root {\n${linhas.map((l) => (l ? `  ${l}` : "")).join("\n")}\n}\n`;
}
