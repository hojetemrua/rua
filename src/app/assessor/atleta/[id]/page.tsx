import type { Metadata } from "next";
import Link from "next/link";
import { IconeAssessor, IconeRecado, IconeVoltar } from "@/componentes/base/icones";
import { BarraZonas } from "@/componentes/base/barra-zonas";
import { GraficoVolume8Semanas } from "@/componentes/base/grafico-volume";
import { MarcadorDinamico } from "@/componentes/base/marcador-dinamico";
import { PontosDaSemana } from "@/componentes/base/pontos-da-semana";
import { RotuloSecao } from "@/componentes/base/rotulo-secao";
import { iniciaisDe } from "@/componentes/base/avatar-iniciais";
import { FICHA_DO_ATLETA, VOLUME_8_SEMANAS } from "@/lib/dados/exemplo";
import { formatarVolume } from "@/lib/formato";

export const metadata: Metadata = {
  title: "Atleta",
  description: "Ficha do atleta: volume, aderência, últimas atividades e a semana publicada.",
};

function Numero({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="rounded-cartao border border-linha bg-branco p-[18px]">
      <p className="font-ui text-[10px] font-extrabold tracking-[0.1em] uppercase text-tinta-3">
        {rotulo}
      </p>
      <p className="numeros text-[30px] leading-[1.1] font-black">{valor}</p>
    </div>
  );
}

export default function Atleta() {
  const ficha = FICHA_DO_ATLETA;

  return (
    <div className="flex flex-col">
      <Link
        href="/assessor/turma"
        className="inline-flex w-fit items-center gap-[9px] font-ui text-[12.5px] font-extrabold text-tinta-3 hover:text-tinta"
      >
        <IconeVoltar className="size-[15px]" />
        Turma
      </Link>

      <header className="mt-3.5 flex flex-wrap items-end justify-between gap-5">
        <div className="flex items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-tinta font-ui text-[19px] font-black text-papel">
            <span aria-hidden="true">{iniciaisDe(ficha.pessoa.nome)}</span>
          </span>
          <div>
            <h1
              className="font-ui text-[34px] font-black tracking-[-0.035em]"
              style={{ fontStretch: "96%" }}
            >
              {ficha.pessoa.nome}
            </h1>
            <p className="font-texto text-[13.5px] text-tinta-3">
              {ficha.contexto}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="flex shrink-0 items-center gap-[9px] rounded-full bg-tinta px-[22px] py-3.5 font-ui text-[14.5px] font-extrabold text-papel transition-colors hover:bg-tinta-2"
        >
          <IconeAssessor className="size-4" />
          Montar semana
        </button>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Numero rotulo="Semana" valor={`${formatarVolume(ficha.semanaKm)} km`} />
        <Numero rotulo="Aderência" valor={ficha.aderencia} />
        <Numero rotulo="Pace médio" valor={ficha.paceMedio} />
        <Numero rotulo="Sem parar" valor={ficha.semParar} />
      </div>

      <div className="mt-3.5 grid items-start gap-3.5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-cartao border border-linha bg-branco p-[22px]">
          <RotuloSecao>Últimas atividades</RotuloSecao>

          <ul className="mt-3 flex flex-col">
            {ficha.ultimasAtividades.map((atividade) => (
              <li
                key={atividade.id}
                className="flex flex-wrap items-center gap-4 border-t border-linha-2 py-3.5"
              >
                <p className="numeros w-11 shrink-0 text-[12px] font-extrabold uppercase text-tinta-3">
                  {atividade.data}
                </p>
                <div className="min-w-[160px] flex-1">
                  <p className="font-ui text-[14.5px] font-extrabold">
                    {atividade.nome}
                  </p>
                  <p className="numeros text-[12.5px] font-bold text-tinta-3">
                    {atividade.resumo}
                  </p>
                </div>
                <BarraZonas
                  fatias={atividade.zonas}
                  className="h-[9px] w-24 shrink-0"
                />
              </li>
            ))}
          </ul>

          <div className="my-[18px] h-px bg-linha" />

          <RotuloSecao>Volume · 8 semanas</RotuloSecao>
          <GraficoVolume8Semanas
            semanas={VOLUME_8_SEMANAS}
            altura={96}
            className="mt-4 gap-2"
          />
        </section>

        <div className="flex flex-col gap-3.5">
          <section className="rounded-cartao border border-linha bg-branco p-[22px]">
            <RotuloSecao>Semana publicada</RotuloSecao>
            <PontosDaSemana
              dias={ficha.semanaPublicada.dias}
              comLetras
              className="mt-4"
            />
            <div className="mt-[18px] mb-3.5 h-px bg-linha" />
            {/* Sem reposição automática: a semana perdida fica perdida. */}
            <p className="font-texto text-[13px] leading-[1.6] text-tinta-2">
              {ficha.semanaPublicada.nota}
            </p>
          </section>

          <section className="rounded-cartao border-[1.5px] border-tinta bg-branco p-[22px]">
            <p className="flex items-center gap-[9px]">
              <IconeRecado className="size-4" />
              <span className="font-ui text-[11px] font-extrabold tracking-[0.14em] uppercase">
                Recado no treino
              </span>
            </p>

            <label htmlFor="recado" className="sr-only">
              Recado para {ficha.pessoa.nome}
            </label>
            <textarea
              id="recado"
              rows={3}
              defaultValue={ficha.recado}
              className="mt-3 w-full resize-y rounded-2xl border border-linha p-3.5 font-texto text-[14px] leading-[1.6] text-tinta-2 outline-none focus-visible:border-tinta"
            />

            <button
              type="button"
              className="mt-3 flex w-full items-center justify-center gap-[9px] rounded-full bg-tinta px-4 py-3.5 font-ui text-[14.5px] font-extrabold text-papel transition-colors hover:bg-tinta-2"
            >
              Enviar recado
            </button>
          </section>
        </div>
      </div>

      <MarcadorDinamico />
    </div>
  );
}
