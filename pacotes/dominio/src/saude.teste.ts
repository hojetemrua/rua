import { describe, expect, it } from "vitest";
import {
  idLocalDeArquivo,
  idLocalDeSaude,
  paraAtividade,
  semTracado,
  valeImportar,
  type RegistroDeSaude,
} from "./saude";

/** Corrida de Apple Watch: vem com traçado. */
const doAppleWatch: RegistroDeSaude = {
  plataforma: "healthkit",
  uuid: "11111111-2222-3333-4444-555555555555",
  origemDoApp: "Apple Watch",
  inicio: "2026-08-03T09:00:00.000Z",
  fim: "2026-08-03T09:30:00.000Z",
  distancia_m: 5020,
  duracaoAtiva_s: 1780,
  fc_media: 154,
  fc_max: 178,
  cadencia_media: 168,
  pontos: [
    { lat: -23.55, lng: -46.63, t: 1_785_920_000_000 },
    { lat: -23.551, lng: -46.63, t: 1_785_920_030_000 },
  ],
};

/** Corrida de Garmin no iOS: números sim, rota não. */
const daGarmin: RegistroDeSaude = {
  plataforma: "healthkit",
  uuid: "aaaa-bbbb",
  origemDoApp: "Garmin Connect",
  inicio: "2026-08-03T09:00:00.000Z",
  fim: "2026-08-03T09:30:10.000Z",
  distancia_m: 5050,
  fc_media: 152,
};

describe("idLocal", () => {
  it("prefixa pela plataforma para nunca colidir com id do dispositivo", () => {
    expect(idLocalDeSaude(doAppleWatch)).toBe(
      "healthkit:11111111-2222-3333-4444-555555555555",
    );
    expect(idLocalDeSaude({ ...daGarmin, plataforma: "health_connect" })).toBe(
      "health_connect:aaaa-bbbb",
    );
    expect(idLocalDeArquivo("deadbeef")).toBe("arquivo:deadbeef");
  });

  it("é estável: o mesmo registro dá sempre o mesmo id", () => {
    expect(idLocalDeSaude(doAppleWatch)).toBe(idLocalDeSaude({ ...doAppleWatch }));
  });
});

describe("paraAtividade", () => {
  it("calcula a duração do intervalo, não confia em campo solto", () => {
    expect(paraAtividade(doAppleWatch).duracao_s).toBe(1800);
    expect(paraAtividade(daGarmin).duracao_s).toBe(1810);
  });

  it("preserva duração em movimento quando a plataforma distingue", () => {
    expect(paraAtividade(doAppleWatch).duracao_movimento_s).toBe(1780);
    expect(paraAtividade(daGarmin).duracao_movimento_s).toBeNull();
  });

  it("marca a fonte como saúde", () => {
    expect(paraAtividade(doAppleWatch).fonte).toBe("saude");
  });

  it("devolve os pontos CRUS, sem recorte de privacidade", () => {
    // Proposital: quem persiste é que recorta. Devolver polilinha pronta aqui
    // deixaria o recorte fácil de esquecer, e a regra não abre exceção.
    const a = paraAtividade(doAppleWatch);
    expect(a.pontos).toHaveLength(2);
    expect(a).not.toHaveProperty("polilinha");
  });

  it("devolve pontos nulos quando o relógio não mandou rota", () => {
    expect(paraAtividade(daGarmin).pontos).toBeNull();
  });

  it("distância ausente vira zero, não indefinida", () => {
    const semDistancia = { ...daGarmin, distancia_m: undefined };
    expect(paraAtividade(semDistancia).distancia_m).toBe(0);
  });

  it("recusa data inválida", () => {
    expect(() => paraAtividade({ ...daGarmin, inicio: "ontem" })).toThrow();
  });

  it("duração nunca é zero, mesmo com início igual ao fim", () => {
    const instantaneo = { ...daGarmin, fim: daGarmin.inicio };
    expect(paraAtividade(instantaneo).duracao_s).toBe(1);
  });
});

describe("semTracado", () => {
  it("é o que a tela usa para explicar o mapa que falta", () => {
    expect(semTracado(daGarmin)).toBe(true);
    expect(semTracado(doAppleWatch)).toBe(false);
    expect(semTracado({ ...doAppleWatch, pontos: [] })).toBe(true);
  });
});

describe("valeImportar", () => {
  it("aceita corrida de verdade", () => {
    expect(valeImportar(doAppleWatch)).toBe(true);
    expect(valeImportar(daGarmin)).toBe(true);
  });

  it("recusa registro curto demais — relógio ligado sem querer", () => {
    const trintaSegundos = {
      ...daGarmin,
      fim: "2026-08-03T09:00:30.000Z",
      distancia_m: 80,
    };
    expect(valeImportar(trintaSegundos)).toBe(false);
  });

  it("recusa distância curta demais em treino curto", () => {
    const cemMetros = {
      ...daGarmin,
      fim: "2026-08-03T09:03:00.000Z",
      distancia_m: 100,
    };
    expect(valeImportar(cemMetros)).toBe(false);
  });

  it("aceita esteira sem distância quando a duração é real", () => {
    // Alguns aparelhos não reportam distância em esteira. Vinte minutos de
    // treino não podem ser descartados por causa disso.
    const esteira = {
      ...daGarmin,
      fim: "2026-08-03T09:20:00.000Z",
      distancia_m: 0,
    };
    expect(valeImportar(esteira)).toBe(true);
  });

  it("recusa data inválida", () => {
    expect(valeImportar({ ...daGarmin, fim: "nunca" })).toBe(false);
  });
});
