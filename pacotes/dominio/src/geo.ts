import type { PontoGps } from "./tipos";

const RAIO_DA_TERRA_M = 6_371_000;

/**
 * Distância entre dois pontos pela fórmula de haversine, em metros.
 *
 * Haversine e não Vincenty de propósito: numa corrida os trechos entre pontos
 * têm dezenas de metros, onde a diferença entre as duas é irrelevante, e
 * haversine custa uma fração do processamento — o que importa quando roda a
 * cada segundo, no celular, com a tela apagada.
 */
export function distanciaEntre(a: PontoGps, b: PontoGps): number {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const lat1 = a.lat * rad;
  const lat2 = b.lat * rad;

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * RAIO_DA_TERRA_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Soma o percurso ponto a ponto, em metros. */
export function distanciaTotal(pontos: readonly PontoGps[]): number {
  let total = 0;
  for (let i = 1; i < pontos.length; i++) {
    total += distanciaEntre(pontos[i - 1]!, pontos[i]!);
  }
  return total;
}

/** Velocidade implícita entre dois pontos, em m/s. */
export function velocidadeEntre(a: PontoGps, b: PontoGps): number {
  const dt = (b.t - a.t) / 1000;
  if (dt <= 0) return 0;
  return distanciaEntre(a, b) / dt;
}

/** Ponto interpolado entre dois, com `fracao` de 0 a 1. */
export function interpolar(
  a: PontoGps,
  b: PontoGps,
  fracao: number,
): PontoGps {
  const f = Math.min(1, Math.max(0, fracao));
  return {
    lat: a.lat + (b.lat - a.lat) * f,
    lng: a.lng + (b.lng - a.lng) * f,
    t: Math.round(a.t + (b.t - a.t) * f),
    ...(a.altitude_m !== undefined && b.altitude_m !== undefined
      ? { altitude_m: a.altitude_m + (b.altitude_m - a.altitude_m) * f }
      : {}),
  };
}

/** Ganho de elevação acumulado, ignorando descida e ruído abaixo de 1 m. */
export function ganhoDeElevacao(pontos: readonly PontoGps[]): number {
  let ganho = 0;
  for (let i = 1; i < pontos.length; i++) {
    const antes = pontos[i - 1]!.altitude_m;
    const agora = pontos[i]!.altitude_m;
    if (antes === undefined || agora === undefined) continue;
    const delta = agora - antes;
    if (delta >= 1) ganho += delta;
  }
  return Math.round(ganho);
}
