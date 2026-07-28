import type { PontoGps } from "./tipos";

/**
 * Polilinha codificada, formato do Google (precisão 5).
 *
 * Trinta linhas em vez de uma dependência, como manda a regra do projeto. Guardar
 * o traçado como uma string comprimida na coluna `polilinha` é o que dispensa
 * uma tabela por trackpoint — decisão de custo do §7 da especificação.
 */

const PRECISAO = 1e5;

function codificarNumero(valor: number, saida: string[]): void {
  let v = valor < 0 ? ~(valor << 1) : valor << 1;
  while (v >= 0x20) {
    saida.push(String.fromCharCode((0x20 | (v & 0x1f)) + 63));
    v >>= 5;
  }
  saida.push(String.fromCharCode(v + 63));
}

export function codificarPolilinha(
  pontos: readonly Pick<PontoGps, "lat" | "lng">[],
): string {
  const saida: string[] = [];
  let latAnterior = 0;
  let lngAnterior = 0;

  for (const { lat, lng } of pontos) {
    const latArredondada = Math.round(lat * PRECISAO);
    const lngArredondada = Math.round(lng * PRECISAO);
    codificarNumero(latArredondada - latAnterior, saida);
    codificarNumero(lngArredondada - lngAnterior, saida);
    latAnterior = latArredondada;
    lngAnterior = lngArredondada;
  }

  return saida.join("");
}

export function decodificarPolilinha(
  texto: string,
): Array<{ lat: number; lng: number }> {
  const pontos: Array<{ lat: number; lng: number }> = [];
  let i = 0;
  let lat = 0;
  let lng = 0;

  while (i < texto.length) {
    let resultado = 0;
    let deslocamento = 0;
    let byte: number;

    do {
      byte = texto.charCodeAt(i++) - 63;
      resultado |= (byte & 0x1f) << deslocamento;
      deslocamento += 5;
    } while (byte >= 0x20);
    lat += resultado & 1 ? ~(resultado >> 1) : resultado >> 1;

    resultado = 0;
    deslocamento = 0;
    do {
      byte = texto.charCodeAt(i++) - 63;
      resultado |= (byte & 0x1f) << deslocamento;
      deslocamento += 5;
    } while (byte >= 0x20);
    lng += resultado & 1 ? ~(resultado >> 1) : resultado >> 1;

    pontos.push({ lat: lat / PRECISAO, lng: lng / PRECISAO });
  }

  return pontos;
}

/**
 * Reduz a quantidade de pontos por Ramer–Douglas–Peucker.
 *
 * Uma corrida de uma hora rende milhares de pontos; a miniatura na lista
 * mostra bem com algumas dezenas. Menos pontos é menos bytes no banco e menos
 * SVG para o celular desenhar.
 */
export function simplificar(
  pontos: ReadonlyArray<{ lat: number; lng: number }>,
  tolerancia = 0.00005,
): Array<{ lat: number; lng: number }> {
  if (pontos.length <= 2) return [...pontos];

  const primeiro = pontos[0]!;
  const ultimo = pontos.at(-1)!;

  let maiorDistancia = 0;
  let indice = 0;

  for (let i = 1; i < pontos.length - 1; i++) {
    const d = distanciaAtePerpendicular(pontos[i]!, primeiro, ultimo);
    if (d > maiorDistancia) {
      maiorDistancia = d;
      indice = i;
    }
  }

  if (maiorDistancia <= tolerancia) return [primeiro, ultimo];

  const esquerda = simplificar(pontos.slice(0, indice + 1), tolerancia);
  const direita = simplificar(pontos.slice(indice), tolerancia);
  return [...esquerda.slice(0, -1), ...direita];
}

function distanciaAtePerpendicular(
  ponto: { lat: number; lng: number },
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const dx = b.lng - a.lng;
  const dy = b.lat - a.lat;

  if (dx === 0 && dy === 0) {
    return Math.hypot(ponto.lng - a.lng, ponto.lat - a.lat);
  }

  const numerador = Math.abs(
    dy * (ponto.lng - a.lng) - dx * (ponto.lat - a.lat),
  );
  return numerador / Math.hypot(dx, dy);
}
