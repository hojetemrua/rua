"use client";

import { usePathname } from "next/navigation";
import { LateralDoAssessor } from "./lateral-assessor";

/** Barra lateral com a seção ativa marcada a partir da URL. */
export function LateralDoAssessorAtiva() {
  return <LateralDoAssessor caminho={usePathname()} />;
}
