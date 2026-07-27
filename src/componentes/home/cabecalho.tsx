import { MarcaRua } from "@/componentes/base/marca";
import { NAVEGACAO } from "@/conteudo/home";

export function CabecalhoHome() {
  return (
    <header className="border-b border-linha bg-papel">
      <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between gap-6 px-6 py-5 sm:px-8">
        <MarcaRua />

        <nav aria-label="Seções desta página">
          <ul className="flex items-center gap-6">
            {NAVEGACAO.map((item, indice) => (
              <li
                key={item.href}
                // No celular só o último item cabe; os outros aparecem a partir
                // de sm para a barra não virar uma parede de texto.
                className={
                  indice === NAVEGACAO.length - 1 ? "" : "hidden sm:block"
                }
              >
                <a
                  href={item.href}
                  // py-2 leva o alvo de toque a 34px de altura: o mínimo
                  // acessível é 24px, e o texto sozinho dá 18px.
                  className="inline-flex items-center py-2 font-ui text-[14px] font-medium text-tinta-2 hover:text-tinta"
                >
                  {item.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
