import Image from "next/image";
import { Container } from "./ui";
import { Eyebrow, GoldRule } from "./SectionHeader";
import FindUsTabs from "./FindUsTabs";
import LaunchNavigationButton from "./LaunchNavigationButton";

/* eslint-disable @next/next/no-img-element */

const PHONE_DISPLAY = "(08) 8356 7764";
const PHONE_HREF = "tel:+61883567764";
// Address-based destination (not the store name): the Google Business
// Profile currently carries a wrong address, so a name query can resolve to
// nothing / the wrong pin — the street address works regardless.
const MAPS_DIR = "https://www.google.com/maps/dir/?api=1&destination=445-457+Tapleys+Hill+Road,+Fulham+Gardens+SA+5024";

// Matches the routes shown on the animated centre map (arrows approach from
// several entrances, not just the northern one).
const STEPS = [
  "Park near either entrance.",
  "Enter the shopping centre.",
  "Follow the walkway towards Drakes.",
  "Grech Jewellers is directly opposite.",
];

/** Line icon recoloured to gold via CSS mask. Figma's icons here aren't
   square (e.g. email is 32×23, location is 22.7×32) — forcing them into a
   single square `size` under mask-size:contain was shrinking whichever axis
   didn't match, so width/height are specified separately per icon.
   Size comes in as a className (not numeric props) so callers can give it
   responsive w-[]/h-[] variants — the tablet frame verifies every one of
   these icons at a smaller size than desktop, not just a uniform scale. */
function InfoIcon({ src, size, tone = "var(--color-gold-dark)" }: { src: string; size: string; tone?: string }) {
  return (
    <span
      aria-hidden
      // the small optical nudge moved out to each caller's `size` string —
      // the mobile CALL button centres its icon instead and must not
      // inherit it.
      className={`shrink-0 ${size}`}
      style={{
        backgroundColor: tone,
        WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
        WebkitMaskSize: "contain", maskSize: "contain",
      }}
    />
  );
}

// Figma stacks these 4 elements (heading + 3 numbered steps) with one
// uniform 27px gap and a hairline divider between each — not a gap+divide-y
// approximation. md: values are the tablet frame's own verified numbers
// (10px label/step text, 19px circle, 18px gap) — everything here used to
// render at the desktop size straight down to 768px.
function Directions() {
  return (
    <div>
      {/* md:leading-[7px]: Figma's cap-trimmed box for this label is only
         6.8px tall at 10px font — the browser's default ~15px line-height
         was adding ~8px of invisible space below it, which (repeated across
         every resized text node here) is what made this column render
         taller than the photo beside it even though Figma has them equal
         (238.3px each). */}
      <p className="text-center font-sans text-[14px] font-semibold text-gold-dark md:text-[10px] md:leading-[7px] lg:text-[14px] lg:leading-normal">Directions</p>
      <ol className="mt-5 flex flex-col gap-5 md:mt-[18px] md:gap-[18px] lg:mt-5 lg:gap-5">
        {STEPS.flatMap((s, i) => [
          // md:h-[0.7px]: Figma's step rules are strokeWeight 0.685 on the
          // tablet frame vs a full 1px at lg.
          i > 0 && <li key={`div-${i}`} aria-hidden className="h-px w-full bg-[#e1dfdc] md:h-[0.7px] lg:h-px" />,
          <li key={i} className="flex items-start gap-3 md:gap-[5px] lg:gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold-light text-[16px] font-semibold text-gold-light md:h-[19px] md:w-[19px] md:text-[11px] lg:h-7 lg:w-7 lg:text-[16px]">{i + 1}</span>
            {/* md:leading-none: Figma's own line-height here is 10.27px on a
               10px font (ratio ~1.03) — leading-snug's 1.375 ratio was
               inflating each 2-line step by several px. */}
            <span className="font-sans text-[14px] leading-snug text-[#403b37] md:text-[10px] md:leading-none lg:text-[14px] lg:leading-snug">{s}</span>
          </li>,
        ].filter(Boolean))}
      </ol>
    </div>
  );
}

function FirstTimeCard() {
  return (
    // md:py-[16px]: py-5 (20px) never had a tablet-specific value — with
    // every text node above now correctly sized/tightened, this card's own
    // vertical padding was the last thing keeping its total height (248px)
    // above the photo beside it (target: both equal, ~238px).
    <div className="flex h-full flex-col items-center justify-center rounded-lg border border-[#c8b08a] bg-cream-light px-4 py-5 text-center md:py-[16px] lg:py-5">
      {/* cropped directly from the Figma export at its exact 37×48 box —
         already the correct gold-dark colour and shape, no recolouring
         needed (the gj-monogram.svg asset didn't match Figma's icon here).
         md:h-[33px]: tablet's own verified crop height (33 of 40, same
         aspect ratio — .text-label already handles the two headings' 10px
         tablet size, so only the icon/body/phone-number sizes needed fixing
         here, they were still rendering at the desktop scale below lg. */}
      <img src="/assets/icons/gj-monogram-crop.png" alt="" aria-hidden loading="lazy" decoding="async" className="h-10 w-auto shrink-0 md:h-[33px] lg:h-10" />
      {/* md:leading-[7px]: same cap-trim gap as the labels elsewhere in this
         section — .text-label's own line-height is left alone (it's shared
         site-wide) and just overridden here at this instance. */}
      <p className="mt-3 text-label text-gold-dark md:leading-[7px] lg:leading-normal">First Time Visiting?</p>
      {/* md:leading-[12px]: Figma's real line-height here (12.3px on a 10px
         font) — leading-snug's 1.375 ratio was inflating each 2-line
         paragraph by a few px, on top of the two labels above, which
         together were what dragged this whole column taller than the
         photo beside it (Figma actually has them equal height). */}
      <p className="mt-2 font-sans text-[14px] leading-snug text-[#403b37] md:mt-[11px] md:text-[10px] md:leading-[12px] lg:mt-2 lg:text-[14px] lg:leading-snug">Our shopping centre map makes finding us quick and easy.</p>
      <p className="mt-6 text-label text-gold-dark md:mt-8 md:leading-[7px] lg:mt-6 lg:leading-normal">Need Help Finding Us?</p>
      <p className="mt-2 font-sans text-[14px] leading-snug text-[#403b37] md:mt-[11px] md:text-[10px] md:leading-[12px] lg:mt-2 lg:text-[14px] lg:leading-snug">Give us a call and we&rsquo;ll happily guide you to our showroom.</p>
      <a href={PHONE_HREF} className="mt-3 inline-flex items-center gap-2 font-sans text-[20px] font-bold text-ink-text hover:text-gold-dark md:mt-[11px] md:gap-[11px] md:text-[14px] lg:mt-3 lg:gap-2 lg:text-[20px]">
        <InfoIcon src="/assets/icons/info-phone.svg" size="mt-0.5 w-[46px] h-[48px] md:w-[31px] md:h-[32px] lg:w-[46px] lg:h-[48px]" />
        {PHONE_DISPLAY}
      </a>
    </div>
  );
}

/* Find Us — a tabbed location card over a blurred storefront backdrop:
   store photo / shopping-centre map / live Google Maps, a directions panel, and
   a contact-info row. Everything reflows to a single column on small screens. */
// pt/pb re-measured directly from the Figma export's actual pixels (not the
// raw backdrop rectangle, which bleeds ~52px above the section's true
// visible top and isn't clipped by any frame in the Figma data). True top =
// y8904 (sharp cream→dark transition). The bottom is y10120 (Closing CTA's
// own background starts there) — an earlier pass mis-measured this as
// y10583 by sampling into a patch of the SAME blurred photo bleeding further
// down, not a real section boundary. 1216px total, matching the original
// skeleton estimate.
export default function FindUs() {
  return (
    // min-h only, no max-h: 1173px is the mobile artboard's height and it
    // still lands exactly at 390px wide (natural content is a touch under
    // it), but the card scales with the viewport, so a hard max-h + the
    // overflow-hidden above was slicing the bottom off the card on any
    // wider phone — 194px of it gone by 767px.
    // pt-[102px]/pb-[98.5px]: the mobile section runs 11004 (where the
    // previous section's bg ends) to 12177 (where the next one's begins) =
    // 1173px, with "Plan Your Visit" at 11106 — i.e. 102px down, not the
    // 64px pt-16 was giving. Bottom is the remainder after the card.
    <section id="findus" aria-label="Find Us" className="relative overflow-hidden bg-ink pb-[98.5px] pt-[102px] min-h-[1173px] md:min-h-0 md:pb-20 md:pt-20 lg:pb-[177px] lg:pt-[189px]">
      {/* blurred storefront backdrop — Figma composites this as a single
         rectangle: solid black fill, then the photo drawn over it at 39%
         opacity (blend normal), then the whole thing blurred. The section's
         own bg-ink already stands in for that solid black base, so the
         image just needs its own 39% opacity — no separate darkening
         overlay on top (an extra bg-ink/70 layer here was compounding with
         the image's own opacity down to ~7.5% net visibility, far darker
         than Figma's actual 39%). */}
      <div aria-hidden className="absolute inset-0">
        <Image src="/assets/findus-blur-bg.webp" alt="" fill sizes="100vw" className="object-cover opacity-[0.39] blur-md" />
      </div>

      <Container className="relative">
        {/* -translate-x-[9.5px]: the mobile artboard sits this whole block
           (eyebrow + heading + rule, all three share one 179px frame at
           x=96) at centre 185.5 while the card below is centred at 195.5 —
           i.e. 9.5px left of the viewport centre. Matching it rather than
           optically centring. Drop this class to centre it instead. */}
        <div className="-translate-x-[9.5px] text-center md:translate-x-0">
          {/* measured #b58a47 exactly — closer to --color-gold (#b88c46) than
             either existing Eyebrow tone (gold-dark #9c7430 / gold-light
             #c0985a), so overriding the color precisely here rather than
             reusing a token that's off by more than this. */}
          <Eyebrow tone="gold-light" className="mx-auto !text-[#b58a47]">Plan Your Visit</Eyebrow>
          {/* leading-none: Figma sets this heading's own line-height to
             exactly 100% (56px at a 56px font) — the browser's default
             ~150% line-height was adding 28px of invisible space below the
             glyphs, which is what pushed the rule 49px lower than Figma
             specifies. Fixing the real cause instead of nudging the rule.
             mt-[13px]: requested explicitly (was 24px) — the 11px removed
             here is added onto the rule's own margin below so the rule
             itself doesn't move from its verified Figma-matching position. */}
          {/* md:32px — the tablet Figma artboard sets this heading at 32px,
             not 44px (that 44 was never verified against the real tablet
             frame). 32 also happens to match the shared .text-h2 role used
             elsewhere on the page, just applied here as a literal value
             rather than the class, since that class's own lg line-height
             (64px) would undo the leading-none rule-gap fix above.
             fig-trim: the same cap-trim the Eyebrow above already uses, so
             this box measures the glyph caps (20px at 32, 35px at 56) exactly
             like Figma's own boxes do — which is what lets the margins below
             be Figma's literal numbers instead of leading-compensated
             guesses. tracking: all three artboards set -0.015em here. */}
          <h2 className="fig-trim mt-[24px] font-serif text-[32px] font-bold leading-none tracking-[-0.015em] text-cream-light md:mt-[12px] lg:mt-[24px] lg:text-[56px]">Find Us</h2>
          {/* 28px on every artboard (mobile/tablet/desktop all agree). With
             the cap-trim above this lands the rule at Figma's exact y —
             291px from the section top at lg, unchanged from before. */}
          <GoldRule width={114} center className="mt-[28px]" />
        </div>

        {/* mt-20: Figma's real gap from the title rule to the card (80px at
           lg, 71px at the tablet frame) — not the 40px this used before.
           Padding lives inside FindUsTabs now (tabs span edge-to-edge,
           content below is inset 16px) instead of one uniform padding
           wrapping everything.
           -mx-*: Container's own side padding (px-5/6/8) was shrinking this
           card to 1116px — cancelling it out so the card bleeds to
           Container's true edge and matches Figma's 1180px width exactly.
           md:-mx-[11px]: the tablet frame actually keeps a 13px side margin
           (not edge-to-edge like desktop) — Container's own md padding is
           still 24px (sm:px-6, no md override there), so cancelling only
           11px of it leaves the real 13px gap instead of the full bleed.
           -mx-[13.5px]/mt-[30px]: the mobile artboard's card is 377 wide in
           a 390 viewport (6.5px each side) and sits 30px under the rule.
           The old sm:-mx-6 is gone — at 640px it made the card wider than
           the viewport, and mobile now runs unbroken up to md. */}
        <div className="-mx-[13.5px] mt-[28px] overflow-hidden rounded-[18px] border border-divider bg-cream-light md:-mx-[11px] md:mt-[69px] lg:-mx-8 lg:mt-20">
          <FindUsTabs directions={<Directions />} firstTime={<FirstTimeCard />} />

          {/* contact info row — its own bordered/tinted box (bg-cream-card +
             divider border), not plain text on the panel background. Same
             16px side inset as the content above, 20px gap above it.
             md:px-4 md:py-[22px]: the tablet frame's own box padding — the
             px-6/py-8 (24/32) below is really the lg-verified value, applied
             everywhere for lack of a tablet-specific override before.
             md:mx-[11px]: matches the same 10.96px inset just fixed on the
             row above it — this was still inheriting the 24px sm:mx-6.
             Mobile: flush to the card's own 4px padding, no gap above (it
             butts straight onto the tab row), 24/32 padding inside — and no
             border or tint of its own, since the mobile artboard fills this
             box with the same #f8f3ea as the card behind it and gives it no
             stroke, i.e. it reads as plain content on the card. */}
          <div className="mx-1 mb-1 mt-0 border-0 bg-transparent px-6 py-8 md:mx-[11px] md:mb-4 md:mt-5 md:border md:border-divider md:bg-cream-card md:px-4 md:py-[22px] lg:mx-4 lg:px-6 lg:py-8">
            {/* all 4 columns side-by-side from md — the tablet frame already
               shows Location/Phone+Email/Hours/Open-in in one row, not the
               2-then-4 split this used to do between 768–1023px. md:gap-5:
               the tablet frame's own 20px column gap (24px only kicks in
               at lg).
               Mobile: one 257px-wide centred column with 32px between each
               block, exactly as the mobile artboard stacks them. */}
            <div className="mx-auto grid max-w-[257px] gap-8 md:max-w-none md:grid-cols-4 md:gap-5 lg:gap-8">
            {/* hairline above the stack — mobile artboard only (Figma
               "Frame 304"); display:none at md so it never takes a grid
               cell in the 4-column layout. */}
            <span aria-hidden className="h-px w-full bg-divider md:hidden" />
            {/* the four "LOCATION / PHONE / EMAIL / HOURS" captions are
               hidden below md — the mobile artboard drops them entirely and
               leans on the icons alone. */}
            <div className="flex gap-3 md:gap-[8px] lg:gap-3">
              <InfoIcon src="/assets/icons/info-location.svg" size="mt-0.5 w-[23px] h-[32px] md:w-[16px] md:h-[22px] lg:w-[23px] lg:h-[32px]" />
              <div>
                <p className="hidden font-sans text-[16px] font-bold uppercase text-gold-dark md:block md:text-[11px] md:leading-[8px] lg:text-[16px] lg:leading-normal">Location</p>
                <p className="font-sans text-[14px] leading-[27px] text-[#403b37] md:mt-1.5 md:text-[10px] md:leading-[12px] lg:text-[14px] lg:leading-snug">Shop 110 Fulham Gardens Shopping Centre, 445-457 Tapleys Hill Road, Fulham Gardens SA 5024</p>
              </div>
            </div>

            <div className="flex flex-col gap-8 md:gap-[22px] lg:gap-5">
              {/* mobile turns the phone number into a full-width gold CALL
                 button (Figma reuses its "Frame 149" button here); md+ keeps
                 the plain icon + caption + number. Only one is ever in the
                 DOM's accessibility tree — the other is display:none. */}
              {/* px-4 + nowrap, not Figma's literal 34px padding: at 257px
                 wide the artboard's own numbers leave exactly 160px for the
                 label, which the real webfont overruns by a hair and wraps
                 onto a second line. The button is full-width and centred, so
                 trimming the side padding changes nothing visually. */}
              <a href={PHONE_HREF} className="flex items-center justify-center gap-2.5 whitespace-nowrap rounded-lg bg-gold px-4 py-[18px] font-sans text-[14px] font-semibold uppercase leading-[10px] tracking-[0.09em] text-cream-light transition-colors hover:bg-gold-dark md:hidden">
                <InfoIcon src="/assets/icons/info-phone.svg" size="w-[19px] h-[20px]" tone="var(--color-cream-light)" />
                Call {PHONE_DISPLAY}
              </a>
              <div className="hidden gap-3 md:flex md:gap-[11px] lg:gap-3">
                <InfoIcon src="/assets/icons/info-phone.svg" size="mt-0.5 w-[30px] h-[32px] md:w-[21px] md:h-[22px] lg:w-[30px] lg:h-[32px]" />
                <div>
                  <p className="font-sans text-[16px] font-bold uppercase text-gold-dark md:text-[11px] md:leading-[8px] lg:text-[16px] lg:leading-normal">Phone</p>
                  <a href={PHONE_HREF} className="mt-1.5 block font-sans text-[14px] text-[#403b37] hover:text-gold-dark md:text-[10px] md:leading-[12px] lg:text-[14px] lg:leading-normal">{PHONE_DISPLAY}</a>
                </div>
              </div>
              <div className="flex items-center gap-4 md:items-start md:gap-[11px] lg:gap-3">
                <InfoIcon src="/assets/icons/info-email.svg" size="w-[32px] h-[23px] md:mt-0.5 md:w-[22px] md:h-[16px] lg:w-[32px] lg:h-[23px]" />
                <div>
                  <p className="hidden font-sans text-[16px] font-bold uppercase text-gold-dark md:block md:text-[11px] md:leading-[8px] lg:text-[16px] lg:leading-normal">Email</p>
                  <a href="mailto:jeweller@grechjewellers.com.au" className="block font-sans text-[14px] leading-[30px] text-[#403b37] hover:text-gold-dark md:mt-1.5 md:text-[10px] md:leading-[12px] lg:text-[14px] lg:leading-normal lg:whitespace-nowrap">jeweller@grechjewellers.com.au</a>
                </div>
              </div>
            </div>

            <div className="flex gap-4 md:gap-[11px] lg:gap-3">
              <InfoIcon src="/assets/icons/info-hours.svg" size="mt-0.5 w-[32px] h-[32px] md:w-[22px] md:h-[22px] lg:w-[32px] lg:h-[32px]" />
              <div className="grow">
                <p className="hidden font-sans text-[16px] font-bold uppercase text-gold-dark md:block md:text-[11px] md:leading-[8px] lg:text-[16px] lg:leading-normal">Hours</p>
                {/* mobile rows sit 26px apart (leading alone, no extra
                   spacing) per the mobile artboard. */}
                <dl className="space-y-0 font-sans text-[14px] leading-[26px] text-[#403b37] md:mt-1.5 md:space-y-0.5 md:text-[10px] md:leading-[12px] lg:text-[14px] lg:leading-normal">
                  <div className="flex justify-between gap-3"><dt>Mon – Fri</dt><dd>9:00am – 5:00pm</dd></div>
                  <div className="flex justify-between gap-3"><dt>Saturday</dt><dd>9:00am – 1:00pm</dd></div>
                  <div className="flex justify-between gap-3"><dt>Sunday</dt><dd>Closed</dd></div>
                </dl>
              </div>
            </div>

            {/* Figma (Frame254/Frame255): a right-aligned VERTICAL stack —
               "OPEN IN" label, "Google Maps" serif line, a 48×2px gold-dark
               rule — sitting above the button with a uniform 10px gap
               throughout, not one inline line of mixed-size text. The
               tablet frame keeps the same structure at a smaller scale
               (~7px gap, 9.6/16.4px text, 33px rule, smaller button). */}
            {/* items-end from md: the tablet frame's Frame254/255 both
               carry counterAxisAlignItems:MAX too, same as desktop — this
               was only flipping to right-aligned at lg, so it sat left-
               aligned (wrong side) through the whole tablet range. */}
            {/* mobile centres this block (Figma's mobile Frame254/255 are
               counterAxisAlignItems:CENTER, not MAX) with a 12px inner gap. */}
            <div className="flex flex-col items-center justify-center gap-[10px] md:items-end md:gap-[7px] lg:gap-[10px]">
              {/* leading-[10px]/[15px]: Figma's cap-trimmed text boxes for
                 these two lines are 10px and 15px tall — the browser's
                 default line-height (~21px/~36px) was inflating this whole
                 column well past Figma's real 101px, which is what was
                 pushing the section's total height past 1216px. */}
              <div className="flex flex-col items-center gap-3 md:items-end md:gap-[7px] lg:gap-[10px]">
                <span className="font-sans text-[14px] font-semibold uppercase leading-[10px] tracking-[0.09em] text-gold-dark md:text-[9.6px] md:leading-[7px] lg:text-[14px] lg:leading-[10px]">Open In</span>
                <span className="font-serif text-[24px] font-semibold leading-[15px] tracking-[0.09em] text-[#403b37] md:text-[16.4px] md:leading-[10px] lg:text-[24px] lg:leading-[15px]">Google Maps</span>
                {/* md:h-[1.4px]: strokeWeight 1.37 on the tablet frame, 2px
                   at mobile and lg. */}
                <span aria-hidden className="h-0.5 w-12 bg-gold-dark md:h-[1.4px] md:w-[33px] lg:h-0.5 lg:w-12" />
              </div>
              {/* desktop opens a new tab; mobile navigates same-tab so the OS
                 can intercept it as a universal/app link straight into the
                 native Google Maps app — see LaunchNavigationButton. */}
              {/* .gj-primary gives it the hero CTA's full state set (hover
                 #9c7430 + cream text + shadow + lift, pressed #8e682a);
                 default text is the hero's ink, not the old cream. Sizing/
                 radius stay this instance's own Figma values. */}
              <LaunchNavigationButton href={MAPS_DIR} className="gj-primary inline-flex items-center justify-center rounded-lg bg-gold px-[34px] py-[18px] text-[14px] leading-[10px] font-semibold uppercase tracking-[0.09em] text-ink md:rounded-[5px] md:px-[23px] md:py-[12px] md:text-[9.6px] md:leading-[7px] lg:rounded-lg lg:px-[34px] lg:py-[18px] lg:text-[14px] lg:leading-[10px]">
                Launch Navigation
              </LaunchNavigationButton>
            </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
