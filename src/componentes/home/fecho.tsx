import { FECHO } from "@/conteudo/home";
import { FormularioListaEspera } from "./formulario-lista-espera";
import { Secao, TituloSecao } from "./secao";

export function Fecho() {
  return (
    <Secao id="me-avisa">
      <TituloSecao>{FECHO.titulo}</TituloSecao>

      <p className="mt-4 max-w-[34rem] font-texto text-[17px] leading-relaxed text-tinta-2">
        {FECHO.texto}
      </p>

      <FormularioListaEspera
        origem="fecho"
        id="fecho"
        className="mt-8 max-w-[30rem]"
      />
    </Secao>
  );
}
