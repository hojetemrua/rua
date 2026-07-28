import Image from "next/image";
import { IconeRelogio } from "@/componentes/base/icones";
import { HEROI } from "@/conteudo/home";
import {
  BLUR_FOTO_HEROI,
  CAMINHO_FOTO_HEROI,
  FOTO_HEROI_NO_UNSPLASH,
  PERFIL_DO_FOTOGRAFO,
  temFotoDeHeroi,
} from "@/lib/foto-heroi";
import { FormularioListaEspera } from "./formulario-lista-espera";

export function Heroi() {
  return (
    <section
      id="topo"
      className="mx-auto w-full max-w-[1240px] px-6 pt-[76px] sm:px-10"
    >
      <div className="grid items-start gap-14 lg:grid-cols-2">
        <div>
          <p className="inline-flex items-center gap-[9px] rounded-full border-[1.5px] border-tracado bg-branco px-3.5 py-[7px] font-ui text-[11.5px] font-extrabold tracking-[0.1em] text-tinta-2">
            <IconeRelogio className="size-3.5 text-tracado" />
            {HEROI.selo}
          </p>

          <h1
            className="mt-[26px] font-ui text-[clamp(56px,7.6vw,112px)] leading-[0.86] font-black tracking-[-0.045em]"
            style={{ fontStretch: "90%" }}
          >
            {HEROI.titulo.map((linha) => (
              <span key={linha} className="block">
                {linha}
              </span>
            ))}
          </h1>

          <div className="mt-[34px] mb-6 h-px bg-linha" />

          <p className="max-w-[54ch] font-texto text-[17px] leading-[1.68] text-pretty text-tinta-2">
            {HEROI.manifesto}{" "}
            <strong className="font-ui text-[19px] font-black tracking-[-0.02em]">
              {HEROI.assinaturaDoManifesto}
            </strong>
          </p>

          <FormularioListaEspera
            origem="heroi"
            id="heroi"
            className="mt-[34px] max-w-[560px]"
          />
        </div>

        {temFotoDeHeroi ? (
          <figure className="relative m-0 aspect-[4/5] w-full overflow-hidden rounded-foto border border-linha bg-linha-2">
            <Image
              src={CAMINHO_FOTO_HEROI}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              placeholder="blur"
              blurDataURL={BLUR_FOTO_HEROI}
              className="object-cover"
            />
            {/*
              Crédito sobre a foto. Chapa escura translúcida em vez de papel
              porque aqui ele fica dentro da imagem, não na borda da seção —
              e a foto é clara demais para texto escuro.
            */}
            <figcaption className="absolute bottom-[18px] left-[18px] rounded-[9px] bg-[rgba(0,0,0,0.5)] px-[11px] py-1.5 font-texto text-[11px] leading-[1.3] text-branco/90 backdrop-blur-[6px]">
              {HEROI.fotoDe}{" "}
              <a
                href={PERFIL_DO_FOTOGRAFO}
                target="_blank"
                rel="noopener noreferrer"
                className="text-inherit underline hover:text-branco"
              >
                {HEROI.fotografo}
              </a>{" "}
              {HEROI.fotoEm}{" "}
              <a
                href={FOTO_HEROI_NO_UNSPLASH}
                target="_blank"
                rel="noopener noreferrer"
                className="text-inherit underline hover:text-branco"
              >
                {HEROI.fonteDaFoto}
              </a>
            </figcaption>
          </figure>
        ) : null}
      </div>
    </section>
  );
}
