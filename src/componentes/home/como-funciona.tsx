import { ICONES } from "@/componentes/base/icones";
import { COMO_FUNCIONA } from "@/conteudo/home";
import { Fio, Secao, TituloSecao } from "./secao";

export function ComoFunciona() {
  return (
    <Secao id="como-funciona">
      <TituloSecao>{COMO_FUNCIONA.titulo}</TituloSecao>

      <Fio className="mt-7" />

      <ol className="mt-7 grid gap-3.5 md:grid-cols-3">
        {COMO_FUNCIONA.passos.map((passo) => {
          const Icone = ICONES[passo.icone];
          return (
            <li
              key={passo.numero}
              className="rounded-cartao-home border border-linha bg-branco p-[30px]"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-[52px] items-center justify-center rounded-pequeno-home border-[1.5px] border-linha">
                  <Icone className="size-[26px]" />
                </span>
                <span className="numeros text-[15px] font-black">
                  {passo.numero}
                </span>
              </div>

              <h3 className="mt-5 font-ui text-[28px] font-black tracking-[-0.025em]">
                {passo.titulo}
              </h3>

              <p className="mt-2 font-texto text-[15px] leading-[1.6] text-tinta-2">
                {passo.texto}
              </p>
            </li>
          );
        })}
      </ol>
    </Secao>
  );
}
