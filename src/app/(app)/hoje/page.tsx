import type { Metadata } from "next";
import { EmConstrucao } from "@/componentes/base/em-construcao";

export const metadata: Metadata = { title: "Hoje" };

export default function Pagina() {
  return (
    <EmConstrucao
      titulo="Hoje"
      fase={4}
      descricao="O cartão do treino do dia, o botão Bora., o bloco SUA SEMANA e o cartão da última corrida entram na fase 4, junto com a leitura de dados reais."
    />
  );
}
