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
   instance's `characters` overrides). Verified against tablet.1_4838.json:
   tablet is NOT a stacked mobile layout — the workshop photo sits beside the
   copy, bled to the tablet artboard's own right edge (x=444.57, w=389.38 of
   834 ≈ flush), same idea as desktop's bleed-to-1920-edge just at its own
   reference size. The rotating "David Ring" media card's position/size as a
   % of the photo box is (within Figma's own rounding) identical between
   tablet and desktop — -11.19%/73.94%/31.18% here vs desktop's
   -11.22%/73.92%/31.19% — so it reuses the same relative style. A pen-sketch
   bleeds off the left as a decorative backdrop (Figma: full opacity — the
   line art is faint on its own, no CSS fade needed) and bleeds down past
   this section's own bottom into Four Pillars below (same cream background,
   so the seam is invisible) — needs `lg:overflow-visible` on the section so
   it isn't clipped early; the photo/card don't rely on clipping for their
   own bounds so this is safe. Only true mobile still stacks in-flow. */
export default function WhyIntro() {
  return (
    <section id="why" aria-label="Why Grech" className="relative overflow-hidden bg-cream py-16 md:overflow-visible md:py-0 md:pb-[80px] lg:min-h-[1014px] lg:overflow-visible lg:pb-0">
      {/* decorative pen-sketch backdrop — Figma x=-261 y=806(rel) w=1115 h=836
         at desktop; x=-114 y=790(rel) w=603 h=452 at tablet (verified against
         tablet.1_4838.json — its own composition, not a scale of desktop's).
         Bleeds off the left at both tiers and, at both tiers, down past this
         section's own bottom into Four Pillars below — `overflow-visible` is
         needed on the section at md too (not just lg) or the tablet version
         gets clipped early. Explicit z-0: this section is `position:relative`
         (for the photo/ring below), which — regardless of DOM order — paints
         its whole subtree above Four Pillars' plain static section next
         door, so without a z-index the sketch would sit on top of Four
         Pillars' card text where it bleeds through. Four Pillars' own
         Container is z-10 to sit above this, while Four Pillars' section
         background (non-positioned) stays beneath it so the bleed still
         shows. */}
      <img
        src={SKETCH}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute z-0 hidden md:block md:left-[-13.669vw] md:top-[790px] md:h-[452px] md:w-[min(72.302vw,603px)] lg:left-[-261px] lg:top-[806px] lg:h-[836px] lg:w-[1115px]"
      />

      <Container className="relative lg:!px-[20px]">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[543px_1fr] lg:items-start lg:gap-0">
          {/* copy — Figma component's own Top:433 (relative to section top) at
             desktop, Top:155/width:352 at tablet (both verified per-breakpoint,
             not a scale of one another). */}
          <div className="md:max-w-[352px] md:pt-[155px] lg:max-w-[543px] lg:self-start lg:pt-[433px]">
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

          {/* imagery — in-flow, contained on mobile only; tablet and desktop
             each get their own Figma-exact bled/absolute version below. */}
          <div className="md:hidden">
            <div className="relative mx-auto w-full max-w-[560px]">
              <div
                data-scroll-image="why"
                className="relative aspect-[731/533] w-full overflow-hidden rounded-2xl"
                style={{ boxShadow: "0 22px 60px rgba(20,19,18,0.14)" }}
              >
                <Image
                  src={WORKSHOP}
                  alt="A Grech jeweller at the workshop bench with tools and design sketches"
                  fill
                  sizes="90vw"
                  className="object-cover"
                />
              </div>
              {/* rotating ring media card overlapping the lower-left corner */}
              <div
                className="gj-lift absolute bottom-[-26px] left-4 h-[150px] w-[180px] overflow-hidden rounded-xl border border-divider bg-black sm:h-[168px] sm:w-[202px]"
                style={{ boxShadow: "0 6px 20px rgba(0,0,0,0.25)", boxSizing: "border-box" }}
              >
                <RotatingImage srcs={RINGS} bgSize="cover" bgPos="center" />
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* workshop photo + media card, tablet — Figma's exact box (x=444.57,
         y=590 rel, 389.38×283.77) bleeds to the RIGHT EDGE OF THE 834
         REFERENCE ARTBOARD (444.57+389.38=833.95 ≈ 834), same wrapper
         technique as desktop but capped at the tablet reference instead of
         1920. Top is a fixed 121px off the section's own top (measured from
         where Hero's 469px band ends), not vw-scaled — same convention as
         desktop's fixed top offset. Hidden at lg in favour of the desktop
         version below. */}
      <div className="absolute inset-x-0 top-0 mx-auto hidden h-0 max-w-[834px] md:block lg:hidden">
        <div className="absolute right-0 top-[121px] aspect-[389/284] w-[min(46.6882vw,389px)]">
          <div data-scroll-image="why" className="relative h-full w-full overflow-hidden rounded-l-2xl border border-[#d8cbb7]" style={{ boxShadow: "0 22px 60px rgba(20,19,18,0.14)" }}>
            <Image
              src={WORKSHOP}
              alt="A Grech jeweller at the workshop bench with tools and design sketches"
              fill
              sizes="389px"
              className="object-cover"
            />
          </div>
          <div
            className="gj-lift absolute overflow-hidden rounded-xl border border-divider bg-black"
            style={{
              left: "-11.22%", top: "73.92%", width: "31.19%", aspectRatio: "228 / 190",
              boxShadow: "0 6px 20px rgba(0,0,0,0.25)", boxSizing: "border-box",
            }}
          >
            <RotatingImage srcs={RINGS} bgSize="cover" bgPos="center" />
          </div>
        </div>
      </div>

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
          <div data-scroll-image="why" className="relative h-full w-full overflow-hidden rounded-l-2xl border border-[#d8cbb7]" style={{ boxShadow: "0 22px 60px rgba(20,19,18,0.14)" }}>
            <Image
              src={WORKSHOP}
              alt="A Grech jeweller at the workshop bench with tools and design sketches"
              fill
              sizes="731px"
              className="object-cover"
            />
          </div>
          <div
            className="gj-lift absolute overflow-hidden rounded-xl border border-divider bg-black"
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
