import { cn } from "@/lib/cn";

const TAMANHOS = {
  /** Tela de gravação: legível no sol, de braço estendido. */
  gigante: "text-[92px] leading-[0.82] sm:text-[112px]",
  /** Números de destaque em cartão. */
  grande: "text-[44px] leading-[0.9]",
  /** Grade de métricas. */
  medio: "text-[26px] leading-none",
} as const;

type NumeroHeroiProps = {
  /** Já formatado em pt-BR. Este componente não formata nada. */
  valor: string;
  rotulo?: string;
  sufixo?: string;
  tamanho?: keyof typeof TAMANHOS;
  className?: string;
};

/**
 * Número em Overpass 900 com tabular-nums, acima ou abaixo do rótulo.
 * O valor entra já formatado — ver src/lib/formato.ts.
 */
export function NumeroHeroi({
  valor,
  rotulo,
  sufixo,
  tamanho = "grande",
  className,
}: NumeroHeroiProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className={cn("numeros font-black text-tinta", TAMANHOS[tamanho])}>
        {valor}
        {sufixo ? (
          <span className="ml-1 align-baseline text-[0.4em] font-semibold text-tinta-3">
            {sufixo}
          </span>
        ) : null}
      </p>
      {rotulo ? <p className="rotulo text-tinta-3">{rotulo}</p> : null}
    </div>
  );
}
