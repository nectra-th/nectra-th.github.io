import Image from "next/image";
import { Container } from "./ui";
import SectionHeader from "./SectionHeader";

/* eslint-disable @next/next/no-img-element */

const BLUEPRINT = "/assets/figma-img/c14f17656e3eed8c249125dc63041ce9154d0701.png";

const SERVICES = [
  { title: ["Custom", "Jewellery"], icon: "ic-custom", img: "/assets/figma-img/cropped/170a0dc03a4a67f171f5bbfcbc64747037945dde.png", desc: "Designed and handcrafted to reflect your story, style and vision." },
  { title: ["Engagement &", "Wedding Rings"], icon: "ic-rings", img: "/assets/figma-img/cropped/c5c992b48e443701e426c3606eda9e7413009670.png", desc: "Beautifully crafted rings for life’s most important moments." },
  { title: ["Jewellery", "Repairs"], icon: "ic-anvil", img: "/assets/figma-img/cropped/f481b2b8396296b95352a977041180e3aafb449a.png", desc: "Expert repairs and restorations to bring treasured pieces back to life." },
  { title: ["Valuations"], icon: "ic-magnifier", img: "/assets/figma-img/cropped/4ac7c8fe6797951d87385b00fd3ba3e144263657.png", desc: "Independent jewellery valuations for insurance, estates and peace of mind." },
  { title: ["Antique", "Jewellery"], icon: "ic-pendant", img: "/assets/figma-img/cropped/a3a7e179e1e16f7a5392d7ee70b87cf294ca2051.png", desc: "Restoring and preserving antique jewellery while respecting its original character." },
  { title: ["Watch", "Services"], icon: "ic-watch", img: "/assets/figma-img/cropped/a0ea27c7ddd271697692c04050ca9bbdd77a11ec.png", desc: "Professional servicing, repairs and battery replacements provided for quality timepieces." },
];

/* Figma's "Custom-Jewellery" icon (compId 1:236) is literally the same ring
   glyph reused on all 6 cards — per request, using the site's distinct
   per-service icon set instead (ic-custom/rings/anvil/magnifier/pendant/watch,
   already colour-matched to this section's gold #B58A47 — two of them
   (anvil/magnifier) are shared with Four Pillars and sit a shade darker at
   #9C7430, a pre-existing minor inconsistency in those two asset files). */
function ServiceCard({ s }: { s: (typeof SERVICES)[number] }) {
  return (
    <li className="group w-[80%] shrink-0 snap-center sm:w-auto">
      <div className="flex gap-4 rounded-[20px] border border-transparent px-3 py-4 transition-[transform,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.45,0,0.55,1)] will-change-transform group-hover:[transform:translateY(-2px)] group-hover:border-[#39342e] group-hover:bg-ink-2 group-hover:shadow-[0_28px_32px_rgba(0,0,0,0.25)] md:gap-4">
        {/* pre-cropped via scripts/crop-service-images.mjs against Figma's own
           imageTransform window for each photo (an independent, non-uniform
           X/Y crop per image — none of them is a plain centred crop), then
           object-fill (not object-cover) to reproduce Figma's scaleMode
           STRETCH exactly — a generic aspect-preserving cover crop would trim
           part of the framing this was cropped to already, or letterbox it. */}
        <div className="relative aspect-[188/240] w-[110px] shrink-0 overflow-hidden rounded-[14px] sm:w-[140px] xl:w-[188px]">
          <Image src={s.img} alt={s.title.join(" ")} fill sizes="(min-width: 1280px) 188px, (min-width: 640px) 140px, 110px" className="object-fill" />
        </div>
        <div className="min-w-0 flex-1">
          <img src={`/assets/icons/${s.icon}.png`} alt="" aria-hidden loading="lazy" decoding="async" className="h-9 w-auto xl:h-12" />
          <h3 className="fig-trim mt-4 text-h3-service text-cream-light">
            {s.title.map((t, i) => (
              <span key={i} className="block">{t}</span>
            ))}
          </h3>
          <span aria-hidden className="mt-[18px] block h-px w-[41px] bg-gold-dark" />
          <p className="mt-5 text-body-xs text-line">{s.desc}</p>
        </div>
      </div>
    </li>
  );
}

/* What We Do — dark editorial band. Header on the left (no CTA row, per
   request), six service cards (2×3 grid at xl, swipeable row below) on the
   right. Figma's copy
   block + services grid together (x=370→1633 on the 1920 canvas) run wider
   than the standard 1180 Container — reproduced with the same vw-fraction
   technique used for the Four Pillars offset, capped at the reference px
   values so it can't overflow or outgrow Figma's size. */
export default function WhatWeDo() {
  return (
    <section id="whatwedo" aria-label="What We Do" className="relative overflow-hidden bg-ink border-b-4 border-[#c8b08a] py-16 md:py-24 xl:pt-[348px] xl:pb-[220px]">
      {/* faint ring blueprint, bleeding off the left edge — 45% opacity per
         Figma (not the 20% previously guessed), bottom-anchored since the
         section's real height is content-driven, not the fixed px Figma
         measured it against. Figma sits it 205px left of the content block's
         own left edge (165 vs 370) — anchored to that same edge (the
         content's margin-left formula below) rather than an independent vw
         value, so it tracks the content instead of staying glued to the
         viewport edge once the content re-centres on ultra-wide screens. */}
      <img
        src={BLUEPRINT}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute bottom-0 hidden opacity-[0.45] xl:block"
        style={{ left: "calc(max(min(19.2708vw, 370px), (100vw - 1263px) / 2) - 205px)", width: "min(38.9063vw, 747px)" }}
      />

      {/* margin-left blends two rules: below 1920px it scales as the Figma
         ratio (19.2708vw) same as the width does, so the whole block never
         overflows; at/above 1920px both hit their px caps and the second
         term takes over, re-centring the whole 1263px block in the extra
         space — without it, screens wider than 1920 would just freeze the
         left edge at 370px and read as stuck-to-the-left. */}
      <Container className="relative xl:!ml-[max(min(19.2708vw,370px),(100vw_-_1263px)/2)] xl:!mr-0 xl:!w-[min(65.7813vw,1263px)] xl:!max-w-none xl:!px-0">
        {/* Figma's copy block (393px, hug-width) sits only ~4px from the
           services grid's left edge — near-zero, but keeping that gap tiny
           (rather than a "nicer" round value) is what lets the grid column
           render at its true 866px/425px-per-card size within this section's
           measured 1263px band; a bigger gap would shrink every card. */}
        <div className="grid gap-12 xl:grid-cols-[393px_1fr] xl:gap-x-1">
          <div>
            <SectionHeader
              tone="dark"
              eyebrow="What We Do"
              title={<>Crafted Around<br />Your Story</>}
              body="From bespoke engagement rings to treasured family heirlooms, every piece receives the same care, precision and craftsmanship that has defined Grech Jewellers since 1978."
              ruleWidth={114}
            />
          </div>

          <ul
            tabIndex={0}
            aria-label="Our services"
            className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-4 sm:gap-y-8 sm:overflow-visible sm:px-0 xl:gap-x-4 xl:gap-y-8"
          >
            {SERVICES.map((s) => (
              <ServiceCard key={s.title.join(" ")} s={s} />
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
