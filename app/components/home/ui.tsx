import Link from "next/link";
import type { ReactNode } from "react";

/* Shared homepage primitives. Self-contained so the whole `home/` tree can be
   reasoned about (and the old transpiler tree deleted) without cross-coupling. */

/** Centred content column (max 1180px) with responsive gutters. */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1180px] px-5 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

type Variant = "gold" | "dark" | "outlineGold" | "outlineGoldOnCream";

/* CTA button — Figma spec: Manrope 16px / 700 / uppercase / 0.06em. Base
   appearance here; hover lift + colour transitions come from the approved
   .gj-* classes (0.5s ease-smooth). */
const VARIANTS: Record<Variant, string> = {
  gold: "gj-primary bg-gold text-ink",
  // border colour is Figma's literal muted-line token (#9f968a), not an
  // opacity blend — verified against the Hero "See Our Work" instance.
  dark: "gj-outline border border-[#9f968a] text-cream-light",
  // rest-state: gold border (#b58a47) + cream-light label text — the exact
  // fills read off the Figma header CTA instance. Hover (#b88c46 fill/border,
  // #141312 text) and active (#9c7430) are the reconciled interaction-system
  // values layered on top by .gj-outline-gold.
  outlineGold: "gj-outline-gold border border-[#b58a47] text-[#f8f3ea]",
  // Process section's CTA pair, on a cream (not dark) background — gold-dark
  // border + text at rest, verified against the Figma "Our Process" CTA
  // Group. Reuses .gj-outline-gold's fill-in-on-hover mechanic.
  outlineGoldOnCream: "gj-outline-gold border border-gold-dark text-gold-dark",
};

export function CTAButton({
  // radius default verified against two independent Figma instances (header
  // CTA + hero primary button) — both use 4px, not 2px.
  children, href, onClick, type = "button", variant = "gold", radius = "rounded-[4px]", className = "",
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: Variant;
  radius?: string;
  className?: string;
}) {
  const cls =
    `inline-flex shrink-0 items-center justify-center whitespace-nowrap ${radius} px-7 py-3.5 text-cta lg:px-9 lg:py-4 ` +
    `${VARIANTS[variant]} ${className}`;
  if (href) {
    const external = href.startsWith("#") || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
    return external
      ? <a href={href} className={cls}>{children}</a>
      : <Link href={href} className={cls}>{children}</Link>;
  }
  return <button type={type} onClick={onClick} className={cls}>{children}</button>;
}
