"use client";

import { useState } from "react";
import { CTAButton } from "../components/home/ui";
import RotatingImage from "../components/home/RotatingImage";
import { ArrowLeft, ArrowRight, Quote, Instagram, Facebook, Diamond } from "../components/icons";

/* eslint-disable @next/next/no-img-element */

/* Interaction review page (not linked from the site). Every hover/click element
   is laid out here with the SAME classes/styles as production + a caption saying
   what SHOULD happen, so each state can be verified in one place. */

function Panel({ title, note, dark = false, children }: { title: string; note?: string; dark?: boolean; children: React.ReactNode }) {
  return (
    <section className={`rounded-2xl border p-6 ${dark ? "border-white/10 bg-ink text-cream-light" : "border-line bg-cream-light text-ink-text"}`}>
      <h2 className="font-serif text-2xl font-semibold">{title}</h2>
      {note && <p className={`mt-1 text-[13px] ${dark ? "text-cream-light/60" : "text-[#575757]"}`}>{note}</p>}
      <div className="mt-5 flex flex-wrap items-start gap-x-8 gap-y-6">{children}</div>
    </section>
  );
}

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex min-h-[52px] items-center">{children}</div>
      <span className="max-w-[15rem] text-[12px] leading-snug text-current opacity-60">{label}</span>
    </div>
  );
}

const RINGS = ["/assets/figma-img/ring-rot-1.png", "/assets/figma-img/ring-rot-2.png", "/assets/figma-img/ring-rot-3.png"];
const THUMBS = [
  "/assets/figma-img/65f309ab217b0a54da7f69aa805c868bdeea725f.webp",
  "/assets/figma-img/81d578de67f967d51b2236c979ea7972051da24b.webp",
  "/assets/figma-img/2c63e483982c2795ce6bfb52aaa2beaa608229c5.webp",
  "/assets/figma-img/633d28daa0a85b2f44a77bed4fa60769d9c5a3e5.webp",
];

export default function ReviewPage() {
  const [time, setTime] = useState("10:00AM");
  const [day, setDay] = useState(15);
  const [tab, setTab] = useState(0);
  const [dot, setDot] = useState(0);
  const [thumb, setThumb] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const softBtn: React.CSSProperties = { border: "1px solid var(--color-line)", background: "transparent", color: "var(--color-ink-text)", borderRadius: 8, height: 44, padding: "0 18px", fontSize: 15, cursor: "pointer" };
  const arrowBtn: React.CSSProperties = { width: 36, height: 36, borderRadius: 6, border: "1px solid rgba(181,138,71,0.5)", background: "transparent", color: "var(--color-gold)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" };

  return (
    <div className="min-h-screen bg-cream">
    <main className="mx-auto max-w-[1180px] px-5 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-serif text-4xl font-semibold text-ink-text">Interaction Review</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-[#575757]">
          Every hover / click element on the site, in one place. <strong>Hover</strong> each element and <strong>click</strong> the
          selectable ones (times, dates, tabs, thumbnails, dots). Each caption states what should happen — flag anything that doesn&rsquo;t match.
        </p>
        <p className="mt-3 text-[13px] text-[#575757]">
          Colours, typography &amp; shadows → <a href="/design" className="font-semibold text-gold-dark underline">/design</a>
        </p>
      </header>

      <div className="flex flex-col gap-6">
        {/* BUTTONS */}
        <Panel title="1 · Buttons" note="All lift 2px on hover with a colour change; press (active) removes the lift + darkens further.">
          <Item label="Primary (gold) → hover #9c7430 + lift · press #8e682a"><CTAButton href="#" variant="gold">Book a Consultation</CTAButton></Item>
          <Item label="Text link with animated underline → gold underline slides in from left">
            <a href="#" className="link-underline text-[15px] font-semibold text-ink-text">Read more</a>
          </Item>
        </Panel>

        <Panel title="1b · Buttons on dark" dark note="Outline-gold = header CTA (fills gold on hover). Dark = secondary (fills ink). Nav links brighten + lift.">
          <Item label="Nav CTA (outline-gold) → fills #b88c46 + text dark + lift · press #9c7430"><CTAButton href="#" variant="outlineGold">Book a Consultation</CTAButton></Item>
          <Item label="Secondary (dark) → fills #211f1c + lift · press #1b1917"><CTAButton href="#" variant="dark">See Our Work</CTAButton></Item>
          <Item label="Nav link → text brightens to #f8f3ea + lift 2px">
            <a href="#" className="gj-navlink link-underline text-[12px] font-medium uppercase tracking-[0.14em] text-cream-light/85">Why Grech</a>
          </Item>
        </Panel>

        {/* SOFT CONTROLS */}
        <Panel title="2 · Booking — time slots & calendar" note="Soft controls: gold border + faint wash + 2px lift on hover; press adds a tiny scale. Selected = solid gold.">
          <Item label="Time slot → hover: gold border + wash + lift · selected: gold fill">
            <div className="flex gap-2.5">
              {["9:00AM", "10:00AM", "11:00AM"].map((t) => {
                const on = time === t;
                return (
                  <button key={t} className="gj-soft" onClick={() => setTime(t)} aria-pressed={on}
                    style={{ ...softBtn, border: `1px solid ${on ? "#b88c46" : "var(--color-line)"}`, background: on ? "#b88c46" : "transparent", color: on ? "var(--color-ink)" : "var(--color-ink-text)", fontWeight: on ? 600 : 400 }}>{t}</button>
                );
              })}
            </div>
          </Item>
          <Item label="Date cell → hover: wash + inset gold ring + lift · selected: gold circle · today: gold ring outline">
            <div className="flex gap-2">
              {[14, 15, 16].map((d) => {
                const on = day === d;
                return (
                  <button key={d} className="gj-soft gj-datecell" onClick={() => setDay(d)} aria-pressed={on}
                    style={{ width: 40, height: 40, borderRadius: "50%", border: "none", cursor: "pointer", fontSize: 15, color: on ? "var(--color-ink)" : "var(--color-ink-text)", background: on ? "#b88c46" : "transparent", fontWeight: on ? 600 : 400, boxShadow: d === 16 && !on ? "inset 0 0 0 1px rgba(181,138,71,0.6)" : "none" }}>{d}</button>
                );
              })}
              <button disabled className="gj-soft gj-datecell" style={{ width: 40, height: 40, borderRadius: "50%", border: "none", fontSize: 15, color: "rgba(87,87,87,0.3)", textDecoration: "line-through", background: "transparent" }}>3</button>
            </div>
          </Item>
          <Item label="Month arrows (soft) → gold border + wash + lift">
            <div className="flex gap-2">
              <button className="gj-soft" style={arrowBtn} aria-label="prev"><ArrowLeft style={{ width: 15, height: 15 }} /></button>
              <button className="gj-soft" style={arrowBtn} aria-label="next"><ArrowRight style={{ width: 15, height: 15 }} /></button>
            </div>
          </Item>
        </Panel>

        {/* FORM FIELDS */}
        <Panel title="3 · Form fields" note="Focus each field with Tab or click. Expected: subtle focus indication; checkbox uses gold accent.">
          <Item label="Text input → focus ring">
            <input placeholder="Your name" style={{ height: 44, width: 220, border: "1px solid var(--color-line)", borderRadius: 8, background: "#fff", padding: "0 14px", fontSize: 14, color: "var(--color-ink-text)" }} />
          </Item>
          <Item label="Select → focus ring">
            <select style={{ height: 44, width: 220, border: "1px solid var(--color-line)", borderRadius: 8, background: "#fff", padding: "0 14px", fontSize: 14, color: "var(--color-ink-text)" }}>
              <option>How did you hear about us?</option><option>Google</option>
            </select>
          </Item>
          <Item label="Checkbox → gold accent">
            <label className="flex items-center gap-2 text-[13px] text-ink-text"><input type="checkbox" style={{ width: 18, height: 18, accentColor: "var(--color-gold)" }} /> I agree</label>
          </Item>
        </Panel>

        {/* CARDS */}
        <Panel title="4 · Cards (hover to lift)" note="Pillar & service cards lift 1px; the review card gains a gold border + shadow + lift; the ring card lifts 2px with a deeper shadow.">
          <Item label="Four-Pillar card → lift + icon gold-light + rule widens (hover the whole card)">
            <div className="group flex w-[180px] cursor-default flex-col items-center rounded-xl border border-line p-4 text-center transition-transform duration-500 ease-[cubic-bezier(0.45,0,0.55,1)] hover:-translate-y-1">
              <Diamond className="h-10 w-12 text-gold-dark transition-colors duration-500 group-hover:text-gold-light" />
              <h3 className="mt-3 font-serif text-[18px] font-semibold text-ink-text [font-variant:small-caps]">Family Craftsmanship</h3>
              <span className="mt-2 h-0.5 w-8 bg-gold-dark/70 transition-all duration-500 group-hover:w-11" />
            </div>
          </Item>
          <Item label="Review card (.gj-review-card) → gold border + shadow + lift">
            <figure className="gj-review-card w-[260px] rounded-lg border border-divider bg-cream-card p-6">
              <Quote className="h-5 w-6 text-gold" />
              <p className="mt-3 text-[13px] leading-relaxed text-[#403b37]">Outstanding craftsmanship and personal service from start to finish.</p>
              <figcaption className="mt-4 text-[13px] font-semibold text-ink-text">— Sample Client</figcaption>
            </figure>
          </Item>
          <Item label="Ring media card (.gj-lift) → lift 2px + shadow deepens">
            <div className="gj-lift relative h-[130px] w-[156px] overflow-hidden rounded-xl border-2 border-divider" style={{ boxShadow: "0 6px 20px rgba(0,0,0,0.25)", boxSizing: "border-box" }}>
              <RotatingImage srcs={RINGS} intervalMs={3000} fadeMs={1000} bgSize="cover" bgPos="center" />
            </div>
          </Item>
        </Panel>

        {/* GALLERY */}
        <Panel title="5 · Featured gallery" dark note="Arrows: gold fill on hover. Thumbnails: click to select — active thumb gets a gold outline; inactive dim to 70% and brighten on hover.">
          <Item label="Gallery arrows → border→gold fill + icon dark on hover">
            <div className="flex gap-2.5">
              {(["left", "right"] as const).map((d) => (
                <button key={d} className="flex h-11 w-11 items-center justify-center rounded-full border border-cream-light/30 bg-ink/45 text-cream-light transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-ink">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d={d === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              ))}
            </div>
          </Item>
          <Item label="Thumbnails → click selects (gold outline); inactive 70% → hover 100%">
            <div className="flex gap-2.5">
              {THUMBS.map((src, i) => (
                <button key={src} onClick={() => setThumb(i)} aria-current={thumb === i}
                  className={`h-[70px] w-[84px] rounded-lg bg-cover bg-center transition-all duration-300 ${thumb === i ? "opacity-100 outline outline-2 outline-offset-[-2px] outline-gold" : "opacity-70 hover:opacity-100"}`}
                  style={{ backgroundImage: `url(${src})` }} />
              ))}
            </div>
          </Item>
        </Panel>

        {/* TABS + DOTS */}
        <Panel title="6 · Find Us tabs & carousel dots" note="Tab: click to activate (gold + underline); inactive darkens on hover; arrow keys move between tabs. Dots: click to select (active is gold + wider).">
          <Item label="Tabs → active gold + underline · inactive hover darkens · ← → keys">
            <div role="tablist" aria-label="demo" className="flex gap-6"
              onKeyDown={(e) => { if (e.key === "ArrowRight") setTab((t) => (t + 1) % 3); if (e.key === "ArrowLeft") setTab((t) => (t + 2) % 3); }}>
              {["Our Store", "Shopping Centre Map", "Google Maps"].map((t, i) => {
                const on = tab === i;
                return (
                  <button key={t} role="tab" aria-selected={on} tabIndex={on ? 0 : -1} onClick={() => setTab(i)}
                    className={`text-[13px] font-bold uppercase tracking-[0.06em] transition-colors duration-300 ${on ? "text-gold" : "text-ink-text/70 hover:text-ink-text"}`}>
                    <span className={on ? "border-b-2 border-gold pb-0.5" : "pb-0.5"}>{t}</span>
                  </button>
                );
              })}
            </div>
          </Item>
          <Item label="Carousel dots → click to select (active gold + wider)">
            <div className="flex gap-2.5">
              {[0, 1, 2].map((i) => (
                <button key={i} onClick={() => setDot(i)} aria-current={dot === i} aria-label={`slide ${i + 1}`}
                  className="h-2.5 rounded-full transition-all duration-300"
                  style={{ width: dot === i ? 26 : 10, background: dot === i ? "var(--color-gold)" : "var(--color-divider)" }} />
              ))}
            </div>
          </Item>
        </Panel>

        {/* LINKS + SOCIAL */}
        <Panel title="7 · Footer links, social & closing CTA" dark note="Footer links go gold on hover. Social circles: gold border + gold icon on hover. Closing link: text lightens + arrow slides right.">
          <Item label="Footer link → text gold on hover">
            <a href="#" className="text-[14px] text-cream-light/70 transition-colors hover:text-gold">Services</a>
          </Item>
          <Item label="Social circles → gold border + gold icon on hover">
            <div className="flex gap-3">
              <a href="#" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-light/20 text-cream-light/80 transition-colors hover:border-gold hover:text-gold"><Instagram className="h-[18px] w-[18px]" /></a>
              <a href="#" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-light/20 text-cream-light/80 transition-colors hover:border-gold hover:text-gold"><Facebook className="h-[18px] w-[18px]" /></a>
            </div>
          </Item>
          <Item label="Closing CTA link → text lightens + arrow slides right">
            <a href="#" className="group inline-flex items-center gap-2 text-[15px] font-bold uppercase tracking-[0.08em] text-gold transition-colors hover:text-gold-light">
              Start a Conversation
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">›</span>
            </a>
          </Item>
        </Panel>

        {/* MOBILE MENU */}
        <Panel title="8 · Mobile menu (open / close)" note="Click to open the full-screen menu; the hamburger and close button, plus focus trapping, are the real component behaviour on mobile.">
          <Item label="Hamburger → opens overlay · Close ✕ → gold circle fills on hover">
            <button onClick={() => setMenuOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-md border border-ink/20">
              <span className="relative block h-4 w-6"><span className="absolute left-0 top-0 h-0.5 w-full bg-ink-text" /><span className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-ink-text" /><span className="absolute bottom-0 left-0 h-0.5 w-full bg-ink-text" /></span>
            </button>
          </Item>
        </Panel>
      </div>

      {menuOpen && (
        <div role="dialog" aria-modal="true" aria-label="Menu demo" className="fixed inset-0 z-[100] flex flex-col bg-ink">
          <div className="flex h-[72px] items-center justify-end px-5">
            <button aria-label="Close menu" onClick={() => setMenuOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/60 text-gold transition-colors hover:bg-gold hover:text-ink">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-1 px-6">
            {["Why Grech", "What We Do", "Our Process", "Our Creations", "Contact"].map((n) => (
              <a key={n} href="#" onClick={() => setMenuOpen(false)} className="border-b border-cream-light/10 py-4 font-serif text-2xl text-cream-light transition-colors hover:text-gold">{n}</a>
            ))}
          </nav>
        </div>
      )}
    </main>
    </div>
  );
}
