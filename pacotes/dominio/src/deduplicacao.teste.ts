import { describe, expect, it } from "vitest";
import {
  decidirImportacao,
  escolherMelhor,
  mesmaCorrida,
  sobreposicao,
  type AtividadeComparavel,
} from "./deduplicacao";

/** Corrida gravada pela Rua: 09:00, 30 min, 5,02 km, com traçado. */
const daRua: AtividadeComparavel = {
  inicio: "2026-08-03T09:00:00Z",
  duracao_s: 1800,
  distancia_m: 5020,
  fonte: "gps",
  polilinha: "abc",
  fc_media: null,
  id_local: "dispositivo:1",
};

/** A MESMA corrida vista pelo relógio: começou 40 s depois, 5,05 km, sem rota. */
const doRelogio: AtividadeComparavel = {
  inicio: "2026-08-03T09:00:40Z",
  duracao_s: 1810,
  distancia_m: 5050,
  fonte: "saude",
  polilinha: null,
  fc_media: 154,
  id_local: "healthkit:uuid-1",
};

describe("sobreposicao", () => {
  it("é 1 quando uma cobre a outra inteira", () => {
    expect(sobreposicao(daRua, daRua)).toBeCloseTo(1, 6);
  });

  it("é 0 quando não há tempo em comum", () => {
    const tarde = { ...daRua, inicio: "2026-08-03T18:00:00Z" };
    expect(sobreposicao(daRua, tarde)).toBe(0);
  });

  it("mede sobre a atividade mais curta, não sobre a soma", () => {
    // 10 min dentro de uma de 30: a curta está 100% contida.
    const curta = { ...daRua, duracao_s: 600, distancia_m: 1700 };
    expect(sobreposicao(daRua, curta)).toBeCloseTo(1, 6);
  });
});

describe("mesmaCorrida", () => {
  it("reconhece a mesma corrida vinda de duas fontes", () => {
    expect(mesmaCorrida(daRua, doRelogio)).toBe(true);
  });

  it("não confunde dois treinos do mesmo dia", () => {
    const aTarde = { ...doRelogio, inicio: "2026-08-03T18:00:00Z" };
    expect(mesmaCorrida(daRua, aTarde)).toBe(false);
  });

  it("não confunde corrida com força feita na mesma hora", () => {
    // Sobrepõem no tempo, mas uma tem 5 km e a outra não tem distância.
    const forca: AtividadeComparavel = {
      inicio: "2026-08-03T09:05:00Z",
      duracao_s: 1500,
      distancia_m: 0,
      fonte: "saude",
    };
    expect(mesmaCorrida(daRua, forca)).toBe(false);
  });

  it("junta duas atividades sem distância que se sobrepõem", () => {
    const a: AtividadeComparavel = {
      inicio: "2026-08-03T09:00:00Z",
      duracao_s: 1800,
      distancia_m: 0,
      fonte: "gps",
    };
    const b: AtividadeComparavel = {
      inicio: "2026-08-03T09:00:30Z",
      duracao_s: 1790,
      distancia_m: 50,
      fonte: "saude",
    };
    expect(mesmaCorrida(a, b)).toBe(true);
  });

  it("aceita 15% de diferença de distância e recusa mais que isso", () => {
    const dentro = { ...doRelogio, distancia_m: 5020 * 1.14 };
    const fora = { ...doRelogio, distancia_m: 5020 * 1.25 };
    expect(mesmaCorrida(daRua, dentro)).toBe(true);
    expect(mesmaCorrida(daRua, fora)).toBe(false);
  });

  it("exige sobreposição mínima: encostar não basta", () => {
    // Termina 09:30, a outra começa 09:29 — só 1 min em comum de 30.
    const encostando = { ...doRelogio, inicio: "2026-08-03T09:29:00Z" };
    expect(mesmaCorrida(daRua, encostando)).toBe(false);
  });
});

describe("escolherMelhor", () => {
  it("traçado ganha de frequência cardíaca", () => {
    // A do relógio tem FC e a da Rua não; mesmo assim a da Rua fica, porque o
    // traçado é o que a tela mostra.
    expect(escolherMelhor(daRua, doRelogio)).toBe(daRua);
    expect(escolherMelhor(doRelogio, daRua)).toBe(daRua);
  });

  it("sem traçado dos dois lados, ganha quem tem mais dado", () => {
    const seca = { ...daRua, polilinha: null };
    expect(escolherMelhor(seca, doRelogio)).toBe(doRelogio);
  });

  it("empatando em dado, ganha a fonte mais confiável", () => {
    const gps = { ...daRua, polilinha: null, fc_media: 150 };
    const saude = { ...doRelogio, fc_media: 150 };
    expect(escolherMelhor(gps, saude)).toBe(gps);
  });
});

describe("decidirImportacao", () => {
  it("insere o que não existe", () => {
    const d = decidirImportacao([doRelogio], []);
    expect(d[0]!.acao).toBe("inserir");
  });

  it("ignora o registro de saúde quando a Rua já gravou com traçado", () => {
    const d = decidirImportacao([doRelogio], [daRua]);
    expect(d[0]!.acao).toBe("ignorar");
  });

  it("substitui quando a candidata é melhor que a existente", () => {
    const existenteSeca = { ...doRelogio };
    const d = decidirImportacao([daRua], [existenteSeca]);
    expect(d[0]!.acao).toBe("substituir");
  });

  it("id_local repetido é ignorado sem comparar números", () => {
    const d = decidirImportacao([doRelogio], [{ ...doRelogio, distancia_m: 99999 }]);
    expect(d[0]!.acao).toBe("ignorar");
  });

  it("deduplica dentro do próprio lote", () => {
    // Exportar o histórico inteiro do relógio traz a mesma corrida repetida.
    const copia = { ...doRelogio, id_local: "healthkit:uuid-2" };
    const d = decidirImportacao([doRelogio, copia], []);
    expect(d.map((x) => x.acao)).toEqual(["inserir", "ignorar"]);
  });

  it("um lote de corridas distintas entra inteiro", () => {
    const dias = [1, 2, 3].map((n) => ({
      ...doRelogio,
      inicio: `2026-08-0${n}T09:00:00Z`,
      id_local: `healthkit:dia-${n}`,
    }));
    const d = decidirImportacao(dias, []);
    expect(d.every((x) => x.acao === "inserir")).toBe(true);
  });
});
