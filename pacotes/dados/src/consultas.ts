import type { Banco } from "./banco";
import type { ClienteRua } from "./cliente";

/**
 * Consultas do Sinal Aberto.
 *
 * Todo número da página pública sai daqui — `niveis_apoio`,
 * `transparencia_meses` e o agregado de `apoios`. Nada fixado no código, nunca.
 *
 * Os tipos vêm do banco, não escritos à mão: `pnpm --filter @rua/dados
 * gerar-tipos` os regenera, e uma coluna renomeada quebra o build em vez de
 * virar `undefined` em produção.
 */

export type ResumoDoMes =
  Banco["public"]["Functions"]["resumo_sinal_aberto"]["Returns"][number];

export type NivelDeApoio = Banco["public"]["Tables"]["niveis_apoio"]["Row"];

export type DatasDoProjeto = Banco["public"]["Tables"]["projeto"]["Row"];

/**
 * Agregado público do mês corrente.
 *
 * Vem de função `SECURITY DEFINER` porque o total e a contagem são públicos,
 * mas a linha de cada apoio não: `anon` não tem leitura em `apoios`.
 *
 * A taxa que volta aqui é ESTIMADA em 13%, porque o mês está aberto. A real
 * vem do extrato e entra em `transparencia_meses` quando o mês fecha.
 */
export async function lerResumoDoMes(
  cliente: ClienteRua,
): Promise<ResumoDoMes | null> {
  const { data, error } = await cliente
    .rpc("resumo_sinal_aberto")
    .maybeSingle();
  return error ? null : data;
}

/** A escada inteira, alcançados e pendentes, em ordem. */
export async function lerNiveis(cliente: ClienteRua): Promise<NivelDeApoio[]> {
  const { data, error } = await cliente
    .from("niveis_apoio")
    .select("*")
    .order("ordem", { ascending: true });
  return error ? [] : (data ?? []);
}

/** As duas datas que fazem a home mudar de estado. */
export async function lerDatasDoProjeto(
  cliente: ClienteRua,
): Promise<DatasDoProjeto | null> {
  const { data, error } = await cliente
    .from("projeto")
    .select("*")
    .maybeSingle();
  return error ? null : data;
}

/**
 * Entrada na lista de espera.
 *
 * Passa por função `SECURITY DEFINER` idempotente: e-mail repetido devolve
 * sucesso sem contar para fora que já estava lá, para a tabela não virar
 * oráculo de "esta pessoa se inscreveu?".
 *
 * A `origem` distingue quem entrou pelo herói, pelo fecho ou pelo botão de
 * apoio — o último é a medida de quantos vão sustentar antes de a campanha
 * abrir.
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
