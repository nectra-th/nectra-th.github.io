import { Container } from "./ui";
import { GoldRule } from "./SectionHeader";
import FeaturedGallery from "./FeaturedGallery";

/* eslint-disable @next/next/no-img-element */

const SKETCH = "/assets/figma-img/7b3544a57ad8f231118674e34b269ea5bd3fd189.png";
// Mobile uses a direct export of the Figma node instead of the raw source
// bitmap: at 390x249 it already ships in its final mobile orientation
// (right-side-up — confirmed by the user; only DESKTOP flips the sketch)
// with the node's 55% image opacity and the transparent→ink gradient baked
// in as alpha, so it needs no CSS transform/opacity/overlay.
const SKETCH_MOBILE = "/assets/figma-img/david-sketch-alpha-grey02-mobile.png";

/* Featured Creations — dark band. Copy + pull-quote on the left, the gallery
   slider on the right (stacks on tablet/mobile). Closes with a tagline
   centred under the gallery column specifically (not the full width). */
export default function Featured() {
  return (
    // Mobile height (1059px on the 390px artboard) now falls out of the real
    // Figma paddings/gaps below, so the section no longer needs a hard
    // min-h/max-h clamp — which, combined with overflow-hidden, would have
    // clipped the copy on narrower phones where it wraps to more lines.
    <section id="featured" aria-label="Our Work" className="relative overflow-hidden bg-ink border-b-4 border-[#c8b08a] pb-[118px] pt-[89px] sm:py-[70px] lg:pb-[70px] lg:pt-[198px]">
      {/* Figma's real box: x=-366 y=+342(rel) w=1064 h=734 on a 1920/1088
         reference, plus its actual fill: image at 55% opacity + a
         top-to-bottom transparent→ink gradient (not a flat low opacity) so
         it fades into the section bg. Orientation is a true 180° rotation:
         the node carries rotation=π in Figma (both mobile and desktop), which
         is scaleX(-1)+scaleY(-1) together — neither single-axis mirror alone
         reproduces it, since the raw PNG ships right-side-up.
         Position is centre-referenced like What We Do's blueprint, not a
         pure vw value: the sketch's left edge is a fixed 736px left of the
         standard Container's own left edge (370px at the 1920 reference —
         370-736=-366, matching Figma exactly), so it re-centres with the
         content block on ultra-wide screens instead of drifting further
         from centre forever. Width still scales with viewport, capped at
         Figma's own 1064px so it can't outgrow the reference size. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[31%] hidden aspect-[1064/734] [transform:rotate(180deg)] lg:block"
        style={{ left: "calc(max(32px, (100vw - 1180px) / 2) - 736px)", width: "min(55.4167vw, 1064px)" }}
      >
        {/* scaleY(-1) on the img only (user request): flips the artwork
           upside-down from what the wrapper's rotate(180) was showing, while
           the gradient overlay below stays outside the flip so its on-screen
           fade direction is unchanged. Net art transform = scaleX(-1). */}
        <img src={SKETCH} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover opacity-[0.55] [transform:scaleY(-1)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-ink" />
      </div>
      {/* lg:!px-0: Figma's 370-1548 content span already fills the standard
         1180 Container edge-to-edge with no extra inset, so the Container's
         own default lg:px-8 padding must be cancelled here — otherwise it
         eats 32px off each side, shrinking the 298fr/850fr columns below
         their true 298px/850px widths and wrapping the body copy to an
         extra line. */}
      <Container className="relative lg:!px-0">
        {/* Figma's columns are 298px copy / 850px gallery (not an even fr
           split) with a 30px gap; the copy column starts 66px lower than the
           gallery, not vertically centred against it. Below lg the tablet
           layout (834px reference) is a completely different, fully centred
           single-line/single-column treatment — not just a scaled-down
           version of the desktop 2-line left-aligned block — so this copy
           block is built by hand instead of reusing SectionHeader's shared
           scale, which doesn't have a 32px/centred/single-line variant. */}
        <div className="grid items-start gap-y-[183px] sm:gap-y-9 lg:grid-cols-[298fr_850fr] lg:gap-x-[30px] lg:gap-y-0">
          <div className="relative text-center lg:mt-[66px] lg:text-left">
            {/* Hand-rolled rather than the shared <Eyebrow>: this section's
               eyebrow is 16px/400/#b58a47 on mobile+tablet but 22px/600/
               gold-dark on desktop, and the shared component has no such
               variant (it steps 16→19→22 at one weight and colour). */}
            <p className="fig-trim font-serif font-normal [font-variant:small-caps] leading-[115%] tracking-[0.12em] text-[16px] text-[#b58a47] lg:text-[22px] lg:font-semibold lg:text-gold-dark">
              Our Work
            </p>
            {/* 32px Bold (w700) on mobile+tablet vs 56px SemiBold (w600) on
               desktop — a genuine weight change, not just a size step. */}
            <h2 className="fig-trim mt-6 font-serif font-bold text-[32px] leading-[34px] tracking-[-0.015em] text-cream-light sm:mt-3 sm:leading-[36px] sm:tracking-normal lg:mt-4 lg:text-[56px] lg:font-semibold lg:leading-[64px] lg:tracking-normal">
              Featured<span className="lg:hidden"> </span>
              <br className="hidden lg:block" />
              Creations
            </h2>
            <GoldRule width={114} className="mx-auto mt-7 lg:mx-0 lg:mt-8" />
            <p className="fig-trim mx-auto mt-6 max-w-[271px] font-sans font-medium text-[14px] leading-[20px] text-line sm:mt-[18px] sm:max-w-[449px] sm:leading-[18px] lg:mx-0 lg:mt-[26px] lg:max-w-none lg:text-[18px] lg:font-normal lg:leading-[27px]">
              Explore a selection of custom jewellery designed and handcrafted for our clients, each piece reflecting a unique story, style and vision.
            </p>
            {/* Not italic at any breakpoint — Figma reports Manrope-Regular
               (desktop) / Manrope-Medium (mobile+tablet), and the gold shifts
               from #b58a47 below lg to #b88c46 on desktop. */}
            <p className="mx-auto mt-4 max-w-[271px] font-sans font-medium text-[14px] leading-[20px] text-[#b58a47] sm:mt-2 sm:max-w-[449px] sm:leading-[18px] lg:mx-0 lg:mt-6 lg:max-w-[271px] lg:text-[18px] lg:font-normal lg:leading-[27px] lg:text-gold">
              No two stories are the same.<span className="sm:hidden"><br /></span> Neither are our creations.
            </p>
            {/* Anchored to the copy block's own bottom (top:100% + 10px) —
               i.e. 10px under "Neither are our creations." — so it tracks the
               pull-quote if the copy ever reflows, instead of a fixed offset
               from the section top. left:-20px + w-screen pulls it back out
               to the full 390px bleed from inside the Container's 20px
               gutter. Stays behind the gallery: both are position:auto, and
               the gallery column comes later in the DOM. */}
            <img
              src={SKETCH_MOBILE}
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
              className="pointer-events-none absolute left-[-20px] top-[calc(100%+10px)] w-screen max-w-none sm:hidden"
            />
          </div>

          {/* -mx-5: the mobile gallery is full-bleed (x=0, w=390 — the whole
             390px artboard), so it has to escape the Container's 20px gutter;
             from sm up it sits inside the gutter like everything else. */}
          <div className="-mx-5 sm:mx-0">
            <FeaturedGallery />

            {/* Figma's closing rule + caption sit directly under the gallery
               column (698-1548), 28px below it — not full section width.
               Rule stroke is #d8cbb7 (divider) at 1px, caption fill is solid
               #625b52 (body-2) — neither is a translucent cream-light blend. */}
            {/* Mobile drops the divider entirely (no rule above the caption on
               the 390px artboard) and sets the caption 118px below the image
               at 24px — larger than both tablet (18px) and desktop (20px).
               mx-5 puts the caption back inside the gutter that the
               full-bleed gallery above just escaped. */}
            <div className="relative mx-5 mt-[118px] sm:mx-0 sm:mt-8 sm:border-t sm:border-divider sm:pt-[23px] lg:pt-[29px]">
              {/* Figma line-heights are tight here (26/20/22 for 24/18/20px)
                 and its boxes are cap-trimmed, so fig-trim applies as it does
                 to the rest of the copy — without both, the 3-line mobile
                 caption alone adds ~40px to the section height. */}
              <p className="fig-trim mx-auto max-w-[278px] text-center font-serif text-[24px] leading-[26px] tracking-[0.1em] text-body-2 [font-variant:small-caps] sm:max-w-none sm:text-[18px] sm:leading-[20px] lg:text-[20px] lg:leading-[22px]">
                each piece is unique, just like the person who wears it.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
