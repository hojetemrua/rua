import Link from "next/link";
import {
  IconeBiblioteca,
  IconeComunidade,
  IconePerfil,
} from "@/componentes/base/icones";
import { AvatarIniciais } from "@/componentes/base/avatar-iniciais";
import { MarcaRua } from "@/componentes/base/marca";
import { cn } from "@/lib/cn";
import { ASSESSORIA, FICHA_DO_ATLETA } from "@/lib/dados/exemplo";

/**
 * Três níveis e nada mais: Turma → Atleta → Biblioteca.
 *
 * "Atleta" está aqui como atalho para a última ficha aberta; o caminho normal
 * continua sendo clicar numa linha da turma.
 */
export const SECOES_DO_ASSESSOR = [
  { href: "/assessor/turma", rotulo: "Turma", Icone: IconeComunidade },
  {
    href: `/assessor/atleta/${FICHA_DO_ATLETA.pessoa.id}`,
    rotulo: "Atleta",
    Icone: IconePerfil,
  },
  { href: "/assessor/biblioteca", rotulo: "Biblioteca", Icone: IconeBiblioteca },
] as const;

export function LateralDoAssessor({ caminho }: { caminho: string | null }) {
  return (
    <div className="flex shrink-0 flex-col gap-6 border-linha bg-branco px-5 py-6 lg:w-[232px] lg:border-r">
      <MarcaRua altura={20} />

      <nav aria-label="Seções do painel">
        <ul className="flex gap-1 overflow-x-auto font-ui text-[13.5px] lg:flex-col">
          {SECOES_DO_ASSESSOR.map((secao) => {
            const ativa =
              caminho !== null &&
              (caminho === secao.href ||
                caminho.startsWith(
                  `/${secao.href.split("/").slice(1, 3).join("/")}/`,
                ));

            return (
              <li key={secao.rotulo}>
                <Link
                  href={secao.href}
                  aria-current={ativa ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-[11px] rounded-[14px] px-3.5 py-[11px] whitespace-nowrap",
                    ativa
                      ? "bg-linha-2 font-extrabold text-tinta"
                      : "font-bold text-tinta-3 hover:text-tinta",
                  )}
                >
                  <secao.Icone className="size-[17px]" />
                  {secao.rotulo}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto hidden lg:block">
        <div className="mb-4 h-px bg-linha" />
        <div className="flex items-center gap-[11px]">
          <AvatarIniciais nome={ASSESSORIA.assessora.nome} tamanho="p" />
          <div>
            <p className="font-ui text-[13px] font-extrabold">
              {ASSESSORIA.assessora.nome}
            </p>
            <p className="font-texto text-[11.5px] text-tinta-3">
              {ASSESSORIA.nome} · {ASSESSORIA.atletas} atletas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
