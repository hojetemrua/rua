"use client";

import { usePathname } from "next/navigation";
import { ListaDeAbas } from "./abas";

/** Barra de abas com a aba ativa marcada a partir da URL. */
export function BarraAbas() {
  return <ListaDeAbas caminho={usePathname()} />;
}
