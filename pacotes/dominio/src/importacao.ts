/**
 * Importação de GPX e TCX.
 *
 * Existe porque é o único caminho de traçado que não depende de aprovação de
 * ninguém: a Garmin não escreve rota no Apple Health, então quem quer o mapa da
 * corrida exporta o arquivo e traz. Funciona no dia 1, sem API, sem parceria.
 *
 * Sem dependência de XML de propósito — `@rua/dominio` não tem dependência
 * nenhuma, e é assim que fica. O leitor abaixo cobre o subconjunto que
 * relógio de corrida gera, e recusa em voz alta o que não entende, em vez de
 * devolver traçado pela metade.
 */

import type { PontoGps } from "./tipos";

export type ArquivoDeAtividade = {
  formato: "gpx" | "tcx";
  /** Nome da atividade, quando o arquivo traz. */
  nome?: string;
  pontos: PontoGps[];
  /** Frequência cardíaca por ponto, quando existe. Mesmo índice de `pontos`. */
  fc?: number[];
  /** Distância que o próprio arquivo declara, em metros. TCX traz; GPX não. */
  distanciaDeclarada_m?: number;
};

export class ErroDeImportacao extends Error {
  constructor(
    message: string,
    readonly motivo:
      | "formato_desconhecido"
      | "sem_pontos"
      | "coordenada_invalida"
      | "sem_tempo",
  ) {
    super(message);
    this.name = "ErroDeImportacao";
  }
}

/**
 * Extrai o conteúdo de texto do primeiro elemento com este nome.
 *
 * Busca ingênua de propósito: aceita `<ele>` e `<ns:ele>`, ignora atributos, e
 * não tenta ser um parser de XML. É o suficiente para arquivo de relógio, que
 * é gerado por máquina e sempre no mesmo formato.
 */
function texto(trecho: string, nome: string): string | undefined {
  const abre = new RegExp(`<(?:\\w+:)?${nome}(?:\\s[^>]*)?>`, "i");
  const m = abre.exec(trecho);
  if (!m) return undefined;
  const inicio = m.index + m[0].length;
  const fecha = new RegExp(`</(?:\\w+:)?${nome}>`, "i");
  const f = fecha.exec(trecho.slice(inicio));
  if (!f) return undefined;
  return trecho.slice(inicio, inicio + f.index).trim();
}

function numero(trecho: string, nome: string): number | undefined {
  const t = texto(trecho, nome);
  if (t === undefined) return undefined;
  const n = Number(t);
  return Number.isFinite(n) ? n : undefined;
}

/** Devolve cada bloco `<nome ...>...</nome>` do documento, em ordem. */
function blocos(xml: string, nome: string): string[] {
  const achados: string[] = [];
  const abre = new RegExp(`<(?:\\w+:)?${nome}(?:\\s[^>]*)?>`, "gi");
  const fechaNome = new RegExp(`</(?:\\w+:)?${nome}>`, "i");
  let m: RegExpExecArray | null;
  while ((m = abre.exec(xml)) !== null) {
    const depois = xml.slice(m.index);
    const f = fechaNome.exec(depois);
    if (!f) break;
    achados.push(depois.slice(0, f.index + f[0].length));
    abre.lastIndex = m.index + f.index;
  }
  return achados;
}

function instante(iso: string | undefined): number | undefined {
  if (!iso) return undefined;
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : undefined;
}

function lerGpx(xml: string): ArquivoDeAtividade {
  const pontos: PontoGps[] = [];
  const fc: number[] = [];
  let temFc = false;

  for (const pt of blocos(xml, "trkpt")) {
    const lat = Number(/\blat\s*=\s*["']([^"']+)["']/i.exec(pt)?.[1]);
    const lng = Number(/\blon\s*=\s*["']([^"']+)["']/i.exec(pt)?.[1]);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      throw new ErroDeImportacao(
        "Um ponto do arquivo está sem latitude ou longitude válida.",
        "coordenada_invalida",
      );
    }
    const t = instante(texto(pt, "time"));
    if (t === undefined) {
      // Sem tempo não há pace, não há split, não há pausa. Melhor recusar do
      // que inventar um relógio.
      throw new ErroDeImportacao(
        "O arquivo tem pontos sem horário. Sem tempo não é possível calcular pace.",
        "sem_tempo",
      );
    }
    const altitude = numero(pt, "ele");
    // `hr` no gpxtpx da Garmin, `heartrate` em alguns exportadores.
    const bpm = numero(pt, "hr") ?? numero(pt, "heartrate");
    if (bpm !== undefined) temFc = true;
    fc.push(bpm ?? 0);

    pontos.push({
      lat,
      lng,
      t,
      ...(altitude !== undefined ? { altitude_m: altitude } : {}),
    });
  }

  if (pontos.length === 0) {
    throw new ErroDeImportacao("Não encontrei nenhum ponto no arquivo.", "sem_pontos");
  }

  return {
    formato: "gpx",
    ...(texto(xml, "name") ? { nome: texto(xml, "name") } : {}),
    pontos,
    ...(temFc ? { fc } : {}),
  };
}

function lerTcx(xml: string): ArquivoDeAtividade {
  const pontos: PontoGps[] = [];
  const fc: number[] = [];
  let temFc = false;

  for (const tp of blocos(xml, "Trackpoint")) {
    const lat = numero(tp, "LatitudeDegrees");
    const lng = numero(tp, "LongitudeDegrees");
    const t = instante(texto(tp, "Time"));
    // TCX de esteira tem Trackpoint sem posição. Não é erro: é ponto sem
    // traçado, e a atividade segue válida pelos números.
    if (lat === undefined || lng === undefined || t === undefined) continue;

    const altitude = numero(tp, "AltitudeMeters");
    const bloco = texto(tp, "HeartRateBpm");
    const bpm = bloco !== undefined ? numero(bloco, "Value") : undefined;
    if (bpm !== undefined) temFc = true;
    fc.push(bpm ?? 0);

    pontos.push({
      lat,
      lng,
      t,
      ...(altitude !== undefined ? { altitude_m: altitude } : {}),
    });
  }

  if (pontos.length === 0) {
    throw new ErroDeImportacao("Não encontrei nenhum ponto no arquivo.", "sem_pontos");
  }

  // TCX declara a distância medida pelo relógio, que é melhor que a soma de
  // haversine: o relógio tem acelerômetro e sabe corrigir GPS ruim.
  const somaDeVoltas = blocos(xml, "Lap")
    .map((lap) => numero(lap, "DistanceMeters") ?? 0)
    .reduce((a, b) => a + b, 0);

  return {
    formato: "tcx",
    ...(texto(xml, "Name") ? { nome: texto(xml, "Name") } : {}),
    pontos,
    ...(temFc ? { fc } : {}),
    ...(somaDeVoltas > 0 ? { distanciaDeclarada_m: somaDeVoltas } : {}),
  };
}

/**
 * Lê um GPX ou TCX e devolve os pontos.
 *
 * O formato é decidido pelo conteúdo, não pela extensão: exportador de relógio
 * troca extensão com frequência, e um `.gpx` que na verdade é TCX travaria a
 * importação por um motivo que o corredor não teria como adivinhar.
 */
export function lerArquivoDeAtividade(conteudo: string): ArquivoDeAtividade {
  const amostra = conteudo.slice(0, 4000);

  // GPX primeiro, e com fronteira no fim do nome da tag. Sem a fronteira, o
  // `<gpxtpx:TrackPointExtension>` que a Garmin põe DENTRO do GPX casava com
  // "Trackpoint" e o arquivo era lido como TCX — que não acha `trkpt` nenhum e
  // devolvia "sem pontos" num GPX perfeitamente válido.
  if (/<(?:\w+:)?gpx[\s>]/i.test(amostra) || /<(?:\w+:)?trkpt[\s>]/i.test(amostra)) {
    return lerGpx(conteudo);
  }
  if (
    /<(?:\w+:)?TrainingCenterDatabase[\s>]/i.test(amostra) ||
    /<(?:\w+:)?Trackpoint[\s>]/i.test(amostra)
  ) {
    return lerTcx(conteudo);
  }
  throw new ErroDeImportacao(
    "Não reconheci o arquivo. A Rua importa GPX e TCX.",
    "formato_desconhecido",
  );
}
