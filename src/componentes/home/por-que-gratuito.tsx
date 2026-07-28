import { IconeConfirmado, IconeCorredor } from "@/componentes/base/icones";
import { POR_QUE_GRATUITO } from "@/conteudo/home";
import { Secao } from "./secao";
import { PainelSinalAberto } from "./painel-sinal-aberto";

/**
 * Único bloco escuro da home. A inversão marca a seção onde o projeto fala de
 * dinheiro — e o painel com as contas abertas vive dentro dela, não ao lado.
 */
export function PorQueGratuito() {
  return (
    <Secao id="por-que-gratuito">
      <div className="rounded-bloco bg-tinta px-7 py-14 text-papel sm:px-12">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <p className="flex items-center gap-[9px] opacity-65">
              <IconeCorredor className="size-[15px]" />
              <span className="font-ui text-[11px] font-extrabold tracking-[0.16em] uppercase">
                {POR_QUE_GRATUITO.rotulo}
              </span>
            </p>

            <h2
              className="mt-[18px] font-ui text-[clamp(38px,4.4vw,60px)] leading-[0.92] font-black tracking-[-0.04em]"
              style={{ fontStretch: "92%" }}
            >
              {POR_QUE_GRATUITO.titulo}
            </h2>

            <p className="mt-[22px] max-w-[52ch] font-texto text-[16.5px] leading-[1.68] text-pretty opacity-86">
              {POR_QUE_GRATUITO.origem}
            </p>

            <div className="mt-[30px] mb-6 h-px bg-branco/22" />

            <ul className="flex flex-col gap-3.5">
              {POR_QUE_GRATUITO.marcadores.map((marcador) => (
                <li key={marcador} className="flex items-center gap-3">
                  <IconeConfirmado className="size-[17px] shrink-0" />
                  <span className="font-texto text-[15.5px]">{marcador}</span>
                </li>
              ))}
            </ul>
          </div>

          <PainelSinalAberto />
        </div>
      </div>
    </Secao>
  );
}
