import { cn } from "@/lib/cn";

/** Medida e respiro comuns a todas as seções da home. */
export function Secao({
  children,
  id,
  className,
  comBorda = true,
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
  comBorda?: boolean;
}) {
  return (
    <section
      id={id}
      // scroll-mt compensa a âncora da navegação do topo.
      className={cn(
        "scroll-mt-20 px-6 py-16 sm:px-8 sm:py-24",
        comBorda && "border-b border-linha",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-[1120px]">{children}</div>
    </section>
  );
}

/** Título de seção: Archivo 900, apertado. */
export function TituloSecao({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "font-ui text-[34px] leading-[1.02] font-black tracking-[-0.02em] text-tinta sm:text-[46px]",
        className,
      )}
    >
      {children}
    </h2>
  );
}
