import type { Metadata } from "next";
import { EmConstrucao } from "@/componentes/base/em-construcao";
import { MarcadorDinamico } from "@/componentes/base/marcador-dinamico";

export const metadata: Metadata = { title: "Atividade" };

export default function Pagina() {
  return (
    <>
      <EmConstrucao
        titulo="Atividade"
        fase={4}
        descricao="O treino fechado — três números, traçado, tempo por zona, selo do melhor km e o recado do assessor — entra na fase 4."
      />
      {/* Rota dinâmica: ver o comentário em MarcadorDinamico. */}
      <MarcadorDinamico />
    </>
  );
}
