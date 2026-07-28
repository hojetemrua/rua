/**
 * Ícones: SVG inline, traço fino, monocromáticos, herdando currentColor.
 * Sem emoji e sem biblioteca de ícones.
 *
 * Os desenhos vêm do protótipo "Home rua.run" no Claude Design.
 */

type IconeProps = {
  className?: string;
  /** Espessura do traço; o design usa 2 no geral e 2.4 nas setas. */
  traco?: number;
};

function Base({
  className,
  traco = 2,
  children,
}: IconeProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={traco}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Home                                                                        */
/* -------------------------------------------------------------------------- */

/** Relógio — selo "abre em 2026". */
export function IconeRelogio(props: IconeProps) {
  return (
    <Base {...props} traco={props.traco ?? 2.4}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Base>
  );
}

/** Seta para a direita — botões e chamadas. */
export function IconeSeta(props: IconeProps) {
  return (
    <Base {...props} traco={props.traco ?? 2.4}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </Base>
  );
}

/** Confirmação — marcadores da seção escura e retorno da lista. */
export function IconeConfirmado(props: IconeProps) {
  return (
    <Base {...props} traco={props.traco ?? 2.6}>
      <path d="M20 6 9 17l-5-5" />
    </Base>
  );
}

/** Envelope — campo de e-mail e contato. */
export function IconeEmail(props: IconeProps) {
  return (
    <Base {...props}>
      <rect width="20" height="16" x="2" y="4" rx="4" />
      <path d="m22 8-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 8" />
    </Base>
  );
}

/** Tênis — o corredor. */
export function IconeCorredor(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M2 16.5v-1.3c0-.7.4-1.4 1-1.7L6 12V8a2 2 0 0 1 2-2h1.8c.6 0 1.2.3 1.6.8l2.2 3c.3.4.8.7 1.3.9l4.3 1.2C20.6 12.3 22 13.3 22 15a2.5 2.5 0 0 1-2.5 2.5H3.5A1.5 1.5 0 0 1 2 16Z" />
      <path d="m6.5 11.5 3.5-1.5" />
      <path d="m10.5 8.5 2.5 2.5" />
      <path d="M2 15h20" />
    </Base>
  );
}

/** Prancheta — o assessor. */
export function IconeAssessor(props: IconeProps) {
  return (
    <Base {...props}>
      <rect width="8" height="4" x="8" y="2" rx="2" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </Base>
  );
}

/** Mais de um — a comunidade. */
export function IconeComunidade(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Base>
  );
}

/** Play em círculo — passo "abrir". */
export function IconeAbrir(props: IconeProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
    </Base>
  );
}

/** Rota — passo "correr". */
export function IconeCorrer(props: IconeProps) {
  return (
    <Base {...props}>
      <circle cx="6" cy="19" r="3" />
      <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
      <circle cx="18" cy="5" r="3" />
    </Base>
  );
}

/** Bandeira — passo "fechar". */
export function IconeFechar(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" x2="4" y1="22" y2="15" />
    </Base>
  );
}

/* -------------------------------------------------------------------------- */
/* Rodapé                                                                      */
/* -------------------------------------------------------------------------- */

export function IconeInstagram(props: IconeProps) {
  return (
    <Base {...props}>
      <rect width="20" height="20" x="2" y="2" rx="6" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </Base>
  );
}

export function IconeTikTok(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M10 10.5v5.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M10 10.5V3h1.4A5.6 5.6 0 0 0 17 8.6V10" />
    </Base>
  );
}

export function IconeYouTube(props: IconeProps) {
  return (
    <Base {...props}>
      <rect width="20" height="14" x="2" y="5" rx="5" />
      <polygon points="10 9 15 12 10 15 10 9" fill="currentColor" stroke="none" />
    </Base>
  );
}

/** Olho — contas do mês. */
export function IconeContas(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </Base>
  );
}

/** Seta para baixo — roadmap. */
export function IconeRoadmap(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M12 13v8" />
      <path d="M12 3v3" />
      <path d="m5 6 7 7 7-7" />
    </Base>
  );
}

/** Código e licença. */
export function IconeCodigo(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </Base>
  );
}

/* -------------------------------------------------------------------------- */
/* Aplicativo do corredor e painel do assessor                                 */
/* -------------------------------------------------------------------------- */

/** Calendário — aba Hoje e o selo de data. */
export function IconeHoje(props: IconeProps) {
  return (
    <Base {...props}>
      <rect width="18" height="18" x="3" y="4" rx="4" />
      <path d="M3 10h18" />
      <path d="M8 2v4" />
      <path d="M16 2v4" />
    </Base>
  );
}

/** Prancheta — aba Plano. Mesmo desenho do assessor: é a planilha dele. */
export function IconePlano(props: IconeProps) {
  return (
    <Base {...props}>
      <rect width="8" height="4" x="8" y="2" rx="2" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M8 11h.01" />
    </Base>
  );
}

/** Play em círculo — aba Correr. */
export function IconeGravar(props: IconeProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </Base>
  );
}

/** Perfil — uma pessoa. */
export function IconePerfil(props: IconeProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M6 21v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1" />
    </Base>
  );
}

/** Chevron para a esquerda — voltar. */
export function IconeVoltar(props: IconeProps) {
  return (
    <Base {...props} traco={props.traco ?? 2.2}>
      <path d="m15 18-6-6 6-6" />
    </Base>
  );
}

/** Chevron para a direita — avançar e abrir. */
export function IconeAvancar(props: IconeProps) {
  return (
    <Base {...props} traco={props.traco ?? 2.2}>
      <path d="m9 18 6-6-6-6" />
    </Base>
  );
}

/** Balão — recado do assessor. */
export function IconeRecado(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </Base>
  );
}

/** Coração — frequência cardíaca. */
export function IconeBpm(props: IconeProps) {
  return (
    <Base {...props} traco={props.traco ?? 2.4}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </Base>
  );
}

/** Montanha — ganho de elevação. */
export function IconeSubida(props: IconeProps) {
  return (
    <Base {...props} traco={props.traco ?? 2.4}>
      <path d="m3 18 6-9 4 5 3-4 5 8H3Z" />
    </Base>
  );
}

/** Pulso — quem está correndo agora. */
export function IconePulso(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M3 12h4l3 8 4-16 3 8h4" />
    </Base>
  );
}

/** Círculo cortado — treino que não rolou. */
export function IconeNaoRolou(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M10.7 4.3a9 9 0 0 1 9 9" />
      <path d="M4.3 10.7a9 9 0 0 0 9 9" />
      <path d="M2 2l20 20" />
    </Base>
  );
}

/** Círculo vazio — treino previsto. */
export function IconePrevisto(props: IconeProps) {
  return (
    <Base {...props} traco={props.traco ?? 2.4}>
      <circle cx="12" cy="12" r="9" />
    </Base>
  );
}

/** Pausa. */
export function IconePausar(props: IconeProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={props.className}>
      <rect x="6" y="4" width="4.5" height="16" rx="1.6" />
      <rect x="13.5" y="4" width="4.5" height="16" rx="1.6" />
    </svg>
  );
}

/** Parar. */
export function IconeEncerrar(props: IconeProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={props.className}>
      <rect x="5" y="5" width="14" height="14" rx="3" />
    </svg>
  );
}

/** Avião de papel — mandar um oi. */
export function IconeEnviar(props: IconeProps) {
  return (
    <Base {...props} traco={props.traco ?? 2.2}>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </Base>
  );
}

/** Mais — novo treino. */
export function IconeMais(props: IconeProps) {
  return (
    <Base {...props} traco={props.traco ?? 2.4}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </Base>
  );
}

/** Barras — biblioteca de treinos. */
export function IconeBiblioteca(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="m16 6 4 14" />
      <path d="M12 6v14" />
      <path d="M8 8v12" />
      <path d="M4 4v16" />
    </Base>
  );
}

/** Pessoa com traço — quem ainda não apareceu. */
export function IconeSumido(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M18 21a6 6 0 0 0-12 0" />
      <circle cx="12" cy="11" r="4" />
      <path d="M3 3l18 18" />
    </Base>
  );
}

/** Engrenagem — ajustes e privacidade. */
export function IconeAjustes(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M12.2 2h-.4a2 2 0 0 0-2 2v.2a2 2 0 0 1-1 1.7l-.4.2a2 2 0 0 1-2 0l-.2-.1a2 2 0 0 0-2.7.7l-.2.4a2 2 0 0 0 .7 2.7l.2.1a2 2 0 0 1 1 1.7v.5a2 2 0 0 1-1 1.7l-.2.2a2 2 0 0 0-.7 2.7l.2.3a2 2 0 0 0 2.7.8l.2-.1a2 2 0 0 1 2 0l.4.2a2 2 0 0 1 1 1.7V20a2 2 0 0 0 2 2h.4a2 2 0 0 0 2-2v-.2a2 2 0 0 1 1-1.7l.4-.2a2 2 0 0 1 2 0l.2.1a2 2 0 0 0 2.7-.8l.2-.3a2 2 0 0 0-.7-2.7l-.2-.2a2 2 0 0 1-1-1.7v-.5a2 2 0 0 1 1-1.7l.2-.1a2 2 0 0 0 .7-2.7l-.2-.4a2 2 0 0 0-2.7-.7l-.2.1a2 2 0 0 1-2 0l-.4-.2a2 2 0 0 1-1-1.7V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </Base>
  );
}

/** Mapa de nome para componente, para o conteúdo poder escolher pelo nome. */
export const ICONES = {
  corredor: IconeCorredor,
  assessor: IconeAssessor,
  comunidade: IconeComunidade,
  abrir: IconeAbrir,
  correr: IconeCorrer,
  fechar: IconeFechar,
  instagram: IconeInstagram,
  tiktok: IconeTikTok,
  youtube: IconeYouTube,
  contas: IconeContas,
  roadmap: IconeRoadmap,
  codigo: IconeCodigo,
  email: IconeEmail,
  hoje: IconeHoje,
  plano: IconePlano,
  gravar: IconeGravar,
  perfil: IconePerfil,
  recado: IconeRecado,
  biblioteca: IconeBiblioteca,
} as const;

export type NomeDeIcone = keyof typeof ICONES;
