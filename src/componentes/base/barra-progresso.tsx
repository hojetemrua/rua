import { cn } from "@/lib/cn";

type BarraProgressoProps = {
  valor: number;
  total: number;
  /** Texto lido por leitor de tela, ex.: "18,4 de 32 quilômetros na semana". */
  descricao: string;
  className?: string;
};

/**
 * Barra de progresso em tinta sobre linha-2.
 * Usada em SUA SEMANA e no painel Sinal Aberto.
 */
export function BarraProgresso({
  valor,
  total,
  descricao,
  className,
}: BarraProgressoProps) {
  const bruto = total > 0 ? (valor / total) * 100 : 0;
  const preenchido = Math.min(100, Math.max(0, bruto));

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(bruto)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={descricao}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-linha-2", className)}
    >
      <div
        className="h-full rounded-full bg-tinta"
        style={{ width: `${preenchido}%` }}
      />
    </div>
  );
}
