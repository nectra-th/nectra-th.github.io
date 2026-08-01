import Link from "next/link";
import type { ReactNode } from "react";

/* Shared homepage primitives. Self-contained so the whole `home/` tree can be
   reasoned about (and the old transpiler tree deleted) without cross-coupling. */

/** Centred content column (max 1180px) with responsive gutters. */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1180px] px-5 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

type Variant = "gold" | "dark" | "outlineGold" | "outlineGoldOnCream";

/* CTA button. gold/dark/outlineGoldOnCream now sit on the shared BUTTON
   SYSTEM classes in globals.css (.btn + .btn-primary/-secondary/-editorial —
   the Figma "01 Buttons" component sets, all four states, per-device
   sizing built in); call sites keep their artboard-verified per-instance
   size overrides so resting layout is pixel-identical to the pre-migration
   rendering. outlineGold stays on the legacy path: it reproduces the
   NAVIGATION CTA component (a different Figma sheet with its own states),
   not a 01-Buttons instance. */
const BTN_VARIANTS: Partial<Record<Variant, string>> = {
  gold: "btn btn-primary",
  dark: "btn btn-secondary",
  outlineGoldOnCream: "btn btn-editorial",
};

export function CTAButton({
  // radius default verified against two independent Figma instances (header
  // CTA + hero primary button) — both use 4px, not 2px.
  children, href, onClick, type = "button", variant = "gold", radius = "rounded-[4px]", className = "",
}: {
  children: ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  type?: "button" | "submit";
  variant?: Variant;
  radius?: string;
  className?: string;
}) {
  const cls = BTN_VARIANTS[variant]
    ? `${BTN_VARIANTS[variant]} shrink-0 ${className}`
    : `inline-flex shrink-0 items-center justify-center whitespace-nowrap ${radius} px-7 py-3.5 text-cta lg:px-9 lg:py-4 ` +
      `gj-outline-gold border border-[#b58a47] text-[#f8f3ea] ${className}`;
  if (href) {
    const external = href.startsWith("#") || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
    return external
      ? <a href={href} onClick={onClick} className={cls}>{children}</a>
      : <Link href={href} className={cls}>{children}</Link>;
  }
  return <button type={type} onClick={onClick} className={cls}>{children}</button>;
}
