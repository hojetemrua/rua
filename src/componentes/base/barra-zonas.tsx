import { cn } from "@/lib/cn";
import { formatarDuracao } from "@/lib/formato";
import { zona, type NumeroDeZona } from "@/lib/zonas";

export type SegmentoDeZona = {
  zona: NumeroDeZona;
  segundos: number;
};

type BarraZonasProps = {
  segmentos: SegmentoDeZona[];
  className?: string;
};

/**
 * TEMPO POR ZONA: uma barra segmentada nas cores funcionais, com legenda
 * textual embaixo. A cor nunca carrega a informação sozinha.
 */
export function BarraZonas({ segmentos, className }: BarraZonasProps) {
  const total = segmentos.reduce((soma, s) => soma + s.segundos, 0);
  if (total <= 0) return null;

  const usados = segmentos.filter((s) => s.segundos > 0);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex h-3 w-full overflow-hidden rounded-full">
        {usados.map((segmento) => (
          <div
            key={segmento.zona}
            className={zona(segmento.zona).fundo}
            style={{ width: `${(segmento.segundos / total) * 100}%` }}
          />
        ))}
      </div>

      <dl className="flex flex-wrap gap-x-5 gap-y-2">
        {usados.map((segmento) => {
          const z = zona(segmento.zona);
          return (
            <div key={segmento.zona} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={cn("size-2 shrink-0 rounded-full", z.fundo)}
              />
              <dt className="rotulo text-tinta-3">
                {z.sigla} {z.rotulo}
              </dt>
              <dd className="numeros text-[13px] font-semibold text-tinta">
                {formatarDuracao(segmento.segundos)}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
