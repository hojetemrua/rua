/**
 * Deduplicação de atividade.
 *
 * O problema, em uma frase: se o corredor gravar na Rua e o relógio também
 * escrever no cofre de saúde, a mesma corrida entra duas vezes — e aí a
 * constância em semanas, a aderência ao plano e o volume contam errado. Não é
 * cosmético: é número errado na tela do assessor.
 *
 * Há duas camadas, e as duas são necessárias:
 *
 *   1. `id_local`, com unique (user_id, id_local) no banco. Resolve reimportar
 *      o MESMO registro: o segundo envio é conflito, não linha nova.
 *   2. Isto aqui. Resolve o caso em que a mesma corrida chega por duas FONTES,
 *      com ids diferentes e números levemente diferentes — porque o GPS do
 *      celular e o do relógio nunca medem igual.
 */

export const TOLERANCIA_DUPLICATA = {
  /** Sobreposição mínima de tempo, em fração da atividade mais curta. */
  sobreposicao: 0.5,
  /** Diferença relativa máxima de distância. 15% cobre GPS de celular vs relógio. */
  distancia: 0.15,
  /** Abaixo disto, a atividade é tratada como sem distância (esteira, força). */
  distanciaIrrelevante_m: 100,
} as const;

export type AtividadeComparavel = {
  inicio: Date | string;
  duracao_s: number;
  distancia_m: number;
  fonte: "gps" | "manual" | "importacao" | "saude";
  /** Presença de traçado é o critério de desempate mais forte. */
  polilinha?: string | null;
  fc_media?: number | null;
  cadencia_media?: number | null;
  id_local?: string;
};

function ms(inicio: Date | string): number {
  return inicio instanceof Date ? inicio.getTime() : Date.parse(inicio);
}

/** Fração da atividade mais curta que as duas dividem no tempo. */
export function sobreposicao(
  a: AtividadeComparavel,
  b: AtividadeComparavel,
): number {
  const ia = ms(a.inicio);
  const ib = ms(b.inicio);
  const fa = ia + a.duracao_s * 1000;
  const fb = ib + b.duracao_s * 1000;

  const comum = Math.min(fa, fb) - Math.max(ia, ib);
  if (comum <= 0) return 0;

  const menor = Math.min(a.duracao_s, b.duracao_s) * 1000;
  return menor === 0 ? 0 : comum / menor;
}

/**
 * Verdadeiro quando as duas são, com toda probabilidade, a mesma corrida.
 *
 * Duas perguntas, as duas obrigatórias: aconteceram ao mesmo tempo, e mediram
 * quase a mesma coisa? Só tempo não basta — quem faz força e corre na mesma
 * hora tem duas atividades legítimas sobrepostas. Só distância não basta — dois
 * cinco-quilômetros no mesmo dia são dois treinos.
 */
export function mesmaCorrida(
  a: AtividadeComparavel,
  b: AtividadeComparavel,
): boolean {
  if (sobreposicao(a, b) < TOLERANCIA_DUPLICATA.sobreposicao) return false;

  const semDistancia =
    a.distancia_m < TOLERANCIA_DUPLICATA.distanciaIrrelevante_m &&
    b.distancia_m < TOLERANCIA_DUPLICATA.distanciaIrrelevante_m;
  if (semDistancia) return true;

  const maior = Math.max(a.distancia_m, b.distancia_m);
  if (maior === 0) return true;
  const diferenca = Math.abs(a.distancia_m - b.distancia_m) / maior;
  return diferenca <= TOLERANCIA_DUPLICATA.distancia;
}

/** Quanto de informação a atividade carrega. Serve só para desempate. */
function riqueza(x: AtividadeComparavel): number {
  let n = 0;
  if (x.polilinha) n += 4; // traçado vale mais que tudo: é o que a tela mostra
  if (x.fc_media) n += 1;
  if (x.cadencia_media) n += 1;
  return n;
}

/** Prioridade da fonte quando a riqueza empata. */
const PESO_DA_FONTE: Record<AtividadeComparavel["fonte"], number> = {
  // Gravação própria é a mais confiável: a Rua sabe como mediu.
  gps: 3,
  // Arquivo do relógio vem com traçado e distância corrigida pelo aparelho.
  importacao: 2,
  saude: 1,
  manual: 0,
};

/**
 * Entre duas versões da mesma corrida, qual fica.
 *
 * Traçado ganha de tudo. Sem traçado dos dois lados, ganha quem tem mais dado;
 * empatando, ganha a fonte mais confiável. Nunca some as duas: somar
 * inventaria uma corrida que ninguém correu.
 *
 * Em empate completo vence o PRIMEIRO argumento. Quem chama decide o que é
 * "primeiro", e `decidirImportacao` passa a existente — porque trocar uma linha
 * por outra idêntica é escrita sem ganho, e num lote grande é escrita sem ganho
 * repetida centenas de vezes.
 */
export function escolherMelhor<T extends AtividadeComparavel>(a: T, b: T): T {
  const ra = riqueza(a);
  const rb = riqueza(b);
  if (ra !== rb) return ra > rb ? a : b;
  return PESO_DA_FONTE[a.fonte] >= PESO_DA_FONTE[b.fonte] ? a : b;
}

export type Decisao<T> =
  | { acao: "inserir"; atividade: T }
  | { acao: "ignorar"; atividade: T; conflita_com: AtividadeComparavel }
  | { acao: "substituir"; atividade: T; conflita_com: AtividadeComparavel };

/**
 * Decide o destino de cada candidata diante do que já existe.
 *
 * Compara também com as candidatas já aceitas na mesma rodada: importar um lote
 * que contém a mesma corrida duas vezes é comum quando a pessoa exporta o
 * histórico inteiro do relógio.
 */
export function decidirImportacao<T extends AtividadeComparavel>(
  candidatas: readonly T[],
  existentes: readonly AtividadeComparavel[],
): Decisao<T>[] {
  const decisoes: Decisao<T>[] = [];
  const aceitas: AtividadeComparavel[] = [];

  for (const c of candidatas) {
    // `id_local` idêntico é o mesmo registro, não uma corrida parecida.
    const mesmoId = [...existentes, ...aceitas].find(
      (e) => c.id_local !== undefined && e.id_local === c.id_local,
    );
    if (mesmoId) {
      decisoes.push({ acao: "ignorar", atividade: c, conflita_com: mesmoId });
      continue;
    }

    const parecida = [...existentes, ...aceitas].find((e) => mesmaCorrida(c, e));
    if (!parecida) {
      decisoes.push({ acao: "inserir", atividade: c });
      aceitas.push(c);
      continue;
    }

    // A existente vai primeiro: no empate ela fica.
    const vencedora = escolherMelhor<AtividadeComparavel>(parecida, c);
    if (vencedora === parecida) {
      decisoes.push({ acao: "ignorar", atividade: c, conflita_com: parecida });
    } else {
      decisoes.push({ acao: "substituir", atividade: c, conflita_com: parecida });
      aceitas.push(c);
    }
  }

  return decisoes;
}
