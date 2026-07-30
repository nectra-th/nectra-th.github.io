import Image from "next/image";
import { CTAButton, Container } from "./ui";
import SectionHeader from "./SectionHeader";
import RotatingImage from "./RotatingImage";

/* eslint-disable @next/next/no-img-element */

const WORKSHOP = "/assets/figma-img/9bbb1421b0e46c5d5cbfa426a35c775df39e4423.png";
const SKETCH = "/assets/figma-img/c8c0022e68fb42e9221a5a1be9fadffbd8839272.png";
const RINGS = ["/assets/figma-img/ring-rot-1.png", "/assets/figma-img/ring-rot-2.png", "/assets/figma-img/ring-rot-3.png"];

/* Why Grech — copy left (the same reusable "DESKTOP" component as the Hero:
   eyebrow/heading/rule/body/2-CTA pattern, verified against the Figma
   instance's `characters` overrides). On desktop the workshop photo bleeds
   to the viewport's right edge (Figma: x=1190 w=731, right edge ≈ viewport
   edge) — positioned off the section like the Hero ring, with a vw-based
   width so it scales down instead of overflowing at narrower lg widths. The
   rotating "David Ring" media card overlaps its lower-left corner at the
   exact Figma offset, expressed as % of the photo box so it scales with it.
   A pen-sketch bleeds off the left as a decorative backdrop (Figma: full
   opacity — the line art is faint on its own, no CSS fade needed) and bleeds
   down past this section's own bottom into Four Pillars below (same cream
   background, so the seam is invisible) — needs `lg:overflow-visible` on the
   section so it isn't clipped early; the photo/card don't rely on clipping
   for their own bounds so this is safe. Stacks in-flow on mobile/tablet. */
export default function WhyIntro() {
  return (
    <section id="why" aria-label="Why Grech" className="relative overflow-hidden bg-cream py-16 md:py-24 lg:min-h-[1014px] lg:overflow-visible lg:py-0">
      {/* decorative pen-sketch backdrop — Figma x=-261 y=808(rel) w=1115 h=836.
         Explicit z-0: this section is `position:relative` (for the photo/ring
         below), which — regardless of DOM order — paints its whole subtree
         above Four Pillars' plain static section next door, so without a
         z-index the sketch would sit on top of Four Pillars' card text where
         it bleeds through. Four Pillars' own Container is z-10 to sit above
         this, while Four Pillars' section background (non-positioned) stays
         beneath it so the bleed still shows. */}
      <img
        src={SKETCH}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute z-0 hidden lg:block lg:left-[-261px] lg:top-[806px] lg:h-[836px] lg:w-[1115px]"
      />

      <Container className="relative lg:!px-[20px]">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[543px_1fr] lg:items-start lg:gap-0">
          {/* copy — Figma component's own Top:433 (relative to section top) */}
          <div className="lg:max-w-[543px] lg:self-start lg:pt-[433px]">
            <SectionHeader
              eyebrow="Why Grech"
              title={<>Adelaide&rsquo;s Trusted<br />Manufacturing<br />Jeweller</>}
              body="Since 1978, Grech Jewellers has combined nearly five decades of traditional jewellery-making expertise with modern design technology to create custom pieces that are personally designed, precision manufactured and built to last for generations."
              ruleWidth={114}
            >
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <CTAButton href="#book" variant="gold">Book a Consultation</CTAButton>
                <CTAButton href="#featured" variant="dark" className="!hidden">See Our Work</CTAButton>
              </div>
            </SectionHeader>
          </div>

          {/* imagery — in-flow, contained on mobile/tablet; hidden at lg in
             favour of the bleed-to-edge version below. */}
          <div className="lg:hidden">
            <div className="relative mx-auto w-full max-w-[560px]">
              <div
                className="relative aspect-[731/533] w-full overflow-hidden rounded-2xl"
                style={{ boxShadow: "0 22px 60px rgba(20,19,18,0.14)" }}
              >
                <Image
                  src={WORKSHOP}
                  alt="A Grech jeweller at the workshop bench with tools and design sketches"
                  fill
                  sizes="(min-width: 1024px) 560px, 90vw"
                  className="object-cover"
                />
              </div>
              {/* rotating ring media card overlapping the lower-left corner */}
              <div
                className="gj-lift absolute bottom-[-26px] left-4 h-[150px] w-[180px] overflow-hidden rounded-xl border border-divider sm:h-[168px] sm:w-[202px]"
                style={{ boxShadow: "0 6px 20px rgba(0,0,0,0.25)", boxSizing: "border-box" }}
              >
                <RotatingImage srcs={RINGS} bgSize="cover" bgPos="center" />
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* workshop photo + media card, desktop — Figma's exact box (x=1190,
         y=315 relative, 731×533) bleeds to the RIGHT EDGE OF THE 1920
         REFERENCE CANVAS, not the raw viewport: `right-0` was previously
         relative to the full-width section, so on very wide monitors it kept
         chasing the ever-more-distant viewport edge, drifting far from the
         centred content column. This inner `max-w-[1920px] mx-auto` wrapper
         behaves exactly like the viewport for widths ≤1920 (no change there)
         but caps out and re-centres for anything wider, so the photo settles
         at a fixed distance from the centred column instead of continuing to
         bleed outward. Width is still a vw fraction (38.07vw, capped at
         731px) so it scales down safely at narrower lg widths. The media
         card is positioned as a % of the photo box so it scales with it. */}
      <div className="absolute inset-x-0 top-0 mx-auto hidden h-0 max-w-[1920px] lg:block">
        <div className="absolute right-0 top-[315px] aspect-[731/533] w-[min(38.07vw,731px)]">
          <div className="relative h-full w-full overflow-hidden rounded-2xl" style={{ boxShadow: "0 22px 60px rgba(20,19,18,0.14)" }}>
            <Image
              src={WORKSHOP}
              alt="A Grech jeweller at the workshop bench with tools and design sketches"
              fill
              sizes="731px"
              className="object-cover"
            />
          </div>
          <div
            className="gj-lift absolute overflow-hidden rounded-xl border border-divider"
            style={{
              left: "-11.22%", top: "73.92%", width: "31.19%", aspectRatio: "228 / 190",
              boxShadow: "0 6px 20px rgba(0,0,0,0.25)", boxSizing: "border-box",
            }}
          >
            <RotatingImage srcs={RINGS} bgSize="cover" bgPos="center" />
          </div>
        </div>
      </div>
    </section>
  );
}
