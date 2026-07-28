import { cn } from "@/lib/cn";
import { zona, type NumeroDeZona } from "@/lib/zonas";

export type FatiaDeZona = {
  zona: NumeroDeZona;
  /** Fração do tempo total, de 0 a 1. */
  fracao: number;
};

type BarraZonasProps = {
  fatias: readonly FatiaDeZona[];
  /**
   * `fina` — tira de 8 a 10px para lista e cartão.
   * `alta` — 34px com a sigla dentro, para a tela de Atividade.
   */
  altura?: "fina" | "alta";
  className?: string;
};

/**
 * TEMPO POR ZONA.
 *
 * Aqui a cor carrega dado, então é uma das poucas partes coloridas do
 * projeto. Na variante alta a sigla vai escrita dentro da faixa; na fina, o
 * texto vive no rótulo acessível — em nenhum dos casos a cor decide sozinha.
 */
export function BarraZonas({
  fatias,
  altura = "fina",
  className,
}: BarraZonasProps) {
  const usadas = fatias.filter((f) => f.fracao > 0);
  if (usadas.length === 0) return null;

  const total = usadas.reduce((soma, f) => soma + f.fracao, 0) || 1;

  const descricao = usadas
    .map((f) => {
      const z = zona(f.zona);
      return `${z.sigla} ${z.rotulo}: ${Math.round((f.fracao / total) * 100)}%`;
    })
    .join("; ");

  return (
    <div
      role="img"
      aria-label={`Tempo por zona. ${descricao}.`}
      className={cn(
        "flex gap-[3px]",
        altura === "alta" ? "h-[34px]" : "h-2.5",
        className,
      )}
    >
      {usadas.map((fatia) => {
        const z = zona(fatia.zona);
        const largura = `${(fatia.fracao / total) * 100}%`;
        // A sigla só cabe a partir de uma fatia razoável.
        const cabeRotulo = altura === "alta" && fatia.fracao / total >= 0.12;

        return (
          <div
            key={fatia.zona}
            style={{ width: largura }}
            className={cn(
              "flex items-center justify-center",
              altura === "alta" ? "rounded-lg" : "rounded-full",
              z.fundo,
            )}
          >
            {cabeRotulo ? (
              <span
                aria-hidden="true"
                className={cn("numeros text-[12px] font-black", z.texto)}
              >
                {z.sigla}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
