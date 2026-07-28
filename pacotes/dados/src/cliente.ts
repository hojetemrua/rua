import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Banco } from "./banco";

/**
 * Cliente Supabase compartilhado pelos dois clientes.
 *
 * A chave anônima é pública por natureza — tudo que ela alcança passa pela
 * RLS. A `service_role` nunca entra aqui: ela ignora RLS e só existe no
 * servidor, para escrever `transparencia_meses` e ler `lista_espera`.
 */

export type ClienteRua = SupabaseClient<Banco>;

export type ConfigDoCliente = {
  url: string;
  chaveAnonima: string;
  /** Sessão persistida faz sentido no app; em leitura pública, não. */
  persistirSessao?: boolean;
};

export function criarCliente({
  url,
  chaveAnonima,
  persistirSessao = true,
}: ConfigDoCliente): ClienteRua {
  return createClient<Banco>(url, chaveAnonima, {
    auth: {
      persistSession: persistirSessao,
      autoRefreshToken: persistirSessao,
    },
  });
}

/**
 * Cliente para leitura pública, sem sessão e sem cookie.
 *
 * Existe separado porque não depende de nada da requisição — o que permite
 * usá-lo dentro de `use cache` na web, onde ler cookie tiraria a página da
 * casca estática.
 */
export function criarClientePublico(config: ConfigDoCliente): ClienteRua {
  return criarCliente({ ...config, persistirSessao: false });
}
