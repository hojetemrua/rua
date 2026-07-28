import Link from "next/link";
import { ICONES, type NomeDeIcone } from "@/componentes/base/icones";
import { MarcaRua } from "@/componentes/base/marca";
import { RODAPE } from "@/conteudo/home";

type ItemDeRodape = {
  icone: NomeDeIcone;
  rotulo: string;
  href: string;
  externo?: boolean;
};

function Coluna({
  rotulo,
  itens,
}: {
  rotulo: string;
  itens: readonly ItemDeRodape[];
}) {
  return (
    <div>
      <h2 className="font-ui text-[10px] font-extrabold tracking-[0.14em] uppercase text-tinta-3">
        {rotulo}
      </h2>
      <ul className="mt-3.5 flex flex-col gap-[11px] font-texto text-[14.5px]">
        {itens.map((item) => {
          const Icone = ICONES[item.icone];
          const conteudo = (
            <>
              <Icone className="size-[17px] shrink-0" />
              {item.rotulo}
            </>
          );
          const classe =
            "inline-flex items-center gap-2.5 py-1 hover:text-tracado";

          return (
            <li key={item.rotulo + item.href}>
              {item.href.startsWith("/") ? (
                <Link href={item.href} className={classe}>
                  {conteudo}
                </Link>
              ) : (
                <a
                  href={item.href}
                  className={classe}
                  {...(item.externo
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {conteudo}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function RodapeHome() {
  return (
    <footer
      id="rodape"
      className="mx-auto w-full max-w-[1240px] px-6 pt-[76px] pb-16 sm:px-10"
    >
      <div className="h-px bg-linha" />

      <div className="grid gap-9 pt-9 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <MarcaRua como="texto" altura={22} />
          <p className="mt-3.5 font-texto text-[13px] leading-[1.6] text-tinta-3">
            {RODAPE.lema}
            <br />
            {RODAPE.subLema}
          </p>
        </div>

        <Coluna
          rotulo={RODAPE.ondeAGenteFala.rotulo}
          itens={RODAPE.ondeAGenteFala.perfis.map((p) => ({ ...p, externo: true }))}
        />
        <Coluna
          rotulo={RODAPE.transparencia.rotulo}
          itens={RODAPE.transparencia.links}
        />
        <Coluna rotulo={RODAPE.contato.rotulo} itens={RODAPE.contato.links} />
      </div>

      <div className="mt-9 mb-[18px] h-px bg-linha" />

      <p className="font-texto text-[12.5px] text-tinta-3">
        <span className="numeros">{RODAPE.assinatura}</span>
      </p>
    </footer>
  );
}
