import Link from "next/link";
import {
  IconeComunidade,
  IconeGravar,
  IconeHoje,
  IconePerfil,
  IconePlano,
} from "@/componentes/base/icones";
import { cn } from "@/lib/cn";

/**
 * Cinco abas de mesmo peso. "Correr" é aba, não botão flutuante — a gravação
 * não é mais importante que o resto, e nenhuma tela passa de sete alvos.
 */
export const ABAS = [
  { href: "/hoje", rotulo: "Hoje", Icone: IconeHoje },
  { href: "/plano", rotulo: "Plano", Icone: IconePlano },
  { href: "/correr", rotulo: "Correr", Icone: IconeGravar },
  { href: "/comunidade", rotulo: "Comunidade", Icone: IconeComunidade },
  { href: "/perfil", rotulo: "Perfil", Icone: IconePerfil },
] as const;

/**
 * Desenho da barra, sem nenhum gancho.
 *
 * Fica separado de `BarraAbas` porque o caminho da URL só existe em tempo de
 * requisição: em rota dinâmica, `usePathname` não pode ser prerenderizado.
 * Assim a mesma marcação vai para a casca estática com `caminho = null` e
 * depois recebe o destaque da aba ativa — sem pulo de layout no meio.
 */
export function ListaDeAbas({ caminho }: { caminho: string | null }) {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-10 border-t border-linha bg-branco"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex w-full max-w-[520px] items-stretch px-0.5">
        {ABAS.map((aba) => {
          const ativa =
            caminho !== null &&
            (caminho === aba.href || caminho.startsWith(`${aba.href}/`));

          return (
            <li key={aba.href} className="flex-1">
              <Link
                href={aba.href}
                aria-current={ativa ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center gap-[5px] pt-3 pb-5",
                  ativa ? "text-tinta" : "text-tinta-3",
                )}
              >
                <aba.Icone
                  className="size-5"
                  traco={ativa ? 2.2 : 2}
                />
                <span
                  className={cn(
                    "font-ui text-[10.5px] leading-none",
                    ativa ? "font-extrabold" : "font-bold",
                  )}
                >
                  {aba.rotulo}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
