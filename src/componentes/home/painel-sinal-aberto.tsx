import { IconeSeta } from "@/componentes/base/icones";
import { SINAL_ABERTO } from "@/conteudo/home";
import { lerSinalAberto } from "@/lib/dados/sinal-aberto";
import {
  formatarInteiro,
  formatarMesCurto,
  formatarReais,
  porcentagem,
} from "@/lib/formato";

function dois(numero: number): string {
  return String(numero).padStart(2, "0");
}

/**
 * Painel Sinal Aberto.
 *
 * Vive dentro do bloco escuro de "Por que gratuito?", então é desenhado em
 * branco sobre tinta. Os números todos vêm do banco — nada fixado aqui.
 */
export async function PainelSinalAberto() {
  const painel = await lerSinalAberto();

  const percentual = porcentagem(
    painel.arrecadadoCentavos,
    painel.custoCentavos,
  );
  const preenchido = Math.min(100, Math.max(0, percentual));

  return (
    <div className="rounded-[26px] border border-branco/22 p-7">
      <div className="flex items-center justify-between gap-4">
        <p className="font-ui text-[11.5px] font-extrabold tracking-[0.16em] uppercase">
          Nível {painel.nivel} · Apoio mensal
        </p>
        <p className="numeros text-[11.5px] font-bold opacity-70">
          {formatarMesCurto(painel.mes)}
        </p>
      </div>

      <h3 className="mt-4 font-ui text-[30px] leading-[1.05] font-black tracking-[-0.03em]">
        {painel.descricao}
      </h3>

      <div className="mt-[22px] flex flex-wrap items-baseline gap-2.5">
        <p className="numeros text-[44px] leading-none font-black whitespace-nowrap">
          R$ {formatarReais(painel.arrecadadoCentavos)}
        </p>
        <p className="font-ui text-[14px] font-bold opacity-70">
          de R$ {formatarReais(painel.custoCentavos)} por mês
        </p>
      </div>

      {/*
        A barra é o traçado: aqui a cor carrega dado, não decoração. O valor
        acessível vai no role=progressbar para quem não enxerga a barra.
      */}
      <div
        role="progressbar"
        aria-valuenow={percentual}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`R$ ${formatarReais(painel.arrecadadoCentavos)} de R$ ${formatarReais(
          painel.custoCentavos,
        )} do custo do mês`}
        className="mt-3.5 h-3 overflow-hidden rounded-full bg-branco/16"
      >
        <div
          className="h-3 rounded-full bg-tracado"
          style={{ width: `${preenchido}%` }}
        />
      </div>

      <div className="numeros mt-2.5 flex justify-between text-[12.5px] font-bold opacity-72">
        <span>
          {formatarInteiro(percentual)}% do nível {painel.nivel}
        </span>
        <span>
          {formatarInteiro(painel.apoiadores)}{" "}
          {painel.apoiadores === 1 ? "pessoa apoiando" : "pessoas apoiando"}
        </span>
      </div>

      {painel.proximos.length > 0 ? (
        <>
          <div className="mt-[26px] mb-[18px] h-px bg-branco/22" />

          <h4 className="font-ui text-[11px] font-extrabold tracking-[0.14em] uppercase opacity-65">
            {SINAL_ABERTO.rotuloDoQueVemDepois}
          </h4>

          <ul className="mt-3 flex flex-col">
            {painel.proximos.map((nivel) => (
              <li
                key={nivel.nivel}
                className="flex items-center gap-3.5 border-b border-branco/14 py-[13px] last:border-b-0"
              >
                <span className="numeros w-[22px] text-[13px] font-black opacity-70">
                  {dois(nivel.nivel)}
                </span>
                <span className="flex-1">
                  <span className="block font-ui text-[14.5px] font-extrabold">
                    {nivel.titulo}
                  </span>
                  {nivel.subtitulo ? (
                    <span className="block font-texto text-[12.5px] opacity-68">
                      {nivel.subtitulo}
                    </span>
                  ) : null}
                </span>
                <span className="numeros text-[14px] font-extrabold whitespace-nowrap">
                  R$ {formatarReais(nivel.metaCentavos)}
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <a
        href="/apoiar"
        className="mt-[22px] flex items-center justify-center gap-2.5 rounded-full bg-branco px-4 py-[17px] font-ui text-[16px] font-extrabold text-tinta transition-opacity hover:opacity-88"
      >
        {SINAL_ABERTO.botao}
        <IconeSeta className="size-4" />
      </a>

      <p className="mt-3 text-center font-texto text-[12.5px] opacity-66">
        {SINAL_ABERTO.rodape}
      </p>

      {painel.daSemente ? (
        <p className="mt-4 rounded-pequeno-home border border-branco/22 p-4 font-texto text-[12.5px] opacity-80">
          Estes são números de exemplo: o banco ainda não está ligado neste
          ambiente. Nada aqui deve ser lido como o custo real do mês.
        </p>
      ) : null}
    </div>
  );
}
