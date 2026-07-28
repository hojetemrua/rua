import type { Metadata } from "next";
import { BotaoLink } from "@/componentes/base/botao";
import { Cartao } from "@/componentes/base/cartao";
import { MarcaRua } from "@/componentes/base/marca";
import { RotuloSecao } from "@/componentes/base/rotulo-secao";
import { lerSinalAberto } from "@/lib/dados/sinal-aberto";
import { formatarInteiro, formatarReais } from "@/lib/formato";

export const metadata: Metadata = {
  title: "Apoiar todo mês",
  description:
    "O apoio mensal paga o custo de manter o Rua no ar. Não destrava recurso nenhum.",
};

async function ContasDoMes() {
  const painel = await lerSinalAberto();

  return (
    <p className="font-texto text-[15px] leading-relaxed text-tinta-2">
      O mês corrente custa{" "}
      <span className="numeros font-semibold text-tinta">
        R$ {formatarReais(painel.custoCentavos)}
      </span>{" "}
      e está em{" "}
      <span className="numeros font-semibold text-tinta">
        R$ {formatarReais(painel.arrecadadoCentavos)}
      </span>
      , com{" "}
      <span className="numeros font-semibold text-tinta">
        {formatarInteiro(painel.apoiadores)}
      </span>{" "}
      {painel.apoiadores === 1 ? "pessoa apoiando" : "pessoas apoiando"}.
    </p>
  );
}

export default function Apoiar() {
  return (
    <>
      <header className="border-b border-linha bg-papel">
        <div className="mx-auto w-full max-w-[1120px] px-6 py-5 sm:px-8">
          <MarcaRua />
        </div>
      </header>

      <main className="flex-1 px-6 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto w-full max-w-[40rem]">
          <RotuloSecao como="p">Apoio mensal</RotuloSecao>

          <h1 className="mt-5 font-ui text-[34px] leading-[1.02] font-black tracking-[-0.02em] text-tinta sm:text-[46px]">
            Ainda não dá para apoiar.
          </h1>

          <p className="mt-5 font-texto text-[17px] leading-relaxed text-tinta-2">
            O recebimento entra no ar junto com o aplicativo, em 2026. Enquanto
            isso, as contas ficam abertas na home: o número publicado lá é o
            custo real do mês, sem meta escondida.
          </p>

          <Cartao className="mt-8 p-6">
            <RotuloSecao como="h2">Como vai funcionar</RotuloSecao>
            <ul className="mt-5 flex flex-col gap-3">
              {[
                "apoio mensal do valor que der, cancelável a qualquer hora",
                "quem apoia não ganha recurso extra, ganha o app de pé",
                "cada nível alcançado fica publicado na home, com o número real",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-tinta"
                  />
                  <p className="font-texto text-[15px] leading-relaxed text-tinta-2">
                    {item}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t border-linha-2 pt-5">
              {/* Sem <Suspense>: `use cache` resolve na prerenderização. */}
              <ContasDoMes />
            </div>
          </Cartao>

          <BotaoLink href="/#me-avisa" tamanho="grande" className="mt-8">
            Entrar na lista
          </BotaoLink>
        </div>
      </main>
    </>
  );
}
