/**
 * Tipos do banco.
 *
 * `banco.gerado.ts` é saída de máquina: `pnpm --filter @rua/dados gerar-tipos`
 * o reescreve inteiro. Este arquivo é escrito à mão e nunca é sobrescrito.
 *
 * A separação existe porque o alias `Banco` morava dentro do arquivo gerado e
 * desapareceu na primeira regeneração — o build quebrou em dois pacotes por um
 * motivo que não tinha nada a ver com a mudança em curso. Nada escrito à mão
 * volta para lá.
 */

import type { Database } from "./banco.gerado";

export type { Database } from "./banco.gerado";

/** Nome curto usado em todo o pacote. */
export type Banco = Database;
