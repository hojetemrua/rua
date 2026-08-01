/**
 * Tradução do cofre de saúde do sistema para uma atividade da Rua.
 *
 * HealthKit e Health Connect entregam a mesma corrida com nomes diferentes e
 * unidades diferentes. Este módulo é a fronteira: o app nativo converte o que
 * leu para `RegistroDeSaude` e daqui para frente nada mais sabe de qual
 * plataforma veio.
 *
 * O que NÃO está aqui, de propósito: leitura de permissão e chamada nativa.
 * Isso é do app, não do domínio, e não tem como ter teste unitário.
 *
 * Fato que atravessa o desenho: **a Garmin não escreve o traçado GPS no Apple
 * Health.** No iOS, corrida de Garmin chega com distância, duração e frequência
 * cardíaca e sem rota. Não é bug de quem lê — é o que o cofre tem. Por isso
 * `RegistroDeSaude.pontos` é opcional e a tela precisa dizer ao corredor que,
 * para o mapa, o caminho é importar o arquivo.
 */

import type { PontoGps } from "./tipos";

/** De onde o registro veio, para rastrear a origem sem mentir na tela. */
export type PlataformaDeSaude = "healthkit" | "health_connect";

export type RegistroDeSaude = {
  plataforma: PlataformaDeSaude;
  /** Identificador estável do registro no cofre. Vira parte do `id_local`. */
  uuid: string;
  /** Nome do app que gravou: "Garmin Connect", "Apple Watch", "Coros"… */
  origemDoApp?: string;
  inicio: string;
  fim: string;
  distancia_m?: number;
  /** Duração em movimento, quando a plataforma distingue de tempo total. */
  duracaoAtiva_s?: number;
  fc_media?: number;
  fc_max?: number;
  cadencia_media?: number;
  /** Presente no Apple Watch; ausente em corrida vinda da Garmin. */
  pontos?: PontoGps[];
};

/**
 * `id_local` de um registro de saúde.
 *
 * Prefixado pela plataforma para nunca colidir com o id que o próprio app gera
 * ao gravar uma corrida, e estável entre sincronizações — é o que faz o unique
 * (user_id, id_local) do banco recusar o segundo envio do mesmo treino.
 */
export function idLocalDeSaude(registro: RegistroDeSaude): string {
  return `${registro.plataforma}:${registro.uuid}`;
}

/** `id_local` de um arquivo importado. O hash vem do app, que leu o arquivo. */
export function idLocalDeArquivo(hash: string): string {
  return `arquivo:${hash}`;
}

export type AtividadeDeSaude = {
  inicio: string;
  duracao_s: number;
  duracao_movimento_s: number | null;
  distancia_m: number;
  fonte: "saude";
  fc_media: number | null;
  fc_max: number | null;
  cadencia_media: number | null;
  id_local: string;
  /** Pontos crus, ainda NÃO recortados por zona de privacidade. */
  pontos: PontoGps[] | null;
};

/**
 * Converte um registro do cofre nos campos de uma atividade.
 *
 * Devolve os pontos crus de propósito: o recorte por zona de privacidade é
 * responsabilidade de quem persiste, e tem de acontecer depois — a regra
 * inviolável não abre exceção para traçado que veio do relógio. Se este módulo
 * já devolvesse polilinha pronta, o recorte ficaria fácil de esquecer.
 */
export function paraAtividade(registro: RegistroDeSaude): AtividadeDeSaude {
  const inicio = Date.parse(registro.inicio);
  const fim = Date.parse(registro.fim);
  if (!Number.isFinite(inicio) || !Number.isFinite(fim)) {
    throw new Error("Registro de saúde com data inválida.");
  }
  const duracao_s = Math.max(1, Math.round((fim - inicio) / 1000));

  return {
    inicio: new Date(inicio).toISOString(),
    duracao_s,
    duracao_movimento_s:
      registro.duracaoAtiva_s !== undefined
        ? Math.round(registro.duracaoAtiva_s)
        : null,
    distancia_m: registro.distancia_m ?? 0,
    fonte: "saude",
    fc_media: registro.fc_media ?? null,
    fc_max: registro.fc_max ?? null,
    cadencia_media: registro.cadencia_media ?? null,
    id_local: idLocalDeSaude(registro),
    pontos: registro.pontos && registro.pontos.length > 0 ? registro.pontos : null,
  };
}

/**
 * Verdadeiro quando o registro tem números mas não tem traçado.
 *
 * A tela usa isto para explicar, antes de o corredor procurar o mapa e não
 * achar: "esta corrida veio do seu relógio sem o traçado — a Garmin não envia a
 * rota para o cofre de saúde. Para ver o mapa, importe o arquivo."
 */
export function semTracado(registro: RegistroDeSaude): boolean {
  return !registro.pontos || registro.pontos.length === 0;
}

/**
 * Filtra o que não é corrida e o que é curto demais para virar registro.
 *
 * O cofre guarda tudo: caminhada de dez passos, corrida de trinta segundos
 * quando o relógio ligou sem querer. Entrar com isso no histórico polui a
 * constância e o volume.
 */
export const MINIMO_PARA_IMPORTAR = {
  duracao_s: 60,
  distancia_m: 200,
} as const;

export function valeImportar(registro: RegistroDeSaude): boolean {
  const inicio = Date.parse(registro.inicio);
  const fim = Date.parse(registro.fim);
  if (!Number.isFinite(inicio) || !Number.isFinite(fim)) return false;
  const duracao_s = (fim - inicio) / 1000;
  if (duracao_s < MINIMO_PARA_IMPORTAR.duracao_s) return false;
  // Sem distância só entra se tiver duração de verdade — cobre esteira, que não
  // reporta distância em alguns aparelhos.
  return (registro.distancia_m ?? 0) >= MINIMO_PARA_IMPORTAR.distancia_m ||
    duracao_s >= 10 * 60;
}
