import Link from "next/link";
import type { ReactNode } from "react";

/* Design-token reference (not linked from the site). Every colour, type style,
   shadow, rule, radius and motion value used across the homepage — with its
   Figma-derived spec — so the design can be audited token-by-token. */

export const metadata = { title: "Design System — Grech Jewellers", robots: { index: false } };

function Section({ n, title, note, children }: { n: string; title: string; note?: string; children: ReactNode }) {
  return (
    <section className="border-t border-line pt-10">
      <div className="mb-6">
        <span className="font-sans text-[12px] font-bold uppercase tracking-[0.14em] text-gold-dark">{n}</span>
        <h2 className="mt-1 font-serif text-3xl font-semibold text-ink-text">{title}</h2>
        {note && <p className="mt-1 max-w-2xl font-sans text-[13px] text-[#575757]">{note}</p>}
      </div>
      {children}
    </section>
  );
}

/* ---------------- Colours ---------------- */
type Swatch = { name: string; varName: string; hex: string; use: string; light?: boolean };
const INK: Swatch[] = [
  { name: "Ink", varName: "--color-ink", hex: "#141312", use: "Page/hero background, primary-button text" },
  { name: "Ink 2", varName: "--color-ink-2", hex: "#211f1c", use: "Dark sections (services), footer" },
  { name: "Ink 3", varName: "--color-ink-3", hex: "#2e2c2c", use: "Quality-strip text" },
  { name: "Ink Text", varName: "--color-ink-text", hex: "#2e2926", use: "Headings & body on light" },
];
const CREAM: Swatch[] = [
  { name: "Cream", varName: "--color-cream", hex: "#ede5d7", use: "Primary light section background", light: true },
  { name: "Cream Light", varName: "--color-cream-light", hex: "#f8f3ea", use: "Cards, panels, text on dark", light: true },
  { name: "Cream Card", varName: "--color-cream-card", hex: "#f3eddf", use: "Review / first-time cards", light: true },
  { name: "Cream Alt", varName: "--color-cream-alt", hex: "#efe6d6", use: "Alternate fill", light: true },
];
const GOLD: Swatch[] = [
  { name: "Gold", varName: "--color-gold", hex: "#b88c46", use: "Primary — CTAs, active states, eyebrows, rules, icons" },
  { name: "Gold Dark", varName: "--color-gold-dark", hex: "#9c7430", use: "Hover/pressed gold, eyebrow text, rules on cream" },
  { name: "Gold Light", varName: "--color-gold-light", hex: "#c0985a", use: "Light-gold accents, secondary eyebrow" },
];
const SUPPORT: Swatch[] = [
  { name: "Rule", varName: "--color-rule", hex: "#c8b08a", use: "Section-boundary rules", light: true },
  { name: "Divider", varName: "--color-divider", hex: "#d8cbb7", use: "Content dividers, card borders", light: true },
  { name: "Line", varName: "--color-line", hex: "#cfc6b8", use: "Input borders, hairlines", light: true },
  { name: "Body", varName: "--color-body", hex: "#575757", use: "Secondary body text" },
  { name: "Body Warm", varName: "(#403b37)", hex: "#403b37", use: "Card body copy on cream" },
  { name: "Body 2", varName: "--color-body-2", hex: "#625b52", use: "Muted warm text" },
  { name: "Muted", varName: "--color-muted", hex: "#9f968a", use: "Faint / copyright" },
];

function SwatchCard({ s }: { s: Swatch }) {
  return (
    <div className="w-[168px]">
      <div className={`h-20 rounded-lg ${s.light ? "border border-line" : ""}`} style={{ background: s.hex }} />
      <p className="mt-2 font-sans text-[13px] font-semibold text-ink-text">{s.name}</p>
      <p className="font-mono text-[12px] uppercase text-[#575757]">{s.hex}</p>
      <p className="font-mono text-[11px] text-[#9f968a]">{s.varName}</p>
      <p className="mt-1 font-sans text-[11px] leading-snug text-[#575757]">{s.use}</p>
    </div>
  );
}
function SwatchRow({ label, items }: { label: string; items: Swatch[] }) {
  return (
    <div className="mb-7">
      <h3 className="mb-3 font-sans text-[12px] font-bold uppercase tracking-[0.1em] text-ink-text/70">{label}</h3>
      <div className="flex flex-wrap gap-5">{items.map((s) => <SwatchCard key={s.name} s={s} />)}</div>
    </div>
  );
}

/* ---------------- Type ---------------- */
type Type = { role: string; spec: string; cls: string; sample: string; dark?: boolean; style?: React.CSSProperties };
const TYPE: Type[] = [
  { role: "H1 / H2 heading", spec: "Cormorant Garamond · 56 / 64 · 600 · tracking 0", cls: "font-serif text-[56px] leading-[64px] font-semibold text-ink-text", sample: "Adelaide’s Trusted" },
  { role: "H2 · Find Us", spec: "Cormorant · 56 · 700 · tracking −0.84", cls: "font-serif text-[56px] font-bold text-ink-text", sample: "Find Us", style: { letterSpacing: "-0.84px" } },
  { role: "H2 · Closing", spec: "Cormorant · 40 / 48 · 600 · tracking 1.2 · small-caps", cls: "font-serif text-[40px] leading-[48px] font-semibold text-ink-text [font-variant:small-caps]", sample: "A Conversation Today", style: { letterSpacing: "1.2px" } },
  { role: "Section heading", spec: "Cormorant · 36 / 41 · 600 · tracking 1.44 · small-caps", cls: "font-serif text-[36px] leading-[41px] font-semibold text-ink-text [font-variant:small-caps]", sample: "Our Four Pillars of Trust", style: { letterSpacing: "1.44px" } },
  { role: "Service card title", spec: "Cormorant · 28 / 30 · 400 · tracking 0.84 · small-caps · cream on dark", cls: "font-serif text-[28px] leading-[30px] text-cream-light [font-variant:small-caps]", sample: "Custom Jewellery", dark: true, style: { letterSpacing: "0.84px" } },
  { role: "Card title", spec: "Cormorant · 24 / 28 · 600 · tracking 0.72 · small-caps", cls: "font-serif text-[24px] leading-[28px] font-semibold text-ink-text [font-variant:small-caps]", sample: "Family Craftsmanship", style: { letterSpacing: "0.72px" } },
  { role: "Eyebrow (primary)", spec: "Cormorant · 22 · 600 · tracking 0.12em · uppercase · gold-dark", cls: "font-serif text-[22px] font-semibold uppercase tracking-[0.12em] text-gold-dark", sample: "Why Grech" },
  { role: "Tagline strip", spec: "Cormorant · 20 · 400 · tracking 2 · small-caps", cls: "font-serif text-[20px] tracking-[0.1em] text-ink-3 [font-variant:small-caps]", sample: "quality. integrity. craftsmanship. since 1978." },
  { role: "Body copy", spec: "Manrope · 18 / 27 · 400", cls: "font-sans text-[18px] leading-[27px] text-[#403b37]", sample: "Since 1978, Grech Jewellers has combined traditional craftsmanship with modern design technology." },
  { role: "CTA / button label", spec: "Manrope · 16 / 22 · 700 · tracking 0.06em · uppercase", cls: "font-sans text-[16px] font-bold uppercase tracking-[0.06em] text-ink-text", sample: "Book a Consultation" },
  { role: "Column heading / tab", spec: "Manrope · 16 · 700 · gold", cls: "font-sans text-[16px] font-bold uppercase tracking-[0.04em] text-gold", sample: "Explore" },
  { role: "Card body", spec: "Manrope · 14 / 21 · 400 · body-warm", cls: "font-sans text-[14px] leading-[21px] text-[#403b37]", sample: "Family owned since 1978, creating every piece with decades of hands-on experience." },
  { role: "Process label", spec: "Manrope · 14 / 18 · 500 · tracking 1 · uppercase", cls: "font-sans text-[14px] leading-[18px] font-medium uppercase tracking-[0.08em] text-ink-text", sample: "Stone Setting" },
  { role: "Footer link", spec: "Manrope · 14 / 30 · 400", cls: "font-sans text-[14px] leading-[30px] text-[#575757]", sample: "About · Services · Process" },
  { role: "Nav link", spec: "Manrope · 12 / 16 · 400 · tracking 0.14em · uppercase", cls: "font-sans text-[12px] leading-[16px] uppercase tracking-[0.14em] text-ink-text", sample: "What We Do" },
];

/* ---------------- Shadows ---------------- */
const SHADOWS = [
  { role: "Product / ring (rest)", val: "0 6px 20px rgba(0,0,0,0.25)" },
  { role: "Ring hover (elevated)", val: "0 16px 40px rgba(0,0,0,0.34)" },
  { role: "Service card", val: "0 20px 55px rgba(0,0,0,0.28)" },
  { role: "Soft ambient (photos)", val: "0 22px 60px rgba(20,19,18,0.12)" },
  { role: "Booking widget", val: "0 20px 60px -20px rgba(20,19,18,0.25)" },
  { role: "Review card hover", val: "0 16px 40px rgba(20,19,18,0.12)" },
];

const RADII = [
  { role: "Buttons", v: "2px" }, { role: "Inputs / small", v: "8px" }, { role: "Thumbnails / cards", v: "12px" }, { role: "Photos / panels", v: "16px" }, { role: "Circles (steps, social)", v: "9999px" },
];

export default function DesignSystem() {
  return (
    <div className="min-h-screen bg-cream-light">
      <main className="mx-auto max-w-[1180px] px-5 py-12 sm:px-6 lg:px-8">
        <header className="mb-10">
          <p className="font-sans text-[12px] font-bold uppercase tracking-[0.14em] text-gold-dark">Grech Jewellers</p>
          <h1 className="mt-1 font-serif text-4xl font-semibold text-ink-text">Design System</h1>
          <p className="mt-2 max-w-2xl font-sans text-[15px] text-[#575757]">
            Every colour, type style, shadow, rule and motion value used on the site — with its Figma-derived spec — for a token-by-token design audit.
            Interactions live on <Link href="/review" className="text-gold-dark underline">/review</Link>.
          </p>
        </header>

        <div className="flex flex-col gap-10">
          <Section n="01" title="Typefaces" note="Two families. Cormorant Garamond for display/headings; Manrope for UI/body.">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-xl border border-line p-6">
                <p className="font-serif text-[52px] leading-none text-ink-text">Aa</p>
                <p className="mt-3 font-sans text-[13px] font-semibold text-ink-text">Cormorant Garamond</p>
                <p className="font-sans text-[12px] text-[#575757]">Display · weights 400 / 500 / 600 / 700 · <span className="font-mono">font-serif</span></p>
                <p className="mt-2 font-serif text-[20px] text-ink-text">The quick brown fox — 1978</p>
              </div>
              <div className="rounded-xl border border-line p-6">
                <p className="font-sans text-[52px] font-semibold leading-none text-ink-text">Aa</p>
                <p className="mt-3 font-sans text-[13px] font-semibold text-ink-text">Manrope</p>
                <p className="font-sans text-[12px] text-[#575757]">UI / body · weights 400 / 500 / 600 / 700 · <span className="font-mono">font-sans</span></p>
                <p className="mt-2 font-sans text-[16px] text-ink-text">The quick brown fox — 1978</p>
              </div>
            </div>
          </Section>

          <Section n="02" title="Colour palette" note="Brand gold reconciled to #b88c46 (matches all interaction states + Figma shadow tokens).">
            <SwatchRow label="Ink / dark" items={INK} />
            <SwatchRow label="Cream / light" items={CREAM} />
            <SwatchRow label="Gold / brand" items={GOLD} />
            <SwatchRow label="Support (rules, dividers, body text)" items={SUPPORT} />
          </Section>

          <Section n="03" title="Typography scale" note="Rendered at spec. Each row: role · font · size / line-height · weight · tracking.">
            <div className="flex flex-col divide-y divide-line">
              {TYPE.map((t) => (
                <div key={t.role} className={`grid items-center gap-4 py-5 md:grid-cols-[220px_1fr] ${t.dark ? "" : ""}`}>
                  <div>
                    <p className="font-sans text-[13px] font-semibold text-ink-text">{t.role}</p>
                    <p className="font-mono text-[11px] leading-tight text-[#575757]">{t.spec}</p>
                  </div>
                  <div className={t.dark ? "rounded-lg bg-ink px-5 py-4" : ""}>
                    <p className={`${t.cls} truncate`} style={t.style}>{t.sample}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section n="04" title="Elevation / shadows" note="Figma drop-shadow tokens. Warm ambient rgba(20,19,18,·) on light surfaces; neutral black on product photography.">
            <div className="flex flex-wrap gap-8">
              {SHADOWS.map((s) => (
                <div key={s.role} className="w-[240px]">
                  <div className="h-28 rounded-2xl bg-cream" style={{ boxShadow: s.val }} />
                  <p className="mt-4 font-sans text-[13px] font-semibold text-ink-text">{s.role}</p>
                  <p className="font-mono text-[11px] text-[#575757]">{s.val}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section n="05" title="Rules & dividers" note="Gold underlines mark section headers; hairlines separate content.">
            <div className="flex flex-col gap-6">
              <div><span aria-hidden className="block h-0.5 w-[114px] bg-gold-dark" /><p className="mt-2 font-mono text-[11px] text-[#575757]">Hero rule — gold-dark · 114 × 2px</p></div>
              <div><span aria-hidden className="block h-0.5 w-16 bg-gold-dark" /><p className="mt-2 font-mono text-[11px] text-[#575757]">Section rule — gold-dark · 64 × 2px</p></div>
              <div><span aria-hidden className="block h-px w-full max-w-md bg-line" /><p className="mt-2 font-mono text-[11px] text-[#575757]">Hairline — line #cfc6b8 · 1px</p></div>
              <div><span aria-hidden className="block h-px w-full max-w-md bg-divider" /><p className="mt-2 font-mono text-[11px] text-[#575757]">Content divider — divider #d8cbb7 · 1px</p></div>
            </div>
          </Section>

          <Section n="06" title="Radii & motion">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-3 font-sans text-[12px] font-bold uppercase tracking-[0.1em] text-ink-text/70">Corner radii</h3>
                <div className="flex flex-wrap gap-4">
                  {RADII.map((r) => (
                    <div key={r.role} className="text-center">
                      <div className="h-16 w-16 border border-gold-dark/50 bg-cream" style={{ borderRadius: r.v }} />
                      <p className="mt-2 font-sans text-[11px] text-ink-text">{r.role}</p>
                      <p className="font-mono text-[11px] text-[#575757]">{r.v}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 font-sans text-[12px] font-bold uppercase tracking-[0.1em] text-ink-text/70">Motion</h3>
                <ul className="flex flex-col gap-2 font-sans text-[13px] text-ink-text">
                  <li><span className="font-semibold">Hover / lift</span> — 0.5s · <span className="font-mono text-[12px] text-[#575757]">cubic-bezier(0.45, 0, 0.55, 1)</span> · translateY(−2px)</li>
                  <li><span className="font-semibold">Scroll reveal</span> — 700ms · <span className="font-mono text-[12px] text-[#575757]">cubic-bezier(0.22, 1, 0.36, 1)</span> · translateY(24px) + fade</li>
                  <li><span className="font-semibold">Ring crossfade</span> — swap 3s · fade 1s</li>
                  <li><span className="font-semibold">Underline / dots</span> — 260–300ms ease</li>
                  <li className="text-[#575757]">All motion is disabled under <span className="font-mono text-[12px]">prefers-reduced-motion</span>.</li>
                </ul>
              </div>
            </div>
          </Section>
        </div>

        <footer className="mt-14 border-t border-line pt-6">
          <p className="font-sans text-[12px] text-[#9f968a]">Grech Jewellers — design tokens · derived from the Figma source of truth.</p>
        </footer>
      </main>
    </div>
  );
}
