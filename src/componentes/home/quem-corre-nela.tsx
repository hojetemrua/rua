import { Cartao } from "@/componentes/base/cartao";
import { QUEM_CORRE_NELA } from "@/conteudo/home";
import { Secao, TituloSecao } from "./secao";

export function QuemCorreNela() {
  return (
    <Secao id="quem-corre-nela">
      <TituloSecao>{QUEM_CORRE_NELA.titulo}</TituloSecao>

      <p className="mt-4 max-w-[38rem] font-texto text-[17px] leading-relaxed text-tinta-2">
        {QUEM_CORRE_NELA.subtitulo}
      </p>

      <ul className="mt-10 grid gap-4 sm:grid-cols-3">
        {QUEM_CORRE_NELA.blocos.map((bloco) => (
          <Cartao key={bloco.titulo} como="li" home className="p-6">
            <h3 className="font-ui text-[20px] font-extrabold tracking-tight text-tinta">
              {bloco.titulo}
            </h3>
            <p className="mt-3 font-texto text-[15px] leading-relaxed text-tinta-2">
              {bloco.texto}
            </p>
          </Cartao>
        ))}
      </ul>
    </Secao>
  );
}
