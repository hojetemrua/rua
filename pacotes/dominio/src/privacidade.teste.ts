import { describe, expect, it } from "vitest";
import {
  recortarZonasDePrivacidade,
  tracadoTodoProtegido,
} from "./privacidade";
import { codificarPolilinha, decodificarPolilinha, simplificar } from "./polilinha";
import type { PontoGps, ZonaDePrivacidade } from "./tipos";

const GRAUS_POR_METRO = 1 / 111_320;

function ponto(metros: number, segundo = metros): PontoGps {
  return { lat: 0, lng: metros * GRAUS_POR_METRO, t: segundo * 1000 };
}

/** Zona de 200 m centrada em `metros` ao longo do eixo do percurso. */
function zona(metros: number, raio_m = 200): ZonaDePrivacidade {
  return { lat: 0, lng: metros * GRAUS_POR_METRO, raio_m };
}

describe("recortarZonasDePrivacidade", () => {
  const percurso = Array.from({ length: 21 }, (_, i) => ponto(i * 100));

  it("remove a partida dentro da zona", () => {
    const recortado = recortarZonasDePrivacidade(percurso, [zona(0)]);
    // Os pontos em 0 m e 100 m e 200 m caem no raio de 200 m.
    expect(recortado[0]!.lng).toBeGreaterThan(percurso[0]!.lng);
    expect(recortado.length).toBeLessThan(percurso.length);
  });

  it("remove a chegada dentro da zona", () => {
    const recortado = recortarZonasDePrivacidade(percurso, [zona(2000)]);
    expect(recortado.at(-1)!.lng).toBeLessThan(percurso.at(-1)!.lng);
  });

  it("preserva o miolo mesmo passando pela zona", () => {
    // Passar correndo pela rua de casa no meio do treino não revela onde mora,
    // e apagar o meio partiria o traçado em dois.
    const recortado = recortarZonasDePrivacidade(percurso, [zona(1000)]);
    expect(recortado).toHaveLength(percurso.length);
  });

  it("devolve vazio quando o percurso inteiro está protegido", () => {
    const curto = [ponto(0), ponto(50), ponto(100)];
    expect(recortarZonasDePrivacidade(curto, [zona(50, 500)])).toEqual([]);
    expect(tracadoTodoProtegido(curto, [zona(50, 500)])).toBe(true);
  });

  it("não mexe no traçado sem zona cadastrada", () => {
    expect(recortarZonasDePrivacidade(percurso, [])).toHaveLength(
      percurso.length,
    );
    expect(tracadoTodoProtegido(percurso, [])).toBe(false);
  });

  it("recorta as duas pontas de uma vez", () => {
    const recortado = recortarZonasDePrivacidade(percurso, [
      zona(0),
      zona(2000),
    ]);
    expect(recortado.length).toBeLessThan(percurso.length - 2);
    expect(recortado.length).toBeGreaterThan(0);
  });
});

describe("polilinha", () => {
  it("codifica e decodifica de volta ao mesmo lugar", () => {
    const original = [
      { lat: -23.5401, lng: -46.6702 },
      { lat: -23.5372, lng: -46.6688 },
      { lat: -23.5366, lng: -46.6631 },
    ];
    const volta = decodificarPolilinha(codificarPolilinha(original));
    expect(volta).toHaveLength(3);
    volta.forEach((p, i) => {
      expect(p.lat).toBeCloseTo(original[i]!.lat, 5);
      expect(p.lng).toBeCloseTo(original[i]!.lng, 5);
    });
  });

  it("comprime bem um percurso longo", () => {
    const pontos = Array.from({ length: 500 }, (_, i) => ({
      lat: -23.54 + i * 0.0001,
      lng: -46.67 + i * 0.0001,
    }));
    const codificada = codificarPolilinha(pontos);
    // Um JSON com os mesmos pontos passa de 20 KB.
    expect(codificada.length).toBeLessThan(JSON.stringify(pontos).length / 4);
  });

  it("aceita percurso vazio", () => {
    expect(codificarPolilinha([])).toBe("");
    expect(decodificarPolilinha("")).toEqual([]);
  });

  it("simplifica descartando pontos redundantes de uma reta", () => {
    const reta = Array.from({ length: 50 }, (_, i) => ({
      lat: 0,
      lng: i * 0.0001,
    }));
    expect(simplificar(reta).length).toBeLessThan(5);
  });

  it("preserva as curvas ao simplificar", () => {
    const zigue = Array.from({ length: 40 }, (_, i) => ({
      lat: i % 2 === 0 ? 0 : 0.001,
      lng: i * 0.0005,
    }));
    expect(simplificar(zigue).length).toBeGreaterThan(10);
  });
});
