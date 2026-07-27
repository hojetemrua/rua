import { cn } from "@/lib/cn";

/**
 * Quatro estados, sempre monocromáticos: cor é dado, e a semana de um atleta
 * não é dado colorido. "Não rolou" não é falha e por isso não tem alerta.
 */
export type EstadoDoDia = "feito" | "hoje" | "nao-rolou" | "previsto";

const APARENCIA: Record<EstadoDoDia, { classe: string; descricao: string }> = {
  feito: { classe: "bg-tinta", descricao: "feito" },
  hoje: { classe: "border-2 border-tinta bg-branco", descricao: "hoje" },
  "nao-rolou": {
    classe: "border border-tinta-3 bg-branco",
    descricao: "não rolou",
  },
  previsto: { classe: "bg-linha", descricao: "previsto" },
};

export const SIGLAS_DA_SEMANA = [
  "S",
  "T",
  "Q",
  "Q",
  "S",
  "S",
  "D",
] as const;

/** Nomes completos para leitor de tela. A semana começa na segunda. */
const NOMES_DA_SEMANA = [
  "segunda",
  "terça",
  "quarta",
  "quinta",
  "sexta",
  "sábado",
  "domingo",
] as const;

type PontosDaSemanaProps = {
  /** Sete estados, de segunda a domingo. */
  dias: EstadoDoDia[];
  className?: string;
};

export function PontosDaSemana({ dias, className }: PontosDaSemanaProps) {
  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {dias.slice(0, 7).map((estado, indice) => {
        const aparencia = APARENCIA[estado];
        return (
          <li key={NOMES_DA_SEMANA[indice]} className="flex">
            <span
              className={cn("size-[9px] rounded-full", aparencia.classe)}
              title={`${NOMES_DA_SEMANA[indice]}: ${aparencia.descricao}`}
            />
            <span className="sr-only">
              {NOMES_DA_SEMANA[indice]}: {aparencia.descricao}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** Cabeçalho S·T·Q·Q·S·S·D alinhado com os pontos. */
export function CabecalhoDaSemana({ className }: { className?: string }) {
  return (
    <ul className={cn("flex items-center gap-2", className)} aria-hidden="true">
      {SIGLAS_DA_SEMANA.map((sigla, indice) => (
        <li
          key={`${sigla}-${indice}`}
          className="rotulo w-[9px] text-center text-tinta-3"
        >
          {sigla}
        </li>
      ))}
    </ul>
  );
}
