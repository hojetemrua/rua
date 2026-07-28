import Image from "next/image";
import Link from "next/link";

/**
 * Assinatura da marca: o logotipo em curvas de /public/marca/rua.svg.
 *
 * O arquivo é carregado, e não embutido neste componente, de propósito. O
 * logotipo deriva de fonte licenciada e está fora da AGPL do código
 * (ver TRADEMARK.md); embutir os vetores aqui colocaria a marca sob a licença
 * do código, que é justamente o que a política separa.
 *
 * `unoptimized` porque o otimizador do Next recusa SVG por padrão — e um SVG
 * de 1 KB não tem o que otimizar.
 */

const PROPORCAO = 1772.84 / 657.74;

export function MarcaRua({
  className,
  altura = 20,
  como = "link",
}: {
  className?: string;
  /** Altura em pixels; a largura acompanha a proporção do logotipo. */
  altura?: number;
  como?: "link" | "texto";
}) {
  const largura = Math.round(altura * PROPORCAO);

  if (como === "texto") {
    return (
      <Image
        src="/marca/rua.svg"
        alt="Rua"
        width={largura}
        height={altura}
        unoptimized
        className={className}
      />
    );
  }

  return (
    <Link href="/" aria-label="Rua — página inicial" className="inline-flex">
      <Image
        src="/marca/rua.svg"
        // Decorativa: quem nomeia o destino é o aria-label do link.
        alt=""
        width={largura}
        height={altura}
        unoptimized
        priority
        className={className}
      />
    </Link>
  );
}
