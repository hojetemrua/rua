/**
 * Ícones: SVG inline, traço fino, monocromáticos, herdando currentColor.
 * Sem emoji e sem biblioteca de ícones.
 */

type IconeProps = {
  className?: string;
};

function Base({
  className,
  children,
}: IconeProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
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

/** Hoje — folha do dia. */
export function IconeHoje({ className }: IconeProps) {
  return (
    <Base className={className}>
      <rect x="3.5" y="5" width="17" height="15" rx="3" />
      <path d="M3.5 9.5h17" />
      <path d="M8 3.5v3M16 3.5v3" />
      <circle cx="12" cy="14.5" r="1.4" fill="currentColor" stroke="none" />
    </Base>
  );
}

/** Plano — a semana empilhada. */
export function IconePlano({ className }: IconeProps) {
  return (
    <Base className={className}>
      <path d="M4 7h16" />
      <path d="M4 12h11" />
      <path d="M4 17h6" />
    </Base>
  );
}

/** Correr — cronômetro. */
export function IconeCorrer({ className }: IconeProps) {
  return (
    <Base className={className}>
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M12 13.5V9.5" />
      <path d="M9.5 2.5h5" />
      <path d="M12 2.5v3" />
    </Base>
  );
}

/** Comunidade — mais de um. */
export function IconeComunidade({ className }: IconeProps) {
  return (
    <Base className={className}>
      <circle cx="9" cy="9" r="3.2" />
      <path d="M3.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <path d="M16 6.4a3.2 3.2 0 0 1 0 6.2" />
      <path d="M17.5 15.2c1.9.6 3.2 2.3 3.2 4.3" />
    </Base>
  );
}

/** Perfil — um. */
export function IconePerfil({ className }: IconeProps) {
  return (
    <Base className={className}>
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M5 20c0-3.4 3.1-5.8 7-5.8s7 2.4 7 5.8" />
    </Base>
  );
}

/** Seta para a direita — "veja mais". */
export function IconeSeta({ className }: IconeProps) {
  return (
    <Base className={className}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </Base>
  );
}

/** Confirmação discreta, usada no retorno da lista de espera. */
export function IconeConfirmado({ className }: IconeProps) {
  return (
    <Base className={className}>
      <path d="M4.5 12.5l5 5 10-11" />
    </Base>
  );
}
