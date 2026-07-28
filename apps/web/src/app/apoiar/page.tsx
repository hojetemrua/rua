import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { IconeConfirmado } from "@/componentes/base/icones";
import { MarcaRua } from "@/componentes/base/marca";
import { RotuloSecao } from "@/componentes/base/rotulo-secao";
import { FormularioListaEspera } from "@/componentes/home/formulario-lista-espera";
import { SINAL_ABERTO } from "@/conteudo/home";
import { lerSinalAberto } from "@/lib/dados/sinal-aberto";
import { formatarDiaPorExtenso, formatarReais } from "@/lib/formato";

export const metadata: Metadata = {
  title: "Apoiar todo mês",
  description:
    "O apoio mensal paga o custo de manter a Rua no ar. Não destrava recurso nenhum.",
};

/**
 * Página de apoio.
 *
 * Tem dois papéis, decididos por `apoio_abre_em` no banco:
 *
 * - **Antes de a campanha abrir:** explica a conta e captura quem já quer
 *   apoiar, na mesma lista de espera com `origem = "apoio"`. Isso dá uma
 *   medida real de quantos vão sustentar antes de pedir dinheiro a ninguém.
 * - **Depois:** manda para a campanha, porque o recebimento não vive aqui.
 */
export default async function Apoiar() {
  const painel = await lerSinalAberto();

  if (painel.apoioAberto) redirect(SINAL_ABERTO.hrefApoiar);

  const escada = painel.nivel ? [painel.nivel, ...painel.proximos] : painel.proximos;

  return (
    <>
      <header className="border-b border-linha bg-papel">
        <div className="mx-auto w-full max-w-[1240px] px-6 py-5 sm:px-10">
          <MarcaRua altura={24} />
        </div>
      </header>

      <main className="flex-1 px-6 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto w-full max-w-[46rem]">
          <RotuloSecao como="p">Apoio mensal</RotuloSecao>

          <h1
            className="mt-5 font-ui text-[clamp(34px,4vw,52px)] leading-[1.02] font-black tracking-[-0.03em]"
            style={{ fontStretch: "94%" }}
          >
            O pedido abre junto com a Rua.
          </h1>

          <p className="mt-5 font-texto text-[17px] leading-relaxed text-tinta-2">
            Não faz sentido pedir para você sustentar uma coisa que ainda não
            pode usar. A campanha abre em{" "}
            <strong className="font-ui font-extrabold text-tinta">
              {formatarDiaPorExtenso(painel.apoioAbreEm).toLowerCase()}
            </strong>
            , no mesmo dia em que a plataforma e os aplicativos abrem.
          </p>

          <p className="mt-4 font-texto text-[17px] leading-relaxed text-tinta-2">
            Até lá as contas já ficam abertas: manter a Rua no ar custa{" "}
            <strong className="numeros font-extrabold text-tinta">
              R$ {formatarReais(painel.custoDoMesCentavos)}
            </strong>{" "}
            este mês, e esse número fica publicado todo mês.
          </p>

          {/* A medida que interessa antes de abrir: quantos já querem apoiar. */}
          <section className="mt-10 rounded-bloco border border-linha bg-branco p-7 shadow-cartao sm:p-9">
            <h2 className="font-ui text-[24px] font-black tracking-[-0.02em]">
              Me avisa quando o apoio abrir
            </h2>
            <p className="mt-2 font-texto text-[15px] leading-relaxed text-tinta-2">
              Mesmo e-mail, mesma lista. Você recebe um aviso no dia — e nada
              além disso.
            </p>
            <FormularioListaEspera
              origem="apoio"
              id="apoio"
              className="mt-6"
              rotuloDoBotao="Quero apoiar"
            />
          </section>

          <h2 className="mt-14 font-ui text-[24px] font-black tracking-[-0.02em]">
            O que cada nível compra
          </h2>
          <p className="mt-2 font-texto text-[15px] leading-relaxed text-tinta-2">
            Nenhum nível libera recurso. Tudo funciona desde o primeiro. As metas
            são brutas: a plataforma de apoio retém uma parte, e o painel mostra
            as três linhas.
          </p>

          <ul className="mt-6 flex flex-col">
            {escada.map((nivel) => {
              const ordem = "ordem" in nivel ? nivel.ordem : 0;
              const meta =
                "metaBrutaCentavos" in nivel
                  ? nivel.metaBrutaCentavos
                  : nivel.metaCentavos;
              return (
                <li
                  key={ordem}
                  className="flex items-baseline gap-4 border-t border-linha py-4"
                >
                  <span className="numeros w-6 shrink-0 text-[13px] font-black text-tinta-3">
                    {String(ordem).padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    <span className="block font-ui text-[16px] font-extrabold">
                      {nivel.nome}
                    </span>
                    <span className="block font-texto text-[14px] leading-relaxed text-tinta-2">
                      {nivel.descricao}
                    </span>
                  </span>
                  <span className="numeros shrink-0 text-[15px] font-extrabold whitespace-nowrap">
                    R$ {formatarReais(meta)}
                  </span>
                </li>
              );
            })}
          </ul>

          <ul className="mt-10 flex flex-col gap-3 border-t border-linha pt-8">
            {[
              "Apoio mensal, do valor que der, cancelável a qualquer hora",
              "Quem apoia não ganha recurso extra — ganha o app de pé",
              "Cada nível alcançado fica publicado na home, com o número real",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <IconeConfirmado className="size-[17px] shrink-0 text-tracado-texto" />
                <span className="font-texto text-[15px] text-tinta-2">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
