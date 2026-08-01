import { Linking } from "react-native";
import {
  isHealthDataAvailableAsync,
  queryWorkoutSamples,
  requestAuthorization,
} from "@kingstinct/react-native-healthkit";
import type { PontoGps, RegistroDeSaude } from "@rua/dominio";
import { inicioDaJanela, type Cofre, type EstadoDoCofre } from "./porta";

/**
 * Cofre do iOS: HealthKit.
 *
 * O que entra aqui, entra do relógio: Apple Watch grava direto, e Garmin, Polar,
 * Coros e Suunto escrevem pelos apps deles.
 *
 * **A Garmin não escreve o traçado.** Corrida de Garmin chega com distância,
 * duração e frequência cardíaca e sem rota — é limitação do app da Garmin, não
 * de leitura. Por isso `pontos` volta indefinido nesses casos, e a tela usa
 * `semTracado()` para dizer isso ao corredor em vez de mostrar mapa vazio.
 */

const PARA_LER = [
  "HKWorkoutTypeIdentifier",
  "HKQuantityTypeIdentifierDistanceWalkingRunning",
  "HKQuantityTypeIdentifierHeartRate",
  "HKQuantityTypeIdentifierActiveEnergyBurned",
  "HKSeriesTypeIdentifierWorkoutRoute",
] as const;

const PARA_ESCREVER = [
  "HKWorkoutTypeIdentifier",
  "HKQuantityTypeIdentifierDistanceWalkingRunning",
] as const;

/** Só corrida e trail. Caminhada e bicicleta ficam de fora do histórico. */
const TIPOS_DE_CORRIDA = new Set(["running", "trailRunning"]);

function metros(q: { unit: string; quantity: number } | undefined): number | undefined {
  if (!q) return undefined;
  if (q.unit === "m") return q.quantity;
  if (q.unit === "km") return q.quantity * 1000;
  if (q.unit === "mi") return q.quantity * 1609.344;
  return q.quantity;
}

export const cofreHealthKit: Cofre = {
  nome: "Saúde do iPhone",

  async disponivel(): Promise<EstadoDoCofre> {
    const tem = await isHealthDataAvailableAsync();
    return tem ? "pronto" : "indisponivel";
  },

  async pedirPermissao() {
    // O iOS mostra o diálogo uma única vez. Se a pessoa recusar, o retorno
    // continua sendo `true` (o pedido foi apresentado) e a consulta volta vazia
    // — o HealthKit não conta quem negou, de propósito, para o app não poder
    // insistir. Então quem decide se "funcionou" é a leitura, não isto.
    try {
      return await requestAuthorization({
        toRead: [...PARA_LER],
        toShare: [...PARA_ESCREVER],
      } as Parameters<typeof requestAuthorization>[0]);
    } catch {
      return false;
    }
  },

  async lerCorridas(desde = inicioDaJanela()): Promise<RegistroDeSaude[]> {
    const treinos = await queryWorkoutSamples({
      limit: 0, // 0 = tudo dentro do filtro
      filter: { date: { startDate: desde } },
      ascending: false,
    });

    const registros: RegistroDeSaude[] = [];

    for (const t of treinos) {
      if (!TIPOS_DE_CORRIDA.has(String(t.workoutActivityType))) continue;

      // A rota é uma consulta separada, por treino. Pode falhar sem a permissão
      // de série — e nesse caso a corrida ainda vale pelos números.
      let pontos: PontoGps[] | undefined;
      try {
        const rotas = await t.getWorkoutRoutes();
        const locais = rotas.flatMap((r) => [...r.locations]);
        if (locais.length > 0) {
          pontos = locais
            .map((l) => ({
              lat: l.latitude,
              lng: l.longitude,
              t: l.date.getTime(),
              precisao_m: l.horizontalAccuracy,
              altitude_m: l.altitude,
            }))
            .sort((a, b) => a.t - b.t);
        }
      } catch {
        pontos = undefined;
      }

      registros.push({
        plataforma: "healthkit",
        uuid: t.uuid,
        inicio: t.startDate.toISOString(),
        fim: t.endDate.toISOString(),
        ...(metros(t.totalDistance) !== undefined
          ? { distancia_m: metros(t.totalDistance) }
          : {}),
        ...(t.duration ? { duracaoAtiva_s: Math.round(t.duration.quantity) } : {}),
        ...(pontos ? { pontos } : {}),
      });
    }

    return registros;
  },

  async abrirAjustes() {
    // `x-apple-health://` abre o app Saúde; o ajuste por app vive dentro dele.
    // Se falhar, cai nos Ajustes da Rua, que é onde a Apple documenta o caminho.
    try {
      await Linking.openURL("x-apple-health://");
    } catch {
      await Linking.openSettings();
    }
  },
};
