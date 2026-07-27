import type { Metadata } from "next";
import { EmConstrucao } from "@/componentes/base/em-construcao";

export const metadata: Metadata = { title: "Comunidade" };

export default function Pagina() {
  return (
    <EmConstrucao
      titulo="Comunidade"
      fase={8}
      descricao="Próximos encontros e seus grupos entram na fase 8. O contador “correndo agora” fica para o fim: exige presença em tempo real, é opt-in e nunca expõe localização individual."
    />
  );
}
