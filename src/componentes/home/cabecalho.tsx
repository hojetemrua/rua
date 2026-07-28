import { IconeSeta } from "@/componentes/base/icones";
import { MarcaRua } from "@/componentes/base/marca";
import { NAVEGACAO } from "@/conteudo/home";

export function CabecalhoHome() {
  return (
    <header
      // Papel translúcido com desfoque: o conteúdo passa por baixo sem sumir
      // e sem virar uma barra opaca.
      className="sticky top-0 z-20 border-b border-linha bg-papel/92 backdrop-blur-[10px]"
    >
      <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-6 px-6 py-[18px] sm:px-10">
        <MarcaRua altura={24} />

        <nav aria-label="Seções desta página">
          <ul className="flex flex-wrap items-center justify-end gap-0.5 font-ui text-[13.5px] font-bold">
            {NAVEGACAO.map((item) => (
              // No celular só o botão cabe; os links aparecem a partir de sm.
              <li key={item.href} className="hidden sm:block">
                <a
                  href={item.href}
                  className="inline-flex border-b-2 border-transparent px-3 py-[9px] whitespace-nowrap hover:border-tinta hover:text-tinta"
                >
                  {item.rotulo}
                </a>
              </li>
            ))}
            <li className="ml-2">
              <a
                href="#me-avisa"
                className="inline-flex items-center gap-[9px] rounded-full bg-tinta px-5 py-[11px] font-extrabold whitespace-nowrap text-papel transition-colors hover:bg-tinta-2"
              >
                Me avisa
                <IconeSeta className="size-[15px]" />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
