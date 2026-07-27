import { cn } from "@/lib/cn";

type CartaoProps = {
  children: React.ReactNode;
  className?: string;
  /** Raio de 24px em vez de 22px — a home usa a variante maior. */
  home?: boolean;
  como?: "div" | "article" | "section" | "li";
};

/**
 * Superfície elevada: branco sobre papel, borda de 1px.
 * Sem sombra e sem gradiente — a elevação é a borda.
 */
export function Cartao({
  children,
  className,
  home = false,
  como: Como = "div",
}: CartaoProps) {
  return (
    <Como
      className={cn(
        "border border-linha bg-branco",
        home ? "rounded-cartao-home" : "rounded-cartao",
        className,
      )}
    >
      {children}
    </Como>
  );
}

/** Divisor interno de cartão. */
export function DivisorInterno({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-linha-2", className)} />;
}
