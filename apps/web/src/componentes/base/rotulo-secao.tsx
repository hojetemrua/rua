import { cn } from "@/lib/cn";

type RotuloSecaoProps = {
  children: React.ReactNode;
  className?: string;
  como?: "h2" | "h3" | "h4" | "p" | "span" | "dt";
};

/**
 * Rótulo de seção: Archivo, caixa-alta, corpo pequeno, cor --ink-3.
 * Ex.: SUA SEMANA · PRÓXIMOS ENCONTROS · TEMPO POR ZONA
 */
export function RotuloSecao({
  children,
  className,
  como: Como = "h2",
}: RotuloSecaoProps) {
  return <Como className={cn("rotulo text-tinta-3", className)}>{children}</Como>;
}
