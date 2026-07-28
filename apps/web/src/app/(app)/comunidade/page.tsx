import type { Metadata } from "next";
import {
  IconeAssessor,
  IconeAvancar,
  IconeComunidade,
  IconePulso,
} from "@/componentes/base/icones";
import { RotuloSecao } from "@/componentes/base/rotulo-secao";
import { cn } from "@/lib/cn";
import {
  CIDADE,
  CORRENDO_AGORA,
  ENCONTROS,
  GRUPOS,
} from "@/lib/dados/exemplo";
import { formatarInteiro } from "@/lib/formato";

export const metadata: Metadata = { title: "Comunidade" };

export default function Comunidade() {
  return (
    <div className="flex flex-col">
      <header className="px-[22px] pt-5">
        <RotuloSecao como="p">{CIDADE}</RotuloSecao>
        <h1
          className="mt-1.5 font-ui text-[30px] font-black tracking-[-0.03em]"
          style={{ fontStretch: "96%" }}
        >
          A rua hoje
        </h1>
      </header>

      {/*
        Só o total da cidade, nunca quem nem onde. O contador depende de
        presença em tempo real: entra por último, opt-in, em canal efêmero,
        sem nada persistido.
      */}
      <section className="mx-3.5 mt-3.5 rounded-[24px] border border-linha bg-branco px-5 py-[18px]">
        <p className="flex items-center gap-[9px] text-tinta-3">
          <IconePulso className="size-3.5" />
          <span className="font-ui text-[11px] font-extrabold tracking-[0.14em] uppercase">
            Correndo agora
          </span>
        </p>
        <p className="mt-2.5 flex items-baseline gap-2.5">
          <span className="numeros text-[34px] leading-none font-black">
            {formatarInteiro(CORRENDO_AGORA)}
          </span>
          <span className="font-texto text-[14px] text-tinta-2">
            pessoas na rua neste minuto
          </span>
        </p>
      </section>

      <RotuloSecao className="px-[22px] pt-5 pb-2.5">
        Próximos encontros
      </RotuloSecao>

      <ul className="mx-3.5 flex flex-col gap-2">
        {ENCONTROS.map((encontro) => (
          <li
            key={encontro.id}
            className="rounded-[20px] border border-linha bg-branco px-[18px] py-4"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-ui text-[18px] font-black tracking-[-0.02em]">
                {encontro.titulo}
              </h3>
              <p className="numeros shrink-0 text-[12px] font-extrabold text-tinta-3">
                {encontro.hora}
              </p>
            </div>

            <p className="mt-1.5 font-texto text-[13.5px] text-tinta-2">
              {encontro.local}
            </p>

            <div className="mt-3.5 flex items-center justify-between gap-3">
              <p className="font-texto text-[12.5px] text-tinta-3">
                {formatarInteiro(encontro.confirmados)} confirmados · aberto a
                todos
              </p>
              <button
                type="button"
                aria-pressed={encontro.vou}
                className={cn(
                  "shrink-0 rounded-full font-ui text-[13px] font-extrabold",
                  encontro.vou
                    ? "bg-tinta px-[18px] py-2.5 text-papel"
                    : "border-[1.5px] border-tinta px-[18px] py-[9px]",
                )}
              >
                Vou
              </button>
            </div>
          </li>
        ))}
      </ul>

      <RotuloSecao className="px-[22px] pt-5 pb-2.5">Seus grupos</RotuloSecao>

      <ul className="mx-3.5 mb-5 flex flex-col gap-2">
        {GRUPOS.map((grupo) => (
          <li key={grupo.id}>
            <button
              type="button"
              className="flex w-full items-center gap-3.5 rounded-[20px] border border-linha bg-branco px-[18px] py-[15px] text-left"
            >
              <span className="flex size-[38px] shrink-0 items-center justify-center rounded-pequeno bg-linha-2">
                {grupo.tipo === "assessoria" ? (
                  <IconeAssessor className="size-[18px]" />
                ) : (
                  <IconeComunidade className="size-[18px]" />
                )}
              </span>
              <span className="flex-1">
                <span className="block font-ui text-[15px] font-extrabold">
                  {grupo.nome}
                </span>
                <span className="block font-texto text-[12.5px] text-tinta-3">
                  {grupo.detalhe}
                </span>
              </span>
              <IconeAvancar className="size-4 text-tinta-3" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
