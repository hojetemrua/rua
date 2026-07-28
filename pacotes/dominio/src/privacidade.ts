import { distanciaEntre } from "./geo";
import type { PontoGps, ZonaDePrivacidade } from "./tipos";

function dentroDeAlgumaZona(
  ponto: PontoGps,
  zonas: readonly ZonaDePrivacidade[],
): boolean {
  return zonas.some(
    (z) =>
      distanciaEntre(ponto, { lat: z.lat, lng: z.lng, t: ponto.t }) <= z.raio_m,
  );
}

/**
 * Recorta o traçado antes de PERSISTIR.
 *
 * Remove os pontos que caem dentro de uma zona de privacidade nas duas
 * pontas do percurso — é ali que mora a casa de alguém. O miolo é preservado
 * mesmo que atravesse uma zona: quem passa correndo pela rua de casa no meio
 * do treino não revela onde mora, e apagar o meio partiria o traçado em dois.
 *
 * Nunca recortar apenas na renderização: o dado sensível não pode existir no
 * banco esperando um bug de permissão. A distância total do esforço permanece
 * intacta — ela é calculada antes, sobre o percurso completo.
 */
export function recortarZonasDePrivacidade(
  pontos: readonly PontoGps[],
  zonas: readonly ZonaDePrivacidade[],
): PontoGps[] {
  if (zonas.length === 0 || pontos.length === 0) return [...pontos];

  let inicio = 0;
  while (inicio < pontos.length && dentroDeAlgumaZona(pontos[inicio]!, zonas)) {
    inicio += 1;
  }

  let fim = pontos.length - 1;
  while (fim >= inicio && dentroDeAlgumaZona(pontos[fim]!, zonas)) {
    fim -= 1;
  }

  return inicio > fim ? [] : pontos.slice(inicio, fim + 1);
}

/**
 * Verdadeiro se o percurso inteiro cai dentro de zona de privacidade.
 * Nesse caso não se guarda polilinha nenhuma — só os números do esforço.
 */
export function tracadoTodoProtegido(
  pontos: readonly PontoGps[],
  zonas: readonly ZonaDePrivacidade[],
): boolean {
  return (
    pontos.length > 0 &&
    recortarZonasDePrivacidade(pontos, zonas).length === 0
  );
}
