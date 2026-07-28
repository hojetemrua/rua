import type { Split } from "./tipos";

/** Distâncias com recorde próprio, em metros. */
export const DISTANCIAS_DE_RECORDE = [1000, 5000, 10_000, 21_097, 42_195] as const;

export type DistanciaDeRecorde = (typeof DISTANCIAS_DE_RECORDE)[number];

/**
 * Melhor tempo para uma distância, por janela deslizante sobre os splits.
 *
 * Deslizante e não do início: o melhor 5k de alguém raramente são os cinco
 * primeiros quilômetros de um treino — costuma estar no meio, depois de
 * aquecer. Devolve `null` quando a atividade é mais curta que a distância.
 *
 * Trabalha em granularidade de quilômetro porque é o que fica guardado; o
 * recorde de 21,097 km usa 21 splits, com o resto desprezado a favor de quem
 * corre (o tempo real seria um pouco maior).
 */
export function melhorTempoEm(
  splits: readonly Split[],
  distancia_m: DistanciaDeRecorde,
): number | null {
  const kms = Math.floor(distancia_m / 1000);
  if (kms === 0 || splits.length < kms) return null;

  let melhor = Number.POSITIVE_INFINITY;
  for (let i = 0; i + kms <= splits.length; i++) {
    let soma = 0;
    for (let j = i; j < i + kms; j++) soma += splits[j]!.tempo_s;
    if (soma < melhor) melhor = soma;
  }

  return Number.isFinite(melhor) ? melhor : null;
}

export type AtividadeParaRecorde = {
  id: string;
  distancia_m: number;
  duracao_s: number;
  ganho_m?: number;
  splits?: readonly Split[];
};

export type Recordes = {
  porDistancia: Partial<Record<DistanciaDeRecorde, { tempo_s: number; atividade_id: string }>>;
  maiorDistancia?: { distancia_m: number; atividade_id: string };
  maiorDuracao?: { duracao_s: number; atividade_id: string };
  maiorGanho?: { ganho_m: number; atividade_id: string };
};

/**
 * Varre o histórico e devolve os recordes.
 *
 * Nenhuma comparação entre pessoas: recorde aqui é sempre contra a própria
 * história. O produto não expõe ranking individual por pace.
 */
export function calcularRecordes(
  atividades: readonly AtividadeParaRecorde[],
): Recordes {
  const recordes: Recordes = { porDistancia: {} };

  for (const atividade of atividades) {
    if (atividade.splits) {
      for (const distancia of DISTANCIAS_DE_RECORDE) {
        const tempo = melhorTempoEm(atividade.splits, distancia);
        if (tempo === null) continue;
        const atual = recordes.porDistancia[distancia];
        if (!atual || tempo < atual.tempo_s) {
          recordes.porDistancia[distancia] = {
            tempo_s: tempo,
            atividade_id: atividade.id,
          };
        }
      }
    }

    if (
      !recordes.maiorDistancia ||
      atividade.distancia_m > recordes.maiorDistancia.distancia_m
    ) {
      recordes.maiorDistancia = {
        distancia_m: atividade.distancia_m,
        atividade_id: atividade.id,
      };
    }

    if (
      !recordes.maiorDuracao ||
      atividade.duracao_s > recordes.maiorDuracao.duracao_s
    ) {
      recordes.maiorDuracao = {
        duracao_s: atividade.duracao_s,
        atividade_id: atividade.id,
      };
    }

    const ganho = atividade.ganho_m ?? 0;
    if (ganho > 0 && (!recordes.maiorGanho || ganho > recordes.maiorGanho.ganho_m)) {
      recordes.maiorGanho = { ganho_m: ganho, atividade_id: atividade.id };
    }
  }

  return recordes;
}
