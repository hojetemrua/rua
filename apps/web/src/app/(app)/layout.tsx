import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { MarcaRua } from "@/componentes/base/marca";
import { ListaDeAbas } from "@/componentes/navegacao/abas";
import { BarraAbas } from "@/componentes/navegacao/barra-abas";
import { CORREDOR } from "@/lib/dados/exemplo";
import { iniciaisDe } from "@/componentes/base/avatar-iniciais";

/**
 * Tela logada: fora do índice.
 *
 * O treino, a planilha e a ficha do atleta são dados de quem entrou, não
 * conteúdo público. Marcar `noindex` aqui vale para todas as rotas filhas e
 * é o que impede que um buscador guarde a página de alguém.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Casca do aplicativo do corredor. Mobile-first: cabeçalho enxuto, conteúdo
 * rolando e as cinco abas fixas no pé.
 *
 * O avatar no topo é a entrada do Perfil — a mesma tela que a quinta aba abre.
 * Dois caminhos para o mesmo lugar é intencional: o avatar é onde a pessoa
 * procura, a aba é onde ela acha sem procurar.
 */
export default function LayoutDoAplicativo({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-[520px] items-center justify-between px-[22px] pt-[22px]">
        <MarcaRua altura={19} />
        <Link
          href="/perfil"
          aria-label={`Perfil de ${CORREDOR.nome}`}
          className="flex size-[34px] items-center justify-center rounded-full border border-linha bg-branco font-ui text-[12px] font-extrabold"
        >
          <span aria-hidden="true">{iniciaisDe(CORREDOR.nome)}</span>
        </Link>
      </header>

      <main className="mx-auto w-full max-w-[520px] flex-1 pb-28">
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
