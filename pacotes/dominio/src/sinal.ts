import { distanciaEntre, velocidadeEntre } from "./geo";
import type { PontoGps } from "./tipos";

/** Limites do filtro de sinal, do §3 da especificação. */
export const LIMITES = {
  /** Acima disto o ponto é ruído urbano, não posição. */
  precisaoMaxima_m: 25,
  /** Ninguém corre a 8 m/s por engano: acima disto é salto de GPS. */
  velocidadeMaxima_ms: 8,
  /** Abaixo disto a pessoa parou. */
  velocidadeDeParada_ms: 0.5,
  /** Tempo parado antes de pausar sozinho. */
  esperaDaPausa_s: 20,
} as const;

/**
 * Descarta pontos que o GPS não deveria ter emitido.
 *
 * Duas regras, em ordem: precisão pior que 25 m sai na hora; salto que implica
 * mais de 8 m/s sai comparando com o último ponto ACEITO, não com o anterior
 * cru — senão um salto isolado contamina o ponto seguinte, que é bom, e a
 * corrida perde um trecho legítimo.
 */
export function filtrarPontos(pontos: readonly PontoGps[]): PontoGps[] {
  const aceitos: PontoGps[] = [];

  for (const ponto of pontos) {
    if (
      ponto.precisao_m !== undefined &&
      ponto.precisao_m > LIMITES.precisaoMaxima_m
    ) {
      continue;
    }

    const ultimo = aceitos.at(-1);
    if (ultimo && velocidadeEntre(ultimo, ponto) > LIMITES.velocidadeMaxima_ms) {
      continue;
    }

    aceitos.push(ponto);
  }

  return aceitos;
}

export type TrechoParado = { inicio_t: number; fim_t: number };

/**
 * Encontra os trechos em que a pessoa ficou abaixo de 0,5 m/s por 20 s ou mais.
 *
 * Serve para a pausa automática e para `duracao_movimento_s`. O tempo total da
 * atividade continua contando o relógio de parede — quem esperou no semáforo
 * esperou de verdade.
 */
export function detectarPausas(pontos: readonly PontoGps[]): TrechoParado[] {
  const pausas: TrechoParado[] = [];
  let inicioParado: number | null = null;

  for (let i = 1; i < pontos.length; i++) {
    const anterior = pontos[i - 1]!;
    const atual = pontos[i]!;
    const parado = velocidadeEntre(anterior, atual) < LIMITES.velocidadeDeParada_ms;

    if (parado) {
      inicioParado ??= anterior.t;
      continue;
    }

    if (inicioParado !== null) {
      const duracao = (anterior.t - inicioParado) / 1000;
      if (duracao >= LIMITES.esperaDaPausa_s) {
        pausas.push({ inicio_t: inicioParado, fim_t: anterior.t });
      }
      inicioParado = null;
    }
  }

  if (inicioParado !== null) {
    const fim = pontos.at(-1)!.t;
    if ((fim - inicioParado) / 1000 >= LIMITES.esperaDaPausa_s) {
      pausas.push({ inicio_t: inicioParado, fim_t: fim });
    }
  }

  return pausas;
}

/** Duração em movimento: tempo total menos as pausas detectadas. */
export function duracaoEmMovimento(pontos: readonly PontoGps[]): number {
  if (pontos.length < 2) return 0;
  const total = (pontos.at(-1)!.t - pontos[0]!.t) / 1000;
  const parado = detectarPausas(pontos).reduce(
    (soma, p) => soma + (p.fim_t - p.inicio_t) / 1000,
    0,
  );
  return Math.max(0, Math.round(total - parado));
}

/** Distância total considerando só os pontos que passaram no filtro. */
export function distanciaFiltrada(pontos: readonly PontoGps[]): number {
  const bons = filtrarPontos(pontos);
  let total = 0;
  for (let i = 1; i < bons.length; i++) {
    total += distanciaEntre(bons[i - 1]!, bons[i]!);
  }
  return total;
}
