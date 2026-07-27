/**
 * Formatação pt-BR. Vírgula decimal, ponto de milhar, fuso de São Paulo.
 * Nada de número formatado à mão espalhado pelas telas.
 */

export const FUSO = "America/Sao_Paulo";

const inteiro = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });

const duasCasas = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const umaCasa = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** `1000` → `"1.000"` */
export function formatarInteiro(valor: number): string {
  return inteiro.format(valor);
}

/** `8.04` → `"8,04"` — distância em km, como aparece nos cartões. */
export function formatarKm(km: number): string {
  return duasCasas.format(km);
}

/** `18.4` → `"18,4"` — volume semanal, uma casa. */
export function formatarVolume(km: number): string {
  return umaCasa.format(km);
}

/** `8040` (metros) → `"8,04"` */
export function formatarMetrosEmKm(metros: number): string {
  return formatarKm(metros / 1000);
}

/**
 * `64000` → `"640"`, `100000` → `"1.000"`.
 * Centavos são a unidade de armazenamento; a home nunca mostra centavos
 * porque as metas são valores redondos.
 */
export function formatarReais(centavos: number): string {
  const reais = centavos / 100;
  return Number.isInteger(reais)
    ? inteiro.format(reais)
    : duasCasas.format(reais);
}

/** `2496` → `"41:36"`; `3760` → `"1:02:40"` */
export function formatarDuracao(segundos: number): string {
  const total = Math.max(0, Math.round(segundos));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const dd = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${dd(m)}:${dd(s)}` : `${m}:${dd(s)}`;
}

/** `310` (segundos por km) → `"5:10"` */
export function formatarPace(segundosPorKm: number): string {
  const total = Math.max(0, Math.round(segundosPorKm));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Converte `"2026-07-01"` num Date estável.
 * Fixa ao meio-dia UTC para que nenhum fuso empurre a data para o dia
 * anterior na hora de formatar.
 */
export function dataDeIso(iso: string): Date {
  return new Date(`${iso.slice(0, 10)}T12:00:00.000Z`);
}

const mesLongoUtc = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** `"2026-07-01"` → `"JULHO DE 2026"` */
export function formatarMesPorExtenso(iso: string): string {
  return mesLongoUtc.format(dataDeIso(iso)).toUpperCase();
}

const diaCompletoUtc = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

/** `"2026-07-26"` → `"DOMINGO, 26 DE JULHO"` */
export function formatarDiaPorExtenso(iso: string): string {
  return diaCompletoUtc.format(dataDeIso(iso)).toUpperCase();
}

/**
 * Percentual arredondado de `parte` sobre `total`.
 * Retorna o número real (pode passar de 100); quem desenha a barra é que
 * decide se corta.
 */
export function porcentagem(parte: number, total: number): number {
    if (total <= 0) return 0;
  return Math.round((parte / total) * 100);
}
