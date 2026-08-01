import { describe, expect, it } from "vitest";
import { ErroDeImportacao, lerArquivoDeAtividade } from "./importacao";

const GPX_GARMIN = `<?xml version="1.0" encoding="UTF-8"?>
<gpx creator="Garmin Connect" version="1.1"
     xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1"
     xmlns="http://www.topografix.com/GPX/1/1">
  <metadata><time>2026-08-03T09:00:00.000Z</time></metadata>
  <trk>
    <name>Corrida matinal</name>
    <trkseg>
      <trkpt lat="-23.550000" lon="-46.630000">
        <ele>760.0</ele>
        <time>2026-08-03T09:00:00.000Z</time>
        <extensions><gpxtpx:TrackPointExtension><gpxtpx:hr>142</gpxtpx:hr></gpxtpx:TrackPointExtension></extensions>
      </trkpt>
      <trkpt lat="-23.551000" lon="-46.630000">
        <ele>762.5</ele>
        <time>2026-08-03T09:00:30.000Z</time>
        <extensions><gpxtpx:TrackPointExtension><gpxtpx:hr>150</gpxtpx:hr></gpxtpx:TrackPointExtension></extensions>
      </trkpt>
      <trkpt lat="-23.552000" lon="-46.630000">
        <ele>761.0</ele>
        <time>2026-08-03T09:01:00.000Z</time>
      </trkpt>
    </trkseg>
  </trk>
</gpx>`;

const TCX_GARMIN = `<?xml version="1.0" encoding="UTF-8"?>
<TrainingCenterDatabase xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2">
  <Activities>
    <Activity Sport="Running">
      <Id>2026-08-03T09:00:00.000Z</Id>
      <Lap StartTime="2026-08-03T09:00:00.000Z">
        <TotalTimeSeconds>300.0</TotalTimeSeconds>
        <DistanceMeters>1000.0</DistanceMeters>
        <Track>
          <Trackpoint>
            <Time>2026-08-03T09:00:00.000Z</Time>
            <Position>
              <LatitudeDegrees>-23.5500000</LatitudeDegrees>
              <LongitudeDegrees>-46.6300000</LongitudeDegrees>
            </Position>
            <AltitudeMeters>760.0</AltitudeMeters>
            <HeartRateBpm><Value>142</Value></HeartRateBpm>
          </Trackpoint>
          <Trackpoint>
            <Time>2026-08-03T09:02:30.000Z</Time>
            <Position>
              <LatitudeDegrees>-23.5550000</LatitudeDegrees>
              <LongitudeDegrees>-46.6300000</LongitudeDegrees>
            </Position>
            <AltitudeMeters>765.0</AltitudeMeters>
            <HeartRateBpm><Value>158</Value></HeartRateBpm>
          </Trackpoint>
        </Track>
      </Lap>
      <Lap StartTime="2026-08-03T09:05:00.000Z">
        <TotalTimeSeconds>300.0</TotalTimeSeconds>
        <DistanceMeters>1050.0</DistanceMeters>
        <Track>
          <Trackpoint>
            <Time>2026-08-03T09:05:00.000Z</Time>
            <Position>
              <LatitudeDegrees>-23.5600000</LatitudeDegrees>
              <LongitudeDegrees>-46.6300000</LongitudeDegrees>
            </Position>
          </Trackpoint>
        </Track>
      </Lap>
    </Activity>
  </Activities>
</TrainingCenterDatabase>`;

describe("lerArquivoDeAtividade · GPX", () => {
  it("lê pontos, altitude e nome", () => {
    const a = lerArquivoDeAtividade(GPX_GARMIN);
    expect(a.formato).toBe("gpx");
    expect(a.nome).toBe("Corrida matinal");
    expect(a.pontos).toHaveLength(3);
    expect(a.pontos[0]!.lat).toBeCloseTo(-23.55, 6);
    expect(a.pontos[0]!.lng).toBeCloseTo(-46.63, 6);
    expect(a.pontos[0]!.altitude_m).toBe(760);
  });

  it("lê o horário de cada ponto em ordem", () => {
    const a = lerArquivoDeAtividade(GPX_GARMIN);
    expect(a.pontos[1]!.t - a.pontos[0]!.t).toBe(30_000);
    expect(a.pontos[2]!.t - a.pontos[1]!.t).toBe(30_000);
  });

  it("lê a frequência cardíaca da extensão da Garmin", () => {
    const a = lerArquivoDeAtividade(GPX_GARMIN);
    expect(a.fc).toEqual([142, 150, 0]);
  });

  it("GPX não declara distância — ela é calculada dos pontos", () => {
    const a = lerArquivoDeAtividade(GPX_GARMIN);
    expect(a.distanciaDeclarada_m).toBeUndefined();
  });
});

describe("lerArquivoDeAtividade · TCX", () => {
  it("lê pontos e frequência cardíaca", () => {
    const a = lerArquivoDeAtividade(TCX_GARMIN);
    expect(a.formato).toBe("tcx");
    expect(a.pontos).toHaveLength(3);
    expect(a.fc).toEqual([142, 158, 0]);
  });

  it("soma a distância declarada de todas as voltas", () => {
    // O relógio corrige GPS ruim com acelerômetro: a distância dele é melhor
    // que a soma de haversine dos pontos.
    const a = lerArquivoDeAtividade(TCX_GARMIN);
    expect(a.distanciaDeclarada_m).toBe(2050);
  });

  it("ignora Trackpoint sem posição em vez de falhar", () => {
    // É o caso de esteira: tem tempo e batimento, não tem coordenada.
    const comEsteira = TCX_GARMIN.replace(
      `            <Position>
              <LatitudeDegrees>-23.5600000</LatitudeDegrees>
              <LongitudeDegrees>-46.6300000</LongitudeDegrees>
            </Position>
`,
      "",
    );
    const a = lerArquivoDeAtividade(comEsteira);
    expect(a.pontos).toHaveLength(2);
  });
});

describe("lerArquivoDeAtividade · recusas", () => {
  it("decide o formato pelo conteúdo, não pela extensão", () => {
    // Exportador de relógio troca extensão com frequência. Um TCX salvo como
    // .gpx tem de funcionar: o corredor não tem como adivinhar o motivo.
    const a = lerArquivoDeAtividade(TCX_GARMIN);
    expect(a.formato).toBe("tcx");
  });

  it("recusa arquivo que não é GPX nem TCX", () => {
    expect(() => lerArquivoDeAtividade("<html><body>oi</body></html>")).toThrow(
      ErroDeImportacao,
    );
    try {
      lerArquivoDeAtividade("qualquer coisa");
    } catch (e) {
      expect((e as ErroDeImportacao).motivo).toBe("formato_desconhecido");
    }
  });

  it("recusa GPX sem nenhum ponto", () => {
    const vazio = `<?xml version="1.0"?><gpx xmlns="http://www.topografix.com/GPX/1/1"><trk><trkseg></trkseg></trk></gpx>`;
    try {
      lerArquivoDeAtividade(vazio);
      throw new Error("devia ter recusado");
    } catch (e) {
      expect((e as ErroDeImportacao).motivo).toBe("sem_pontos");
    }
  });

  it("recusa ponto sem horário em vez de inventar um relógio", () => {
    const semTempo = `<?xml version="1.0"?><gpx xmlns="http://www.topografix.com/GPX/1/1"><trk><trkseg>
      <trkpt lat="-23.55" lon="-46.63"><ele>760</ele></trkpt>
    </trkseg></trk></gpx>`;
    try {
      lerArquivoDeAtividade(semTempo);
      throw new Error("devia ter recusado");
    } catch (e) {
      expect((e as ErroDeImportacao).motivo).toBe("sem_tempo");
    }
  });

  it("recusa coordenada inválida", () => {
    const ruim = `<?xml version="1.0"?><gpx xmlns="http://www.topografix.com/GPX/1/1"><trk><trkseg>
      <trkpt lat="" lon="-46.63"><time>2026-08-03T09:00:00Z</time></trkpt>
    </trkseg></trk></gpx>`;
    try {
      lerArquivoDeAtividade(ruim);
      throw new Error("devia ter recusado");
    } catch (e) {
      expect((e as ErroDeImportacao).motivo).toBe("coordenada_invalida");
    }
  });
});
