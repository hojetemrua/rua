import { cn } from "@/lib/cn";

/**
 * Quatro estados. Todos monocromáticos: a semana de alguém não é dado
 * colorido, e "não rolou" não é falha — por isso é um contorno tracejado, e
 * não um alerta.
 */
export type EstadoDoDia = "feito" | "hoje" | "nao-rolou" | "previsto";

const APARENCIA: Record<EstadoDoDia, { classe: string; descricao: string }> = {
  feito: { classe: "bg-tinta", descricao: "feito" },
  hoje: { classe: "border-[2.5px] border-tinta", descricao: "hoje" },
  "nao-rolou": {
    classe: "border-[1.5px] border-dashed border-tinta-3",
    descricao: "não rolou",
  },
  previsto: { classe: "bg-linha-2", descricao: "previsto" },
};

export const SIGLAS_DA_SEMANA = ["S", "T", "Q", "Q", "S", "S", "D"] as const;

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
  /** Mostra a inicial do dia abaixo do ponto. */
  comLetras?: boolean;
  className?: string;
};

export function PontosDaSemana({
  dias,
  comLetras = false,
  className,
}: PontosDaSemanaProps) {
  return (
    <ul
      className={cn(
        "flex items-start",
        comLetras ? "justify-between" : "gap-2",
        className,
      )}
    >
      {dias.slice(0, 7).map((estado, indice) => {
        const aparencia = APARENCIA[estado];
        const nome = NOMES_DA_SEMANA[indice];
        return (
          <li
            key={nome}
            className="flex flex-col items-center gap-[7px]"
            title={`${nome}: ${aparencia.descricao}`}
          >
            <span className={cn("size-3 rounded-full", aparencia.classe)} />
            {comLetras ? (
              <span
                aria-hidden="true"
                className={cn(
                  "font-ui text-[10px]",
                  estado === "hoje"
                    ? "font-extrabold text-tinta"
                    : "font-bold text-tinta-3",
                )}
              >
                {SIGLAS_DA_SEMANA[indice]}
              </span>
            ) : null}
            <span className="sr-only">
              {nome}: {aparencia.descricao}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** Legenda dos quatro estados, usada no painel da turma. */
export function LegendaDaSemana({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-5 gap-y-2", className)}>
      {(Object.keys(APARENCIA) as EstadoDoDia[]).map((estado) => (
        <li
          key={estado}
          className="flex items-center gap-[7px] font-texto text-[12.5px] text-tinta-3"
        >
          <span
            aria-hidden="true"
            className={cn(
              "size-[11px] shrink-0 rounded-full",
              APARENCIA[estado].classe,
            )}
          />
          {APARENCIA[estado].descricao}
        </li>
      ))}
    </ul>
  );
}
