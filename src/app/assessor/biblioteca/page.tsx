import type { Metadata } from "next";
import { IconeMais } from "@/componentes/base/icones";
import { BarraZonas } from "@/componentes/base/barra-zonas";
import { RotuloSecao } from "@/componentes/base/rotulo-secao";
import { cn } from "@/lib/cn";
import { BIBLIOTECA, BIBLIOTECA_RESUMO } from "@/lib/dados/exemplo";
import { formatarInteiro } from "@/lib/formato";

export const metadata: Metadata = { title: "Biblioteca" };

const FILTROS = [
  { chave: "todos", rotulo: "Todos" },
  { chave: "leve", rotulo: "Leve" },
  { chave: "intervalado", rotulo: "Intervalado" },
  { chave: "longao", rotulo: "Longão" },
] as const;

/**
 * Biblioteca de treinos.
 *
 * Mão dupla e custo zero nas duas pontas: publicar para a turma ou para todo
 * mundo é a mesma ferramenta, e nenhum assessor paga para publicar nem
 * ninguém paga para usar.
 */
export default function Biblioteca() {
  return (
    <div className="flex flex-col">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <RotuloSecao como="p">
            {formatarInteiro(BIBLIOTECA_RESUMO.total)} treinos ·{" "}
            {formatarInteiro(BIBLIOTECA_RESUMO.compartilhados)} compartilhados
            com a turma
          </RotuloSecao>
          <h1
            className="mt-1.5 font-ui text-[36px] font-black tracking-[-0.035em]"
            style={{ fontStretch: "96%" }}
          >
            Biblioteca de treinos
          </h1>
        </div>

        <button
          type="button"
          className="flex shrink-0 items-center gap-[9px] rounded-full bg-tinta px-[22px] py-3.5 font-ui text-[14.5px] font-extrabold text-papel transition-colors hover:bg-tinta-2"
        >
          <IconeMais className="size-4" />
          Novo treino
        </button>
      </header>

      {/* Filtro ainda sem estado: entra com a biblioteca no banco. */}
      <div className="mt-[22px] flex flex-wrap gap-2">
        {FILTROS.map((filtro, indice) => (
          <button
            key={filtro.chave}
            type="button"
            aria-pressed={indice === 0}
            className={cn(
              "rounded-full px-4 py-[9px] font-ui text-[12.5px]",
              indice === 0
                ? "bg-tinta font-extrabold text-papel"
                : "border border-linha bg-branco font-bold hover:border-tinta-3",
            )}
          >
            {filtro.rotulo}
          </button>
        ))}
      </div>

      <ul className="mt-[18px] grid gap-3.5 md:grid-cols-2 xl:grid-cols-3">
        {BIBLIOTECA.map((treino) => (
          <li
            key={treino.id}
            className="flex flex-col rounded-cartao border border-linha bg-branco p-[22px]"
          >
            <h2 className="font-ui text-[22px] font-black tracking-[-0.025em]">
              {treino.nome}
            </h2>
            <p className="numeros mt-1.5 text-[13px] font-bold text-tinta-3">
              {treino.faixa}
            </p>

            <BarraZonas fatias={treino.zonas} className="mt-4 h-2.5" />

            <div className="my-4 h-px bg-linha" />

            <p className="font-texto text-[13.5px] leading-[1.6] text-tinta-2">
              {treino.descricao}
            </p>

            <div className="mt-4 flex items-center justify-between gap-3 pt-0">
              <p className="font-texto text-[12.5px] text-tinta-3">
                usado <span className="numeros">{treino.usos}</span>×
              </p>
              <button
                type="button"
                className="shrink-0 rounded-full border-[1.5px] border-tinta px-4 py-[9px] font-ui text-[12.5px] font-extrabold"
              >
                Publicar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <section className="mt-3.5 flex flex-wrap items-center justify-between gap-5 rounded-cartao border border-linha bg-branco p-[22px]">
        <p className="max-w-[64ch] font-texto text-[14px] leading-[1.6] text-tinta-2">
          {BIBLIOTECA_RESUMO.rodape}
        </p>
        <button
          type="button"
          className="shrink-0 rounded-full border-[1.5px] border-tinta px-5 py-3 font-ui text-[13.5px] font-extrabold"
        >
          Ver biblioteca pública
        </button>
      </section>
    </div>
  );
}
