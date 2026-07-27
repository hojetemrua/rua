import Link from "next/link";
import { MarcaRua } from "@/componentes/base/marca";
import { RotuloSecao } from "@/componentes/base/rotulo-secao";

/**
 * Casca da plataforma do assessor. Três níveis e nada mais: Turma → Atleta →
 * Biblioteca. Atleta se alcança pela Turma, por isso não está na navegação.
 *
 * Pensada para desktop, mas precisa continuar utilizável em 360px — daí a
 * navegação empilhar acima do conteúdo abaixo de `lg`.
 */
const SECOES = [
  { href: "/assessor/turma", rotulo: "Turma" },
  { href: "/assessor/biblioteca", rotulo: "Biblioteca" },
] as const;

export default function LayoutDoAssessor({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-linha bg-papel">
        <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-center justify-between gap-4 px-6 py-5 sm:px-8">
          <div className="flex items-center gap-4">
            <MarcaRua />
            <RotuloSecao como="p">Painel do assessor</RotuloSecao>
          </div>

          <nav aria-label="Seções do painel">
            <ul className="flex items-center gap-6">
              {SECOES.map((secao) => (
                <li key={secao.href}>
                  <Link
                    href={secao.href}
                    className="font-ui text-[14px] font-medium text-tinta-2 hover:text-tinta"
                  >
                    {secao.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1180px] flex-1 px-6 py-10 sm:px-8">
        {children}
      </main>
    </div>
  );
}
