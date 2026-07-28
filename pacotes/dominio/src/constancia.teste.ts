import { describe, expect, it } from "vitest";
import { chaveDaSemana, semanaAnterior, semanasSemParar } from "./constancia";
import { aderenciaDaSemana, vincularAtividade } from "./aderencia";
import {
  calcularRecordes,
  melhorTempoEm,
} from "./recordes";
import {
  fcMaximaEstimada,
  fracoesPorZona,
  tempoPorZona,
  zona,
  zonaPorFc,
} from "./zonas";
import type { Split } from "./tipos";

describe("chaveDaSemana", () => {
  it("põe segunda e domingo da mesma semana na mesma chave", () => {
    // 2026-07-20 é segunda; 2026-07-26 é domingo.
    expect(chaveDaSemana("2026-07-20T10:00:00-03:00")).toBe(
      chaveDaSemana("2026-07-26T10:00:00-03:00"),
    );
  });

  it("separa domingo da segunda seguinte", () => {
    expect(chaveDaSemana("2026-07-26T10:00:00-03:00")).not.toBe(
      chaveDaSemana("2026-07-27T10:00:00-03:00"),
    );
  });

  it("usa o calendário de São Paulo, não o UTC", () => {
    // 2026-07-27T01:00Z é domingo 26 às 22h em São Paulo: semana anterior.
    expect(chaveDaSemana("2026-07-27T01:00:00Z")).toBe(
      chaveDaSemana("2026-07-22T15:00:00Z"),
    );
  });

  it("volta uma semana corretamente, inclusive virando o ano", () => {
    expect(semanaAnterior("2026-W31")).toBe("2026-W30");
    expect(semanaAnterior("2026-W01")).toMatch(/^2025-W5[23]$/);
  });
});

describe("semanasSemParar", () => {
  const ref = new Date("2026-07-29T12:00:00-03:00"); // quarta, W31

  it("conta semanas consecutivas com pelo menos um treino", () => {
    const atividades = [
      { inicio: "2026-07-28T06:00:00-03:00" }, // W31
      { inicio: "2026-07-22T06:00:00-03:00" }, // W30
      { inicio: "2026-07-15T06:00:00-03:00" }, // W29
    ];
    expect(semanasSemParar(atividades, ref)).toBe(3);
  });

  it("não zera quando a semana corrente ainda não tem treino", () => {
    // Estar na quarta sem ter corrido não apaga o histórico.
    const atividades = [
      { inicio: "2026-07-22T06:00:00-03:00" }, // W30
      { inicio: "2026-07-15T06:00:00-03:00" }, // W29
    ];
    expect(semanasSemParar(atividades, ref)).toBe(2);
  });

  it("para na primeira semana vazia", () => {
    const atividades = [
      { inicio: "2026-07-28T06:00:00-03:00" }, // W31
      // W30 vazia
      { inicio: "2026-07-15T06:00:00-03:00" }, // W29
    ];
    expect(semanasSemParar(atividades, ref)).toBe(1);
  });

  it("conta uma vez a semana com vários treinos", () => {
    const atividades = [
      { inicio: "2026-07-27T06:00:00-03:00" },
      { inicio: "2026-07-28T06:00:00-03:00" },
      { inicio: "2026-07-29T06:00:00-03:00" },
    ];
    expect(semanasSemParar(atividades, ref)).toBe(1);
  });

  it("devolve 0 sem histórico e quando o último treino é antigo", () => {
    expect(semanasSemParar([], ref)).toBe(0);
    expect(
      semanasSemParar([{ inicio: "2026-05-01T06:00:00-03:00" }], ref),
    ).toBe(0);
  });
});

describe("vincularAtividade", () => {
  const prescritos = [
    { data: "2026-07-20", distancia_m: 5000 },
    { data: "2026-07-22", distancia_m: 7000 },
    { data: "2026-07-26", distancia_m: 14_000 },
  ];

  it("casa mesma data e distância dentro de 20%", () => {
    const i = vincularAtividade(
      { inicio: "2026-07-20T06:00:00Z", distancia_m: 5120 },
      prescritos,
    );
    expect(i).toBe(0);
  });

  it("aceita um dia de folga", () => {
    const i = vincularAtividade(
      { inicio: "2026-07-21T06:00:00Z", distancia_m: 5000 },
      prescritos,
    );
    expect(i).toBe(0);
  });

  it("recusa distância fora da tolerância", () => {
    const i = vincularAtividade(
      { inicio: "2026-07-20T06:00:00Z", distancia_m: 2000 },
      prescritos,
    );
    expect(i).toBeNull();
  });

  it("recusa data distante", () => {
    const i = vincularAtividade(
      { inicio: "2026-07-24T06:00:00Z", distancia_m: 5000 },
      prescritos,
    );
    expect(i).toBeNull();
  });

  it("prefere o prescrito do mesmo dia quando há empate de distância", () => {
    const dois = [
      { data: "2026-07-21", distancia_m: 5000 },
      { data: "2026-07-20", distancia_m: 5000 },
    ];
    expect(
      vincularAtividade(
        { inicio: "2026-07-20T06:00:00Z", distancia_m: 5000 },
        dois,
      ),
    ).toBe(1);
  });

  it("casa só pela data quando o prescrito não define distância", () => {
    expect(
      vincularAtividade({ inicio: "2026-07-20T06:00:00Z", distancia_m: 999 }, [
        { data: "2026-07-20" },
      ]),
    ).toBe(0);
  });
});

describe("aderenciaDaSemana", () => {
  const prescritos = [
    { data: "2026-07-20", distancia_m: 5000 },
    { data: "2026-07-22", distancia_m: 7000 },
    { data: "2026-07-23", distancia_m: 6000 },
    { data: "2026-07-25", distancia_m: 6000 },
    { data: "2026-07-26", distancia_m: 14_000 },
  ];

  it("conta 4 de 5 como 80%", () => {
    const realizados = [
      { inicio: "2026-07-20T06:00:00Z", distancia_m: 5120 },
      { inicio: "2026-07-22T06:00:00Z", distancia_m: 7200 },
      { inicio: "2026-07-25T06:00:00Z", distancia_m: 6040 },
      { inicio: "2026-07-26T06:00:00Z", distancia_m: 14_100 },
    ];
    const a = aderenciaDaSemana(prescritos, realizados);
    expect(a.realizados).toBe(4);
    expect(a.percentual).toBe(80);
  });

  it("não passa de 100% com treino extra", () => {
    const realizados = prescritos.map((p) => ({
      inicio: `${p.data}T06:00:00Z`,
      distancia_m: p.distancia_m!,
    }));
    realizados.push({ inicio: "2026-07-24T06:00:00Z", distancia_m: 5000 });
    expect(aderenciaDaSemana(prescritos, realizados).percentual).toBe(100);
  });

  it("não deixa uma atividade contar por dois prescritos", () => {
    const dois = [
      { data: "2026-07-20", distancia_m: 5000 },
      { data: "2026-07-21", distancia_m: 5000 },
    ];
    const a = aderenciaDaSemana(dois, [
      { inicio: "2026-07-20T06:00:00Z", distancia_m: 5000 },
    ]);
    expect(a.realizados).toBe(1);
    expect(a.percentual).toBe(50);
  });

  it("semana sem prescrição é 100%, não 0", () => {
    // O assessor que não publicou nada não tem aderência ruim.
    expect(aderenciaDaSemana([], []).percentual).toBe(100);
  });

  it("semana prescrita e nada feito é 0%", () => {
    expect(aderenciaDaSemana(prescritos, []).percentual).toBe(0);
  });
});

describe("zonas", () => {
  it("mapeia batimento para zona por percentual da máxima", () => {
    const max = 190;
    expect(zonaPorFc(100, max)).toBe(1); // 53%
    expect(zonaPorFc(122, max)).toBe(2); // 64%
    expect(zonaPorFc(142, max)).toBe(3); // 75%
    expect(zonaPorFc(160, max)).toBe(4); // 84%
    expect(zonaPorFc(180, max)).toBe(5); // 95%
  });

  it("toda zona tem rótulo textual junto da cor", () => {
    for (const n of [1, 2, 3, 4, 5] as const) {
      expect(zona(n).rotulo.length).toBeGreaterThan(0);
      expect(zona(n).sigla).toBe(`Z${n}`);
    }
    expect(zona(3).rotulo).toBe("FIRME");
  });

  it("não divide por zero sem FC máxima", () => {
    expect(zonaPorFc(150, 0)).toBe(1);
  });

  it("estima FC máxima por Tanaka", () => {
    expect(fcMaximaEstimada(30)).toBe(187);
    expect(fcMaximaEstimada(50)).toBe(173);
  });

  it("soma tempo por zona e devolve frações que fecham em 1", () => {
    const tempo = tempoPorZona(
      [
        { fc: 100, segundos: 120 },
        { fc: 142, segundos: 600 },
        { fc: 160, segundos: 180 },
      ],
      190,
    );
    expect(tempo.z1).toBe(120);
    expect(tempo.z3).toBe(600);
    expect(tempo.z4).toBe(180);

    const fracoes = fracoesPorZona(tempo);
    const soma = fracoes.reduce((s, f) => s + f.fracao, 0);
    expect(soma).toBeCloseTo(1, 6);
    expect(fracoes.every((f) => f.fracao > 0)).toBe(true);
  });

  it("devolve lista vazia sem amostra nenhuma", () => {
    expect(fracoesPorZona({ z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 })).toEqual([]);
  });
});

describe("recordes", () => {
  const splits: Split[] = [
    { km: 1, tempo_s: 320 },
    { km: 2, tempo_s: 300 },
    { km: 3, tempo_s: 290 },
    { km: 4, tempo_s: 295 },
    { km: 5, tempo_s: 310 },
    { km: 6, tempo_s: 330 },
  ];

  it("acha o melhor 1k em qualquer posição, não no começo", () => {
    expect(melhorTempoEm(splits, 1000)).toBe(290);
  });

  it("acha o melhor 5k por janela deslizante", () => {
    // Melhor janela: km 2 a 6 = 300+290+295+310 = ... conferindo 1-5 e 2-6.
    const umAoCinco = 320 + 300 + 290 + 295 + 310;
    const doisAoSeis = 300 + 290 + 295 + 310 + 330;
    expect(melhorTempoEm(splits, 5000)).toBe(Math.min(umAoCinco, doisAoSeis));
  });

  it("devolve null quando a atividade é curta demais", () => {
    expect(melhorTempoEm(splits, 10_000)).toBeNull();
    expect(melhorTempoEm([], 1000)).toBeNull();
  });

  it("junta recordes de várias atividades", () => {
    const r = calcularRecordes([
      { id: "a", distancia_m: 6000, duracao_s: 1845, ganho_m: 40, splits },
      {
        id: "b",
        distancia_m: 12_000,
        duracao_s: 3600,
        ganho_m: 120,
        splits: splits.map((s) => ({ ...s, tempo_s: s.tempo_s - 10 })),
      },
    ]);
    expect(r.porDistancia[1000]?.atividade_id).toBe("b");
    expect(r.maiorDistancia?.atividade_id).toBe("b");
    expect(r.maiorDuracao?.atividade_id).toBe("b");
    expect(r.maiorGanho?.ganho_m).toBe(120);
  });

  it("não inventa recorde sem histórico", () => {
    const r = calcularRecordes([]);
    expect(r.porDistancia).toEqual({});
    expect(r.maiorDistancia).toBeUndefined();
  });
});
