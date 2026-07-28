import type { Metadata } from "next";
import {
  IconeAvancar,
  IconeConfirmado,
  IconeNaoRolou,
  IconePrevisto,
  IconeVoltar,
} from "@/componentes/base/icones";
import { BarraProgresso } from "@/componentes/base/barra-progresso";
import { BarraZonas } from "@/componentes/base/barra-zonas";
import { RotuloSecao } from "@/componentes/base/rotulo-secao";
import { cn } from "@/lib/cn";
import {
  PLANO_DA_SEMANA,
  SEMANA_DO_CORREDOR,
  type DiaDoPlano,
} from "@/lib/dados/exemplo";
import { formatarVolume } from "@/lib/formato";

export const metadata: Metadata = { title: "Plano" };

/** O ícone diz o estado antes do texto — não é só a cor que informa. */
function IconeDoEstado({ estado }: { estado: DiaDoPlano["estado"] }) {
  if (estado === "feito") return <IconeConfirmado className="size-[15px]" traco={3} />;
  if (estado === "nao-rolou") return <IconeNaoRolou className="size-[15px]" />;
  return <IconePrevisto className="size-[15px]" />;
}

function LinhaDoDia({ dia }: { dia: DiaDoPlano }) {
  const naoRolou = dia.estado === "nao-rolou";
  const hoje = dia.estado === "hoje";

  return (
    <li
      className={cn(
        "flex gap-3.5 rounded-[20px] px-[18px] py-3.5",
        naoRolou && "border border-dashed border-linha bg-papel",
        hoje && "border-2 border-tinta bg-branco",
        !naoRolou && !hoje && "border border-linha bg-branco",
      )}
    >
      <div className="w-8 shrink-0">
        <p
          className={cn(
            "font-ui text-[10px] font-extrabold",
            hoje ? "text-tinta" : "text-tinta-3",
          )}
        >
          {dia.sigla}
        </p>
        <p
          className={cn(
            "numeros text-[20px] leading-none font-black",
            naoRolou && "text-tinta-3",
          )}
        >
          {dia.dia}
        </p>
      </div>

      <div className="flex-1">
        <p
          className={cn(
            "flex items-center gap-2",
            naoRolou && "text-tinta-3",
          )}
        >
          <IconeDoEstado estado={dia.estado} />
          <span
            className={cn(
              "font-ui text-[16px]",
              naoRolou ? "font-bold line-through" : "font-black",
            )}
          >
            {dia.nomeDoTreino}
          </span>
        </p>

        <p
          className={cn(
            "mt-[5px] text-[12.5px]",
            naoRolou
              ? "font-texto text-tinta-3"
              : hoje
                ? "font-texto text-tinta-2"
                : "numeros font-bold text-tinta-2",
          )}
        >
          {dia.resultado}
        </p>

        {dia.zonas ? (
          <BarraZonas fatias={dia.zonas} className="mt-2 h-2 w-32" />
        ) : null}
      </div>
    </li>
  );
}

export default function Plano() {
  const { feitos, perdidos, previstos, feitoKm, metaKm, rotulo } =
    SEMANA_DO_CORREDOR;

  return (
    <div className="flex flex-col">
      <header className="flex items-end justify-between px-[22px] pt-5">
        <div>
          <RotuloSecao como="p">{rotulo}</RotuloSecao>
          <h1
            className="mt-1.5 font-ui text-[30px] font-black tracking-[-0.03em]"
            style={{ fontStretch: "96%" }}
          >
            Seu plano
          </h1>
        </div>

        {/*
          Semana anterior e próxima. Sem estado ainda: a navegação por semana
          entra quando o plano vier do banco.
        */}
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Semana anterior"
            className="flex size-9 items-center justify-center rounded-full border border-linha bg-branco"
          >
            <IconeVoltar className="size-[15px]" />
          </button>
          <button
            type="button"
            aria-label="Próxima semana"
            className="flex size-9 items-center justify-center rounded-full border border-linha bg-branco"
          >
            <IconeAvancar className="size-[15px]" />
          </button>
        </div>
      </header>

      <section className="mx-3.5 mt-3.5 rounded-[24px] border border-linha bg-branco px-5 py-4">
        <BarraProgresso
          valor={feitoKm}
          total={metaKm}
          descricao={`${formatarVolume(feitoKm)} de ${metaKm} quilômetros na semana`}
          className="h-[9px]"
        />
        <div className="numeros mt-[11px] flex justify-between text-[12px] font-extrabold text-tinta-3">
          <span>
            {feitos} feitos · {perdidos} perdido · {previstos} previstos
          </span>
          <span className="text-tinta">
            {formatarVolume(feitoKm)} / {metaKm} km
          </span>
        </div>
      </section>

      <ul className="mx-3.5 mt-3 flex flex-col gap-2">
        {PLANO_DA_SEMANA.map((dia) => (
          <LinhaDoDia key={`${dia.sigla}-${dia.dia}`} dia={dia} />
        ))}
      </ul>
    </div>
  );
}
