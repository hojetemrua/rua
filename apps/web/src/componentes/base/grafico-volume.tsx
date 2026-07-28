import { cn } from "@/lib/cn";
import { formatarVolume } from "@/lib/formato";

export type SemanaDeVolume = {
  /** Rótulo curto da semana, ex.: "20/7". */
  rotulo: string;
  km: number;
  /**
   * `atual` em tinta, `recente` em tinta-2, `antigo` em linha. O gradiente de
   * tom substitui legenda: quanto mais recente, mais escuro.
   */
  destaque: "antigo" | "recente" | "atual";
};

const TOM = {
  antigo: "bg-linha",
  recente: "bg-tinta-2",
  atual: "bg-tinta",
} as const;

type GraficoVolumeProps = {
  semanas: readonly SemanaDeVolume[];
  /** Altura da área de barras. */
  altura?: number;
  className?: string;
};

/**
 * VOLUME · 8 SEMANAS — barras em div, sem biblioteca de gráfico.
 * Não existe meta anual nem medalha: o gráfico mostra o que houve, só isso.
 */
export function GraficoVolume8Semanas({
  semanas,
  altura = 74,
  className,
}: GraficoVolumeProps) {
  if (semanas.length === 0) return null;

  const maximo = Math.max(...semanas.map((s) => s.km), 1);
  const resumo = semanas
    .map((s) => `${s.rotulo}: ${formatarVolume(s.km)} km`)
    .join("; ");

  return (
    <div
      role="img"
      aria-label={`Volume por semana. ${resumo}.`}
      className={cn("flex items-end gap-1.5", className)}
      style={{ height: altura }}
    >
      {semanas.map((semana, indice) => (
        <div
          key={`${semana.rotulo}-${indice}`}
          className={cn("flex-1 rounded-md", TOM[semana.destaque])}
          // Mínimo de 6% para uma semana fraca não sumir da linha de base.
          style={{ height: `${Math.max(6, (semana.km / maximo) * 100)}%` }}
        />
      ))}
    </div>
  );
}
