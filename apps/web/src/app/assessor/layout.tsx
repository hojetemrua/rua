import type { Metadata } from "next";
import { Suspense } from "react";
import { LateralDoAssessor } from "@/componentes/navegacao/lateral-assessor";
import { LateralDoAssessorAtiva } from "@/componentes/navegacao/lateral-assessor-ativa";

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
 * Casca da plataforma do assessor.
 *
 * Pensada para desktop, onde a turma inteira cabe na tela — mas empilha em
 * telas estreitas em vez de forçar rolagem horizontal, porque assessor também
 * abre o painel no celular entre um treino e outro.
 */
export default function LayoutDoAssessor({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col lg:flex-row">
      <Suspense fallback={<LateralDoAssessor caminho={null} />}>
        <LateralDoAssessorAtiva />
      </Suspense>

      <main className="min-w-0 flex-1 px-5 py-7 sm:px-[30px]">{children}</main>
    </div>
  );
}
