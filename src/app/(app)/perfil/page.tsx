import type { Metadata } from "next";
import { EmConstrucao } from "@/componentes/base/em-construcao";

export const metadata: Metadata = { title: "Perfil" };

export default function Pagina() {
  return (
    <EmConstrucao
      titulo="Perfil"
      fase={9}
      descricao="Volume em 8 semanas, constância, cartão da assessoria, exportar dados em um clique e o cartão do seu apoio entram na fase 9. O apoio mensal aparece só aqui."
    />
  );
}
