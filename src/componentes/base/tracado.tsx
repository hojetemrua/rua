import { cn } from "@/lib/cn";

/** Ponto da polilinha, em graus: `[longitude, latitude]`. */
export type PontoDoTracado = readonly [number, number];

type TracadoProps = {
  pontos: readonly PontoDoTracado[];
  /** Descrição para leitor de tela, ex.: "Traçado do treino no Pacaembu". */
  descricao: string;
  className?: string;
};

const CAIXA = 100;
const MARGEM = 6;

/**
 * Traçado da corrida como SVG puro sobre papel — sem nenhum tile de mapa.
 * Decisão de custo: tile só na tela de Atividade em tela cheia, sob toque
 * explícito. Em listas, cartões e miniaturas é sempre este componente.
 */
export function Tracado({ pontos, descricao, className }: TracadoProps) {
  if (pontos.length < 2) return null;

  const lngs = pontos.map(([lng]) => lng);
  const lats = pontos.map(([, lat]) => lat);

  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  // Mantém a proporção do percurso: a maior extensão define a escala, e o
  // eixo menor fica centralizado na caixa.
  const extensao = Math.max(maxLng - minLng, maxLat - minLat) || 1e-6;
  const util = CAIXA - MARGEM * 2;
  const escala = util / extensao;

  const deslocX = (util - (maxLng - minLng) * escala) / 2;
  const deslocY = (util - (maxLat - minLat) * escala) / 2;

  const caminho = pontos
    .map(([lng, lat]) => {
      const x = MARGEM + deslocX + (lng - minLng) * escala;
      // Latitude cresce para o norte, y cresce para baixo.
      const y = MARGEM + deslocY + (maxLat - lat) * escala;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${CAIXA} ${CAIXA}`}
      className={cn("h-auto w-full", className)}
      role="img"
      aria-label={descricao}
    >
      <polyline
        points={caminho}
        fill="none"
        stroke="var(--trace)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
