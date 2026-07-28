import { CabecalhoHome } from "@/componentes/home/cabecalho";
import { ComoFunciona } from "@/componentes/home/como-funciona";
import { Fecho } from "@/componentes/home/fecho";
import { Heroi } from "@/componentes/home/heroi";
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
        {/*
          O painel Sinal Aberto vive dentro desta seção, não como bloco
          separado: é lá que o projeto fala de dinheiro, e o desenho põe as
          contas ao lado do texto que as explica.
        */}
        <PorQueGratuito />
        <ComoFunciona />
        <Fecho />
      </main>

      <RodapeHome />
    </>
  );
}
