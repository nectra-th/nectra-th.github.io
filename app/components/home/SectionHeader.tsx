import type { ReactNode } from "react";

/* The recurring editorial section-header pattern, encoding the Figma type scale
   (fluid-scaled for smaller screens):
     eyebrow  — Cormorant 22px w600, tracked, gold-dark, uppercase
     title    — Cormorant 56px w600 (h2)
     rule     — gold-dark divider (114px on the hero, 64px elsewhere)
     body     — Manrope 18px
   `tone` flips colours for dark vs light backgrounds; `align` centres it. */

export function GoldRule({
  width = 64,
  center = false,
  className = "",
  color = "bg-gold-dark",
  thickness = "h-0.5",
}: { width?: number; center?: boolean; className?: string; color?: string; thickness?: string }) {
  return (
    <span
      aria-hidden
      className={`block ${thickness} ${color} ${center ? "mx-auto" : ""} ${className}`}
      style={{ width, maxWidth: "60vw" }}
    />
  );
}

export function Eyebrow({ children, tone = "gold", className = "" }: { children: ReactNode; tone?: "gold" | "gold-light"; className?: string }) {
  // Two distinct Figma type specs share this component: the hero's "Since
  // 1978" (gold-dark, 22px, 0.12em tracking) vs. "Plan Your Visit" /
  // "We Look Forward to Meeting You" (gold-light, 24px, 0.03em tracking) —
  // verified against both instances via the Figma API. See the .text-eyebrow*
  // tokens in globals.css for the shared size/weight/tracking scale.
  const color = tone === "gold-light" ? "text-gold-light" : "text-gold-dark";
  const size = tone === "gold-light" ? "text-eyebrow-lg" : "text-eyebrow";
  return (
    <p className={`fig-trim ${size} ${color} ${className}`}>
      {children}
    </p>
  );
}

export default function SectionHeader({
  eyebrow, title, body, tone = "light", align = "left", ruleWidth = 64, headingId, className = "", children, bodyMaxWidth,
  // Per-caller margin overrides (each replaces its default wholesale, so a
  // caller re-states every tier it needs) — added for the per-breakpoint
  // Figma passes, where a section's own artboard specifies different
  // element gaps at one tier without changing the shared defaults.
  titleMargin = "mt-4",
  ruleMargin = "mt-6 lg:mt-8",
  bodyMargin = "mt-7",
  bodyClassName = "",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  ruleWidth?: number;
  headingId?: string;
  className?: string;
  children?: ReactNode; // e.g. a CTA row appended under the body
  bodyMaxWidth?: number; // px override of the default 34rem (544px) — e.g. Reviews' 636px single-line copy
  titleMargin?: string;
  ruleMargin?: string;
  bodyMargin?: string;
  // Appended last so it can override .text-body — for sections whose board
  // genuinely diverges from the shared token (e.g. Reviews' 18px mobile
  // leading vs the token's majority 25px).
  bodyClassName?: string;
}) {
  const centered = align === "center";
  const heading = tone === "dark" ? "text-cream-light" : "text-ink-text";
  // dark body colour is Figma's literal --color-line token (#cfc6b8), not an
  // opacity blend — verified against the What We Do copy-block instance.
  // Light tone's #403b37 must be inline style, not a class: the `.text-body`
  // TYPOGRAPHY token below shares its name with the `--color-body` theme
  // colour, so Tailwind also emits a text-body COLOR utility (#575757) that
  // was silently out-cascading the text-[#403b37] class (caught in the art
  // audit — Why/Process bodies rendered #575757 instead of #403b37).
  const bodyColor = tone === "dark" ? "text-line" : "";
  const bodyStyle = tone === "dark" ? undefined : { color: "#403b37" };
  return (
    <div className={`${centered ? "text-center" : ""} ${className}`}>
      {eyebrow && <Eyebrow className={centered ? "mx-auto" : ""}>{eyebrow}</Eyebrow>}
      <h2
        id={headingId}
        className={`fig-trim ${titleMargin} text-h2 ${heading}`}
      >
        {title}
      </h2>
      <GoldRule width={ruleWidth} center={centered} className={ruleMargin} />
      {body && (
        <p
          className={`fig-trim ${bodyMargin} ${bodyMaxWidth ? "" : "max-w-[34rem]"} text-body ${bodyColor} ${centered ? "mx-auto" : ""} ${bodyClassName}`}
          style={bodyMaxWidth ? { maxWidth: bodyMaxWidth, ...bodyStyle } : bodyStyle}
        >
          {body}
        </p>
      )}
      {children}
    </div>
  );
}
