import type { Metadata } from "next";
import Link from "next/link";
import { IconeEnviar, IconeSeta, IconeSumido } from "@/componentes/base/icones";
import {
  LegendaDaSemana,
  PontosDaSemana,
  SIGLAS_DA_SEMANA,
} from "@/componentes/base/pontos-da-semana";
import { RotuloSecao } from "@/componentes/base/rotulo-secao";
import {
  ASSESSORIA,
  QUEM_NAO_APARECEU,
  TREINOS_SEM_PLANILHA,
  TURMA,
} from "@/lib/dados/exemplo";
import { formatarInteiro, formatarVolume } from "@/lib/formato";

export const metadata: Metadata = { title: "Turma" };

/**
 * Painel da turma.
 *
 * Sem número de cobrança, por decisão de produto: não existe ranking de
 * atleta nem alerta vermelho. O painel mostra aderência e volume, e o bloco
 * de quem sumiu vem com contexto humano em vez de contagem de falha.
 */
export default function Turma() {
  return (
    <div className="flex flex-col">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <RotuloSecao como="p">{ASSESSORIA.semana}</RotuloSecao>
          <h1
            className="mt-1.5 font-ui text-[36px] font-black tracking-[-0.035em]"
            style={{ fontStretch: "96%" }}
          >
            Aderência da turma
          </h1>
        </div>
        <p className="flex items-baseline gap-2">
          <span className="numeros text-[38px] leading-none font-black">
            {ASSESSORIA.aderencia}%
          </span>
          <span className="font-ui text-[11px] leading-[1.3] font-bold text-tinta-3">
            TREINOS
            <br />
            FEITOS
          </span>
        </p>
      </header>

      <div className="mt-6 grid items-start gap-3.5 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/*
          Três classes que parecem decorativas e não são:
          - `min-w-0`: item de grade nasce com `min-width:auto` e não encolhe
            abaixo do conteúdo, então sem isto a tabela de 620px empurra a
            página em vez de rolar sozinha.
          - `relative`: os textos `sr-only` dentro da tabela são
            `position:absolute`. Sem um ancestral posicionado, o bloco que os
            contém vira a viewport, eles escapam da rolagem e a posição deles
            entra no `scrollWidth` do documento — 10px de rolagem horizontal
            vindos de um texto invisível.
          - `overflow-x-auto`: a tabela rola dentro do cartão, não a página.
        */}
        <div className="relative min-w-0 overflow-x-auto rounded-cartao border border-linha bg-branco">
          <table className="w-full min-w-[620px] border-collapse text-left">
            <caption className="sr-only">
              Atletas da turma, com os treinos da semana, o volume e quando
              apareceram pela última vez.
            </caption>
            <thead>
              <tr className="border-b border-linha font-ui text-[10px] font-extrabold tracking-[0.12em] uppercase text-tinta-3">
                <th scope="col" className="px-5 py-3 font-extrabold">
                  Atleta
                </th>
                <th scope="col" className="px-5 py-3 font-extrabold">
                  {SIGLAS_DA_SEMANA.join(" · ")}
                </th>
                <th scope="col" className="px-5 py-3 font-extrabold">
                  Volume
                </th>
                <th scope="col" className="px-5 py-3 font-extrabold">
                  Sinal
                </th>
              </tr>
            </thead>
            <tbody>
              {TURMA.map((atleta) => (
                <tr
                  key={atleta.id}
                  className="border-b border-linha-2 last:border-b-0"
                >
                  <th scope="row" className="px-5 py-3.5 font-normal">
                    <Link
                      href={`/assessor/atleta/${atleta.id}`}
                      className="font-ui text-[15px] font-extrabold hover:underline"
                    >
                      {atleta.nome}
                    </Link>
                  </th>
                  <td className="px-5 py-3.5">
                    <PontosDaSemana dias={atleta.semana} className="w-[180px]" />
                  </td>
                  <td className="numeros px-5 py-3.5 text-[14px] font-extrabold">
                    {formatarVolume(atleta.volumeKm)} km
                  </td>
                  <td className="px-5 py-3.5 font-texto text-[12.5px] text-tinta-2">
                    {atleta.sinal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3.5">
          <section className="rounded-cartao border border-linha bg-branco p-5">
            <p className="flex items-center gap-2 text-tinta-3">
              <IconeSumido className="size-[15px]" />
              <span className="font-ui text-[11px] font-extrabold tracking-[0.14em] uppercase">
                Quem ainda não apareceu
              </span>
            </p>
            <p className="mt-2.5 font-texto text-[13px] leading-[1.55] text-tinta-2">
              {QUEM_NAO_APARECEU.length === 3 ? "Três" : QUEM_NAO_APARECEU.length}{" "}
              pessoas sem treino esta semana. Talvez seja só a semana.
            </p>

            <ul className="mt-3 flex flex-col">
              {QUEM_NAO_APARECEU.map((pessoa) => (
                <li
                  key={pessoa.id}
                  className="flex items-center justify-between gap-3 border-t border-linha-2 py-3"
                >
                  <div>
                    <p className="font-ui text-[14.5px] font-extrabold">
                      {pessoa.nome}
                    </p>
                    {/* Contexto, não cobrança. */}
                    <p className="font-texto text-[12px] text-tinta-3">
                      {pessoa.contexto}
                    </p>
                  </div>
                  <p className="numeros shrink-0 text-[12px] font-bold text-tinta-3">
                    {pessoa.diasParado} dias
                  </p>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="mt-3.5 flex w-full items-center justify-center gap-[9px] rounded-full bg-tinta px-4 py-3.5 font-ui text-[14.5px] font-extrabold text-papel transition-colors hover:bg-tinta-2"
            >
              <IconeEnviar className="size-4" />
              Mandar um oi
            </button>
          </section>

          <section className="rounded-cartao border border-linha bg-branco p-5">
            <RotuloSecao>Publicar na semana</RotuloSecao>
            <p className="mt-2.5 font-texto text-[13px] leading-[1.55] text-tinta-2">
              {formatarInteiro(TREINOS_SEM_PLANILHA)} treinos ainda sem planilha
              para a semana que vem.
            </p>
            <Link
              href="/assessor/biblioteca"
              className="mt-3.5 flex items-center justify-center gap-[9px] rounded-full border-[1.5px] border-tinta px-4 py-[13px] font-ui text-[14.5px] font-extrabold"
            >
              Abrir biblioteca
              <IconeSeta className="size-[15px]" />
            </Link>
          </section>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        <LegendaDaSemana />
        <p className="font-texto text-[12.5px] text-tinta-3 sm:ml-auto">
          Clique num atleta para abrir a ficha.
        </p>
      </div>
    </div>
  );
}
