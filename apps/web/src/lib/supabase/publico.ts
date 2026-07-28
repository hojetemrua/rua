import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente para leitura e escrita públicas, sem sessão e sem cookie.
 *
 * Existe separado do cliente de sessão (fase 3) por dois motivos: não depende
 * de nada da requisição, então pode viver dentro de `use cache`; e usa a chave
 * anônima, então tudo que ele faz passa pela RLS.
 */

const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const CHAVE_ANONIMA = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Devolve `null` quando o ambiente não está configurado, para que a home
 * continue de pé com os valores de semente em vez de quebrar o build.
 */
export function clientePublico(): SupabaseClient | null {
  if (!URL_SUPABASE || !CHAVE_ANONIMA) return null;

  return createClient(URL_SUPABASE, CHAVE_ANONIMA, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const supabaseConfigurado = Boolean(URL_SUPABASE && CHAVE_ANONIMA);
