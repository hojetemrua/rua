import { describe, expect, it } from "vitest";
import { fatiarEmSplits, paceSKm, velocidadeMedia } from "./pace";
import { distanciaEntre } from "./geo";
import {
  formatarDistancia,
  formatarDuracao,
  formatarPace,
  formatarReais,
  formatarVolume,
} from "./formato";
import type { PontoGps } from "./tipos";

/**
 * Grau de longitude em metros no equador, medido pela própria haversine.
 *
 * Usar a constante decorada (111.320) fazia um percurso "de 2.000 m" medir
 * 1.999,99 m pela função — e a marca do segundo quilômetro nunca era cruzada,
 * derrubando o teste por um centímetro. Calibrar pela função sob teste deixa
 * as distâncias exatas e a asserção honesta.
 */
const METROS_POR_GRAU = distanciaEntre(
  { lat: 0, lng: 0, t: 0 },
  { lat: 0, lng: 1, t: 0 },
);

/**
 * Percurso sintético reto, para leste, com pontos a cada segundo.
 * `velocidade_ms` controla o pace; a latitude fixa mantém a conta previsível.
 */
function percursoReto(
  segundos: number,
  velocidade_ms: number,
  inicio_t = 0,
): PontoGps[] {
  const pontos: PontoGps[] = [];
  for (let s = 0; s <= segundos; s++) {
    pontos.push({
      lat: 0,
      lng: (s * velocidade_ms) / METROS_POR_GRAU,
      t: inicio_t + s * 1000,
    });
  }
  return pontos;
}

describe("paceSKm", () => {
  it("converte distância e tempo em segundos por quilômetro", () => {
    expect(paceSKm(8040, 2496)).toBe(310); // 8,04 km em 41:36 → 5:10/km
    expect(paceSKm(1000, 300)).toBe(300);
  });

  it("devolve 0 para distância nula em vez de infinito", () => {
    expect(paceSKm(0, 600)).toBe(0);
    expect(paceSKm(-5, 600)).toBe(0);
  });
});

describe("velocidadeMedia", () => {
  it("calcula metros por segundo", () => {
    expect(velocidadeMedia(1000, 250)).toBe(4);
  });

  it("não divide por zero", () => {
    expect(velocidadeMedia(1000, 0)).toBe(0);
  });
});

describe("formatação pt-BR", () => {
  it("usa vírgula decimal na distância", () => {
    expect(formatarDistancia(8040)).toBe("8,04 km");
    expect(formatarDistancia(500)).toBe("0,50 km");
  });

  it("formata volume com uma casa", () => {
    expect(formatarVolume(18.4)).toBe("18,4");
  });

  it("formata pace sempre como m:ss/km", () => {
    expect(formatarPace(310)).toBe("5:10/km");
    expect(formatarPace(65)).toBe("1:05/km");
    expect(formatarPace(600)).toBe("10:00/km");
  });

  it("formata duração em mm:ss e passa a h:mm:ss acima de uma hora", () => {
    expect(formatarDuracao(2496)).toBe("41:36");
    expect(formatarDuracao(3760)).toBe("1:02:40");
    expect(formatarDuracao(59)).toBe("0:59");
  });

  it("mostra reais sem centavos quando o valor é redondo", () => {
    expect(formatarReais(115_000)).toBe("1.150");
    expect(formatarReais(64_050)).toBe("640,50");
  });
});

describe("fatiarEmSplits", () => {
  it("devolve um split por quilômetro completo", () => {
    // 3.040 m a 4 m/s: três quilômetros de 250 s e 40 m de sobra.
    // O percurso passa de propósito da marca redonda: percurso que fecha
    // exatamente em 3.000,000 m depende do último centésimo do somatório de
    // ponto flutuante, e rastro de GPS real nunca cai na marca.
    const splits = fatiarEmSplits(percursoReto(760, 4));
    expect(splits).toHaveLength(3);
    expect(splits.map((s) => s.km)).toEqual([1, 2, 3]);
    for (const split of splits) {
      expect(split.tempo_s).toBeGreaterThanOrEqual(249);
      expect(split.tempo_s).toBeLessThanOrEqual(251);
    }
  });

  it("descarta o resto parcial por padrão", () => {
    // 1.400 m: um km completo e 400 m de sobra.
    const splits = fatiarEmSplits(percursoReto(350, 4));
    expect(splits).toHaveLength(1);
  });

  it("inclui o parcial quando pedido", () => {
    const splits = fatiarEmSplits(percursoReto(350, 4), { incluirParcial: true });
    expect(splits).toHaveLength(2);
    expect(splits[1]!.km).toBe(2);
  });

  it("interpola a marca do km quando o trecho entre pontos é longo", () => {
    // Dois pontos só, 2.100 m em 525 s: as marcas de 1 km e 2 km caem no meio
    // do mesmo trecho — um trecho longo pode cruzar mais de uma.
    // Sem interpolação, o primeiro split sairia com os 500 s inteiros.
    const pontos: PontoGps[] = [
      { lat: 0, lng: 2100 / METROS_POR_GRAU, t: 525_000 },
    ];
    pontos.unshift({ lat: 0, lng: 0, t: 0 });
    const splits = fatiarEmSplits(pontos);
    expect(splits).toHaveLength(2);
    expect(splits[0]!.tempo_s).toBeGreaterThanOrEqual(249);
    expect(splits[0]!.tempo_s).toBeLessThanOrEqual(251);
    expect(splits[1]!.tempo_s).toBeGreaterThanOrEqual(249);
    expect(splits[1]!.tempo_s).toBeLessThanOrEqual(251);
  });

  it("soma o ganho de elevação dentro de cada split", () => {
    const pontos = percursoReto(525, 4).map((p, i) => ({
      ...p,
      altitude_m: i * 0.1, // sobe ~52 m ao longo de 2.100 m
    }));
    const splits = fatiarEmSplits(pontos);
    expect(splits).toHaveLength(2);
    expect(splits[0]!.ganho_m).toBeGreaterThan(20);
    expect(splits[0]!.ganho_m).toBeLessThan(30);
  });

  it("não quebra com menos de dois pontos", () => {
    expect(fatiarEmSplits([])).toEqual([]);
    expect(fatiarEmSplits([{ lat: 0, lng: 0, t: 0 }])).toEqual([]);
  });
});
