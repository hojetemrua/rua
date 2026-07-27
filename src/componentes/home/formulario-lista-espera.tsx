"use client";

import { useActionState } from "react";
import { Botao } from "@/componentes/base/botao";
import { IconeConfirmado } from "@/componentes/base/icones";
import { LISTA_ESPERA } from "@/conteudo/home";
import { cn } from "@/lib/cn";
import { entrarNaLista } from "@/acoes/lista-espera";
import {
  ESTADO_INICIAL,
  type EstadoDaLista,
} from "@/acoes/lista-espera-estado";

type FormularioProps = {
  /** De onde partiu a inscrição: "heroi" ou "fecho". */
  origem: string;
  /** Sufixo do id do campo — a home tem dois formulários na mesma página. */
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
          "flex items-center gap-3 font-ui text-[17px] font-semibold text-tinta",
          className,
        )}
        role="status"
      >
        <IconeConfirmado className="size-5 shrink-0" />
        {LISTA_ESPERA.sucesso}
      </p>
    );
  }

  const comErro = estado.estado === "erro";

  return (
    <form action={acao} className={cn("flex flex-col gap-3", className)}>
      <input type="hidden" name="origem" value={origem} />

      <label htmlFor={idCampo} className="sr-only">
        {LISTA_ESPERA.rotuloDoCampo}
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
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
          className={cn(
            "h-14 min-w-0 flex-1 rounded-full border bg-branco px-6 font-texto text-[16px] text-tinta",
            "placeholder:text-tinta-3",
            comErro ? "border-tinta" : "border-linha",
          )}
        />
        <Botao
          type="submit"
          tamanho="grande"
          disabled={pendente}
          className="shrink-0"
        >
          {pendente ? "Um instante…" : LISTA_ESPERA.botao}
        </Botao>
      </div>

      {comErro ? (
        <p
          id={idErro}
          role="alert"
          className="font-texto text-[14px] font-medium text-tinta"
        >
          {estado.mensagem}
        </p>
      ) : null}
    </form>
  );
}
