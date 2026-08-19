import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  loading?: boolean;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-accent hover:bg-accent-hover text-white font-semibold shadow-lg shadow-accent/10",
  secondary:
    "bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700",
  ghost: "hover:bg-neutral-800 text-gray-300 hover:text-white",
  outline:
    "border border-neutral-700 hover:border-accent text-white hover:text-accent-soft",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  loading,
  className = "",
  disabled,
  ...props
}: Props) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg
        transition-all duration-150 cursor-pointer select-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
