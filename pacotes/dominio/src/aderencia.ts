import type {
  PrescritoParaAderencia,
  RealizadoParaAderencia,
} from "./tipos";

/** Tolerâncias do vínculo automático, do §3 da especificação. */
export const TOLERANCIA = {
  /** Treino de segunda feito na terça ainda é aquele treino. */
  dias: 1,
  /** 12 km prescritos, 10 km feitos: conta. 8 km, não. */
  distancia: 0.2,
} as const;

function paraIsoLocal(data: Date | string): string {
  const d = typeof data === "string" ? new Date(data) : data;
  return d.toISOString().slice(0, 10);
}

function diferencaEmDias(a: string, b: string): number {
  const ms = Math.abs(
    new Date(`${a}T12:00:00Z`).getTime() - new Date(`${b}T12:00:00Z`).getTime(),
  );
  return Math.round(ms / 86_400_000);
}

/**
 * Tenta casar uma atividade com um treino prescrito.
 *
 * Regra: mesma data com folga de um dia, e distância dentro de ±20% quando o
 * prescrito define distância. Prescrito sem distância (um "regenerativo" por
 * tempo) casa só pela data.
 *
 * Devolve o índice do prescrito, ou `null` quando o corredor precisa vincular
 * à mão — melhor pedir do que atribuir errado, porque isso mexe na aderência
 * que o assessor vê.
 */
export function vincularAtividade(
  atividade: RealizadoParaAderencia,
  prescritos: readonly PrescritoParaAderencia[],
): number | null {
  const dia = paraIsoLocal(atividade.inicio);

  const candidatos = prescritos
    .map((p, indice) => ({ p, indice, dias: diferencaEmDias(p.data, dia) }))
    .filter(({ p, dias }) => {
      if (dias > TOLERANCIA.dias) return false;
      if (p.distancia_m === undefined) return true;
      const desvio =
        Math.abs(atividade.distancia_m - p.distancia_m) / p.distancia_m;
      return desvio <= TOLERANCIA.distancia;
    })
    .sort((a, b) => a.dias - b.dias);

  return candidatos[0]?.indice ?? null;
}

export type Aderencia = {
  prescritos: number;
  realizados: number;
  /** De 0 a 1. Sem prescrição na semana, aderência é 1: não há o que cobrar. */
  fracao: number;
  /** Arredondado para a exibição: `78`. */
  percentual: number;
};

/**
 * ADERÊNCIA — realizados sobre prescritos, na semana.
 *
 * Nunca passa de 100%: treino extra é bem-vindo e não vira nota acima da
 * média. E semana sem prescrição devolve 100%, não 0 — o assessor que não
 * publicou nada não tem aderência ruim, tem semana sem planilha.
 */
export function aderenciaDaSemana(
  prescritos: readonly PrescritoParaAderencia[],
  realizados: readonly RealizadoParaAderencia[],
): Aderencia {
  if (prescritos.length === 0) {
    return { prescritos: 0, realizados: realizados.length, fracao: 1, percentual: 100 };
  }

  const usados = new Set<number>();
  for (const atividade of realizados) {
    const restantes = prescritos.map((p, i) => (usados.has(i) ? null : p));
    const indice = vincularAtividade(
      atividade,
      restantes.filter((p): p is PrescritoParaAderencia => p !== null),
    );
    if (indice === null) continue;

    // Reindexa: `indice` aponta para a lista filtrada.
    let vistos = -1;
    for (let i = 0; i < prescritos.length; i++) {
      if (usados.has(i)) continue;
      vistos += 1;
      if (vistos === indice) {
        usados.add(i);
        break;
      }
    }
  }

  const fracao = Math.min(1, usados.size / prescritos.length);
  return {
    prescritos: prescritos.length,
    realizados: usados.size,
    fracao,
    percentual: Math.round(fracao * 100),
  };
}
