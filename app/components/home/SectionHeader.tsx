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
}) {
  const centered = align === "center";
  const heading = tone === "dark" ? "text-cream-light" : "text-ink-text";
  // dark body colour is Figma's literal --color-line token (#cfc6b8), not an
  // opacity blend — verified against the What We Do copy-block instance.
  const bodyColor = tone === "dark" ? "text-line" : "text-[#403b37]";
  return (
    <div className={`${centered ? "text-center" : ""} ${className}`}>
      {eyebrow && <Eyebrow className={centered ? "mx-auto" : ""}>{eyebrow}</Eyebrow>}
      <h2
        id={headingId}
        className={`fig-trim mt-4 text-h2 ${heading}`}
      >
        {title}
      </h2>
      <GoldRule width={ruleWidth} center={centered} className="mt-6 lg:mt-8" />
      {body && (
        <p
          className={`fig-trim mt-7 ${bodyMaxWidth ? "" : "max-w-[34rem]"} text-body ${bodyColor} ${centered ? "mx-auto" : ""}`}
          style={bodyMaxWidth ? { maxWidth: bodyMaxWidth } : undefined}
        >
          {body}
        </p>
      )}
      {children}
    </div>
  );
}
