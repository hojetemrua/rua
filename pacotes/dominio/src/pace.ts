import { distanciaEntre, interpolar } from "./geo";
import type { PontoGps, Split } from "./tipos";

/**
 * Pace em segundos por quilômetro.
 * Devolve 0 para distância nula, em vez de Infinity — número que a interface
 * possa formatar sem verificar.
 */
export function paceSKm(distancia_m: number, duracao_s: number): number {
  if (distancia_m <= 0) return 0;
  return Math.round(duracao_s / (distancia_m / 1000));
}

/** Velocidade média em m/s. */
export function velocidadeMedia(distancia_m: number, duracao_s: number): number {
  if (duracao_s <= 0) return 0;
  return distancia_m / duracao_s;
}

/**
 * Fatia o percurso em splits de 1 km.
 *
 * Interpola o ponto que cruza a marca do quilômetro em vez de arredondar para
 * o ponto mais próximo: sem isso, um trecho longo entre duas leituras de GPS
 * joga o split inteiro para o km seguinte e o pace sai errado justamente onde
 * o sinal estava pior.
 *
 * O último split parcial só entra se `incluirParcial` for verdadeiro — na
 * tela de Atividade o resto de 300 m não é um "km".
 */
export function fatiarEmSplits(
  pontos: readonly PontoGps[],
  { incluirParcial = false }: { incluirParcial?: boolean } = {},
): Split[] {
  if (pontos.length < 2) return [];

  const splits: Split[] = [];
  let acumulado = 0;
  let inicioDoKm = pontos[0]!.t;
  let kmAtual = 1;
  let ganhoDoKm = 0;

  for (let i = 1; i < pontos.length; i++) {
    const anterior = pontos[i - 1]!;
    const atual = pontos[i]!;
    const trecho = distanciaEntre(anterior, atual);
    if (trecho === 0) continue;

    const subida =
      anterior.altitude_m !== undefined && atual.altitude_m !== undefined
        ? Math.max(0, atual.altitude_m - anterior.altitude_m)
        : 0;

    let restanteDoTrecho = trecho;
    let base = anterior;

    // Um trecho longo pode cruzar mais de uma marca de quilômetro.
    while (acumulado + restanteDoTrecho >= kmAtual * 1000) {
      const faltando = kmAtual * 1000 - acumulado;
      const fracao = faltando / restanteDoTrecho;
      const cruzamento = interpolar(base, atual, fracao);

      splits.push({
        km: kmAtual,
        tempo_s: Math.round((cruzamento.t - inicioDoKm) / 1000),
        ganho_m: Math.round(ganhoDoKm + subida * fracao),
      });

      acumulado = kmAtual * 1000;
      inicioDoKm = cruzamento.t;
      kmAtual += 1;
      ganhoDoKm = 0;
      restanteDoTrecho -= faltando;
      base = cruzamento;
    }

    acumulado += restanteDoTrecho;
    ganhoDoKm += subida * (restanteDoTrecho / trecho);
  }

  if (incluirParcial && acumulado > (kmAtual - 1) * 1000) {
    const fim = pontos.at(-1)!;
    splits.push({
      km: kmAtual,
      tempo_s: Math.round((fim.t - inicioDoKm) / 1000),
      ganho_m: Math.round(ganhoDoKm),
    });
  }

  return splits;
}
