import type { Metadata } from "next";
import { EmConstrucao } from "@/componentes/base/em-construcao";

export const metadata: Metadata = { title: "Correr" };

export default function Pagina() {
  return (
    <EmConstrucao
      titulo="Correr"
      fase={5}
      descricao="A tela de gravação entra na fase 5: captura de GPS, fila offline em IndexedDB, wake lock, encerramento e resumo. Contraste altíssimo, nada piscando."
    />
  );
}
