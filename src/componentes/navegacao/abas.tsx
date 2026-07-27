import Link from "next/link";
import {
  IconeComunidade,
  IconeCorrer,
  IconeHoje,
  IconePerfil,
  IconePlano,
} from "@/componentes/base/icones";
import { cn } from "@/lib/cn";

/**
 * Cinco abas de mesmo peso. "Correr" é aba, não botão flutuante — e Perfil é
 * aba, não só o avatar do topo.
 */
export const ABAS = [
  { href: "/hoje", rotulo: "Hoje", Icone: IconeHoje },
  { href: "/plano", rotulo: "Plano", Icone: IconePlano },
  { href: "/correr", rotulo: "Correr", Icone: IconeCorrer },
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
      <ul className="mx-auto flex w-full max-w-[520px] items-stretch">
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
                  "flex h-16 flex-col items-center justify-center gap-1.5",
                  ativa ? "text-tinta" : "text-tinta-3",
                )}
              >
                <aba.Icone className="size-6" />
                <span
                  className={cn(
                    "font-ui text-[11px] leading-none",
                    ativa ? "font-semibold" : "font-medium",
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
