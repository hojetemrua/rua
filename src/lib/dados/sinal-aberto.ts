import { cacheLife, cacheTag } from "next/cache";
import { clientePublico } from "@/lib/supabase/publico";

/** Etiqueta de cache do painel. Um apoio novo invalida por aqui. */
export const ETIQUETA_SINAL_ABERTO = "sinal-aberto";

export type NivelSinalAberto = {
  nivel: number;
  titulo: string;
  metaCentavos: number;
  alcancadoEm: string | null;
};

export type SinalAberto = {
  /** Primeiro dia do mês, em ISO: "2026-07-01". */
  mes: string;
  nivel: number;
  descricao: string;
  custoCentavos: number;
  arrecadadoCentavos: number;
  apoiadores: number;
  /** Níveis acima do atual, em ordem crescente. */
  proximos: NivelSinalAberto[];
  /**
   * Verdadeiro quando os números vieram da semente, não do banco. A home avisa
   * o visitante em vez de apresentar número de exemplo como se fosse real.
   */
  daSemente: boolean;
};

/**
 * Semente usada enquanto não há banco configurado. São os números de exemplo
 * do handoff — nunca devem ser tratados como reais, por isso `daSemente`.
 */
const SEMENTE: SinalAberto = {
  mes: "2026-07-01",
  nivel: 1,
  descricao: "Servidor de pé para 5.000 corredores",
  custoCentavos: 100_000,
  arrecadadoCentavos: 64_000,
  apoiadores: 41,
  proximos: [
    {
      nivel: 2,
      titulo: "Mapa e traçado sem limite",
      metaCentavos: 240_000,
      alcancadoEm: null,
    },
    {
      nivel: 3,
      titulo: "Painel do assessor liberado",
      metaCentavos: 430_000,
      alcancadoEm: null,
    },
    {
      nivel: 4,
      titulo: "Um ano garantido na frente",
      metaCentavos: 700_000,
      alcancadoEm: null,
    },
  ],
  daSemente: true,
};

type LinhaResumo = {
  mes: string;
  nivel: number;
  descricao: string;
  custo_centavos: number;
  arrecadado_centavos: number;
  apoiadores: number;
};

type LinhaNivel = {
  nivel: number;
  titulo: string;
  meta_centavos: number;
  alcancado_em: string | null;
};

async function buscarNoBanco(): Promise<SinalAberto | null> {
  const supabase = clientePublico();
  if (!supabase) return null;

  const [resumo, niveis] = await Promise.all([
    supabase.rpc("resumo_sinal_aberto").maybeSingle<LinhaResumo>(),
    supabase
      .from("niveis_sinal_aberto")
      .select("nivel, titulo, meta_centavos, alcancado_em")
      .order("nivel", { ascending: true })
      .returns<LinhaNivel[]>(),
  ]);

  if (resumo.error || niveis.error || !resumo.data) return null;

  const linha = resumo.data;

  return {
    mes: linha.mes.slice(0, 10),
    nivel: linha.nivel,
    descricao: linha.descricao,
    custoCentavos: linha.custo_centavos,
    arrecadadoCentavos: Number(linha.arrecadado_centavos),
    apoiadores: linha.apoiadores,
    proximos: (niveis.data ?? [])
      .filter((n) => n.nivel > linha.nivel)
      .map((n) => ({
        nivel: n.nivel,
        titulo: n.titulo,
        metaCentavos: n.meta_centavos,
        alcancadoEm: n.alcancado_em,
      })),
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
