import Link from "next/link";
import { AvatarIniciais } from "./avatar-iniciais";
import { PontosDaSemana, type EstadoDoDia } from "./pontos-da-semana";
import { formatarVolume } from "@/lib/formato";

export type Atleta = {
  id: string;
  nome: string;
  /** Sete estados, de segunda a domingo. */
  semana: EstadoDoDia[];
  volumeKm: number;
  /** Quando apareceu por último: "hoje" · "ontem" · "terça". */
  sinal: string;
};

/**
 * Linha da tabela da Turma. Sem número de cobrança: não existe ranking nem
 * alerta vermelho — só o que a pessoa fez e quando apareceu.
 */
export function LinhaAtleta({ atleta }: { atleta: Atleta }) {
  return (
    <tr className="border-t border-linha-2">
      <th scope="row" className="py-3 pr-4 text-left font-normal">
        <Link
          href={`/assessor/atleta/${atleta.id}`}
          className="flex items-center gap-3 font-ui text-[15px] font-semibold text-tinta hover:underline"
        >
          <AvatarIniciais nome={atleta.nome} tamanho="p" />
          {atleta.nome}
        </Link>
      </th>
      <td className="py-3 pr-4">
        <PontosDaSemana dias={atleta.semana} />
      </td>
      <td className="numeros py-3 pr-4 text-[14px] font-semibold text-tinta">
        {formatarVolume(atleta.volumeKm)}
        <span className="ml-1 font-texto text-[12px] font-normal text-tinta-3">
          km
        </span>
      </td>
      <td className="py-3 font-texto text-[14px] text-tinta-3">{atleta.sinal}</td>
    </tr>
  );
}
