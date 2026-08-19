import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
};

/**
 * Encabezado de sección. El eyebrow va en monoespaciada, como la notación
 * al margen de una hoja de ejercicios.
 */
export function SectionHeading({ eyebrow, title, description, align = "center" }: Props) {
  const centered = align === "center";

  return (
    <div className={centered ? "text-center" : ""}>
      <p
        className={`flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-accent-soft mb-4 ${
          centered ? "justify-center" : ""
        }`}
      >
        <span className="h-px w-6 bg-accent/50" aria-hidden="true" />
        {eyebrow}
      </p>

      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white text-balance">
        {title}
      </h2>

      {description && (
        <p
          className={`mt-4 text-gray-400 leading-relaxed max-w-xl ${
            centered ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
