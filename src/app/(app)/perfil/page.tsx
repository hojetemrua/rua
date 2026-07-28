import type { Metadata } from "next";
import { IconeAjustes, IconeContas, IconeRoadmap } from "@/componentes/base/icones";
import { AvatarIniciais } from "@/componentes/base/avatar-iniciais";
import { GraficoVolume8Semanas } from "@/componentes/base/grafico-volume";
import { RotuloSecao } from "@/componentes/base/rotulo-secao";
import {
  ASSESSORA,
  CORREDOR,
  PERFIL_DO_CORREDOR,
  VOLUME_8_SEMANAS,
} from "@/lib/dados/exemplo";
import { iniciaisDe } from "@/componentes/base/avatar-iniciais";

export const metadata: Metadata = { title: "Perfil" };

function Numero({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="rounded-[18px] border border-linha bg-branco px-3 py-3.5">
      <p className="font-ui text-[10px] font-extrabold tracking-[0.1em] uppercase text-tinta-3">
        {rotulo}
      </p>
      <p className="numeros text-[24px] leading-[1.15] font-black">{valor}</p>
    </div>
  );
}

export default function Perfil() {
  const { apoio } = PERFIL_DO_CORREDOR;

  return (
    <div className="flex flex-col">
      <header className="flex items-center gap-3.5 px-[22px] pt-5">
        <span className="flex size-[58px] shrink-0 items-center justify-center rounded-full bg-tinta font-ui text-[20px] font-black text-papel">
          <span aria-hidden="true">{iniciaisDe(CORREDOR.nome)}</span>
        </span>
        <div>
          <h1 className="font-ui text-[26px] font-black tracking-[-0.03em]">
            {CORREDOR.nome}
          </h1>
          <p className="font-texto text-[13px] text-tinta-3">
            {CORREDOR.descricao}
          </p>
        </div>
      </header>

      <div className="mx-3.5 mt-[18px] grid grid-cols-3 gap-2">
        <Numero rotulo="No mês" valor={PERFIL_DO_CORREDOR.noMes} />
        {/* Constância é semana consecutiva com treino, nunca dia consecutivo. */}
        <Numero rotulo="Sem parar" valor={PERFIL_DO_CORREDOR.semParar} />
        <Numero rotulo="Melhor 10k" valor={PERFIL_DO_CORREDOR.melhor10k} />
      </div>

      <section className="mx-3.5 mt-2.5 rounded-[24px] border border-linha bg-branco px-5 py-[18px]">
        <RotuloSecao>Volume · 8 semanas</RotuloSecao>
        <GraficoVolume8Semanas
          semanas={VOLUME_8_SEMANAS}
          altura={74}
          className="mt-3.5"
        />
        <p className="mt-2.5 font-texto text-[12.5px] text-tinta-3">
          Semana atual em preto. Sem meta anual, sem medalha.
        </p>
      </section>

      <section className="mx-3.5 mt-2.5 flex items-center gap-3.5 rounded-[24px] border border-linha bg-branco px-5 py-[18px]">
        <AvatarIniciais nome={ASSESSORA.nome} tamanho="m" />
        <div className="flex-1">
          <p className="font-ui text-[15px] font-extrabold">{ASSESSORA.nome}</p>
          <p className="font-texto text-[12.5px] text-tinta-3">
            {ASSESSORA.descricao}
          </p>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-full border-[1.5px] border-tinta px-4 py-[9px] font-ui text-[12.5px] font-extrabold"
        >
          Falar
        </button>
      </section>

      {/*
        O apoio mensal aparece uma vez só em todo o aplicativo, e é aqui.
        Nenhuma outra tela pede dinheiro.
      */}
      <section className="mx-3.5 mt-2.5 rounded-[24px] bg-tinta p-5 text-papel">
        <p className="flex items-center gap-2 opacity-70">
          <IconeContas className="size-3.5" />
          <span className="font-ui text-[10.5px] font-extrabold tracking-[0.14em] uppercase">
            Seu apoio · nível {apoio.nivel}
          </span>
        </p>
        <p className="mt-2.5 font-ui text-[22px] font-black tracking-[-0.02em]">
          {apoio.valor}
        </p>
        <div
          role="progressbar"
          aria-valuenow={apoio.percentualDaTurma}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`A turma está em ${apoio.percentualDaTurma}% do nível ${apoio.nivel}`}
          className="mt-3.5 h-2 overflow-hidden rounded-full bg-branco/16"
        >
          <div
            className="h-2 rounded-full bg-tracado"
            style={{ width: `${apoio.percentualDaTurma}%` }}
          />
        </div>
        <p className="mt-2.5 font-texto text-[12.5px] opacity-72">
          {apoio.nota}
        </p>
      </section>

      <nav className="mx-[22px] mt-4 mb-5 flex flex-col">
        <button
          type="button"
          className="flex items-center gap-3 border-t border-linha py-3.5 font-ui text-[14.5px] font-bold"
        >
          <IconeAjustes className="size-[17px] text-tinta-3" />
          Ajustes e privacidade
        </button>
        {/* Exportar é um clique, e o formato é aberto. */}
        <button
          type="button"
          className="flex items-center gap-3 border-t border-linha py-3.5 font-ui text-[14.5px] font-bold"
        >
          <IconeRoadmap className="size-[17px] text-tinta-3" />
          Baixar meus dados
        </button>
      </nav>
    </div>
  );
}
