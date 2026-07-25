import Link from "next/link";
import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1180px] px-6 md:px-8 ${className}`}>
      {children}
    </div>
  );
}

type BtnProps = {
  children: ReactNode;
  href?: string;
  variant?: "gold" | "dark" | "outlineDark" | "outlineLight";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

export function Button({
  children,
  href,
  variant = "gold",
  className = "",
  onClick,
  type = "button",
}: BtnProps) {
  const base =
    "inline-flex items-center justify-center px-7 py-4 text-[13px] font-bold tracking-[0.08em] uppercase rounded-[2px] transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out will-change-transform hover:-translate-y-0.5 active:translate-y-0 active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";
  const styles: Record<string, string> = {
    gold: "bg-gold text-ink hover:bg-gold-dark hover:shadow-lg hover:shadow-gold/25 active:shadow-sm",
    dark: "bg-ink/60 text-cream-light hover:bg-ink-3 border border-cream-light/25 hover:border-cream-light/40 hover:shadow-lg hover:shadow-black/30",
    outlineDark:
      "border border-ink/40 text-ink-text hover:bg-ink hover:text-cream-light hover:border-ink hover:shadow-lg hover:shadow-ink/20",
    outlineLight:
      "border border-white/40 text-white hover:bg-white hover:text-ink hover:shadow-lg hover:shadow-black/25",
  };
  const cls = `${base} ${styles[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

/** Serif eyebrow label with letterspacing, e.g. "WHY GRECH" */
export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={`eyebrow ${className}`}>{children}</span>;
}
