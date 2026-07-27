import { Cartao } from "@/componentes/base/cartao";
import { COMO_FUNCIONA } from "@/conteudo/home";
import { Secao, TituloSecao } from "./secao";

export function ComoFunciona() {
  return (
    <Secao id="como-funciona">
      <TituloSecao>{COMO_FUNCIONA.titulo}</TituloSecao>

      <ol className="mt-10 grid gap-4 sm:grid-cols-3">
        {COMO_FUNCIONA.passos.map((passo) => (
          <Cartao key={passo.numero} como="li" home className="p-6">
            <p className="numeros text-[13px] font-extrabold text-tinta-3">
              {passo.numero}
            </p>
            <h3 className="mt-4 font-ui text-[20px] font-extrabold tracking-tight text-tinta">
              {passo.titulo}
            </h3>
            <p className="mt-3 font-texto text-[15px] leading-relaxed text-tinta-2">
              {passo.texto}
            </p>
          </Cartao>
        ))}
      </ol>
    </Secao>
  );
}
