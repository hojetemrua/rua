import { cn } from "@/lib/cn";
import { formatarVolume } from "@/lib/formato";

export type SemanaDeVolume = {
  /** Rótulo curto, ex.: "21/7". */
  rotulo: string;
  km: number;
  /** A semana corrente é desenhada em tinta; as outras em linha. */
  atual?: boolean;
};

type GraficoVolumeProps = {
  semanas: SemanaDeVolume[];
  className?: string;
};

const LARGURA_BARRA = 22;
const ESPACO = 12;
const ALTURA = 96;
const BASE = 4;

/**
 * VOLUME · 8 SEMANAS — SVG puro, sem biblioteca de gráfico.
 * Semana atual em --ink, as demais em --line.
 */
export function GraficoVolume8Semanas({
  semanas,
  className,
}: GraficoVolumeProps) {
  if (semanas.length === 0) return null;

  const maximo = Math.max(...semanas.map((s) => s.km), 1);
  const largura =
    semanas.length * LARGURA_BARRA + (semanas.length - 1) * ESPACO;

  const resumo = semanas
    .map((s) => `${s.rotulo}: ${formatarVolume(s.km)} km`)
    .join("; ");

  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      <svg
        viewBox={`0 0 ${largura} ${ALTURA}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Volume por semana. ${resumo}.`}
      >
        {semanas.map((semana, indice) => {
          const util = ALTURA - BASE;
          const altura = Math.max(BASE, (semana.km / maximo) * util);
          const x = indice * (LARGURA_BARRA + ESPACO);
          return (
            <rect
              key={`${semana.rotulo}-${indice}`}
              x={x}
              y={ALTURA - altura}
              width={LARGURA_BARRA}
              height={altura}
              rx={3}
              fill={semana.atual ? "var(--ink)" : "var(--line)"}
            />
          );
        })}
      </svg>

      <ul className="flex justify-between" aria-hidden="true">
        {semanas.map((semana, indice) => (
          <li
            key={`${semana.rotulo}-${indice}`}
            className={cn(
              "numeros text-[11px] font-semibold",
              semana.atual ? "text-tinta" : "text-tinta-3",
            )}
          >
            {semana.rotulo}
          </li>
        ))}
      </ul>
    </figure>
  );
}
