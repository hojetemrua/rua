import { describe, expect, it } from "vitest";
import {
  detectarPausas,
  distanciaFiltrada,
  duracaoEmMovimento,
  filtrarPontos,
  LIMITES,
} from "./sinal";
import { distanciaEntre, ganhoDeElevacao } from "./geo";
import type { PontoGps } from "./tipos";

const GRAUS_POR_METRO = 1 / 111_320;

function ponto(
  segundo: number,
  metros: number,
  extra: Partial<PontoGps> = {},
): PontoGps {
  return { lat: 0, lng: metros * GRAUS_POR_METRO, t: segundo * 1000, ...extra };
}

describe("distanciaEntre", () => {
  it("mede metros com precisão suficiente para corrida", () => {
    const d = distanciaEntre(ponto(0, 0), ponto(1, 100));
    expect(d).toBeGreaterThan(99);
    expect(d).toBeLessThan(101);
  });

  it("devolve zero para o mesmo ponto", () => {
    expect(distanciaEntre(ponto(0, 0), ponto(0, 0))).toBe(0);
  });
});

describe("filtrarPontos", () => {
  it("descarta ponto com precisão pior que o limite", () => {
    const pontos = [
      ponto(0, 0, { precisao_m: 5 }),
      ponto(1, 4, { precisao_m: LIMITES.precisaoMaxima_m + 1 }),
      ponto(2, 8, { precisao_m: 6 }),
    ];
    expect(filtrarPontos(pontos)).toHaveLength(2);
  });

  it("mantém ponto exatamente no limite de precisão", () => {
    const pontos = [
      ponto(0, 0, { precisao_m: LIMITES.precisaoMaxima_m }),
      ponto(1, 4, { precisao_m: LIMITES.precisaoMaxima_m }),
    ];
    expect(filtrarPontos(pontos)).toHaveLength(2);
  });

  it("descarta salto acima de 8 m/s", () => {
    // 500 m em um segundo: teletransporte de GPS urbano.
    const pontos = [ponto(0, 0), ponto(1, 500), ponto(2, 8)];
    const bons = filtrarPontos(pontos);
    expect(bons).toHaveLength(2);
    expect(bons[1]!.t).toBe(2000);
  });

  it("compara com o último ponto ACEITO, não com o anterior cru", () => {
    // Se comparasse com o cru, o ponto bom em t=2 seria descartado por estar
    // "longe" do salto — e a corrida perderia um trecho legítimo.
    const pontos = [ponto(0, 0), ponto(1, 900), ponto(2, 8), ponto(3, 12)];
    const bons = filtrarPontos(pontos);
    expect(bons.map((p) => p.t)).toEqual([0, 2000, 3000]);
  });

  it("aceita corrida rápida de verdade", () => {
    // 7 m/s ≈ 2:23/km. Rápido, e não é salto.
    const pontos = [ponto(0, 0), ponto(1, 7), ponto(2, 14)];
    expect(filtrarPontos(pontos)).toHaveLength(3);
  });
});

describe("detectarPausas", () => {
  it("acha trecho parado acima da espera", () => {
    const pontos = [
      ...Array.from({ length: 11 }, (_, s) => ponto(s, s * 4)),
      // 25 s praticamente no lugar
      ...Array.from({ length: 26 }, (_, s) => ponto(11 + s, 40 + s * 0.1)),
      ...Array.from({ length: 10 }, (_, s) => ponto(37 + s, 43 + s * 4)),
    ];
    const pausas = detectarPausas(pontos);
    expect(pausas).toHaveLength(1);
    expect((pausas[0]!.fim_t - pausas[0]!.inicio_t) / 1000).toBeGreaterThanOrEqual(
      LIMITES.esperaDaPausa_s,
    );
  });

  it("ignora parada curta, de semáforo rápido", () => {
    const pontos = [
      ...Array.from({ length: 6 }, (_, s) => ponto(s, s * 4)),
      ...Array.from({ length: 6 }, (_, s) => ponto(6 + s, 20 + s * 0.1)),
      ...Array.from({ length: 6 }, (_, s) => ponto(12 + s, 21 + s * 4)),
    ];
    expect(detectarPausas(pontos)).toHaveLength(0);
  });

  it("fecha a pausa que dura até o fim da corrida", () => {
    const pontos = [
      ...Array.from({ length: 6 }, (_, s) => ponto(s, s * 4)),
      ...Array.from({ length: 30 }, (_, s) => ponto(6 + s, 20 + s * 0.1)),
    ];
    expect(detectarPausas(pontos)).toHaveLength(1);
  });
});

describe("duracaoEmMovimento", () => {
  it("desconta as pausas do tempo total", () => {
    const pontos = [
      ...Array.from({ length: 11 }, (_, s) => ponto(s, s * 4)),
      ...Array.from({ length: 26 }, (_, s) => ponto(11 + s, 40 + s * 0.1)),
      ...Array.from({ length: 10 }, (_, s) => ponto(37 + s, 43 + s * 4)),
    ];
    const total = (pontos.at(-1)!.t - pontos[0]!.t) / 1000;
    expect(duracaoEmMovimento(pontos)).toBeLessThan(total);
  });

  it("devolve 0 sem pontos suficientes", () => {
    expect(duracaoEmMovimento([])).toBe(0);
    expect(duracaoEmMovimento([ponto(0, 0)])).toBe(0);
  });
});

describe("distanciaFiltrada", () => {
  it("não conta o salto descartado", () => {
    const pontos = [ponto(0, 0), ponto(1, 900), ponto(2, 8)];
    expect(distanciaFiltrada(pontos)).toBeLessThan(20);
  });
});

describe("ganhoDeElevacao", () => {
  it("soma só a subida e ignora ruído abaixo de um metro", () => {
    const pontos = [
      ponto(0, 0, { altitude_m: 700 }),
      ponto(1, 4, { altitude_m: 700.4 }), // ruído
      ponto(2, 8, { altitude_m: 710 }), // +9,6
      ponto(3, 12, { altitude_m: 705 }), // descida, não conta
      ponto(4, 16, { altitude_m: 715 }), // +10
    ];
    expect(ganhoDeElevacao(pontos)).toBe(20);
  });

  it("devolve 0 quando não há altitude", () => {
    expect(ganhoDeElevacao([ponto(0, 0), ponto(1, 4)])).toBe(0);
  });
});
