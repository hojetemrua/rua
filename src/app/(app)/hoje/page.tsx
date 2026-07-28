import type { Metadata } from "next";
import Link from "next/link";
import {
  IconeAssessor,
  IconeAvancar,
  IconeCorrer,
  IconeHoje as IconeCalendario,
  IconeSeta,
} from "@/componentes/base/icones";
import { BarraProgresso } from "@/componentes/base/barra-progresso";
import { PontosDaSemana } from "@/componentes/base/pontos-da-semana";
import { RotuloSecao } from "@/componentes/base/rotulo-secao";
import {
  HOJE_ISO,
  SEMANA_DO_CORREDOR,
  TREINO_DE_HOJE,
  ULTIMA_ATIVIDADE,
} from "@/lib/dados/exemplo";
import {
  formatarDiaPorExtenso,
  formatarDuracao,
  formatarKm,
  formatarPace,
  formatarVolume,
} from "@/lib/formato";

export const metadata: Metadata = { title: "Hoje" };

/**
 * Quatro alvos de toque: Bora, o cartão da última corrida, o avatar e as
 * cinco abas. Nada mais entra aqui.
 */
export default function Hoje() {
  const atividade = ULTIMA_ATIVIDADE;

  return (
    <div className="flex flex-col">
      <section className="mx-3.5 mt-[22px] rounded-[26px] border border-linha bg-branco px-5 py-[22px]">
        <p className="flex items-center gap-2 text-tinta-3">
          <IconeCalendario className="size-3.5" />
          <span className="font-ui text-[11px] font-extrabold tracking-[0.14em] uppercase">
            {formatarDiaPorExtenso(HOJE_ISO)}
          </span>
        </p>

        <h1
          className="mt-2.5 font-ui text-[40px] leading-[0.98] font-black tracking-[-0.035em]"
          style={{ fontStretch: "92%" }}
        >
          {TREINO_DE_HOJE.nome}
        </h1>

        <p className="mt-2.5 font-texto text-[15px] leading-[1.55] text-tinta-2">
          {TREINO_DE_HOJE.descricao}
        </p>

        {TREINO_DE_HOJE.publicadoPor ? (
          <>
            <div className="mt-4 mb-3 h-px bg-linha" />
            <p className="flex items-center gap-2 font-texto text-[13px] text-tinta-3">
              <IconeAssessor className="size-3.5" />
              Publicado por {TREINO_DE_HOJE.publicadoPor}
            </p>
          </>
        ) : null}
      </section>

      <div className="px-3.5 pt-4">
        <Link
          href="/correr"
          className="flex h-24 items-center justify-center gap-3.5 rounded-[26px] bg-tinta font-ui text-[34px] font-black tracking-[-0.02em] text-papel transition-colors hover:bg-tinta-2"
        >
          Bora.
          <IconeSeta className="size-[26px]" traco={2.6} />
        </Link>
      </div>

      <section className="mx-3.5 mt-4 rounded-[26px] border border-linha bg-branco p-5">
        <div className="flex items-baseline justify-between">
          <RotuloSecao>Sua semana</RotuloSecao>
          <p className="numeros text-[13px] font-extrabold">
            {formatarVolume(SEMANA_DO_CORREDOR.feitoKm)} /{" "}
            {SEMANA_DO_CORREDOR.metaKm} km
          </p>
        </div>

        <BarraProgresso
          valor={SEMANA_DO_CORREDOR.feitoKm}
          total={SEMANA_DO_CORREDOR.metaKm}
          descricao={`${formatarVolume(SEMANA_DO_CORREDOR.feitoKm)} de ${SEMANA_DO_CORREDOR.metaKm} quilômetros na semana`}
          className="mt-3 h-[9px]"
        />

        <PontosDaSemana
          dias={SEMANA_DO_CORREDOR.dias}
          comLetras
          className="mt-3.5"
        />
      </section>

      <Link
        href={`/atividade/${atividade.id}`}
        className="mx-3.5 mt-2.5 flex items-center gap-3.5 rounded-[26px] border border-linha bg-branco px-5 py-[18px]"
      >
        <span className="flex size-[42px] shrink-0 items-center justify-center rounded-pequeno bg-linha-2">
          <IconeCorrer className="size-5" />
        </span>
        <span className="flex-1">
          <span className="block font-ui text-[15px] font-extrabold">
            Última corrida · sexta
          </span>
          <span className="numeros block text-[13px] font-bold text-tinta-3">
            {formatarKm(atividade.distanciaKm)} km ·{" "}
            {formatarDuracao(atividade.duracaoSegundos)} ·{" "}
            {formatarPace(atividade.paceSegundosPorKm)}/km
          </span>
        </span>
        <IconeAvancar className="size-[17px] text-tinta-3" />
      </Link>
    </div>
  );
}
