import { IconeConfirmado, IconeSeta } from "@/componentes/base/icones";
import { SINAL_ABERTO } from "@/conteudo/home";
import { lerSinalAberto, type SinalAberto } from "@/lib/dados/sinal-aberto";
import {
  formatarDiaCurto,
  formatarInteiro,
  formatarMesCurto,
  formatarReais,
  porcentagem,
} from "@/lib/formato";

function dois(numero: number): string {
  return String(numero).padStart(2, "0");
}

/** Uma das três linhas do extrato. */
function Linha({
  rotulo,
  valor,
  sinal,
}: {
  rotulo: string;
  valor: string;
  sinal?: "menos";
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="font-ui text-[10px] font-extrabold tracking-[0.12em] uppercase opacity-60">
        {rotulo}
      </dt>
      <dd className="numeros text-[15px] font-extrabold whitespace-nowrap">
        {sinal === "menos" ? "−" : ""}R$ {valor}
      </dd>
    </div>
  );
}

/**
 * Estado antes de a campanha abrir.
 *
 * Mostra o custo, não uma barra em zero. Enquanto não há o que apoiar, uma
 * barra vazia numa página que fala de contas abertas parece descuido — e o §4
 * proíbe exibir `R$ 0 · 0% · 0 pessoas apoiando`.
 */
function AntesDeAbrir({ painel }: { painel: SinalAberto }) {
  return (
    <>
      <div className="mt-[22px]">
        <p className="numeros text-[46px] leading-none font-black sm:text-[58px]">
          R$ {formatarReais(painel.custoDoMesCentavos)}
        </p>
        <p className="mt-2 font-ui text-[17px] font-medium opacity-70">
          é o que custa manter a Rua no ar este mês
        </p>
      </div>

      <p className="mt-4 font-texto text-[15px] leading-relaxed opacity-86">
        {SINAL_ABERTO.antesDeAbrir}
      </p>
    </>
  );
}

/** Estado depois de a campanha abrir: as três linhas e a barra em dois tons. */
function DepoisDeAbrir({ painel }: { painel: SinalAberto }) {
  const meta = painel.nivel?.metaBrutaCentavos ?? 0;
  const percentual = porcentagem(painel.brutoCentavos, meta);

  // As duas fatias somam o preenchimento; cada uma é medida sobre a meta.
  const fatiaDeQuemComecou = Math.min(
    100,
    Math.max(0, porcentagem(painel.deQuemComecouCentavos, meta)),
  );
  const fatiaDaComunidade = Math.min(
    100 - fatiaDeQuemComecou,
    Math.max(0, porcentagem(painel.daComunidadeCentavos, meta)),
  );

  return (
    <>
      <p className="mt-[22px] flex flex-wrap items-baseline gap-2.5 font-ui">
        <span className="numeros text-[46px] leading-none font-black whitespace-nowrap sm:text-[58px]">
          R$ {formatarReais(painel.brutoCentavos)}
        </span>
        <span className="text-[17px] font-medium opacity-70">
          de R$ {formatarReais(meta)} bruto por mês
        </span>
      </p>

      {/*
        Barra em dois tons. A fatia de quem começou fica em cinza e a da
        comunidade no traçado: mostrar o dinheiro do fundador como "arrecadado"
        sem distinguir seria tecnicamente verdade e moralmente esticado.
      */}
      <div
        role="progressbar"
        aria-valuenow={percentual}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`R$ ${formatarReais(painel.brutoCentavos)} de R$ ${formatarReais(meta)} da meta bruta do nível ${painel.nivel?.ordem}`}
        className="mt-3.5 flex h-3 overflow-hidden rounded-full bg-branco/16"
      >
        <div
          className="h-3 bg-tinta-3"
          style={{ width: `${fatiaDeQuemComecou}%` }}
        />
        <div
          className="h-3 bg-tracado"
          style={{ width: `${fatiaDaComunidade}%` }}
        />
      </div>

      <div className="numeros mt-2.5 flex flex-wrap justify-between gap-2 text-[12.5px] font-bold opacity-72">
        <span>
          {formatarInteiro(percentual)}% do nível {painel.nivel?.ordem}
        </span>
        <span>
          {formatarInteiro(painel.apoiadores)}{" "}
          {painel.apoiadores === 1 ? "pessoa apoiando" : "pessoas apoiando"}
        </span>
      </div>

      {/* As três linhas: sem meta escondida também quer dizer sem taxa escondida. */}
      <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-branco/22 pt-4">
        <Linha rotulo="Arrecadado" valor={formatarReais(painel.brutoCentavos)} />
        <Linha
          rotulo="Taxa da plataforma"
          valor={formatarReais(painel.taxaCentavos)}
          sinal="menos"
        />
        <Linha
          rotulo="Na operação"
          valor={formatarReais(painel.liquidoCentavos)}
        />
      </dl>

      {painel.deQuemComecouCentavos > 0 ? (
        <p className="mt-4 font-texto text-[13px] leading-relaxed opacity-72">
          {SINAL_ABERTO.deQuemComecou}
        </p>
      ) : null}
    </>
  );
}

/**
 * Painel Sinal Aberto.
 *
 * Vive dentro do bloco escuro de "Por que gratuito?", então é desenhado em
 * branco sobre tinta. Todo número vem do banco — `niveis_apoio`,
 * `transparencia_meses` e o agregado de `apoios`. Nada fixado aqui.
 *
 * Nenhum nível libera funcionalidade: cada um compra capacidade, independência
 * ou permanência, e tudo funciona desde o nível 1.
 */
export async function PainelSinalAberto() {
  const painel = await lerSinalAberto();

  const nivelCorrenteComoItem =
    painel.nivel === null
      ? []
      : [
          {
            ordem: painel.nivel.ordem,
            nome: painel.nivel.nome,
            descricao: painel.nivel.descricao,
            metaCentavos: painel.nivel.metaBrutaCentavos,
            alcancadoEm: null,
          },
        ];

  const pendentes = painel.apoioAberto
    ? painel.proximos
    : [...nivelCorrenteComoItem, ...painel.proximos];

  return (
    <div className="rounded-[26px] border border-branco/22 p-7">
      <div className="flex items-center justify-between gap-4">
        <p className="font-ui text-[11.5px] font-extrabold tracking-[0.16em] uppercase">
          {painel.apoioAberto
            ? `Nível ${painel.nivel?.ordem} · ${painel.nivel?.nome}`
            : SINAL_ABERTO.rotuloAntesDeAbrir}
        </p>
        <p className="numeros text-[11.5px] font-bold opacity-70">
          {formatarMesCurto(painel.mes)}
        </p>
      </div>

      <h3 className="mt-4 font-ui text-[30px] leading-[1.05] font-black tracking-[-0.03em]">
        {painel.apoioAberto
          ? painel.nivel?.descricao
          : SINAL_ABERTO.tituloAntesDeAbrir}
      </h3>

      {painel.apoioAberto ? (
        <DepoisDeAbrir painel={painel} />
      ) : (
        <AntesDeAbrir painel={painel} />
      )}

      {painel.alcancados.length > 0 ? (
        <>
          <div className="mt-[26px] mb-[18px] h-px bg-branco/22" />
          <h4 className="font-ui text-[11px] font-extrabold tracking-[0.14em] uppercase opacity-65">
            {SINAL_ABERTO.rotuloAlcancados}
          </h4>
          <ul className="mt-3 flex flex-col">
            {painel.alcancados.map((nivel) => (
              <li
                key={nivel.ordem}
                className="flex items-center gap-3.5 border-b border-branco/14 py-3 last:border-b-0"
              >
                <IconeConfirmado className="size-4 shrink-0 text-tracado" />
                <span className="flex-1 font-ui text-[14.5px] font-extrabold">
                  {nivel.nome}
                </span>
                <span className="numeros text-[12.5px] font-bold opacity-68">
                  {nivel.alcancadoEm
                    ? formatarDiaCurto(nivel.alcancadoEm)
                    : null}
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {/*
        Antes de abrir, o nível corrente entra na lista: ele ainda é uma meta,
        e sem isso desapareceria da página — não aparece no topo (que mostra o
        custo) nem entre os próximos (que o excluem).
      */}
      {pendentes.length > 0 ? (
        <>
          <div className="mt-[26px] mb-[18px] h-px bg-branco/22" />
          <h4 className="font-ui text-[11px] font-extrabold tracking-[0.14em] uppercase opacity-65">
            {SINAL_ABERTO.rotuloDoQueVemDepois}
          </h4>
          <ul className="mt-3 flex flex-col">
            {pendentes.map((nivel) => (
              <li
                key={nivel.ordem}
                className="flex items-center gap-3.5 border-b border-branco/14 py-[13px] last:border-b-0"
              >
                <span className="numeros w-[22px] text-[13px] font-black opacity-70">
                  {dois(nivel.ordem)}
                </span>
                <span className="flex-1">
                  <span className="block font-ui text-[14.5px] font-extrabold">
                    {nivel.nome}
                  </span>
                  <span className="block font-texto text-[12.5px] opacity-68">
                    {nivel.descricao}
                  </span>
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
        href={painel.apoioAberto ? SINAL_ABERTO.hrefApoiar : "/apoiar"}
        className="mt-[22px] flex items-center justify-center gap-2.5 rounded-full bg-branco px-4 py-[17px] font-ui text-[16px] font-extrabold text-tinta transition-opacity hover:opacity-88"
        {...(painel.apoioAberto
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {painel.apoioAberto ? SINAL_ABERTO.botao : SINAL_ABERTO.botaoAntesDeAbrir}
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
