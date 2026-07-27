import { Cartao } from "./cartao";
import { RotuloSecao } from "./rotulo-secao";

/**
 * Marcador honesto de tela ainda não construída. A casca de navegação existe
 * desde a fase 1; o conteúdo de cada aba entra na fase indicada.
 */
export function EmConstrucao({
  titulo,
  fase,
  descricao,
}: {
  titulo: string;
  fase: number;
  descricao: string;
}) {
  return (
    <section className="flex flex-col gap-4">
      <RotuloSecao>Fase {fase}</RotuloSecao>
      <h1 className="font-ui text-[30px] leading-[1.05] font-black tracking-tight text-tinta">
        {titulo}
      </h1>
      <Cartao className="p-5">
        <p className="font-texto text-[15px] leading-relaxed text-tinta-2">
          {descricao}
        </p>
      </Cartao>
    </section>
  );
}
