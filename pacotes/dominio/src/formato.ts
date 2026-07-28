/**
 * Formatação pt-BR. Vírgula decimal, ponto de milhar, fuso de São Paulo.
 * Nada de número formatado à mão espalhado pelas telas.
 */

export const FUSO = "America/Sao_Paulo";

const inteiro = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const umaCasa = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const duasCasas = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** `1240` → `"1.240"` */
export function formatarInteiro(valor: number): string {
  return inteiro.format(valor);
}

/** `8040` → `"8,04 km"` — metros para quilômetros, com a unidade. */
export function formatarDistancia(metros: number): string {
  return `${duasCasas.format(metros / 1000)} km`;
}

/** `8.04` → `"8,04"` — só o número, para quando o rótulo já diz a unidade. */
export function formatarKm(km: number): string {
  return duasCasas.format(km);
}

/** `18.4` → `"18,4"` — volume semanal, uma casa. */
export function formatarVolume(km: number): string {
  return umaCasa.format(km);
}

/**
 * Pace por quilômetro, sempre `m:ss/km`.
 * `310` → `"5:10/km"`
 */
export function formatarPace(segundosPorKm: number): string {
  return `${formatarRelogio(segundosPorKm)}/km`;
}

/**
 * Duração como relógio: `mm:ss` abaixo de uma hora, `h:mm:ss` acima.
 * `2496` → `"41:36"` · `3760` → `"1:02:40"`
 */
export function formatarDuracao(segundos: number): string {
  return formatarRelogio(segundos);
}

function formatarRelogio(segundos: number): string {
  const total = Math.max(0, Math.round(segundos));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const dd = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${dd(m)}:${dd(s)}` : `${m}:${dd(s)}`;
}

/** `64000` → `"640"`; `115000` → `"1.150"`. Centavos são a unidade guardada. */
export function formatarReais(centavos: number): string {
  const reais = centavos / 100;
  return Number.isInteger(reais)
    ? inteiro.format(reais)
    : duasCasas.format(reais);
}

/**
 * Converte `"2026-07-26"` num Date estável.
 * Fixa ao meio-dia UTC para que nenhum fuso empurre a data para o dia anterior.
 */
export function dataDeIso(iso: string): Date {
  return new Date(`${iso.slice(0, 10)}T12:00:00.000Z`);
}

const diaCompleto = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

/** `"2026-07-26"` → `"DOMINGO, 26 DE JULHO"` */
export function formatarDiaPorExtenso(iso: string): string {
  return diaCompleto.format(dataDeIso(iso)).toUpperCase();
}

const mesLongo = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** `"2026-07-01"` → `"JULHO DE 2026"` */
export function formatarMesPorExtenso(iso: string): string {
  return mesLongo.format(dataDeIso(iso)).toUpperCase();
}

/** `"2026-07-01"` → `"JULHO 2026"` — forma curta usada no painel. */
export function formatarMesCurto(iso: string): string {
  return formatarMesPorExtenso(iso).replace(" DE ", " ");
}

/** Siglas de dia em três letras, segunda a domingo. */
export const SIGLAS_DE_DIA = [
  "SEG",
  "TER",
  "QUA",
  "QUI",
  "SEX",
  "SÁB",
  "DOM",
] as const;

/** Iniciais da semana, para a grade S·T·Q·Q·S·S·D. */
export const INICIAIS_DE_DIA = ["S", "T", "Q", "Q", "S", "S", "D"] as const;

/**
 * Pace sem a unidade, para quando o rótulo da tela já diz "PACE".
 * `310` → `"5:10"`
 */
export function formatarPaceCurto(segundosPorKm: number): string {
  return formatarRelogio(segundosPorKm);
}

/** `8040` → `"8,04"` — metros em quilômetros, sem a unidade. */
export function formatarMetrosEmKm(metros: number): string {
  return formatarKm(metros / 1000);
}

/**
 * Percentual arredondado de `parte` sobre `total`.
 * Devolve o número real, que pode passar de 100 — quem desenha a barra decide
 * se corta. Total zero devolve 0 em vez de NaN.
 */
export function porcentagem(parte: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((parte / total) * 100);
}
