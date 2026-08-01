import { Container } from "./ui";
import { GoldRule } from "./SectionHeader";
import QualityStrip from "./QualityStrip";

/* eslint-disable @next/next/no-img-element */

// Body copy line breaks are hard-set (not left to natural wrapping) so every
// card reads as exactly 3 lines — and the break points are IDENTICAL at
// tablet and desktop (verified against both artboards' raw text nodes:
// tablet's `\n`/double-space wrap points land on the same words as the lg
// breaks), so one md+ break serves both tiers. Mobile's single column still
// wraps naturally.
const MDBR = <br className="hidden md:block" />;
const PILLARS = [
  {
    icon: "ic-diamond", title: ["Family", "Craftsmanship"], width: 246,
    desc: <>Family owned since 1978,{MDBR} creating every piece with{MDBR} decades of hands-on experience.</>,
  },
  {
    icon: "ic-anvil", title: ["Manufactured", "On Site"], width: 209,
    desc: <>Designed and manufactured{MDBR} in our Adelaide workshop.{MDBR} No middlemen. No markups.</>,
  },
  {
    icon: "ic-magnifier", title: ["Trusted", "Expertise"], width: 209,
    desc: <>Professional advice, repairs,{MDBR} valuations and remodelling{MDBR} from experienced jewellers.</>,
  },
  {
    icon: "ic-hand", title: ["Personal", "Service"], width: 256,
    desc: <>Work directly with the jeweller.{MDBR} Honest guidance with no pressure,{MDBR} just personal service.</>,
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
    <section id="pillars" aria-label="Our Four Pillars of Trust" className="bg-cream border-b-4 border-[#c8b08a] pb-16 pt-4 md:pb-[77px] lg:pb-[99px] lg:pt-0">
      {/* relative z-10: sits above Why Grech's bleeding sketch backdrop (z-0),
         while this section's own plain background stays unpositioned so the
         sketch still shows through beneath the cards/text. */}
      <Container className="relative z-10">
        {/* md:w-[416px]/mr-[68px]/ml-auto: verified against tablet.1_4838.json
           — the card block sits right-shifted at tablet too, not centred
           (right edge is 68px inside Container's own inner edge, not flush
           to it — the ml-auto+mr combo reproduces that exact 326px-from-
           viewport-left position). lg:w-[1016px]/ml-auto: matches the cards
           row's own width (246+209+209+256 + 3×32 gaps) and right-alignment,
           so the title centres over the 4 cards themselves rather than the
           full Container width now that the row no longer spans it — reset
           mr back to 0 there since lg's ml-auto alone (flush to Container's
           edge) is the correct desktop behaviour. */}
        <div className="text-center md:ml-auto md:mr-[68px] md:w-[416px] lg:mr-0 lg:w-[1016px]">
          <h2 className="fig-trim text-h2-caps text-ink-text">
            Our Four Pillars of Trust
          </h2>
          <GoldRule width={64} center className="mt-5 lg:mt-7" />
        </div>

        {/* md:grid-cols-2/gap-x-6/gap-y-8: tablet's own 2×2 grid — verified
           exact 196px columns (from the 416px width above ÷ 2, minus the
           24px gap), 24px column gap, 32px row gap. Positioned with the same
           ml-auto/mr-[68px]/w-[416px] as the title above so the two block
           line up. lg:justify-end: the row (920px cards + 96px gaps =
           1016px) is narrower than Container's own content width, so it
           flushes to Container's right edge — which already sits 32px in
           from the 1180px outer band via Container's own lg:px-8 — instead
           of centring. Moves the cards (and their icons) away from Why
           Grech's pen-sketch backdrop bleeding in on the left. */}
        <ul className="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-2 md:ml-auto md:mr-[68px] md:w-[416px] md:grid-cols-2 md:gap-x-6 md:gap-y-8 lg:mt-10 lg:w-auto lg:grid-cols-[246px_209px_209px_256px] lg:justify-end lg:mr-0 lg:gap-8">
          {PILLARS.map((p) => (
            <li key={p.title.join(" ")} className="group">
              {/* px-[11px] not px-3(12px): at the exact per-card widths below,
                 3 of the 4 hard-set body line breaks overflow their column
                 by exactly 1px at true 12px padding — this 1px-per-side trim
                 gives just enough room for every line to land as intended. */}
              {/* Padding/margins here are paired so the VISUAL box (what the
                 hover state reveals) is roomier than the LAYOUT box (which is
                 Figma-verified per breakpoint and must not move):
                 each padding is oversized for breathing room, then a
                 negative margin claws back the difference so the content's
                 position and every card/section height measure exactly as
                 before. Net layout paddings preserved: 16px vertical at
                 base/lg, 0 at md (tablet cards are flush top/bottom in
                 Figma — icon starts at the card's own top, desc ends at its
                 bottom), 11px horizontal everywhere (the value the lg
                 hard-set line breaks were tuned against). Visual box:
                 24px/24px at base/lg, 20px vertical at md, 24px horizontal.
                 The expanded box may overlap a neighbour's gap slightly on
                 hover, but only one card hovers at a time. */}
              <div className="flex flex-col items-center rounded-xl border border-transparent -mx-[13px] px-6 -my-2 py-6 text-center transition-[transform,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.45,0,0.55,1)] will-change-transform group-hover:[transform:translateY(-2px)] group-hover:border-divider group-hover:bg-cream-card group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.25)] md:-my-5 md:py-5 lg:-my-2 lg:py-6">
                <img src={`/assets/icons/${p.icon}.png`} alt="" aria-hidden loading="lazy" decoding="async" width={80} height={80} className="h-14 w-auto md:h-16 lg:h-[80px]" />
                <h3 className="fig-trim mt-6 text-h3-card text-ink-text md:mt-5 lg:mt-4">
                  {p.title[0]}
                  <br />
                  {p.title[1]}
                </h3>
                <span aria-hidden className="mt-3 h-0.5 w-8 bg-gold-dark transition-[width] duration-500 group-hover:w-11 md:mt-4 lg:mt-5" />
                {/* md:w-max/max-w-none: Figma's tablet desc text boxes hug
                   their (hard-broken) longest line and OVERFLOW the 196px
                   card symmetrically — card 1's is 228px wide on a 196px
                   card — so the card's own inner width must not constrain
                   them, or the overflowing lines re-wrap to 4. The flex
                   column's items-center centres the overhang the same way
                   Figma does. Scoped to md: lg's verified rendering keeps
                   its original max-w constraint untouched. */}
                <p className="fig-trim mt-4 max-w-[15rem] text-body-sm text-[#403b37] md:w-max md:max-w-none lg:mt-5 lg:w-auto lg:max-w-[15rem]">
                  {p.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>

      {/* Figma's "Frame 337" (this strip) is a sibling of the "Four Pillars"
         instance, not nested inside it, with its own near-centred position
         (only 24px off true viewport-centre) at desktop — close enough that
         standard centring reads the same and stays consistent with the
         block above. Tablet is NOT centred though (verified against
         tablet.1_4838.json: x=390, width=358 — right-shifted like the cards
         above, not spanning the full width): without a width/position
         constraint here, the text centred across the ENTIRE container
         instead, drifting far enough left to land directly on top of Why
         Grech's bleeding pen-sketch (its dark leather-notebook corner,
         specifically, which is what made "quality." unreadable) instead of
         sitting beside it like Figma intends. The inner div's `lg:contents`
         removes it from layout at lg so desktop's already-correct centred
         behaviour is untouched. md:mt-[78px]: cards end at y=1539, this
         strip's rule sits at y=1617 — a 78px gap, not the 64px this used
         before. relative z-10 for the same reason as the cards Container:
         the sketch (position:absolute, z-0) paints above any plain
         non-positioned sibling regardless of z-index value — without this,
         the sketch was covering the start of this text. */}
      <Container className="relative z-10 mt-16 md:mt-[78px] lg:mt-[136px]">
        <div className="md:ml-auto md:mr-[62px] md:w-[358px] lg:contents">
          {/* This instance's tablet spec (verified): 14px single-line text
             with a 10px gap to the rule — NOT the 20px/17px the Process
             instance keeps. Both revert to the shared defaults at lg. */}
          <QualityStrip
            className="md:pt-[10px] lg:pt-[17px]"
            textClass="text-[17px] md:text-[14px] md:leading-[110%] lg:text-[20px] lg:leading-[115%]"
          />
        </div>
      </Container>
    </section>
  );
}
