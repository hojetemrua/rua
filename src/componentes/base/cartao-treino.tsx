import { Cartao } from "./cartao";
import { cn } from "@/lib/cn";
import { formatarInteiro } from "@/lib/formato";

type CartaoTreinoProps = {
  nome: string;
  /** Faixa de volume ou de tempo, ex.: "12–16 km" · "45–60 min". */
  faixa?: string;
  /** Descrição em linguagem de treinador. */
  descricao: string;
  /** Ex.: "Publicado por Camila Ferraz". */
  autoria?: string;
  /** Quantas vezes o treino já foi usado — some quando não há uso. */
  usos?: number;
  /** Botão ou link de ação no pé do cartão. */
  acao?: React.ReactNode;
  home?: boolean;
  className?: string;
};

export function CartaoTreino({
  nome,
  faixa,
  descricao,
  autoria,
  usos,
  acao,
  home = false,
  className,
}: CartaoTreinoProps) {
  return (
    <Cartao como="article" home={home} className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-ui text-[19px] font-extrabold tracking-tight text-tinta">
          {nome}
        </h3>
        {faixa ? (
          <p className="numeros shrink-0 pt-1 text-[13px] font-semibold text-tinta-3">
            {faixa}
          </p>
        ) : null}
      </div>

      <p className="mt-2 font-texto text-[15px] leading-relaxed text-tinta-2">
        {descricao}
      </p>

      {autoria || usos !== undefined ? (
        <p className="mt-3 font-texto text-[13px] text-tinta-3">
          {autoria}
          {autoria && usos !== undefined ? " · " : null}
          {usos !== undefined ? (
            <>
              usado <span className="numeros">{formatarInteiro(usos)}</span>×
            </>
          ) : null}
        </p>
      ) : null}

      {acao ? <div className="mt-4">{acao}</div> : null}
    </Cartao>
  );
}
