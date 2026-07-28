"use server";

import { Resend } from "resend";
import type { EstadoDaLista } from "@/acoes/lista-espera-estado";
import { LISTA_ESPERA } from "@/conteudo/home";
import { clientePublico } from "@/lib/supabase/publico";

const EMAIL_PLAUSIVEL = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

/**
 * Entrada na lista de espera.
 *
 * A gravação passa pela função `entrar_na_lista` no banco, que é idempotente e
 * não conta para fora se o e-mail já estava lá. Por isso um e-mail repetido
 * devolve sucesso: a página nunca revela quem já se inscreveu.
 */
export async function entrarNaLista(
  _anterior: EstadoDaLista,
  dados: FormData,
): Promise<EstadoDaLista> {
  const email = String(dados.get("email") ?? "")
    .trim()
    .toLowerCase();
  const origem = String(dados.get("origem") ?? "home").slice(0, 40);

  if (!EMAIL_PLAUSIVEL.test(email) || email.length > 320) {
    return { estado: "erro", mensagem: LISTA_ESPERA.erroEmail };
  }

  const supabase = clientePublico();
  if (!supabase) {
    console.error(
      "lista_espera: NEXT_PUBLIC_SUPABASE_URL/ANON_KEY ausentes; nada foi gravado.",
    );
    return { estado: "erro", mensagem: LISTA_ESPERA.erroGenerico };
  }

  const { error } = await supabase.rpc("entrar_na_lista", {
    p_email: email,
    p_origem: origem,
  });

  if (error) {
    if (error.message.includes("email_invalido")) {
      return { estado: "erro", mensagem: LISTA_ESPERA.erroEmail };
    }
    console.error("lista_espera: falha ao gravar", error);
    return { estado: "erro", mensagem: LISTA_ESPERA.erroGenerico };
  }

  // O e-mail de confirmação é um extra: se falhar, a pessoa já está na lista e
  // não deve ver erro por isso.
  await enviarConfirmacao(email);

  return { estado: "ok" };
}

async function enviarConfirmacao(email: string): Promise<void> {
  const chave = process.env.RESEND_API_KEY;
  const remetente = process.env.RUA_EMAIL_REMETENTE;

  if (!chave || !remetente) return;

  try {
    const resend = new Resend(chave);
    await resend.emails.send({
      from: remetente,
      to: email,
      subject: "Você está na lista do Rua.",
      text: [
        "Pronto: seu e-mail está na lista.",
        "",
        "Quando o Rua abrir, em 2026, você recebe um aviso. Nada além disso —",
        "sem newsletter, sem fila paga, sem convite especial.",
        "",
        "A rua está aberta.",
        "",
        "rua.run",
      ].join("\n"),
    });
  } catch (erro) {
    console.error("lista_espera: falha ao enviar confirmação", erro);
  }
}
