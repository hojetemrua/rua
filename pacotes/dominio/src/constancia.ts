import { FUSO } from "./formato";
import type { AtividadeParaConstancia } from "./tipos";

/**
 * Identificador da semana ISO no fuso de São Paulo: `"2026-W31"`.
 * A semana começa na segunda.
 */
export function chaveDaSemana(data: Date | string): string {
  const d = typeof data === "string" ? new Date(data) : data;

  // Traz a data para o calendário de São Paulo antes de decidir a semana:
  // uma corrida às 22h de domingo em UTC é sábado aqui.
  const local = new Date(
    new Date(d).toLocaleString("en-US", { timeZone: FUSO }),
  );

  const alvo = new Date(
    Date.UTC(local.getFullYear(), local.getMonth(), local.getDate()),
  );

  // ISO 8601: quinta-feira decide o ano da semana.
  const diaIso = alvo.getUTCDay() === 0 ? 7 : alvo.getUTCDay();
  alvo.setUTCDate(alvo.getUTCDate() + 4 - diaIso);

  const primeiroDeJaneiro = new Date(Date.UTC(alvo.getUTCFullYear(), 0, 1));
  const semana = Math.ceil(
    ((alvo.getTime() - primeiroDeJaneiro.getTime()) / 86_400_000 + 1) / 7,
  );

  return `${alvo.getUTCFullYear()}-W${String(semana).padStart(2, "0")}`;
}

/**
 * Chave da semana anterior à informada.
 *
 * A âncora fica ao MEIO-DIA UTC de propósito. Ancorada à meia-noite, a
 * conversão para São Paulo (UTC-3) empurrava a segunda-feira para o domingo
 * anterior, e a função pulava duas semanas em vez de uma. Meio-dia dá três
 * horas de folga em cada direção, o que nenhum fuso brasileiro atravessa.
 */
export function semanaAnterior(chave: string): string {
  const [ano, w] = chave.split("-W");
  const semana = Number(w);

  // 4 de janeiro cai sempre na semana 1 do calendário ISO.
  const ancora = new Date(Date.UTC(Number(ano), 0, 4, 12));
  const diaIso = ancora.getUTCDay() === 0 ? 7 : ancora.getUTCDay();

  // Segunda da semana 1 → segunda da semana pedida → uma semana atrás.
  ancora.setUTCDate(ancora.getUTCDate() - diaIso + 1 + (semana - 1) * 7 - 7);

  return chaveDaSemana(ancora);
}

/**
 * CONSTÂNCIA — a métrica-herói do projeto.
 *
 * Semanas consecutivas com pelo menos uma atividade, contando da semana de
 * referência para trás. **Nunca dias consecutivos**: sequência diária empurra
 * corredor para lesão e transforma descanso em falha, o que este produto
 * recusa fazer.
 *
 * A semana corrente conta se já tem treino; se ainda não tem, a contagem
 * começa na semana passada — estar na quarta-feira sem treino não zera nada.
 */
export function semanasSemParar(
  atividades: readonly AtividadeParaConstancia[],
  referencia: Date = new Date(),
): number {
  if (atividades.length === 0) return 0;

  const comTreino = new Set(atividades.map((a) => chaveDaSemana(a.inicio)));

  let chave = chaveDaSemana(referencia);
  if (!comTreino.has(chave)) {
    chave = semanaAnterior(chave);
    if (!comTreino.has(chave)) return 0;
  }

  let total = 0;
  while (comTreino.has(chave)) {
    total += 1;
    chave = semanaAnterior(chave);
  }

  return total;
}
