import { RotuloSecao } from "@/componentes/base/rotulo-secao";
import { POR_QUE_GRATUITO } from "@/conteudo/home";
import { Secao, TituloSecao } from "./secao";

export function PorQueGratuito() {
  return (
    <Secao id="por-que-gratuito">
      <RotuloSecao como="p">{POR_QUE_GRATUITO.rotulo}</RotuloSecao>

      <TituloSecao className="mt-5 max-w-[36rem]">
        {POR_QUE_GRATUITO.titulo}
      </TituloSecao>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
        <div>
          <p className="max-w-[36rem] font-texto text-[17px] leading-relaxed text-tinta-2">
            {POR_QUE_GRATUITO.origem}
          </p>
          <p className="mt-5 font-ui text-[14px] font-semibold text-tinta">
            {POR_QUE_GRATUITO.assinatura}
          </p>
        </div>

        <ul className="flex flex-col gap-4 border-t border-linha pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
          {POR_QUE_GRATUITO.marcadores.map((marcador) => (
            <li key={marcador} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2 size-1.5 shrink-0 rounded-full bg-tinta"
              />
              <p className="font-texto text-[15px] leading-relaxed text-tinta-2">
                {marcador}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Secao>
  );
}
