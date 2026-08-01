import { Platform } from "react-native";
import {
  decidirImportacao,
  paraAtividade,
  valeImportar,
  type AtividadeComparavel,
  type RegistroDeSaude,
} from "@rua/dominio";
import { cofreHealthConnect } from "./health-connect";
import { cofreHealthKit } from "./healthkit";
import { inicioDaJanela, type Cofre } from "./porta";

export * from "./porta";

/**
 * O cofre desta plataforma.
 *
 * Nulo no navegador e em qualquer coisa que não seja iOS ou Android — a web do
 * assessor não lê saúde de ninguém.
 */
export const cofre: Cofre | null =
  Platform.OS === "ios"
    ? cofreHealthKit
    : Platform.OS === "android"
      ? cofreHealthConnect
      : null;

export type ResultadoDaSincronia = {
  /** Corridas novas, prontas para virar atividade. */
  novas: RegistroDeSaude[];
  /** Ignoradas por já existirem — o número que a tela mostra como "já tinha". */
  jaExistiam: number;
  /** Descartadas por serem curtas demais para virar registro. */
  curtasDemais: number;
  /**
   * Quantas vieram sem traçado. A tela explica o motivo em vez de deixar o
   * corredor procurar um mapa que não existe.
   */
  semTracado: number;
};

/**
 * Lê o cofre e decide o que entra.
 *
 * Duas peneiras, em ordem: o que é curto demais para ser treino sai primeiro, e
 * depois a deduplicação contra o que já está no histórico. A ordem importa —
 * comparar lixo com o histórico é trabalho jogado fora.
 *
 * O recorte por zona de privacidade NÃO acontece aqui. Ele é do passo que
 * persiste, com as zonas do perfil em mão, e é regra inviolável do projeto:
 * traçado só vai para o banco recortado, inclusive quando veio do relógio.
 */
export async function sincronizarSaude(
  jaNoHistorico: readonly AtividadeComparavel[],
  desde: Date = inicioDaJanela(),
): Promise<ResultadoDaSincronia> {
  if (!cofre) return { novas: [], jaExistiam: 0, curtasDemais: 0, semTracado: 0 };

  const lidas = await cofre.lerCorridas(desde);

  const valem = lidas.filter(valeImportar);
  const curtasDemais = lidas.length - valem.length;

  const comparaveis: (AtividadeComparavel & { registro: RegistroDeSaude })[] =
    valem.map((r) => {
      const a = paraAtividade(r);
      return {
        registro: r,
        inicio: a.inicio,
        duracao_s: a.duracao_s,
        distancia_m: a.distancia_m,
        fonte: a.fonte,
        polilinha: a.pontos ? "tem-pontos" : null,
        fc_media: a.fc_media,
        cadencia_media: a.cadencia_media,
        id_local: a.id_local,
      };
    });

  const decisoes = decidirImportacao(comparaveis, jaNoHistorico);

  const novas = decisoes
    .filter((d) => d.acao === "inserir" || d.acao === "substituir")
    .map((d) => d.atividade.registro);

  return {
    novas,
    jaExistiam: decisoes.filter((d) => d.acao === "ignorar").length,
    curtasDemais,
    semTracado: novas.filter((r) => !r.pontos || r.pontos.length === 0).length,
  };
}
