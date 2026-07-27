import { BarraProgresso } from "@/componentes/base/barra-progresso";
import { BotaoLink } from "@/componentes/base/botao";
import { Cartao, DivisorInterno } from "@/componentes/base/cartao";
import { RotuloSecao } from "@/componentes/base/rotulo-secao";
import { SINAL_ABERTO } from "@/conteudo/home";
import { lerSinalAberto } from "@/lib/dados/sinal-aberto";
import {
  formatarInteiro,
  formatarMesPorExtenso,
  formatarReais,
  porcentagem,
} from "@/lib/formato";
import { Secao } from "./secao";

function dois(numero: number): string {
  return String(numero).padStart(2, "0");
}

export async function PainelSinalAberto() {
  const painel = await lerSinalAberto();

  const percentual = porcentagem(
    painel.arrecadadoCentavos,
    painel.custoCentavos,
  );

  return (
    <Secao id="sinal-aberto">
      <Cartao home className="p-6 sm:p-9">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <RotuloSecao>
            Nível {painel.nivel} · Apoio mensal
          </RotuloSecao>
          <p className="rotulo text-tinta-3">
            {formatarMesPorExtenso(painel.mes)}
          </p>
        </div>

        <h3 className="mt-6 font-ui text-[22px] leading-tight font-extrabold tracking-tight text-tinta sm:text-[26px]">
          {painel.descricao}
        </h3>

        <p className="mt-7 font-ui text-tinta">
          <span className="numeros text-[46px] leading-none font-black sm:text-[58px]">
            R$ {formatarReais(painel.arrecadadoCentavos)}
          </span>
          <span className="ml-3 text-[17px] font-medium text-tinta-2">
            de{" "}
            <span className="numeros font-semibold">
              R$ {formatarReais(painel.custoCentavos)}
            </span>{" "}
            por mês
          </span>
        </p>

        <BarraProgresso
          valor={painel.arrecadadoCentavos}
          total={painel.custoCentavos}
          descricao={`R$ ${formatarReais(painel.arrecadadoCentavos)} de R$ ${formatarReais(
            painel.custoCentavos,
          )} do custo do mês`}
          className="mt-6"
        />

        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-texto text-[15px] text-tinta-2">
            <span className="numeros font-semibold text-tinta">
              {formatarInteiro(painel.apoiadores)}
            </span>{" "}
            {painel.apoiadores === 1 ? "pessoa apoiando" : "pessoas apoiando"}
          </p>
          <p className="numeros text-[15px] font-semibold text-tinta-3">
            {formatarInteiro(percentual)}%
          </p>
        </div>

        {painel.proximos.length > 0 ? (
          <>
            <DivisorInterno className="mt-8" />

            <RotuloSecao como="h4" className="mt-7">
              {SINAL_ABERTO.rotuloDoQueVemDepois}
            </RotuloSecao>

            <ul className="mt-5 flex flex-col">
              {painel.proximos.map((nivel) => (
                <li
                  key={nivel.nivel}
                  className="flex items-baseline justify-between gap-4 border-b border-linha-2 py-3 last:border-b-0"
                >
                  <p className="font-texto text-[15px] text-tinta-2">
                    <span className="numeros mr-3 font-semibold text-tinta-3">
                      {dois(nivel.nivel)}
                    </span>
                    {nivel.titulo}
                  </p>
                  <p className="numeros shrink-0 text-[15px] font-semibold text-tinta">
                    R$ {formatarReais(nivel.metaCentavos)}
                  </p>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        <BotaoLink href="/apoiar" tamanho="grande" className="mt-8">
          {SINAL_ABERTO.botao}
        </BotaoLink>

        <p className="mt-6 font-texto text-[13px] text-tinta-3">
          {SINAL_ABERTO.rodape}
        </p>

        {painel.daSemente ? (
          <p className="mt-4 rounded-pequeno-home border border-linha bg-papel p-4 font-texto text-[13px] text-tinta-2">
            Estes são números de exemplo: o banco ainda não está ligado neste
            ambiente. Nada aqui deve ser lido como o custo real do mês.
          </p>
        ) : null}
      </Cartao>
    </Secao>
  );
}
