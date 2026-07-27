import type { Metadata } from "next";
import { EmConstrucao } from "@/componentes/base/em-construcao";

export const metadata: Metadata = { title: "Plano" };

export default function Pagina() {
  return (
    <EmConstrucao
      titulo="Plano"
      fase={6}
      descricao="A semana previsto × realizado, dia a dia, entra na fase 6. O estado perdido é sempre “Não rolou. Sem problema.” — nunca cobrança."
    />
  );
}
