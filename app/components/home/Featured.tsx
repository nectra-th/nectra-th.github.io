import { Container } from "./ui";
import { Eyebrow, GoldRule } from "./SectionHeader";
import FeaturedGallery from "./FeaturedGallery";

/* eslint-disable @next/next/no-img-element */

const SKETCH = "/assets/figma-img/7b3544a57ad8f231118674e34b269ea5bd3fd189.png";

/* Featured Creations — dark band. Copy + pull-quote on the left, the gallery
   slider on the right (stacks on tablet/mobile). Closes with a tagline
   centred under the gallery column specifically (not the full width). */
export default function Featured() {
  return (
    <section id="featured" aria-label="Our Work" className="relative overflow-hidden bg-ink border-b-4 border-[#c8b08a] py-16 md:py-[70px] lg:pb-[70px] lg:pt-[198px]">
      {/* Figma's real box: x=-366 y=+342(rel) w=1064 h=734 on a 1920/1088
         reference, plus its actual fill: image at 55% opacity + a
         top-to-bottom transparent→ink gradient (not a flat low opacity) so
         it fades into the section bg. Per design review this is a
         horizontal flip (scaleX(-1)), not a vertical flip or 180° rotation.
         Position is centre-referenced like What We Do's blueprint, not a
         pure vw value: the sketch's left edge is a fixed 736px left of the
         standard Container's own left edge (370px at the 1920 reference —
         370-736=-366, matching Figma exactly), so it re-centres with the
         content block on ultra-wide screens instead of drifting further
         from centre forever. Width still scales with viewport, capped at
         Figma's own 1064px so it can't outgrow the reference size. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[31%] hidden aspect-[1064/734] [transform:scaleX(-1)] lg:block"
        style={{ left: "calc(max(32px, (100vw - 1180px) / 2) - 736px)", width: "min(55.4167vw, 1064px)" }}
      >
        <img src={SKETCH} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover opacity-[0.55]" />
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
        <div className="grid items-start gap-9 lg:grid-cols-[298fr_850fr] lg:gap-x-[30px] lg:gap-y-0">
          <div className="text-center lg:mt-[66px] lg:text-left" data-reveal>
            <Eyebrow className="mx-auto lg:mx-0 lg:text-[22px]">Our Work</Eyebrow>
            <h2 className="fig-trim mt-3 font-serif font-semibold text-[28px] leading-[1.08] text-cream-light sm:text-[32px] lg:mt-4 lg:text-[56px] lg:leading-[64px]">
              Featured<span className="lg:hidden"> </span>
              <br className="hidden lg:block" />
              Creations
            </h2>
            <GoldRule width={114} className="mx-auto mt-7 lg:mx-0 lg:mt-6" />
            <p className="fig-trim mx-auto mt-5 max-w-[28rem] font-sans text-[14px] leading-relaxed text-line lg:mx-0 lg:mt-7 lg:max-w-[34rem] lg:text-[18px] lg:leading-[27px]">
              Explore a selection of custom jewellery designed and handcrafted for our clients, each piece reflecting a unique story, style and vision.
            </p>
            <p className="mx-auto mt-2 max-w-[28rem] font-sans text-[14px] italic leading-relaxed text-gold lg:mx-0 lg:mt-6 lg:max-w-[22rem] lg:text-[18px]">
              No two stories are the same. Neither are our creations.
            </p>
          </div>

          <div>
            <FeaturedGallery />

            {/* Figma's closing rule + caption sit directly under the gallery
               column (698-1548), 28px below it — not full section width.
               Rule stroke is #d8cbb7 (divider) at 1px, caption fill is solid
               #625b52 (body-2) — neither is a translucent cream-light blend. */}
            <div className="relative mt-7 border-t border-divider pt-[23px] lg:pt-[29px]">
              <p className="text-center font-serif text-[18px] tracking-[0.1em] text-body-2 [font-variant:small-caps] lg:text-[20px]">
                each piece is unique, just like the person who wears it.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
