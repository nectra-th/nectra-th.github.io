import type { ReactNode } from "react";

/* Design Bible (not linked from the site, noindexed) — the single reference
   page for designers: every colour token, both font families, all 13
   typography roles with their per-breakpoint specs, the full button system
   (3 variants × 4 states × 3 device sizes, live + static state swatches),
   breakpoints, motion values, and site-wide conventions. Values here mirror
   globals.css and the Figma Design System file ("03 Components") — if those
   change, update this page. */

export const metadata = { title: "Design Bible — Grech Jewellers", robots: { index: false } };

const COLORS = [
  { name: "ink", hex: "#141312", note: "Primary dark background (hero, dark bands)" },
  { name: "ink-2", hex: "#211f1c", note: "Raised dark surface (card hover on dark)" },
  { name: "ink-3", hex: "#2e2c2c", note: "Tertiary dark" },
  { name: "ink-text", hex: "#2e2926", note: "Headings on light backgrounds" },
  { name: "cream", hex: "#ede5d7", note: "Light band background" },
  { name: "cream-light", hex: "#f8f3ea", note: "Lightest surface + text on dark" },
  { name: "cream-card", hex: "#f3eddf", note: "Card fill on light (pillar hover)" },
  { name: "cream-alt", hex: "#efe6d6", note: "Alt light surface (time slots)" },
  { name: "gold", hex: "#b88c46", note: "Primary interaction gold (buttons, accents)" },
  { name: "gold-dark", hex: "#9c7430", note: "Hover gold / rules / eyebrows on light" },
  { name: "gold-light", hex: "#c0985a", note: "Eyebrows on dark" },
  { name: "rule", hex: "#c8b08a", note: "Section-boundary rules (4px borders)" },
  { name: "divider", hex: "#d8cbb7", note: "Content dividers, card borders" },
  { name: "line", hex: "#cfc6b8", note: "Body copy on dark, mobile menu nav" },
  { name: "body", hex: "#575757", note: "Body copy on light" },
  { name: "body-2", hex: "#625b52", note: "Muted serif captions" },
  { name: "muted", hex: "#9f968a", note: "Disabled text, secondary borders" },
];

const TYPE_ROLES: [string, string, string, string, string, string][] = [
  // class, sample, mobile, tablet, desktop, used in
  [".text-h1", "Expert Craftsmanship.", "36px Bold / lh36", "36px Regular / lh36", "56px SemiBold / lh64", "Hero heading only"],
  [".text-h2", "Every Meaningful Piece", "32px SemiBold / lh34.5", "32px Bold / lh36", "56px SemiBold / lh64", "Section titles (6 sections)"],
  [".text-h2-caps", "Our Four Pillars of Trust", "36px / 110% / 0.04em", "24px / 110%", "36px / 115%", "Four Pillars + Brands titles (small-caps)"],
  [".text-h2-closing", "A Conversation Today", "32px / 121% / 0.03em", "24px / 108%", "40px / 121%", "Closing CTA title (small-caps)"],
  [".text-h3-card", "Family Craftsmanship", "24px / 130%", "18px / 130%", "24px / 115%", "Four Pillars card titles (small-caps)"],
  [".text-h3-service", "Custom Jewellery", "21px / 108% / 0.02em", "18.96px / 0.03em", "24px → 28px @xl", "What We Do card titles (small-caps)"],
  [".text-eyebrow", "Since 1978", "16px / 0.12em", "16px / 0.12em", "22px / 0.12em", "Gold eyebrow labels (small-caps)"],
  [".text-eyebrow-lg", "Plan Your Visit", "17px / 0.03em", "16px / 0.12em", "24px / 0.03em", "Gold-light eyebrows (Find Us, Closing)"],
  [".text-body", "Since 1978, Grech Jewellers has combined…", "14px Medium / lh25", "14px Medium / lh18", "18px Regular / lh27", "Shared body copy"],
  [".text-body-sm", "Family owned since 1978…", "15px Light / lh22", "12px Light / lh16", "14px Regular / lh21", "Four Pillars descriptions"],
  [".text-body-xs", "Designed and handcrafted…", "13px Medium / 157%", "9.48px", "13px → 14px @xl", "Service card descriptions"],
  [".text-cta", "Book a Consultation", "14px Bold / 0.06em", "12px", "14px → 16px @lg", "Button labels (uppercase)"],
  [".text-label", "First Time Visiting?", "14px SemiBold", "10px", "14px", "Small uppercase meta labels"],
];

const BTN_STATES: { state: string; p: [string, string, string]; s: [string, string, string]; e: [string, string, string] }[] = [
  // [bg, border, text]
  { state: "Default", p: ["#b88c46", "#b88c46", "#141312"], s: ["transparent", "#9f968a", "#f8f3ea"], e: ["transparent", "#9c7430", "#9c7430"] },
  { state: "Hover", p: ["#9c7430", "#9c7430", "#f8f3ea"], s: ["#211f1c", "#c8b08a", "#b58a47"], e: ["#9c7430", "#9c7430", "#141312"] },
  { state: "Pressed", p: ["#8e682a", "#8e682a", "#f8f3ea"], s: ["#1b1917", "#9c7430", "#c8b08a"], e: ["#8e682a", "#8e682a", "#f8f3ea"] },
  { state: "Disabled", p: ["#d8cbb7", "#d8cbb7", "#9f968a"], s: ["transparent", "#39342e", "#9f968a"], e: ["transparent", "#d8cbb7", "#9f968a"] },
];

function Section({ n, title, note, dark = false, children }: { n: string; title: string; note?: string; dark?: boolean; children: ReactNode }) {
  return (
    <section className={`${dark ? "bg-ink text-cream-light" : ""} border-t border-line`}>
      <div className="mx-auto max-w-[1100px] px-6 py-12">
        <span className="font-sans text-[12px] font-bold uppercase tracking-[0.14em] text-gold-dark">{n}</span>
        <h2 className={`mt-1 font-serif text-3xl font-semibold ${dark ? "text-cream-light" : "text-ink-text"}`}>{title}</h2>
        {note && <p className={`mt-2 max-w-2xl font-sans text-[13px] leading-relaxed ${dark ? "text-line" : "text-[#575757]"}`}>{note}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

function StateBtn({ label, spec, size }: { label: string; spec: [string, string, string]; size: "m" | "t" | "d" }) {
  const dims = size === "t"
    ? { height: 41, padding: "0 20px", fontSize: 12, letterSpacing: "0.72px" }
    : size === "d"
      ? { height: 56, padding: "0 36px", fontSize: 16, letterSpacing: "0.96px" }
      : { height: 56, padding: "0 28px", fontSize: 14, letterSpacing: "0.84px" };
  return (
    <span
      className="inline-flex items-center justify-center whitespace-nowrap rounded-[4px] font-sans font-bold uppercase"
      style={{ ...dims, backgroundColor: spec[0], border: `1px solid ${spec[1]}`, color: spec[2] }}
    >
      {label}
    </span>
  );
}

export default function DesignBible() {
  return (
    <main className="bg-cream-light pb-24">
      <header className="mx-auto max-w-[1100px] px-6 pb-10 pt-16">
        <p className="text-eyebrow text-gold-dark">Grech Jewellers</p>
        <h1 className="fig-trim mt-3 font-serif text-5xl font-semibold text-ink-text">Design Bible</h1>
        <p className="mt-4 max-w-2xl font-sans text-[14px] leading-relaxed text-[#575757]">
          The living reference for every token used on grechjewellers: colours, type roles,
          the button system, breakpoints and conventions. Sources: <code>globals.css</code> and
          the Figma Design System (&ldquo;03 Components&rdquo;). Resize the window to see the
          responsive roles change tier.
        </p>
      </header>

      <Section n="01" title="Colour" note="Every @theme token. Gold #b88c46 is the reconciled primary (the interaction system + shadow work all use it); #b58a47 appears only in legacy Figma fills and the Featured/Find Us eyebrows.">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {COLORS.map((c) => (
            <div key={c.name} className="overflow-hidden rounded-lg border border-divider bg-white">
              <div className="h-16" style={{ backgroundColor: c.hex }} />
              <div className="p-3">
                <p className="font-sans text-[13px] font-bold text-ink-text">--color-{c.name}</p>
                <p className="font-mono text-[12px] uppercase text-[#575757]">{c.hex}</p>
                <p className="mt-1 font-sans text-[11px] leading-snug text-[#9f968a]">{c.note}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section n="02" title="Fonts" note="Two families only. Serif for headings/eyebrows/captions, sans for body and UI. Small-caps roles use font-variant, not an uppercase transform.">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-divider bg-white p-6">
            <p className="font-serif text-4xl text-ink-text">Cormorant Garamond</p>
            <p className="mt-2 font-sans text-[12px] text-[#575757]">--font-serif · weights 400 / 600 / 700 · headings, eyebrows, small-caps captions</p>
          </div>
          <div className="rounded-lg border border-divider bg-white p-6">
            <p className="font-sans text-4xl text-ink-text">Manrope</p>
            <p className="mt-2 font-sans text-[12px] text-[#575757]">--font-sans · weights 300–700 · body copy, buttons, labels, nav</p>
          </div>
        </div>
      </Section>

      <Section n="03" title="Typography roles" note="13 shared classes in globals.css. Each renders live below at the CURRENT viewport tier; the table lists all three tiers (mobile base / md 768+ / lg 1024+). Every value is verified against its own Figma artboard — several roles genuinely shrink or change weight at tablet.">
        <div className="flex flex-col gap-6">
          {TYPE_ROLES.map(([cls, sample, m, t, d, used]) => (
            <div key={cls} className="rounded-lg border border-divider bg-white p-5">
              <p className={`${cls.slice(1)} fig-trim text-ink-text`}>{sample}</p>
              <div className="mt-4 grid gap-1 border-t border-divider pt-3 font-sans text-[12px] text-[#575757] sm:grid-cols-[140px_1fr_1fr_1fr_1fr]">
                <code className="font-bold text-gold-dark">{cls}</code>
                <span><b>mobile</b> {m}</span>
                <span><b>tablet</b> {t}</span>
                <span><b>desktop</b> {d}</span>
                <span className="text-[#9f968a]">{used}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section n="04" title="Buttons" dark note="The 01-Buttons system: .btn + .btn-primary / .btn-secondary / .btn-editorial. Sizing per tier — mobile h56·px28·14px, tablet h41·px20·12px, desktop h56·px36·16px (Secondary pads 42 at desktop, per its own wider Figma set). Shadow 0 2px 8px 25% on Hover only. The top row is LIVE (hover/press it); rows below are static renderings of each state. Editorial is Figma desktop-only. The header nav CTA, menu Call button, Launch Navigation and Booking-widget controls are separate Figma component families — not these classes.">
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <button className="btn btn-primary">Book a Consultation</button>
          <button className="btn btn-secondary">See Our Work</button>
          <button className="btn btn-editorial">Book a Consultation</button>
          <button className="btn btn-primary" disabled>Disabled</button>
          <span className="font-sans text-[11px] uppercase tracking-wide text-line">← live: hover / press these</span>
        </div>
        {(["m", "t", "d"] as const).map((size) => (
          <div key={size} className="mb-8">
            <p className="mb-3 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-gold-light">
              {size === "m" ? "Mobile — h56 · pad 28 · 14px/0.84" : size === "t" ? "Tablet — h41 · pad 20 · 12px/0.72" : "Desktop — h56 · pad 36 (S: 42) · 16px/0.96"}
            </p>
            <div className="grid gap-3">
              {BTN_STATES.map((row) => (
                <div key={row.state} className="flex flex-wrap items-center gap-3">
                  <span className="w-[72px] shrink-0 font-sans text-[11px] uppercase tracking-wide text-line">{row.state}</span>
                  <StateBtn label="Primary" spec={row.p} size={size} />
                  <StateBtn label="Secondary" spec={row.s} size={size} />
                  <StateBtn label="Editorial" spec={row.e} size={size} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>

      <Section n="05" title="Breakpoints & references" note="Tailwind defaults; each maps to a Figma reference artboard. Content column is a 1180px max-width Container (px-5 / sm:px-6 / lg:px-8 gutters).">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-sans text-[13px] text-ink-text">
            <thead><tr className="border-b border-divider text-left text-[11px] uppercase tracking-wide text-[#9f968a]">
              <th className="py-2 pr-6">Tier</th><th className="pr-6">CSS range</th><th className="pr-6">Figma artboard</th><th>Notes</th>
            </tr></thead>
            <tbody className="[&_td]:py-2 [&_td]:pr-6 [&_tr]:border-b [&_tr]:border-divider/60">
              <tr><td>mobile (base)</td><td>&lt; 768px</td><td>iPhone 13 &amp; 14 — 390px</td><td>Hamburger menu, stacked layouts, seam-straddling hero ring</td></tr>
              <tr><td>tablet (md)</td><td>768–1023px</td><td>iPad Pro 11&quot; — 834px</td><td>Desktop-style nav bar; its OWN compositions, not scaled desktop</td></tr>
              <tr><td>desktop (lg)</td><td>1024px+</td><td>Slide 16:9 — 1920px</td><td>Bleed elements use vw fractions capped at Figma px</td></tr>
              <tr><td>xl</td><td>1280px+</td><td>—</td><td>Only .text-h3-service / .text-body-xs step here</td></tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section n="06" title="Motion & conventions" note="What every new component should inherit.">
        <ul className="grid list-disc gap-3 pl-5 font-sans text-[13px] leading-relaxed text-[#575757] sm:grid-cols-2">
          <li><b>Transitions:</b> 0.5s <code>--ease-smooth</code> (cubic-bezier .45,0,.55,1); entrances use <code>--ease-lux</code>.</li>
          <li><b>Hover lift:</b> interactive cards lift −2px (.gj-lift / .gj-soft); the new button system uses colour+shadow only, no lift.</li>
          <li><b>Reduced motion:</b> all animation/transition collapse to 0.01ms; carousels stop auto-advancing; hero video doesn&rsquo;t autoplay.</li>
          <li><b>fig-trim:</b> text measured from Figma uses <code>text-box-trim</code> cap-height trimming — margins are cap-to-cap, so browser line-boxes match Figma&rsquo;s trimmed boxes.</li>
          <li><b>Hero overlay pattern:</b> one gradient everywhere (&ldquo;Rectangle 23&rdquo;): transparent 47% → short 13% fade → flat 63% ink; vertical on mobile, horizontal (dark side = copy side) from md up. Video is full-opacity — the gradient is the only dimmer.</li>
          <li><b>Gold rules:</b> 2px <code>gold-dark</code> bars — 114px under section titles, 64px under band titles, 32px in cards.</li>
          <li><b>Section boundaries:</b> dark bands close with a 4px <code>--color-rule</code> bottom border.</li>
          <li><b>Radius:</b> buttons 4px · cards 12px (rounded-xl) · media 16px (rounded-2xl); full-bleed mobile media drops rounding.</li>
          <li><b>Carousel dots:</b> 10px <code>divider</code> dots, active = 26px <code>gold</code> pill.</li>
          <li><b>Interaction classes:</b> legacy <code>.gj-*</code> set still powers nav links, calendar cells, time slots, gallery arrows, review cards — see globals.css.</li>
        </ul>
      </Section>

      <Section n="07" title="Booking system" note="The booking widget's own Figma component family ('03 Components / Booking System') — distinct from the 01-Buttons system. All values below are the literal component-set states; in code they live in the .gj-datecell / .gj-navarrow / .gj-field / .gj-timeslot classes. Shadow on hover = 0 2px 8px 25%, same as buttons. Error red #d84b4b is the system's only non-palette colour.">
        <div className="flex flex-col gap-10">
          <div>
            <p className="mb-3 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-gold-dark">Booking CTA — 334×48 · radius 8 · 15px text #ede5d7</p>
            <div className="flex flex-wrap items-center gap-3">
              {[["Default", "#b88c46", "#ede5d7", false], ["Hover (+shadow)", "#b58a47", "#ede5d7", true], ["Pressed", "#8e682a", "#ede5d7", false], ["Loading", "#b88c46", "#ede5d7", false], ["Disabled", "#d8cbb7", "#9f968a", false]].map(([label, bg, txt, sh]) => (
                <span key={label as string} className="inline-flex h-12 items-center justify-center rounded-lg px-8 font-sans text-[15px]" style={{ backgroundColor: bg as string, color: txt as string, boxShadow: sh ? "0 2px 8px rgba(0,0,0,0.25)" : undefined }}>{label as string}</span>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-gold-dark">Time Button — 162×43 · 15px</p>
            <div className="flex flex-wrap items-center gap-3">
              {[["Default", "#f8f3ea", "#d8cbb7", "#403b37", false], ["Hover (+shadow)", "#efe6d6", "#9c7430", "#2e2926", true], ["Selected", "#b88c46", "#b88c46", "#ede5d7", false], ["Disabled", "#f8f3ea", "#d8cbb7", "#cfc6b8", false], ["Unavailable", "#f3eddf", "#d8cbb7", "#9f968a", false]].map(([label, bg, bd, txt, sh]) => (
                <span key={label as string} className="inline-flex h-[43px] w-[162px] items-center justify-center font-sans text-[15px]" style={{ backgroundColor: bg as string, border: `1px solid ${bd}`, color: txt as string, boxShadow: sh ? "0 2px 8px rgba(0,0,0,0.25)" : undefined }}>{label as string}</span>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-gold-dark">Calendar Day — 40px circle · 15px</p>
            <div className="flex flex-wrap items-center gap-4">
              {[["7", "Default", "transparent", "transparent", "#403b37"], ["8", "Hover", "#f3eddf", "#d8cbb7", "#2e2926"], ["9", "Today", "transparent", "#403b37", "#2e2926"], ["10", "Selected", "#b88c46", "#b88c46", "#f8f3ea"], ["11", "Disabled / outside / unavailable", "transparent", "transparent", "#625b52"]].map(([d, label, bg, bd, txt]) => (
                <span key={label} className="flex flex-col items-center gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full font-sans text-[15px]" style={{ backgroundColor: bg, border: `1px solid ${bd}`, color: txt }}>{d}</span>
                  <span className="font-sans text-[10px] uppercase text-[#9f968a]">{label}</span>
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-gold-dark">Month Toggle Arrow — 32×32</p>
            <div className="flex flex-wrap items-center gap-4">
              {[["Default", "#f8f3ea", "#d8cbb7", "#9c7430", false], ["Hover (+shadow)", "#f3eddf", "#9c7430", "#8e682a", true], ["Pressed (+shadow)", "#f8f3ea", "#9c7430", "#8e682a", true]].map(([label, bg, bd, ic, sh]) => (
                <span key={label as string} className="flex flex-col items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full font-sans text-[14px]" style={{ backgroundColor: bg as string, border: `1px solid ${bd}`, color: ic as string, boxShadow: sh ? "0 2px 8px rgba(0,0,0,0.25)" : undefined }}>‹</span>
                  <span className="font-sans text-[10px] uppercase text-[#9f968a]">{label as string}</span>
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-gold-dark">Inputs (Text / Select / Phone) — 334×66 incl. label · 14px · label #625b52 · error #d84b4b</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[["Default", "#d8cbb7", "1px", "Your name", "#9f968a"], ["Hover", "#9c7430", "1px", "Your name", "#9f968a"], ["Focus", "#9c7430", "2px", "Your name|", "#2e2926"], ["Filled", "#d8cbb7", "1px", "David Grech", "#2e2926"], ["Error", "#d84b4b", "1px", "Required field", "#d84b4b"]].map(([label, bd, bw, val, txt]) => (
                <div key={label}>
                  <p className="font-sans text-[14px] text-[#625b52]">Full name <span className="text-[10px] uppercase text-[#9f968a]">— {label}</span></p>
                  <div className="mt-2 flex h-11 items-center rounded bg-white px-3 font-sans text-[14px]" style={{ border: `${bw} solid ${bd}`, color: txt }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-gold-dark">Checkbox — 24×24 · radius 2</p>
            <div className="flex flex-wrap items-center gap-4">
              {[["Default", "#ede5d7", "#d8cbb7", ""], ["Ticked", "#9c7430", "#9c7430", "✓"], ["Pressed", "#8e682a", "#8e682a", "✓"]].map(([label, bg, bd, mark]) => (
                <span key={label} className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-[2px] font-sans text-[14px] text-cream-light" style={{ backgroundColor: bg, border: `1px solid ${bd}` }}>{mark}</span>
                  <span className="font-sans text-[10px] uppercase text-[#9f968a]">{label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
