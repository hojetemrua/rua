import type { ClienteRua } from "./cliente";

/**
 * Consultas do Sinal Aberto.
 *
 * Todo número da página pública sai daqui — `transparencia_meses`,
 * `niveis_sinal_aberto` e o agregado de `apoios`. Nada fixado no código, nunca.
 */

export type ResumoDoMes = {
  mes: string;
  nivel: number;
  descricao: string;
  custo_centavos: number;
  arrecadado_centavos: number;
  apoiadores: number;
};

/**
 * Agregado público do mês corrente.
 *
 * Vem de função `SECURITY DEFINER` porque o total e a contagem são públicos,
 * mas a linha de cada apoio não: `anon` não tem leitura em `apoios`.
 */
export async function lerResumoDoMes(
  cliente: ClienteRua,
): Promise<ResumoDoMes | null> {
  const { data, error } = await cliente
    .rpc("resumo_sinal_aberto")
    .maybeSingle();
  if (error || !data) return null;
  return data as ResumoDoMes;
}

export async function lerNiveis(cliente: ClienteRua) {
  const { data, error } = await cliente
    .from("niveis_sinal_aberto")
    .select("nivel, titulo, subtitulo, meta_centavos, alcancado_em")
    .order("nivel", { ascending: true });
  return error ? [] : (data ?? []);
}

/**
 * Entrada na lista de espera.
 *
 * Passa por função `SECURITY DEFINER` idempotente: e-mail repetido devolve
 * sucesso sem contar para fora que já estava lá, para a tabela não virar
 * oráculo de "esta pessoa se inscreveu?".
 */
export async function entrarNaLista(
  cliente: ClienteRua,
  email: string,
  origem = "home",
): Promise<{ ok: true } | { ok: false; motivo: "email_invalido" | "falha" }> {
  const { error } = await cliente.rpc("entrar_na_lista", {
    p_email: email,
    p_origem: origem,
  });
  if (!error) return { ok: true };
  return {
    ok: false,
    motivo: error.message.includes("email_invalido") ? "email_invalido" : "falha",
  };
}
