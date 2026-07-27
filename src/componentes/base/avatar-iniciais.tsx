import { cn } from "@/lib/cn";

const TAMANHOS = {
  p: "size-8 text-[11px]",
  m: "size-10 text-[13px]",
  g: "size-14 text-[18px]",
} as const;

type AvatarIniciaisProps = {
  nome: string;
  tamanho?: keyof typeof TAMANHOS;
  className?: string;
};

/** "Camila Ferraz" → "CF" */
export function iniciaisDe(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  const primeira = partes[0]![0] ?? "";
  const ultima = partes.length > 1 ? (partes.at(-1)![0] ?? "") : "";
  return (primeira + ultima).toUpperCase();
}

export function AvatarIniciais({
  nome,
  tamanho = "m",
  className,
}: AvatarIniciaisProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border border-linha bg-papel font-ui font-semibold tracking-wide text-tinta-2",
        TAMANHOS[tamanho],
        className,
      )}
      aria-hidden="true"
    >
      {iniciaisDe(nome)}
    </span>
  );
}
