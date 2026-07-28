import { ICONES } from "@/componentes/base/icones";
import { QUEM_CORRE_NELA } from "@/conteudo/home";
import { Fio, Secao, TituloSecao } from "./secao";

export function QuemCorreNela() {
  return (
    <Secao id="quem-corre-nela">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <TituloSecao>{QUEM_CORRE_NELA.titulo}</TituloSecao>
        <p className="max-w-[38ch] font-texto text-[15px] leading-[1.6] text-tinta-3">
          {QUEM_CORRE_NELA.subtitulo}
        </p>
      </div>

      <Fio className="mt-7" />

      <ul className="mt-7 grid gap-3.5 md:grid-cols-3">
        {QUEM_CORRE_NELA.blocos.map((bloco) => {
          const Icone = ICONES[bloco.icone];
          return (
            <li
              key={bloco.titulo}
              className="rounded-cartao-home border border-linha bg-branco p-[30px] shadow-cartao"
            >
              <span className="flex size-[52px] items-center justify-center rounded-pequeno-home bg-tinta text-papel">
                <Icone className="size-[26px]" />
              </span>

              <h3 className="mt-5 font-ui text-[30px] font-black tracking-[-0.025em]">
                {bloco.titulo}
              </h3>

              <Fio className="my-4" />

              <p className="font-texto text-[15.5px] leading-[1.62] text-tinta-2">
                {bloco.texto}
              </p>
            </li>
          );
        })}
      </ul>
    </Secao>
  );
}
