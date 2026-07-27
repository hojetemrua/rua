import { CabecalhoHome } from "@/componentes/home/cabecalho";
import { ComoFunciona } from "@/componentes/home/como-funciona";
import { Fecho } from "@/componentes/home/fecho";
import { Heroi } from "@/componentes/home/heroi";
import { PainelSinalAberto } from "@/componentes/home/painel-sinal-aberto";
import { PorQueGratuito } from "@/componentes/home/por-que-gratuito";
import { QuemCorreNela } from "@/componentes/home/quem-corre-nela";
import { RodapeHome } from "@/componentes/home/rodape";

export default function Home() {
  return (
    <>
      <CabecalhoHome />

      <main className="flex-1">
        <Heroi />
        <QuemCorreNela />
        <PorQueGratuito />

        {/*
          O único trecho da home que depende do banco — e sem <Suspense> de
          propósito.

          `lerSinalAberto` é `use cache`, então resolve durante a
          prerenderização e entra direto na casca estática. Com um <Suspense>
          em volta, o React mandava primeiro o esqueleto e trocava pelo
          conteúdo por script no fim do documento: o número aparecia só depois
          do JS, o que atrasa o LCP e deixa a seção vazia para quem não executa
          script. Sem a fronteira, o painel vem pronto no HTML.
        */}
        <PainelSinalAberto />

        <ComoFunciona />
        <Fecho />
      </main>

      <RodapeHome />
    </>
  );
}
