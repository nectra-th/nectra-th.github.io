import Image from "next/image";
import { Container } from "./ui";
import SectionHeader from "./SectionHeader";

/* eslint-disable @next/next/no-img-element */

const BLUEPRINT = "/assets/figma-img/c14f17656e3eed8c249125dc63041ce9154d0701.webp";

const SERVICES = [
  { title: ["Custom", "Jewellery"], icon: "ic-custom", img: "/assets/figma-img/cropped/170a0dc03a4a67f171f5bbfcbc64747037945dde.webp", desc: "Designed and handcrafted to reflect your story, style and vision." },
  // Figma verified: this one heading alone drops to 20px at mobile (not the
  // usual 24px, letterSpacing 0.6px = the same 0.03em ratio) — the only one
  // of the 6 services long enough that it needs a smaller size to stay on
  // one line; every other heading fits at the standard 24px untouched.
  { title: ["Engagement &", "Wedding Rings"], icon: "ic-rings", mobileHeadingPx: 20, img: "/assets/figma-img/cropped/c5c992b48e443701e426c3606eda9e7413009670.webp", desc: "Beautifully crafted rings for life’s most important moments." },
  { title: ["Jewellery", "Repairs"], icon: "ic-anvil", img: "/assets/figma-img/cropped/f481b2b8396296b95352a977041180e3aafb449a.webp", desc: "Expert repairs and restorations to bring treasured pieces back to life." },
  { title: ["Valuations"], icon: "ic-magnifier", img: "/assets/figma-img/cropped/4ac7c8fe6797951d87385b00fd3ba3e144263657.webp", desc: "Independent jewellery valuations for insurance, estates and peace of mind." },
  { title: ["Antique", "Jewellery"], icon: "ic-pendant", img: "/assets/figma-img/cropped/a3a7e179e1e16f7a5392d7ee70b87cf294ca2051.webp", desc: "Restoring and preserving antique jewellery while respecting its original character." },
  { title: ["Watch", "Services"], icon: "ic-watch", img: "/assets/figma-img/cropped/a0ea27c7ddd271697692c04050ca9bbdd77a11ec.webp", desc: "Professional servicing, repairs and battery replacements provided for quality timepieces." },
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
      {/* Mobile is a genuinely different card, not just a smaller one:
         Figma stacks it vertically and centres everything (icon → heading →
         rule above a full-width image, body below), heading is ONE line
         (24px, all 6 services checked — even "Antique Jewellery" fits),
         and the icon is 48px, matching xl's size, not tablet's scaled-down
         32.5px. That's incompatible with the horizontal image-left layout
         below at the DOM level (icon/heading live outside the image at
         mobile, but wrap the same content column as the body at md+), so
         it's a separate markup swapped via md:hidden / hidden md:flex
         rather than one structure reordered with CSS alone. */}
      <div className="flex flex-col items-center gap-[17px] text-center md:hidden">
        <div className="flex flex-col items-center gap-4">
          <img src={`/assets/icons/${s.icon}.png`} alt="" aria-hidden loading="lazy" decoding="async" className="h-12 w-auto" />
          <h3
            className="fig-trim whitespace-nowrap font-serif font-normal leading-[108%] tracking-[0.03em] text-cream-light [font-variant:small-caps]"
            style={{ fontSize: "mobileHeadingPx" in s ? s.mobileHeadingPx : 24 }}
          >
            {s.title.join(" ")}
          </h3>
          <span aria-hidden className="mt-[2px] block h-px w-[41px] bg-gold-dark" />
        </div>
        <div className="relative aspect-[280/240] w-full overflow-hidden rounded-[14px]">
          <Image src={s.img} alt={s.title.join(" ")} fill sizes="90vw" className="object-cover" />
        </div>
        <p className="max-w-[84%] fig-trim font-sans text-sm font-medium leading-[157%] tracking-[-0.03em] text-line">{s.desc}</p>
      </div>

      {/* Tablet/desktop: horizontal, image left + content right. */}
      <div className="hidden gap-4 rounded-[20px] border border-transparent px-3 py-4 transition-[transform,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.45,0,0.55,1)] will-change-transform group-hover:[transform:translateY(-2px)] group-hover:border-[#39342e] group-hover:bg-ink-2 group-hover:shadow-[0_28px_32px_rgba(0,0,0,0.25)] md:flex md:h-[192px] md:gap-[10.84px] md:py-[10.84px] md:px-[10px] xl:h-auto xl:px-3 xl:py-4">
        {/* pre-cropped via scripts/crop-service-images.mjs against Figma's own
           imageTransform window for each photo (an independent, non-uniform
           X/Y crop per image — none of them is a plain centred crop).
           object-cover (not object-fill/stretch) per request — Figma's own
           scaleMode is STRETCH, but reproducing that literally distorts the
           photo whenever the box's rendered aspect ratio drifts from the
           crop's own, which happens often across responsive widths; cover
           keeps every photo looking correct at the cost of sometimes
           trimming a sliver more than Figma's exact crop window.
           Tablet verified across all 6 cards: same 67.7211% scale as the
           type tokens — 127.32px image (aspect ratio unchanged, so height
           derives correctly) and a 9.48px radius, down from 14px. */}
        <div className="relative aspect-[188/240] w-[127.32px] shrink-0 overflow-hidden rounded-[9.48px] xl:w-[188px] xl:rounded-[14px]">
          <Image src={s.img} alt={s.title.join(" ")} fill sizes="(min-width: 1280px) 188px, 127.32px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          {/* icon 32.51px at tablet (48px at xl) — same scale factor again */}
          <img src={`/assets/icons/${s.icon}.png`} alt="" aria-hidden loading="lazy" decoding="async" className="h-[32.51px] w-auto xl:h-12" />
          <h3 className="fig-trim mt-[10.84px] text-h3-service text-cream-light">
            {s.title.map((t, i) => (
              <span key={i} className="block">{t}</span>
            ))}
          </h3>
          {/* rule 27.77px wide at tablet (41px at xl) */}
          <span aria-hidden className="mt-[12.19px] block h-px w-[27.77px] bg-gold-dark xl:w-[41px]" />
          <p className="mt-[13.54px] text-body-xs text-line">{s.desc}</p>
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
    // Explicit request: cards grid row-gap 42.66px→10px at md, so the grid
    // is now 2×32.66px=65.32px shorter — added onto md's own bottom padding
    // (96px→161.32px) instead of top, so the section's total height stays
    // the same as before this change without touching the row-gap's own
    // Figma-verified value anywhere else (xl is untouched).
    // Mobile top padding is Figma's real 144px (section top at y=3654, the
    // "What We Do" eyebrow at y=3798 — both confirmed against the 4px
    // #c8b08a divider lines bounding this section), not the previous 64px
    // guess; height corrected 1386→1390 to match those same two dividers
    // (5044-3654) now that the internal spacing sums to the precise value.
    <section id="whatwedo" aria-label="What We Do" className="relative overflow-hidden bg-ink border-b-4 border-[#c8b08a] pt-36 pb-16 min-h-[1390px] max-h-[1390px] md:min-h-0 md:max-h-none md:pt-24 md:pb-[161.32px] xl:pt-[348px] xl:pb-[220px]">
      {/* faint ring blueprint, bleeding off the left edge — 45% opacity per
         Figma (not the 20% previously guessed), bottom-anchored since the
         section's real height is content-driven, not the fixed px Figma
         measured it against. Confirmed present at tablet too (previously
         `xl:block`-only was a real gap — the Figma-ipad reference clearly
         shows it), but tablet's content sits at a plain fixed inset (the
         standard Container's own sm:px-6 padding, not the vw-fraction
         formula xl needs), so it's simplest as a separate element with a
         flat px position rather than forcing one element to cover both a
         fixed and a dynamic breakpoint. Mobile also has this — a third,
         separate instance (x=-86px, 517px wide, sitting right after the
         cards row) rather than trying to make one image's box cover three
         very different breakpoint positions at once. */}
      <img
        src={BLUEPRINT}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        // max-w-none cancels Tailwind Preflight's `img { max-width: 100% }`
        // — without it, an explicit w-[517px] on a plain <img> still gets
        // capped to the 390px viewport (max-width wins over width whenever
        // they conflict, regardless of class specificity), which is why
        // this rendered both smaller than Figma and, being bottom-anchored,
        // positioned wrong (the missing 127px of height shifted the visible
        // part of the ring down). The tablet/xl versions never hit this
        // because they size via inline `style`, which isn't subject to the
        // stylesheet cascade at all.
        className="pointer-events-none absolute bottom-[-60px] left-[-86px] block w-[517px] max-w-none opacity-[0.45] md:hidden"
      />
      <img
        src={BLUEPRINT}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute bottom-0 left-[-71px] hidden w-[374px] opacity-[0.45] md:block xl:hidden"
      />
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
           measured 1263px band; a bigger gap would shrink every card.
           Tablet is ALSO side-by-side, not stacked — a first pass read this
           as stacked because the header's own node width (347px) overlaps
           the cards' start, but that 347px is a loose box, not tightly
           hugged; visually cropping the actual figma-ipad.jpg reference
           confirmed no overlap. Column width is the body text's own
           explicit, exact 198px (textAutoResize: HEIGHT — a real fixed-
           width constraint, not a hug value like the heading's 347px) —
           an earlier pass used a rougher 228px (eyeballed from where the
           cards visually start in a screenshot) instead of this precise
           figma value, making the column wider than Figma's real one and
           leaving less room than it should for the cards. No separate
           gap-x at md. Column is 210px, not literally 198 — "Crafted
           Around" (the hardcoded first line of the heading) measures
           203.75px at this weight/size with the real fonts loaded, so 198px
           wrapped it a second time into 3 lines total. Figma's body is a
           touch narrower still (198px, its own explicit width) but
           SectionHeader's bodyMaxWidth applies unconditionally (not just at
           this breakpoint) — using it here would also force desktop's body
           down to 198px inside its real 393px column. Left unset; body
           wraps at the full 210px column, ~12px past Figma's exact value. */}
        <div className="grid gap-12 md:grid-cols-[210px_1fr] md:items-start md:gap-x-0 md:gap-y-0 xl:grid-cols-[393px_1fr] xl:gap-x-1">
          <div>
            <SectionHeader
              tone="dark"
              eyebrow="What We Do"
              // Figma mobile: this heading is ONE line (32px, box height 20
              // matches a single cap-height-trimmed line, not two) — the
              // <br/> is md+-only so mobile gets the natural, unbroken flow.
              title={<>Crafted Around<br className="hidden md:inline" /> Your Story</>}
              body="From bespoke engagement rings to treasured family heirlooms, every piece receives the same care, precision and craftsmanship that has defined Grech Jewellers since 1978."
              ruleWidth={114}
            />
          </div>

          <ul
            tabIndex={0}
            aria-label="Our services"
            className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-4 sm:gap-y-8 sm:overflow-visible sm:px-0 md:gap-x-[21.67px] md:gap-y-[10px] xl:gap-x-4 xl:gap-y-8"
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
