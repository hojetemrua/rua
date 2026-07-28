import { cacheLife, cacheTag } from "next/cache";
import { clientePublico } from "@/lib/supabase/publico";

/** Etiqueta de cache do painel. Um apoio novo invalida por aqui. */
export const ETIQUETA_SINAL_ABERTO = "sinal-aberto";

export type NivelDeApoio = {
  ordem: number;
  nome: string;
  /** Meta BRUTA, antes da taxa da plataforma de apoio. */
  metaCentavos: number;
  descricao: string;
  alcancadoEm: string | null;
};

export type SinalAberto = {
  /** Primeiro dia do mês, em ISO. */
  mes: string;
  /** Quando a plataforma e os apps abrem. */
  lancaEm: string;
  /** Quando a campanha de apoio começa a receber. */
  apoioAbreEm: string;
  /**
   * Falso antes de `apoioAbreEm`. Nesse período o painel mostra o CUSTO em vez
   * de uma barra de arrecadação em zero: não há o que apoiar ainda, e barra
   * vazia numa página que fala de contas abertas parece descuido, não honestidade.
   */
  apoioAberto: boolean;
  /** Custo real de operação do mês. */
  custoDoMesCentavos: number;
  /** Nível corrente: o primeiro ainda não alcançado. */
  nivel: {
    ordem: number;
    nome: string;
    descricao: string;
    metaBrutaCentavos: number;
  } | null;
  /** As três linhas que o §4 exige. */
  brutoCentavos: number;
  taxaCentavos: number;
  liquidoCentavos: number;
  /** A barra em dois tons. */
  deQuemComecouCentavos: number;
  daComunidadeCentavos: number;
  apoiadores: number;
  /** Níveis já alcançados, com a data. */
  alcancados: NivelDeApoio[];
  /** Níveis acima do corrente. */
  proximos: NivelDeApoio[];
  /**
   * Verdadeiro quando os números vieram da semente, não do banco. A home avisa
   * o visitante em vez de apresentar número de exemplo como se fosse real.
   */
  daSemente: boolean;
};

const NIVEIS_SEMENTE: NivelDeApoio[] = [
  {
    ordem: 1,
    nome: "A rua de pé",
    metaCentavos: 115_000,
    descricao:
      "Servidor, banco, e-mail e mapas no ar para os primeiros milhares.",
    alcancadoEm: null,
  },
  {
    ordem: 2,
    nome: "Cabe mais gente",
    metaCentavos: 290_000,
    descricao: "Escala para dezenas de milhares sem engasgo.",
    alcancadoEm: null,
  },
  {
    ordem: 3,
    nome: "Fora do bolso de um",
    metaCentavos: 520_000,
    descricao:
      "Associação, contabilidade, jurídico e marca. A Rua para de depender de uma pessoa.",
    alcancadoEm: null,
  },
  {
    ordem: 4,
    nome: "Um ano na frente",
    metaCentavos: 800_000,
    descricao: "Reserva de 12 meses. A rua não fecha em ano magro.",
    alcancadoEm: null,
  },
  {
    ordem: 5,
    nome: "Mais gente construindo",
    metaCentavos: 1_380_000,
    descricao: "Remunerar quem constrói: código, acessibilidade, suporte.",
    alcancadoEm: null,
  },
];

const SEMENTE: SinalAberto = {
  mes: "2026-07-01",
  lancaEm: "2026-09-19",
  apoioAbreEm: "2026-09-19",
  apoioAberto: false,
  custoDoMesCentavos: 100_000,
  nivel: {
    ordem: 1,
    nome: NIVEIS_SEMENTE[0]!.nome,
    descricao: NIVEIS_SEMENTE[0]!.descricao,
    metaBrutaCentavos: NIVEIS_SEMENTE[0]!.metaCentavos,
  },
  brutoCentavos: 0,
  taxaCentavos: 0,
  liquidoCentavos: 0,
  deQuemComecouCentavos: 0,
  daComunidadeCentavos: 0,
  apoiadores: 0,
  alcancados: [],
  proximos: NIVEIS_SEMENTE.slice(1),
  daSemente: true,
};

type LinhaResumo = {
  mes: string;
  nivel: number | null;
  nome: string | null;
  descricao: string | null;
  meta_bruta_centavos: number | null;
  bruto_centavos: number;
  fundador_centavos: number;
  comunidade_centavos: number;
  taxa_estimada_centavos: number;
  liquido_estimado_centavos: number;
  apoiadores: number;
  custo_do_mes_centavos: number | null;
};

type LinhaNivel = {
  ordem: number;
  nome: string;
  meta_centavos: number;
  descricao: string;
  alcancado_em: string | null;
};

type LinhaProjeto = { lanca_em: string; apoio_abre_em: string };

async function buscarNoBanco(): Promise<SinalAberto | null> {
  const supabase = clientePublico();
  if (!supabase) return null;

  const [resumo, niveis, projeto] = await Promise.all([
    supabase.rpc("resumo_sinal_aberto").maybeSingle<LinhaResumo>(),
    supabase
      .from("niveis_apoio")
      .select("ordem, nome, meta_centavos, descricao, alcancado_em")
      .order("ordem", { ascending: true })
      .returns<LinhaNivel[]>(),
    supabase
      .from("projeto")
      .select("lanca_em, apoio_abre_em")
      .maybeSingle<LinhaProjeto>(),
  ]);

  if (resumo.error || niveis.error || !resumo.data || !projeto.data) return null;

  const linha = resumo.data;
  const todos = (niveis.data ?? []).map(
    (n): NivelDeApoio => ({
      ordem: n.ordem,
      nome: n.nome,
      metaCentavos: n.meta_centavos,
      descricao: n.descricao,
      alcancadoEm: n.alcancado_em,
    }),
  );

  // Data em ISO no fuso de São Paulo, para a virada do estado acontecer à
  // meia-noite daqui e não à meia-noite de Londres.
  const hoje = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
  }).format(new Date());

  return {
    mes: linha.mes.slice(0, 10),
    lancaEm: projeto.data.lanca_em,
    apoioAbreEm: projeto.data.apoio_abre_em,
    apoioAberto: projeto.data.apoio_abre_em <= hoje,
    custoDoMesCentavos: linha.custo_do_mes_centavos ?? 0,
    nivel:
      linha.nivel !== null &&
      linha.nome !== null &&
      linha.descricao !== null &&
      linha.meta_bruta_centavos !== null
        ? {
            ordem: linha.nivel,
            nome: linha.nome,
            descricao: linha.descricao,
            metaBrutaCentavos: linha.meta_bruta_centavos,
          }
        : null,
    brutoCentavos: Number(linha.bruto_centavos),
    taxaCentavos: Number(linha.taxa_estimada_centavos),
    liquidoCentavos: Number(linha.liquido_estimado_centavos),
    deQuemComecouCentavos: Number(linha.fundador_centavos),
    daComunidadeCentavos: Number(linha.comunidade_centavos),
    apoiadores: linha.apoiadores,
    alcancados: todos.filter((n) => n.alcancadoEm !== null),
    proximos: todos.filter(
      (n) => n.alcancadoEm === null && n.ordem !== linha.nivel,
    ),
    daSemente: false,
  };
}

/**
 * Números do painel Sinal Aberto.
 *
 * Fica em cache porque o custo do mês e a soma dos apoios não mudam a cada
 * visita, e a home é a página mais acessada do projeto. A etiqueta permite
 * derrubar o cache no instante em que alguém apoia.
 */
export async function lerSinalAberto(): Promise<SinalAberto> {
  "use cache";
  cacheTag(ETIQUETA_SINAL_ABERTO);
  cacheLife({ stale: 300, revalidate: 900, expire: 3600 });

  return (await buscarNoBanco()) ?? SEMENTE;
}
