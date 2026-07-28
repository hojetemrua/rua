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
/* Abas do aplicativo                                                          */
/* -------------------------------------------------------------------------- */

export function IconeHoje({ className }: IconeProps) {
  return (
    <Base className={className} traco={1.5}>
      <rect x="3.5" y="5" width="17" height="15" rx="3" />
      <path d="M3.5 9.5h17" />
      <path d="M8 3.5v3M16 3.5v3" />
      <circle cx="12" cy="14.5" r="1.4" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function IconePlano({ className }: IconeProps) {
  return (
    <Base className={className} traco={1.5}>
      <path d="M4 7h16" />
      <path d="M4 12h11" />
      <path d="M4 17h6" />
    </Base>
  );
}

/** Cronômetro — aba Correr. */
export function IconeCronometro({ className }: IconeProps) {
  return (
    <Base className={className} traco={1.5}>
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M12 13.5V9.5" />
      <path d="M9.5 2.5h5" />
      <path d="M12 2.5v3" />
    </Base>
  );
}

export function IconePerfil({ className }: IconeProps) {
  return (
    <Base className={className} traco={1.5}>
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M5 20c0-3.4 3.1-5.8 7-5.8s7 2.4 7 5.8" />
    </Base>
  );
}

/* -------------------------------------------------------------------------- */

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
} as const;

export type NomeDeIcone = keyof typeof ICONES;
