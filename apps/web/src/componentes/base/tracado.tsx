import { cn } from "@/lib/cn";

/** Ponto da polilinha, em graus: `[longitude, latitude]`. */
export type PontoDoTracado = readonly [number, number];

type TracadoProps = {
  pontos: readonly PontoDoTracado[];
  /** Descrição para leitor de tela, ex.: "Traçado do treino no Pacaembu". */
  descricao: string;
  /** Desenha a malha de quarteirões atrás do percurso. */
  comGrade?: boolean;
  /** Marca o ponto de partida. */
  comPartida?: boolean;
  className?: string;
};

const LARGURA = 362;
const ALTURA = 186;
const MARGEM = 24;

/**
 * Traçado da corrida como SVG puro — sem nenhum tile de mapa.
 *
 * Decisão de custo, e também de privacidade: tile cobrado por requisição é o
 * maior custo variável de um app de corrida, e o traçado desenhado localmente
 * não manda a rota de ninguém para um servidor de mapas. Tile só na tela de
 * Atividade em tela cheia, sob toque explícito.
 *
 * A malha atrás é decorativa: sugere quarteirões sem afirmar onde é.
 */
export function Tracado({
  pontos,
  descricao,
  comGrade = false,
  comPartida = false,
  className,
}: TracadoProps) {
  if (pontos.length < 2) return null;

  const lngs = pontos.map(([lng]) => lng);
  const lats = pontos.map(([, lat]) => lat);

  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  // Mantém a proporção do percurso: a maior extensão define a escala.
  const extensaoLng = maxLng - minLng || 1e-6;
  const extensaoLat = maxLat - minLat || 1e-6;
  const escala = Math.min(
    (LARGURA - MARGEM * 2) / extensaoLng,
    (ALTURA - MARGEM * 2) / extensaoLat,
  );

  const deslocX = (LARGURA - extensaoLng * escala) / 2;
  const deslocY = (ALTURA - extensaoLat * escala) / 2;

  const coordenadas = pontos.map(([lng, lat]) => {
    const x = deslocX + (lng - minLng) * escala;
    // Latitude cresce para o norte, y cresce para baixo.
    const y = deslocY + (maxLat - lat) * escala;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const partida = coordenadas[0]!.split(",");

  return (
    <svg
      viewBox={`0 0 ${LARGURA} ${ALTURA}`}
      className={cn("h-auto w-full", className)}
      role="img"
      aria-label={descricao}
      preserveAspectRatio="xMidYMid slice"
    >
      {comGrade ? (
        <g aria-hidden="true">
          <rect width={LARGURA} height={ALTURA} fill="#EAEAE6" />
          {Array.from({ length: Math.ceil(LARGURA / 38) }, (_, i) => (
            <line
              key={`v${i}`}
              x1={i * 38}
              y1={0}
              x2={i * 38}
              y2={ALTURA}
              stroke="#E0E0DB"
            />
          ))}
          {Array.from({ length: Math.ceil(ALTURA / 38) }, (_, i) => (
            <line
              key={`h${i}`}
              x1={0}
              y1={i * 38}
              x2={LARGURA}
              y2={i * 38}
              stroke="#E0E0DB"
            />
          ))}
          {/* Duas avenidas mais largas, para a malha não ficar uniforme. */}
          <rect x={0} y={54} width={LARGURA} height={9} fill="#DEDED9" />
          <rect x={96} y={0} width={9} height={ALTURA} fill="#DEDED9" />
        </g>
      ) : null}

      <polyline
        points={coordenadas.join(" ")}
        fill="none"
        stroke="var(--trace)"
        strokeWidth={comGrade ? 6 : 3}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect={comGrade ? undefined : "non-scaling-stroke"}
      />

      {comPartida ? (
        <circle cx={partida[0]} cy={partida[1]} r={7} fill="var(--ink)" />
      ) : null}
    </svg>
  );
}
