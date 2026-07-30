import type { ReactNode } from "react";

/* The recurring editorial section-header pattern, encoding the Figma type scale
   (fluid-scaled for smaller screens):
     eyebrow  — Cormorant 22px w600, tracked, gold-dark, uppercase
     title    — Cormorant 56px w600 (h2)
     rule     — gold-dark divider (114px on the hero, 64px elsewhere)
     body     — Manrope 18px
   `tone` flips colours for dark vs light backgrounds; `align` centres it. */

export function GoldRule({ width = 64, center = false, className = "" }: { width?: number; center?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={`block h-0.5 bg-gold-dark ${center ? "mx-auto" : ""} ${className}`}
      style={{ width, maxWidth: "60vw" }}
    />
  );
}

export function Eyebrow({ children, tone = "gold", className = "" }: { children: ReactNode; tone?: "gold" | "gold-light"; className?: string }) {
  const color = tone === "gold-light" ? "text-gold-light" : "text-gold-dark";
  return (
    <p className={`fig-trim font-serif font-semibold uppercase leading-none tracking-[0.12em] text-[16px] md:text-[19px] lg:text-[22px] ${color} ${className}`}>
      {children}
    </p>
  );
}

export default function SectionHeader({
  eyebrow, title, body, tone = "light", align = "left", ruleWidth = 64, headingId, className = "", children,
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
}) {
  const centered = align === "center";
  const heading = tone === "dark" ? "text-cream-light" : "text-ink-text";
  const bodyColor = tone === "dark" ? "text-cream-light/75" : "text-[#403b37]";
  return (
    <div className={`${centered ? "text-center" : ""} ${className}`}>
      {eyebrow && <Eyebrow className={centered ? "mx-auto" : ""}>{eyebrow}</Eyebrow>}
      <h2
        id={headingId}
        className={`fig-trim mt-4 font-serif font-semibold leading-[1.08] text-[32px] md:text-[44px] lg:text-[56px] lg:leading-[64px] ${heading}`}
      >
        {title}
      </h2>
      <GoldRule width={ruleWidth} center={centered} className="mt-6 lg:mt-8" />
      {body && (
        <p className={`fig-trim mt-7 max-w-[34rem] font-sans text-[15px] leading-relaxed md:text-base lg:text-[18px] lg:leading-[27px] ${bodyColor} ${centered ? "mx-auto" : ""}`}>
          {body}
        </p>
      )}
      {children}
    </div>
  );
}
