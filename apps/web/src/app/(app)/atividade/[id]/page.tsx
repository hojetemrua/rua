import type { Metadata } from "next";
import Link from "next/link";
import { IconeRecado, IconeVoltar } from "@/componentes/base/icones";
import { BarraZonas } from "@/componentes/base/barra-zonas";
import { MarcadorDinamico } from "@/componentes/base/marcador-dinamico";
import { RotuloSecao } from "@/componentes/base/rotulo-secao";
import { Tracado } from "@/componentes/base/tracado";
import { ULTIMA_ATIVIDADE } from "@/lib/dados/exemplo";
import {
  formatarDuracao,
  formatarKm,
  formatarPaceCurto,
} from "@/lib/formato";

export const metadata: Metadata = {
  title: "Atividade",
  description: "Traçado, números, tempo por zona e o recado do assessor.",
};

function Numero({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="rounded-[18px] border border-linha bg-branco px-3 py-3.5">
      <p className="font-ui text-[10px] font-extrabold tracking-[0.1em] uppercase text-tinta-3">
        {rotulo}
      </p>
      <p className="numeros text-[26px] leading-[1.1] font-black">{valor}</p>
    </div>
  );
}

/**
 * Treino fechado.
 *
 * Enquanto não há autenticação nem tabela de atividade, a página mostra
 * sempre a mesma corrida, independente do id da rota. O `MarcadorDinamico`
 * mantém a rota honesta como dinâmica — é o que ela vai ser de fato.
 */
export default function Atividade() {
  const atividade = ULTIMA_ATIVIDADE;

  return (
    <div className="flex flex-col">
      <header className="flex items-center gap-3 px-[22px] pt-[18px]">
        <Link
          href="/hoje"
          aria-label="Voltar para Hoje"
          className="flex size-[34px] shrink-0 items-center justify-center rounded-full border border-linha bg-branco"
        >
          <IconeVoltar className="size-[15px]" />
        </Link>
        <div>
          <RotuloSecao como="p" className="text-[10.5px]">
            {atividade.cabecalho}
          </RotuloSecao>
          <h1 className="font-ui text-[24px] font-black tracking-[-0.03em]">
            Treino fechado.
          </h1>
        </div>
      </header>

      {/* Traçado em SVG puro: nenhum tile de mapa é requisitado. */}
      <div className="mx-3.5 mt-3.5 h-[186px] overflow-hidden rounded-[24px]">
        <Tracado
          pontos={atividade.tracado}
          descricao={`Traçado do treino: ${atividade.cabecalho}`}
          comGrade
          comPartida
          className="h-full"
        />
      </div>

      <div className="mx-3.5 mt-3 grid grid-cols-3 gap-2">
        <Numero rotulo="Distância" valor={formatarKm(atividade.distanciaKm)} />
        <Numero
          rotulo="Tempo"
          valor={formatarDuracao(atividade.duracaoSegundos)}
        />
        <Numero
          rotulo="Pace"
          valor={formatarPaceCurto(atividade.paceSegundosPorKm)}
        />
      </div>

      <section className="mx-3.5 mt-3 rounded-[24px] border border-linha bg-branco px-5 py-[18px]">
        <div className="flex items-baseline justify-between gap-3">
          <RotuloSecao>Tempo por zona</RotuloSecao>
          {atividade.melhor ? (
            <p className="font-ui text-[11px] font-extrabold tracking-[0.14em] uppercase text-tracado-texto">
              {atividade.melhor}
            </p>
          ) : null}
        </div>
        <BarraZonas
          fatias={atividade.zonas}
          altura="alta"
          className="mt-3"
        />
      </section>

      {atividade.recado ? (
        <section className="mx-3.5 mt-2.5 mb-5 rounded-[24px] border-[1.5px] border-tinta bg-branco px-[18px] py-4">
          <p className="flex items-center gap-[9px]">
            <IconeRecado className="size-[15px]" />
            <span className="font-ui text-[13px] font-extrabold">
              {atividade.recado.autor}
            </span>
          </p>
          <blockquote className="mt-2 font-texto text-[14px] leading-[1.6]">
            “{atividade.recado.texto}”
          </blockquote>
        </section>
      ) : null}

      <MarcadorDinamico />
    </div>
  );
}
