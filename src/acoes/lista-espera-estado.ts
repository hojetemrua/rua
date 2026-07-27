/**
 * Estado do formulário da lista de espera.
 *
 * Vive fora de `lista-espera.ts` porque um arquivo `"use server"` só pode
 * exportar função assíncrona — exportar o objeto inicial de lá derruba o
 * módulo em tempo de execução, e nem o `tsc` nem o `next build` avisam.
 */
export type EstadoDaLista =
  | { estado: "ocioso" }
  | { estado: "ok" }
  | { estado: "erro"; mensagem: string };

export const ESTADO_INICIAL: EstadoDaLista = { estado: "ocioso" };
