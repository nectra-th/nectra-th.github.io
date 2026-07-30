/* Homepage — section skeleton (starting point).
   Each block is sized to the Figma desktop artboard (heights sum to 11088px),
   with its background colour and a bottom boundary rule. No content yet —
   elements are added section-by-section next. Responsive heights come with the
   content. The previous complete build is backed up at /full. */

import Header from "./components/home/Header";
import Hero from "./components/home/Hero";
import WhyIntro from "./components/home/WhyIntro";
import ScrollReveal from "./components/home/ScrollReveal";

type Shell = { id: string; label: string; h: number; bg: string; rule?: boolean };

// Figma desktop section heights (0 → 11088), verified pixel-for-pixel against
// the exported Figma screenshot. `rule` marks the 7 sections that end at one
// of Figma's real divider lines (Line 14/15/17/18/19/20/21 — 4px, #c8b08a);
// the other boundaries are plain background-colour cuts with no rule.
// Hero and Why Grech are rendered separately above (built section-by-section).
const SECTIONS: Shell[] = [
  { id: "pillars", label: "Four Pillars of Trust", h: 632, bg: "bg-cream", rule: true },
  { id: "whatwedo", label: "What We Do", h: 1458, bg: "bg-ink", rule: true },
  { id: "process", label: "Our Process", h: 1424, bg: "bg-cream", rule: true },
  { id: "featured", label: "Featured Creations", h: 1088, bg: "bg-ink", rule: true },
  { id: "reviews", label: "Reviews", h: 768, bg: "bg-cream", rule: true },
  { id: "brands", label: "Selected Brands", h: 285, bg: "bg-ink", rule: true },
  { id: "book", label: "Book a Consultation", h: 1247, bg: "bg-cream" },
  { id: "findus", label: "Find Us", h: 1216, bg: "bg-ink" },
  { id: "closing", label: "Closing", h: 552, bg: "bg-ink" },
];

export default function Home() {
  return (
    <>
      <Header />
      {/* the header is a fixed overlay ON TOP of the hero video (per Figma —
         its own 108px-tall rect is drawn over the top of the hero, the page
         doesn't reserve space for it), so no top offset here. */}
      <main>
        <Hero />
        <WhyIntro />

        {SECTIONS.map((s) => (
          <section
            key={s.id}
            id={s.id}
            aria-label={s.label}
            className={`${s.bg} ${s.rule ? "border-b-4 border-[#c8b08a]" : ""}`}
            style={{ minHeight: s.h }}
          />
        ))}
      </main>
      <footer aria-label="Footer" className="bg-ink" style={{ minHeight: 416 }} />
      <ScrollReveal />
    </>
  );
}
