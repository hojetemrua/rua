import Link from "next/link";
import { cn } from "@/lib/cn";

type Aparencia = "principal" | "secundario" | "discreto";
type Tamanho = "grande" | "medio";

const APARENCIAS: Record<Aparencia, string> = {
  // Tinta cheia sobre papel. Nenhuma sombra.
  principal:
    "bg-tinta text-papel border border-tinta hover:bg-tinta-2 hover:border-tinta-2",
  secundario:
    "bg-branco text-tinta border border-linha hover:border-tinta-3",
  discreto:
    "bg-transparent text-tinta-2 border border-transparent hover:text-tinta",
};

const TAMANHOS: Record<Tamanho, string> = {
  grande: "h-14 px-7 text-[16px]",
  medio: "h-11 px-5 text-[14px]",
};

function classesDoBotao(
  aparencia: Aparencia,
  tamanho: Tamanho,
  larguraTotal: boolean,
  className?: string,
) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-ui font-semibold transition-colors",
    "disabled:cursor-not-allowed disabled:border-linha disabled:bg-linha-2 disabled:text-tinta-3",
    APARENCIAS[aparencia],
    TAMANHOS[tamanho],
    larguraTotal && "w-full",
    className,
  );
}

type BotaoProps = React.ComponentPropsWithoutRef<"button"> & {
  aparencia?: Aparencia;
  tamanho?: Tamanho;
  larguraTotal?: boolean;
};

export function Botao({
  aparencia = "principal",
  tamanho = "medio",
  larguraTotal = false,
  className,
  type = "button",
  ...resto
}: BotaoProps) {
  return (
    <button
      type={type}
      className={classesDoBotao(aparencia, tamanho, larguraTotal, className)}
      {...resto}
    />
  );
}

type BotaoLinkProps = React.ComponentPropsWithoutRef<typeof Link> & {
  aparencia?: Aparencia;
  tamanho?: Tamanho;
  larguraTotal?: boolean;
};

export function BotaoLink({
  aparencia = "principal",
  tamanho = "medio",
  larguraTotal = false,
  className,
  ...resto
}: BotaoLinkProps) {
  return (
    <Link
      className={classesDoBotao(aparencia, tamanho, larguraTotal, className)}
      {...resto}
    />
  );
}
