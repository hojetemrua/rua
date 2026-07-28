import { FECHO } from "@/conteudo/home";
import { Secao } from "./secao";
import { FormularioListaEspera } from "./formulario-lista-espera";

export function Fecho() {
  return (
    <Secao id="me-avisa">
      <div className="rounded-bloco border border-linha bg-branco px-7 py-14 shadow-cartao sm:px-12">
        <div className="flex flex-wrap items-center justify-between gap-10">
          <div>
            <p
              className="font-ui text-[clamp(34px,4vw,52px)] leading-[0.94] font-black tracking-[-0.04em]"
              style={{ fontStretch: "94%" }}
            >
              {FECHO.titulo}
            </p>
            <p className="mt-3 max-w-[44ch] font-texto text-[16.5px] leading-[1.6] text-tinta-2">
              {FECHO.texto}
            </p>
          </div>

          {/*
            O protótipo traz um botão que rola de volta ao campo do herói.
            Aqui o formulário é repetido: quem chegou ao fim da página se
            inscreve sem ter que subir de novo, e sem JavaScript no meio.
          */}
          <FormularioListaEspera
            origem="fecho"
            id="fecho"
            className="w-full max-w-[520px]"
          />
        </div>
      </div>
    </Secao>
  );
}
