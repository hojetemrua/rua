import type { Metadata } from "next";
import { EmConstrucao } from "@/componentes/base/em-construcao";

export const metadata: Metadata = { title: "Turma" };

export default function Pagina() {
  return (
    <EmConstrucao
      titulo="Turma"
      fase={7}
      descricao="A tabela da turma, o bloco QUEM AINDA NÃO APARECEU e o PUBLICAR NA SEMANA entram na fase 7. Sem ranking de atleta e sem alerta vermelho."
    />
  );
}
