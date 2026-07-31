import { Container } from "./ui";
import { GoldRule } from "./SectionHeader";
import QualityStrip from "./QualityStrip";

/* eslint-disable @next/next/no-img-element */

// Body copy line breaks are hard-set (not left to natural wrapping) so every
// card reads as exactly 3 lines at the lg-tier column widths below — the
// <br> is lg-only (hidden below lg) since narrower/wider columns at other
// breakpoints wrap naturally instead.
const LGBR = <br className="hidden lg:block" />;
const PILLARS = [
  {
    icon: "ic-diamond", title: ["Family", "Craftsmanship"], width: 246,
    desc: <>Family owned since 1978,{LGBR} creating every piece with{LGBR} decades of hands-on experience.</>,
  },
  {
    icon: "ic-anvil", title: ["Manufactured", "On Site"], width: 209,
    desc: <>Designed and manufactured{LGBR} in our Adelaide workshop.{LGBR} No middlemen. No markups.</>,
  },
  {
    icon: "ic-magnifier", title: ["Trusted", "Expertise"], width: 209,
    desc: <>Professional advice, repairs,{LGBR} valuations and remodelling{LGBR} from experienced jewellers.</>,
  },
  {
    icon: "ic-hand", title: ["Personal", "Service"], width: 256,
    desc: <>Work directly with the jeweller.{LGBR} Honest guidance with no pressure,{LGBR} just personal service.</>,
  },
];

/* Four Pillars of Trust — 4 across (desktop) → 2×2 (tablet) → 1 column (mobile).
   Each pillar is a centred icon + two-line small-caps title + gold rule + body.
   Figma's "Trust Card" component is invisible at rest (fills/strokes/effects
   all empty) and reveals a card on Hover: fill #F3EDDF (cream-card), 1px
   #D8CBB7 (divider) border, 12px radius, "Elevation/Large" shadow
   (0 12px 32px rgba(0,0,0,.25)), and the whole card shifts up 2px — the same
   -2px lift used everywhere else on the site (.gj-lift/.gj-soft). */
export default function FourPillars() {
  return (
    <section id="pillars" aria-label="Our Four Pillars of Trust" className="bg-cream border-b-4 border-[#c8b08a] pb-16 pt-4 md:pb-20 lg:pb-[99px] lg:pt-0">
      {/* relative z-10: sits above Why Grech's bleeding sketch backdrop (z-0),
         while this section's own plain background stays unpositioned so the
         sketch still shows through beneath the cards/text. */}
      <Container className="relative z-10">
        {/* lg:w-[1016px] lg:ml-auto: matches the cards row's own width
           (246+209+209+256 + 3×32 gaps) and right-alignment, so the title
           centres over the 4 cards themselves rather than the full
           Container width now that the row no longer spans it. */}
        <div className="text-center lg:ml-auto lg:w-[1016px]">
          <h2 className="fig-trim text-h2-caps text-ink-text">
            Our Four Pillars of Trust
          </h2>
          <GoldRule width={64} center className="mt-5 lg:mt-7" />
        </div>

        {/* lg:justify-end: the row (920px cards + 96px gaps = 1016px) is
           narrower than Container's own content width, so it flushes to
           Container's right edge — which already sits 32px in from the
           1180px outer band via Container's own lg:px-8 — instead of
           centring. Moves the cards (and their icons) away from Why Grech's
           pen-sketch backdrop bleeding in on the left. */}
        <ul className="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:mt-10 lg:grid-cols-[246px_209px_209px_256px] lg:justify-end lg:gap-8">
          {PILLARS.map((p) => (
            <li key={p.title.join(" ")} className="group">
              {/* px-[11px] not px-3(12px): at the exact per-card widths below,
                 3 of the 4 hard-set body line breaks overflow their column
                 by exactly 1px at true 12px padding — this 1px-per-side trim
                 gives just enough room for every line to land as intended. */}
              <div className="flex flex-col items-center rounded-xl border border-transparent px-[11px] py-4 text-center transition-[transform,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.45,0,0.55,1)] will-change-transform group-hover:[transform:translateY(-2px)] group-hover:border-divider group-hover:bg-cream-card group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.25)]">
                <img src={`/assets/icons/${p.icon}.png`} alt="" aria-hidden loading="lazy" decoding="async" width={80} height={80} className="h-14 w-auto lg:h-[80px]" />
                <h3 className="fig-trim mt-6 text-h3-card text-ink-text lg:mt-4">
                  {p.title[0]}
                  <br />
                  {p.title[1]}
                </h3>
                <span aria-hidden className="mt-3 h-0.5 w-8 bg-gold-dark transition-[width] duration-500 group-hover:w-11 lg:mt-5" />
                <p className="fig-trim mt-4 max-w-[15rem] text-body-sm text-[#403b37] lg:mt-5">
                  {p.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>

      {/* Figma's "Frame 337" (this strip) is a sibling of the "Four Pillars"
         instance, not nested inside it, with its own near-centred position
         (only 24px off true viewport-centre) — close enough that standard
         centring reads the same and stays consistent with the block above.
         relative z-10 for the same reason as the cards Container: Why Grech's
         bleeding sketch (position:absolute, z-0) paints above any plain
         non-positioned sibling regardless of z-index value — without this,
         the sketch was covering the start of this text. */}
      <Container className="relative z-10 mt-16 lg:mt-[136px]">
        <QualityStrip />
      </Container>
    </section>
  );
}
