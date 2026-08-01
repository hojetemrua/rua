import type { RegistroDeSaude } from "@rua/dominio";

/**
 * A porta do cofre de saúde.
 *
 * Uma interface, duas implementações: HealthKit no iOS, Health Connect no
 * Android. O resto do app não sabe em qual plataforma está — e é por isso que
 * "conectar com Garmin, Apple Watch, Polar, Coros e Suunto" é UM trabalho e não
 * cinco: quem fala com o relógio é o sistema operacional, não a Rua.
 *
 * O que a Rua pede, e só: exercício, distância, frequência cardíaca, calorias e
 * rota. Pedir categoria que o app não usa é o que mais aumenta o rigor da
 * revisão nas duas lojas.
 */
export type EstadoDoCofre =
  | "indisponivel"
  | "precisa_instalar"
  | "sem_permissao"
  | "pronto";

export type Cofre = {
  /** Nome para a tela: "Saúde do iPhone" ou "Health Connect". */
  readonly nome: string;

  /** O cofre existe neste aparelho? */
  disponivel(): Promise<EstadoDoCofre>;

  /**
   * Pede permissão de leitura.
   *
   * Devolve falso quando a pessoa recusa — e recusar é resposta legítima. O app
   * segue funcionando por GPS e por importação de arquivo, sem insistir.
   */
  pedirPermissao(): Promise<boolean>;

  /** Corridas registradas a partir de `desde`. */
  lerCorridas(desde: Date): Promise<RegistroDeSaude[]>;

  /**
   * Abre a tela de permissões do sistema.
   *
   * Necessário porque as duas plataformas só mostram o diálogo uma vez: depois
   * de recusar, o único caminho é o ajuste do sistema. Sem este botão a pessoa
   * fica presa achando que o app está quebrado.
   */
  abrirAjustes(): Promise<void>;
};

/**
 * Janela padrão da primeira sincronização.
 *
 * Noventa dias cobrem um ciclo de treino inteiro sem trazer o histórico de anos
 * de uma vez — que no Android exigiria a permissão de histórico e, nas duas
 * plataformas, deixaria a primeira abertura lenta. O resto entra por importação
 * de arquivo, quando a pessoa quiser.
 */
export const DIAS_DA_PRIMEIRA_SINCRONIA = 90;

export function inicioDaJanela(dias = DIAS_DA_PRIMEIRA_SINCRONIA): Date {
  return new Date(Date.now() - dias * 24 * 60 * 60 * 1000);
}
