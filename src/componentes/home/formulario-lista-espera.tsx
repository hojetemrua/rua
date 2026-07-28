"use client";

import { useActionState } from "react";
import {
  IconeConfirmado,
  IconeEmail,
  IconeSeta,
} from "@/componentes/base/icones";
import { HEROI, LISTA_ESPERA } from "@/conteudo/home";
import { cn } from "@/lib/cn";
import { entrarNaLista } from "@/acoes/lista-espera";
import {
  ESTADO_INICIAL,
  type EstadoDaLista,
} from "@/acoes/lista-espera-estado";

type FormularioProps = {
  /** De onde partiu a inscrição: "heroi" ou "fecho". */
  origem: string;
  /** Sufixo do id do campo — a home tem mais de um formulário na página. */
  id: string;
  className?: string;
};

export function FormularioListaEspera({
  origem,
  id,
  className,
}: FormularioProps) {
  const [estado, acao, pendente] = useActionState<EstadoDaLista, FormData>(
    entrarNaLista,
    ESTADO_INICIAL,
  );

  const idCampo = `email-${id}`;
  const idErro = `erro-${id}`;

  if (estado.estado === "ok") {
    return (
      <p
        className={cn(
          "flex items-center gap-3 font-ui text-[17px] font-extrabold",
          className,
        )}
        role="status"
      >
        <IconeConfirmado className="size-5 shrink-0 text-tracado" />
        {LISTA_ESPERA.sucesso}
      </p>
    );
  }

  const comErro = estado.estado === "erro";

  return (
    <form action={acao} className={className}>
      <input type="hidden" name="origem" value={origem} />

      <label htmlFor={idCampo} className="sr-only">
        {LISTA_ESPERA.rotuloDoCampo}
      </label>

      <div className="flex flex-wrap items-center gap-2.5">
        <div
          className={cn(
            "flex flex-[1_1_300px] items-center gap-3 rounded-full border-[1.5px] bg-branco px-[22px]",
            comErro ? "border-z4" : "border-tinta",
          )}
        >
          <IconeEmail className="size-[19px] shrink-0 text-tinta-3" />
          <input
            id={idCampo}
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder={LISTA_ESPERA.placeholder}
            aria-invalid={comErro || undefined}
            aria-describedby={comErro ? idErro : undefined}
            className="w-full border-0 bg-transparent py-[18px] font-texto text-[16px] text-tinta outline-none placeholder:text-tinta-3"
          />
        </div>

        <button
          type="submit"
          disabled={pendente}
          className="inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full bg-tinta px-[30px] py-[19px] font-ui text-[17px] font-extrabold text-papel transition-colors hover:bg-tinta-2 disabled:bg-linha disabled:text-tinta-3"
        >
          {pendente ? "Um instante…" : LISTA_ESPERA.botao}
          {pendente ? null : <IconeSeta className="size-[17px]" />}
        </button>
      </div>

      {comErro ? (
        <p
          id={idErro}
          role="alert"
          className="mt-3 font-texto text-[14px] font-medium text-tinta"
        >
          {estado.mensagem}
        </p>
      ) : (
        <p className="mt-3 font-texto text-[13px] text-tinta-3">
          {HEROI.apoioDoCampo}
        </p>
      )}
    </form>
  );
}
