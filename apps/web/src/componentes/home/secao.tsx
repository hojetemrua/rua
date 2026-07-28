import { cn } from "@/lib/cn";

/** Medida e respiro comuns a todas as seções da home. */
export function Secao({
  children,
  id,
  className,
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      // scroll-mt compensa o cabeçalho fixo quando a âncora é usada.
      className={cn("scroll-mt-24 px-6 pt-24 sm:px-10", className)}
    >
      <div className="mx-auto w-full max-w-[1240px]">{children}</div>
    </section>
  );
}

/**
 * Título de seção: Archivo 900, largura 94% e espacejamento fechado.
 * `font-stretch` depende do eixo wdth carregado no layout raiz.
 */
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
        "m-0 font-ui text-[clamp(36px,4.2vw,56px)] leading-[0.94] font-black tracking-[-0.035em]",
        className,
      )}
      style={{ fontStretch: "94%" }}
    >
      {children}
    </h2>
  );
}

/** Fio de 1px que separa cabeçalho de seção do conteúdo. */
export function Fio({ className }: { className?: string }) {
  return <div className={cn("h-px bg-linha", className)} />;
}
