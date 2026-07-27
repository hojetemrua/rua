import type { Metadata } from "next";
import { EmConstrucao } from "@/componentes/base/em-construcao";
import { MarcadorDinamico } from "@/componentes/base/marcador-dinamico";

export const metadata: Metadata = { title: "Atleta" };

export default function Pagina() {
  return (
    <>
      <EmConstrucao
        titulo="Atleta"
        fase={7}
        descricao="A ficha do atleta — quatro números, últimas atividades, volume em 8 semanas, semana publicada e recado no treino — entra na fase 7."
      />
      {/* Rota dinâmica: ver o comentário em MarcadorDinamico. */}
      <MarcadorDinamico />
    </>
  );
}
