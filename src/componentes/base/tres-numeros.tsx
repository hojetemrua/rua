import { cn } from "@/lib/cn";

export type Metrica = {
  rotulo: string;
  /** Já formatado em pt-BR. */
  valor: string;
  sufixo?: string;
  /** Linha de apoio abaixo do número, ex.: "86% MÁX". */
  apoio?: string;
};

type TresNumerosProps = {
  metricas: Metrica[];
  /** Colunas no mobile. A partir de sm o número de colunas acompanha os itens. */
  colunas?: 2 | 3 | 4;
  className?: string;
};

const GRADE = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
} as const;

/**
 * Grade de métricas com rótulo em cima e número embaixo.
 * Usada nos três números da Atividade, do Perfil e da ficha do atleta.
 */
export function TresNumeros({
  metricas,
  colunas = 3,
  className,
}: TresNumerosProps) {
  return (
    <dl className={cn("grid gap-px bg-linha-2", GRADE[colunas], className)}>
      {metricas.map((metrica) => (
        <div
          key={metrica.rotulo}
          className="flex flex-col gap-2 bg-branco px-4 py-4 first:pl-0 last:pr-0"
        >
          <dt className="rotulo text-tinta-3">{metrica.rotulo}</dt>
          <dd className="numeros text-[26px] leading-none font-black text-tinta">
            {metrica.valor}
            {metrica.sufixo ? (
              <span className="ml-1 text-[13px] font-semibold text-tinta-3">
                {metrica.sufixo}
              </span>
            ) : null}
            {metrica.apoio ? (
              <span className="mt-1 block font-texto text-[12px] font-medium text-tinta-3">
                {metrica.apoio}
              </span>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
