import Image from "next/image";
import { Container, CTAButton } from "./ui";
import { Eyebrow, GoldRule } from "./SectionHeader";
import HeroVideo from "./HeroVideo";

/* Hero — a cinematic dark band with the workshop video playing behind the copy.
   The intersecting-rings product shot is decorative and straddles the dark→cream
   seam on both tablet (verified against figma-data/tablet.1_4838.json: the
   "Video Demo" band is 469px tall at the 834px reference, ring 310×310 at
   left 484px/top 314px) and desktop (988px band, ring 720×720 at 916/652) —
   absolute, `pointer-events-none`, each its own breakpoint-exact position/
   size, not a shared scale of one another (Figma re-composed each
   breakpoint independently, not a linear scale-down). Only mobile still
   flows the ring in-flow below the copy. Structural content (text + CTAs)
   stays in the grid. */
export default function Hero() {
  return (
    // overflow stays visible at every tier (the video/wash wrapper clips
    // itself) so the seam-straddling ring below is never cut; z-20 lifts the
    // whole section above Why Grech's positioned subtree at every tier for
    // the same reason.
    <section id="top" aria-label="Hero" className="relative z-20 bg-ink border-b-4 border-[#c8b08a] min-h-[907px] max-h-[907px] md:min-h-[469px] md:max-h-none lg:min-h-[988px]">
      {/* full-bleed background video + overlay (clipped to the hero band).
         ONE shared overlay pattern at every tier, taken from the art team's
         "Rectangle 23" export (pixel-profiled at 390×908): transparent for
         47% of the axis, a short 13% fade, then flat 63% ink for the rest —
         NOT a smooth full-length ramp. Only the AXIS differs per tier:
         mobile runs it vertically (transparent top → dark bottom, where the
         copy sits), md+ runs the identical stops horizontally via `to left`
         (transparent right → dark left, where the copy sits). The video
         itself is full-opacity everywhere — this gradient is the only
         dimmer. */}
      <div className="absolute inset-0 overflow-hidden">
        <HeroVideo />
        <div
          aria-hidden
          className="absolute inset-0 md:hidden"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(20,19,18,0) 0%, rgba(20,19,18,0) 47%, rgba(20,19,18,0.63) 60%, rgba(20,19,18,0.63) 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 hidden md:block"
          style={{
            backgroundImage:
              "linear-gradient(to left, rgba(20,19,18,0) 0%, rgba(20,19,18,0) 47%, rgba(20,19,18,0.63) 60%, rgba(20,19,18,0.63) 100%)",
          }}
        />
      </div>

      <Container className="relative lg:!px-[24px]">
        {/* pt: base 464px is the mobile artboard's own copy-block top
           (eyebrow at y=464 of the 907px band — the mobile design places
           the copy in the band's LOWER half, not near the header); md:pt-32
           (128px) is tablet's verified top; desktop positions via the copy
           div's own lg:pt instead. */}
        <div className="grid grid-cols-1 items-center gap-10 pb-16 pt-[464px] md:pb-20 md:pt-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-0 lg:pb-0 lg:pt-0">
          {/* copy — Figma component's own Top:377/Left:394 (Left comes from the
             Container's 24px inset) at desktop; Top:128/width:547 at tablet
             (both verified per-breakpoint against their own Figma frame —
             tablet's gaps between elements are also its own, not desktop's:
             eyebrow-to-h1 16px (already matched by mt-4), h1-to-rule 16px,
             rule-to-body 26px, body-to-buttons only 9px — tight, but real,
             since the tablet copy runs 5 lines instead of desktop's 3).
             Mobile gaps are their own too (verified against mobile.1_4213):
             eyebrow-to-h1 8, h1-to-rule 11, rule-to-body 9, body-to-buttons
             24 — hence the base margins below. */}
          <div className="max-w-[520px] md:max-w-[547px] lg:max-w-[497px] lg:self-start lg:pt-[377px]">
            <Eyebrow>Since 1978</Eyebrow>
            <h1 className="fig-trim mt-2 text-h1 text-cream-light md:mt-4">
              Expert Craftsmanship.
              <br />
              Personally Made.
            </h1>
            {/* base mt: Figma's box-to-box gap is 11px, but our fig-trim h1
               box is 13.5px shorter than Figma's untrimmed one — 24.5px
               lands the rule at the artboard's absolute y=565. */}
            <GoldRule width={114} className="mt-[24.5px] md:mt-4 lg:mt-8" />
            {/* md:max-w/tracking — Figma's tablet text box for this exact copy
               is 319px wide with 0.28px tracking (both verified against
               tablet.1_4838.json), narrower/looser than mobile's and desktop's
               480px/no-tracking box, so it wraps onto Figma's own line breaks
               here instead of inheriting the wider boxes' wrap. Mobile shares
               tablet's 0.28px tracking but has its own 22px line-height
               (explicit here since a plain utility would outrank the token's
               own md/lg line-heights, they're restated per tier). */}
            <p className="fig-trim mt-[7px] max-w-[480px] text-body leading-[22px] tracking-[0.28px] text-cream-light/75 md:mt-[26px] md:max-w-[319px] md:leading-[18px] lg:mt-7 lg:max-w-[480px] lg:leading-[27px] lg:tracking-normal lg:text-[#cfc6b8]">
              Since 1978, Grech Jewellers has combined traditional craftsmanship with
              modern design technology to create custom jewellery that&rsquo;s personally
              designed, precision manufactured and made to last for generations.
            </p>
            {/* md: button row/size — Figma's tablet buttons are 20px/16px
               padding (not the desktop-ish 28px/14px default), Medium weight
               with no letter-spacing (not Bold/0.06em), 41px tall, with only
               an 8px gap between them — all verified against the "Button /
               Tablet" component instances, distinct from both the base
               (mobile) and lg (desktop) button styling. The overrides are
               `md:max-lg:` (tablet-range ONLY), not plain `md:` — these use
               !important to beat CTAButton's own base classes, so a plain
               md: version would ALSO beat the non-important lg: desktop
               classes and drag the tablet sizing up into desktop. */}
            {/* base: mobile buttons are Figma's own 53px-tall full-width
               stack with a 16px gap (max-md:!h/!py-0 — same !important
               range-scoping reasoning as the tablet overrides). */}
            {/* .btn's own per-device scale now covers tablet (41/20/12) and
               desktop (56/36 primary, 56/42 secondary) exactly — only the
               artboard-specific deviations remain as overrides: the mobile
               53px height, and tablet's Medium/no-tracking label (the hero
               artboard instances genuinely differ from the component set
               there). */}
            <div className="mt-9 flex flex-col gap-4 sm:flex-row md:mt-[9px] md:gap-2 lg:mt-6 lg:gap-3">
              <CTAButton href="#book" variant="gold" className="max-md:!h-[53px] md:max-lg:!font-medium md:max-lg:!tracking-normal">Book a Consultation</CTAButton>
              <CTAButton href="#featured" variant="dark" className="max-md:!h-[53px] md:max-lg:!font-medium md:max-lg:!tracking-normal">See Our Work</CTAButton>
            </div>
          </div>

        </div>
      </Container>

      {/* intersecting rings, mobile — Figma's box (x=39, 303×303) against the
         390px reference artboard: left 10vw, width 77.6923vw capped at 303px.
         Same seam-centring technique as the tablet/desktop versions below
         (top-full + border-compensated translateY) per request — the ring
         straddles the Hero/Why-Grech boundary at every breakpoint. */}
      <Image
        src="/assets/hero-rings.png"
        alt="Grech Jewellers diamond engagement ring and matching wedding band"
        width={720}
        height={720}
        priority
        sizes="303px"
        className="pointer-events-none absolute left-[10vw] top-full block w-[min(77.6923vw,303px)] drop-shadow-2xl [transform:translateY(calc(-50%+4px))] md:hidden"
      />

      {/* intersecting rings, tablet — Figma's box (x=484 rel, y=314, 310×310)
         against the 834px reference artboard: left/width as vw fractions
         (58.0336vw / 37.1703vw), capped at 310px, so it settles at Figma's
         exact position/size at 834 while scaling down at narrower md widths
         (768–833) instead of overflowing. Distinct ratios from desktop's
         (47.7083vw/37.5vw) — Figma re-composed this breakpoint by hand, not
         a linear scale of the desktop numbers. Vertically, the ring must sit
         exactly centred on the Hero/Why-Grech seam regardless of the
         section's actual (content-driven) height — a fixed top-[314px]
         only lines up with that seam when the section renders at exactly
         Figma's own 469px, so `top-full` + a translateY is used instead: it
         anchors to the section's real bottom edge (its nearest positioned
         ancestor) and centres the image on it, self-correcting whenever the
         section is taller than 469px. The translateY is `-50% + 4px`, not a
         plain -50%, because `top:100%` resolves against the section's
         padding box (border excluded) while the visible seam is the far
         edge of its 4px border-b — without the +4px the ring's centre
         would sit 4px short of the actual line between the two sections.
         Hidden at lg in favour of the desktop version below. */}
      <Image
        src="/assets/hero-rings.png"
        alt="Grech Jewellers diamond engagement ring and matching wedding band"
        width={720}
        height={720}
        priority
        sizes="310px"
        className="pointer-events-none absolute hidden drop-shadow-2xl md:top-full md:block md:left-[58.0336vw] md:w-[min(37.1703vw,310px)] md:[transform:translateY(calc(-50%+4px))] lg:hidden"
      />

      {/* intersecting rings, desktop — Figma's box (x=916, y=652, 720×720) is
         page-absolute against a 1920-wide reference artboard, so left/width
         are expressed as vw fractions (47.7083vw / 37.5vw) rather than fixed
         px: 47.7083+37.5=85.2% of viewport width, so the right edge can never
         exceed the viewport at ANY size — reproduces Figma exactly at 1920
         while scaling down (instead of overflowing) at narrower lg widths
         (1024–1919). Width is capped at 720px so it doesn't grow past Figma's
         intended size on ultra-wide screens. Vertically centred on the
         Hero/Why-Grech seam via top-full + the same border-compensated
         translateY as the tablet version above, rather than a fixed top
         offset, so it stays centred on the seam even when the section
         renders taller than 988px. */}
      <Image
        src="/assets/hero-rings.png"
        alt="Grech Jewellers diamond engagement ring and matching wedding band"
        width={720}
        height={720}
        priority
        sizes="720px"
        className="pointer-events-none absolute hidden drop-shadow-2xl lg:top-full lg:block lg:left-[47.7083vw] lg:w-[min(37.5vw,720px)] lg:[transform:translateY(calc(-50%+4px))]"
      />
    </section>
  );
}
