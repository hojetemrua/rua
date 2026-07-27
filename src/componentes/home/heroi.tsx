import Image from "next/image";
import { HEROI } from "@/conteudo/home";
import { CAMINHO_FOTO_HEROI, temFotoDeHeroi } from "@/lib/foto-heroi";
import { FormularioListaEspera } from "./formulario-lista-espera";

export function Heroi() {
  return (
    <section className="relative isolate overflow-hidden border-b border-linha">
      {temFotoDeHeroi ? (
        <Image
          src={CAMINHO_FOTO_HEROI}
          // Decorativa: o crédito da foto é texto, logo abaixo.
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
      ) : null}

      <div className="mx-auto w-full max-w-[1120px] px-6 py-14 sm:px-8 sm:py-20">
        {/*
          O bloco de texto é papel opaco sobre a foto. Garante o contraste AA
          sem recorrer a sombra ou gradiente, que o projeto não usa.
        */}
        <div className="max-w-[44rem] rounded-cartao-home border border-linha bg-papel p-7 sm:p-10">
          <p className="rotulo inline-flex items-center rounded-full border border-linha px-3 py-2 text-tinta-2">
            {HEROI.selo}
          </p>

          <h1 className="mt-7 font-ui text-[52px] leading-[0.86] font-black tracking-[-0.035em] text-tinta sm:text-[76px] lg:text-[88px]">
            {HEROI.titulo.map((linha) => (
              <span key={linha} className="block">
                {linha}
              </span>
            ))}
          </h1>

          <p className="mt-7 max-w-[36rem] font-texto text-[17px] leading-relaxed text-tinta-2">
            {HEROI.manifesto}
          </p>

          <FormularioListaEspera
            origem="heroi"
            id="heroi"
            className="mt-8 max-w-[30rem]"
          />

          <p className="mt-3 font-texto text-[13px] text-tinta-3">
            {HEROI.apoioDoCampo}
          </p>
        </div>
      </div>

      {temFotoDeHeroi ? (
        <p className="absolute right-4 bottom-4 rounded-full border border-linha bg-papel px-3 py-1.5 font-texto text-[11px] text-tinta-3">
          {HEROI.creditoDaFoto}
        </p>
      ) : null}
    </section>
  );
}
