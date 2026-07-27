import type { Metadata } from "next";
import { EmConstrucao } from "@/componentes/base/em-construcao";

export const metadata: Metadata = { title: "Biblioteca" };

export default function Pagina() {
  return (
    <EmConstrucao
      titulo="Biblioteca"
      fase={7}
      descricao="A biblioteca de treinos entra na fase 7. Publicar para a turma ou para todos custa zero nas duas pontas."
    />
  );
}
