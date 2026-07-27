import { Suspense } from "react";
import { ListaDeAbas } from "@/componentes/navegacao/abas";
import { BarraAbas } from "@/componentes/navegacao/barra-abas";

/**
 * Casca do aplicativo do corredor. Mobile-first: conteúdo rolando e as cinco
 * abas fixas no pé. O `pb` do conteúdo reserva a altura da barra para o último
 * elemento nunca ficar embaixo dela.
 */
export default function LayoutDoAplicativo({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-[520px] flex-1 px-5 pt-8 pb-28">
        {children}
      </main>

      {/*
        A barra inteira já vai na casca estática sem aba ativa; só o destaque
        depende da URL, que é dado de requisição em rota dinâmica.
      */}
      <Suspense fallback={<ListaDeAbas caminho={null} />}>
        <BarraAbas />
      </Suspense>
    </div>
  );
}
