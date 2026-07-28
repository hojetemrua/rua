/**
 * Formatação da web — reexporta `@rua/dominio`.
 *
 * Nenhuma fórmula vive aqui. A regra de ouro do projeto é que cálculo e
 * formatação existem uma vez, no núcleo, e são usados pelos dois clientes: se
 * o pace é calculado em dois lugares, está errado.
 *
 * Este arquivo existe só para os componentes seguirem importando de `@/lib`.
 */
export {
  FUSO,
  dataDeIso,
  formatarDiaCurto,
  formatarDiaCurtoCaixaAlta,
  formatarDiaPorExtenso,
  formatarDistancia,
  formatarDuracao,
  formatarInteiro,
  formatarKm,
  formatarMesCurto,
  formatarMesPorExtenso,
  formatarMetrosEmKm,
  formatarPace,
  formatarPaceCurto,
  formatarReais,
  formatarVolume,
  porcentagem,
  INICIAIS_DE_DIA,
  SIGLAS_DE_DIA,
} from "@rua/dominio";
