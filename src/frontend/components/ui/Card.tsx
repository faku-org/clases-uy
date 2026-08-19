import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Resalta la tarjeta como opción destacada */
  featured?: boolean;
};

/**
 * Superficie base de la landing: azul profundo con borde hairline.
 * En hover el borde toma el acento y aparece un halo suave.
 */
export function Card({ children, className = "", featured = false }: Props) {
  return (
    <div
      className={`
        group relative rounded-2xl border transition-all duration-300
        bg-gradient-to-b from-slate-2 to-slate
        ${
          featured
            ? "border-accent/35 shadow-[0_0_0_1px_rgba(33,150,243,0.08),0_18px_50px_-24px_rgba(33,150,243,0.55)]"
            : "border-line hover:border-accent/40 hover:shadow-[0_18px_50px_-28px_rgba(33,150,243,0.5)]"
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/** Casilla del ícono, con anillo de acento */
export function CardIcon({ children }: { children: ReactNode }) {
  return (
    <div className="w-11 h-11 rounded-xl bg-accent/10 ring-1 ring-inset ring-accent/25 flex items-center justify-center text-accent-soft transition-colors duration-300 group-hover:bg-accent/20 group-hover:ring-accent/40">
      {children}
    </div>
  );
}
