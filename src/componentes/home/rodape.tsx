import Link from "next/link";
import { MarcaRua } from "@/componentes/base/marca";
import { RotuloSecao } from "@/componentes/base/rotulo-secao";
import { RODAPE } from "@/conteudo/home";

export function RodapeHome() {
  return (
    <footer className="px-6 py-16 sm:px-8">
      <div className="mx-auto grid w-full max-w-[1120px] gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <MarcaRua como="texto" />
          <p className="mt-4 font-texto text-[15px] text-tinta-2">
            {RODAPE.lema}
          </p>
          <p className="font-texto text-[15px] text-tinta-2">
            {RODAPE.subLema}
          </p>
        </div>

        <div>
          <RotuloSecao como="h2">{RODAPE.ondeAGenteFala.rotulo}</RotuloSecao>
          <p className="mt-4 font-ui text-[15px] font-semibold text-tinta">
            {RODAPE.ondeAGenteFala.perfil}
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {RODAPE.ondeAGenteFala.redes.map((rede) => (
              <li key={rede.rotulo}>
                <a
                  href={rede.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center py-1 font-texto text-[15px] text-tinta-2 hover:text-tinta"
                >
                  {rede.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <RotuloSecao como="h2">{RODAPE.transparencia.rotulo}</RotuloSecao>
          <ul className="mt-4 flex flex-col gap-2">
            {RODAPE.transparencia.links.map((item) => (
              <li key={item.rotulo}>
                <a
                  href={item.href}
                  {...("externo" in item && item.externo
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="inline-flex items-center py-1 font-texto text-[15px] text-tinta-2 hover:text-tinta"
                >
                  {item.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <RotuloSecao como="h2">{RODAPE.contato.rotulo}</RotuloSecao>
          <p className="mt-4">
            <a
              href={`mailto:${RODAPE.contato.email}`}
              className="inline-flex items-center py-1 font-texto text-[15px] text-tinta-2 hover:text-tinta"
            >
              {RODAPE.contato.email}
            </a>
          </p>
          <p className="mt-3">
            <Link
              href={RODAPE.souAssessor.href}
              className="inline-flex items-center py-1 font-ui text-[15px] font-semibold text-tinta hover:underline"
            >
              {RODAPE.souAssessor.rotulo}
            </Link>
          </p>
        </div>
      </div>

      <div className="mx-auto mt-14 w-full max-w-[1120px] border-t border-linha pt-6">
        <p className="font-texto text-[13px] text-tinta-3">
          <span className="numeros">{RODAPE.assinatura}</span>
        </p>
      </div>
    </footer>
  );
}
