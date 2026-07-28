import type { Metadata } from "next";
import Link from "next/link";
import {
  IconeBpm,
  IconeCorredor,
  IconeCorrer,
  IconeEncerrar,
  IconePausar,
  IconeSubida,
} from "@/componentes/base/icones";
import { GRAVACAO, ULTIMA_ATIVIDADE } from "@/lib/dados/exemplo";
import { formatarDuracao, formatarKm, formatarPace } from "@/lib/formato";
import { zona } from "@/lib/zonas";

export const metadata: Metadata = { title: "Correr" };

function Caixa({
  rotulo,
  valor,
  apoio,
  Icone,
  className,
}: {
  rotulo: string;
  valor: string;
  apoio?: string;
  Icone?: (p: { className?: string }) => React.ReactElement;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[18px] border-2 border-tinta p-3.5 ${className ?? ""}`}
    >
      <p className="flex items-center gap-1.5 font-ui text-[12.5px] font-extrabold tracking-[0.05em] sm:text-[14px]">
        {Icone ? <Icone className="size-[15px]" /> : null}
        {rotulo}
      </p>
      <p className="numeros mt-1 text-[34px] leading-none font-black tracking-[-0.03em]">
        {valor}
      </p>
      {apoio ? (
        <p className="mt-0.5 font-ui text-[11.5px] font-extrabold opacity-66">
          {apoio}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Tela de gravação.
 *
 * Contraste máximo e nada piscando: preto sobre branco puro, sem o papel do
 * resto do app. É a única tela pensada para ser lida de relance, no sol, com
 * o braço em movimento — por isso os números são maiores do que o bom senso
 * de interface normalmente permitiria.
 *
 * Estática por enquanto. A captura de GPS, a fila offline e o wake lock são
 * a fase 5; aqui está o desenho e a hierarquia que ela vai preencher.
 */
export default function Correr() {
  const z = zona(GRAVACAO.zonaAgora);

  return (
    <div className="flex min-h-[calc(100dvh-8rem)] flex-col bg-branco">
      <p className="flex items-center gap-[9px] px-[22px] pt-[18px]">
        <IconeCorrer className="size-[19px]" traco={2.4} />
        <span className="font-ui text-[14px] font-extrabold tracking-[0.08em] uppercase">
          Gravando · {GRAVACAO.nomeDoTreino}
        </span>
      </p>

      <div className="px-5 pt-3.5">
        <p className="numeros text-[112px] leading-[0.82] font-black tracking-[-0.05em]">
          {formatarKm(GRAVACAO.distanciaKm)}
        </p>
        <p className="mt-1 font-ui text-[21px] font-extrabold tracking-[0.06em]">
          QUILÔMETROS
        </p>
      </div>

      <div className="mx-5 mt-[18px] grid grid-cols-2 gap-2.5">
        <Caixa
          rotulo="TEMPO"
          valor={formatarDuracao(GRAVACAO.duracaoSegundos)}
          className="[&_p:nth-child(2)]:text-[44px]"
        />
        <Caixa
          rotulo="PACE"
          valor={formatarPace(GRAVACAO.paceSegundosPorKm)}
          className="[&_p:nth-child(2)]:text-[44px]"
        />
      </div>

      {/*
        A zona é o único bloco colorido da tela: a cor aqui é o dado. O rótulo
        textual vai junto, para quem não distingue as cores.
      */}
      <div
        className={`mx-5 mt-2.5 flex items-center justify-between rounded-[20px] border-2 border-tinta p-4 ${z.fundo}`}
      >
        <div>
          <p className="font-ui text-[14px] font-extrabold tracking-[0.06em]">
            ZONA AGORA
          </p>
          <p className="numeros mt-0.5 text-[38px] leading-none font-black">
            {z.sigla}{" "}
            <span className="font-ui text-[20px] font-extrabold">
              {z.rotulo}
            </span>
          </p>
        </div>
        <div
          aria-hidden="true"
          className="flex flex-col items-end gap-[5px]"
        >
          {[38, 46, 54, 46, 38].map((largura, i) => (
            <span
              key={largura + String(i)}
              className="rounded-full bg-tinta"
              style={{
                width: largura,
                height: i === 2 ? 9 : 7,
                opacity: i === 2 ? 1 : 0.28,
              }}
            />
          ))}
        </div>
      </div>

      <div className="mx-5 mt-2.5 grid grid-cols-3 gap-2.5">
        <Caixa
          rotulo="BPM"
          valor={String(GRAVACAO.bpm)}
          apoio={`${GRAVACAO.percentualMaximo}% MÁX`}
          Icone={IconeBpm}
        />
        <Caixa
          rotulo="CAD"
          valor={String(GRAVACAO.cadencia)}
          apoio="PASSOS/MIN"
          Icone={IconeCorredor}
        />
        <Caixa
          rotulo="SUBIDA"
          valor={String(GRAVACAO.subidaMetros)}
          apoio="METROS"
          Icone={IconeSubida}
        />
      </div>

      <div className="mx-5 mt-2.5 flex items-center justify-between gap-3 border-t-2 border-tinta pt-3">
        <p className="font-ui text-[14px] font-extrabold tracking-[0.06em]">
          ÚLTIMO KM
        </p>
        <p className="numeros text-[24px] font-black">
          {GRAVACAO.ultimoKm.pace} · {GRAVACAO.ultimoKm.bpm} bpm
        </p>
      </div>

      <div className="mt-auto flex gap-3 px-5 pt-[18px] pb-[22px]">
        <button
          type="button"
          className="flex h-20 flex-1 items-center justify-center gap-2.5 rounded-[22px] border-[3px] border-tinta font-ui text-[22px] font-black"
        >
          <IconePausar className="size-[18px]" />
          Pausar
        </button>
        <Link
          href={`/atividade/${ULTIMA_ATIVIDADE.id}`}
          className="flex h-20 flex-1 items-center justify-center gap-2.5 rounded-[22px] bg-tinta font-ui text-[22px] font-black text-branco"
        >
          <IconeEncerrar className="size-[18px]" />
          Encerrar
        </Link>
      </div>
    </div>
  );
}
