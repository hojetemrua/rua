import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Assinatura da marca.
 *
 * PROVISÓRIO: o logo definitivo é a palavra em Grama, entregue como SVG em
 * curvas em /public/marca/. Enquanto o arquivo não existir no repositório,
 * o texto abaixo faz o papel dele em Archivo 900. A fonte Grama nunca deve
 * ser embarcada no bundle.
 */
export function MarcaRua({
  className,
  como = "link",
}: {
  className?: string;
  como?: "link" | "texto";
}) {
  const marca = (
    <span
      className={cn(
        "font-ui text-[20px] leading-none font-black tracking-tight text-tinta",
        className,
      )}
    >
      rua
    </span>
  );

  if (como === "texto") return marca;

  return (
    <Link href="/" aria-label="Rua — página inicial" className="inline-flex">
      {marca}
    </Link>
  );
}
