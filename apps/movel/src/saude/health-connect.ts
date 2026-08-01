import {
  getSdkStatus,
  initialize,
  openHealthConnectSettings,
  readRecords,
  requestExerciseRoute,
  requestPermission,
  SdkAvailabilityStatus,
} from "react-native-health-connect";
import type { Length, Location } from "react-native-health-connect/lib/typescript/types/base.types";
import type { PontoGps, RegistroDeSaude } from "@rua/dominio";
import { inicioDaJanela, type Cofre, type EstadoDoCofre } from "./porta";

/**
 * Cofre do Android: Health Connect.
 *
 * O Google Fit saiu de cena; este é o caminho único. A Garmin entrou no Health
 * Connect em 2025, e aqui — diferente do iOS — existe `ExerciseRoute`, com
 * permissão própria e separada da permissão de sessão.
 *
 * **Se a Garmin de fato escreve a rota, ninguém documentou.** É teste em
 * aparelho real com relógio real, e está marcado como a primeira tarefa em
 * `docs/relogios.md`. O código já pede a rota; se ela não vier, a corrida entra
 * pelos números, igual ao iOS.
 */

/**
 * Estados da rota, como o Health Connect os define.
 *
 * Declarados aqui porque a biblioteca tem o enum em runtime mas **não o
 * reexporta da raiz** — `types/index.d.ts` não inclui `base.types`. Importar o
 * caminho interno funcionaria hoje e quebraria na primeira reorganização do
 * pacote; os três valores, por outro lado, são API do Android e não mudam.
 */
const ROTA = { COM_DADOS: 0, SEM_DADOS: 1, PRECISA_CONSENTIR: 2 } as const;

/** Corrida e trail no vocabulário de `exerciseType` do Health Connect. */
const TIPO_CORRIDA = 56;
const TIPO_TRAIL = 57;

const PERMISSOES = [
  { accessType: "read", recordType: "ExerciseSession" },
  { accessType: "read", recordType: "Distance" },
  { accessType: "read", recordType: "HeartRate" },
  { accessType: "read", recordType: "TotalCaloriesBurned" },
  { accessType: "write", recordType: "ExerciseSession" },
  { accessType: "write", recordType: "Distance" },
] as const;

/**
 * Ler além de 30 dias exige esta permissão.
 *
 * Sem ela o Health Connect entrega apenas os 30 dias anteriores à concessão —
 * e quem chega com dois anos de corrida acha que a Rua perdeu o histórico dele.
 */
const HISTORICO = { accessType: "read", recordType: "HealthDataHistory" } as const;

/**
 * `Length` do Health Connect é `{ value, unit }`, não metros.
 *
 * Tratar o valor como metro sem olhar a unidade daria uma corrida de 5
 * quilômetros com 5 metros de altitude — ou 8000 metros de erro de precisão. A
 * unidade vem no dado; usar ela é obrigatório.
 */
function emMetros(c: Length | undefined): number | undefined {
  if (!c) return undefined;
  switch (c.unit) {
    case "meters":
      return c.value;
    case "kilometers":
      return c.value * 1000;
    case "miles":
      return c.value * 1609.344;
    case "feet":
      return c.value * 0.3048;
    case "inches":
      return c.value * 0.0254;
    default:
      return c.value;
  }
}

function paraPontos(locais: readonly Location[]): PontoGps[] {
  return locais
    .map((l) => {
      const precisao = emMetros(l.horizontalAccuracy);
      const altitude = emMetros(l.altitude);
      return {
        lat: l.latitude,
        lng: l.longitude,
        t: Date.parse(l.time),
        ...(precisao !== undefined ? { precisao_m: precisao } : {}),
        ...(altitude !== undefined ? { altitude_m: altitude } : {}),
      };
    })
    .filter((p) => Number.isFinite(p.t))
    .sort((a, b) => a.t - b.t);
}

export const cofreHealthConnect: Cofre = {
  nome: "Health Connect",

  async disponivel(): Promise<EstadoDoCofre> {
    const status = await getSdkStatus();
    if (status === SdkAvailabilityStatus.SDK_AVAILABLE) {
      const ok = await initialize();
      return ok ? "pronto" : "indisponivel";
    }
    if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED) {
      return "precisa_instalar";
    }
    return "indisponivel";
  },

  async pedirPermissao() {
    await initialize();
    const concedidas = await requestPermission([
      ...PERMISSOES,
      HISTORICO,
    ] as Parameters<typeof requestPermission>[0]);

    // A rota tem consentimento próprio, pedido por registro na hora da leitura.
    // Aqui só interessa saber se a sessão de exercício foi liberada: sem ela não
    // há nada para ler, e insistir na rota seria pedir permissão para nada.
    return concedidas.some(
      (p) => "recordType" in p && p.recordType === "ExerciseSession",
    );
  },

  async lerCorridas(desde = inicioDaJanela()): Promise<RegistroDeSaude[]> {
    await initialize();

    const { records } = await readRecords("ExerciseSession", {
      timeRangeFilter: {
        operator: "between",
        startTime: desde.toISOString(),
        endTime: new Date().toISOString(),
      },
      ascendingOrder: false,
    });

    const registros: RegistroDeSaude[] = [];

    for (const s of records) {
      if (s.exerciseType !== TIPO_CORRIDA && s.exerciseType !== TIPO_TRAIL) continue;

      // Sem id não há como deduplicar nem como pedir a rota. Registro assim é
      // inútil para a Rua, e inventar um id faria a mesma corrida entrar de novo
      // na próxima sincronização.
      const id = s.metadata?.id;
      if (!id) continue;

      // A rota tem três estados, e os três importam: já vem com os pontos, não
      // existe, ou existe e precisa de consentimento próprio. Só o terceiro
      // justifica abrir diálogo — pedir nos outros dois seria interromper a
      // pessoa para nada.
      let pontos: PontoGps[] | undefined;
      const rotaNoRegistro = s.exerciseRoute;
      try {
        if (rotaNoRegistro && rotaNoRegistro.type === ROTA.COM_DADOS) {
          pontos = paraPontos(rotaNoRegistro.route ?? []);
        } else if (rotaNoRegistro && rotaNoRegistro.type === ROTA.PRECISA_CONSENTIR) {
          const rota = await requestExerciseRoute(id);
          pontos = paraPontos(rota?.route ?? []);
        }
      } catch {
        // Recusar o consentimento é resposta legítima: a corrida segue valendo
        // pelos números, exatamente como a que vem da Garmin no iOS.
        pontos = undefined;
      }

      registros.push({
        plataforma: "health_connect",
        uuid: id,
        ...(s.metadata?.dataOrigin ? { origemDoApp: s.metadata.dataOrigin } : {}),
        inicio: s.startTime,
        fim: s.endTime,
        ...(pontos && pontos.length > 0 ? { pontos } : {}),
      });
    }

    return registros;
  },

  async abrirAjustes() {
    openHealthConnectSettings();
  },
};
