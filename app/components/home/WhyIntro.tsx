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
   opacity — the line art is faint on its own, no CSS fade needed; clipped by
   this section's own overflow-hidden rather than reproducing its full
   836px-tall bleed into Four Pillars below). Stacks in-flow on mobile/tablet. */
export default function WhyIntro() {
  return (
    <section id="why" className="relative overflow-hidden bg-cream py-16 md:py-24 lg:min-h-[1014px] lg:py-0">
      {/* decorative pen-sketch backdrop — Figma x=-261 y=808(rel) w=1115 h=836 */}
      <img
        src={SKETCH}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute hidden lg:block lg:left-[-261px] lg:top-[808px] lg:h-[836px] lg:w-[1115px]"
      />

      <Container className="relative lg:!px-[20px]">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[543px_1fr] lg:items-start lg:gap-0">
          {/* copy — Figma component's own Top:433 (relative to section top) */}
          <div data-reveal className="lg:max-w-[543px] lg:self-start lg:pt-[433px]">
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
          <div data-reveal style={{ "--reveal-delay": "120ms" } as React.CSSProperties} className="lg:hidden">
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
                className="gj-lift absolute bottom-[-26px] left-4 h-[150px] w-[180px] overflow-hidden rounded-xl border-2 border-divider sm:h-[168px] sm:w-[202px]"
                style={{ boxShadow: "0 6px 20px rgba(0,0,0,0.25)", boxSizing: "border-box" }}
              >
                <RotatingImage srcs={RINGS} bgSize="cover" bgPos="center" />
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* workshop photo + media card, desktop — Figma's exact box (x=1190,
         y=315 relative, 731×533) bleeds to the viewport's right edge; left
         and width are vw fractions (62vw / 38.07vw, summing under 100%) so
         the right edge can never exceed the viewport at any lg-tier width,
         reproducing Figma exactly at the 1920 reference and scaling down
         (instead of overflowing) narrower. The media card is positioned as a
         % of this same box (Figma offset ÷ photo size), so it scales and
         stays glued to the photo's corner at every width. */}
      <div className="absolute hidden lg:top-[315px] lg:block lg:aspect-[731/533] lg:right-0 lg:w-[min(38.07vw,731px)]">
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
          className="gj-lift absolute overflow-hidden rounded-xl border-2 border-divider"
          style={{
            left: "-11.22%", top: "73.92%", width: "31.19%", aspectRatio: "228 / 190",
            boxShadow: "0 6px 20px rgba(0,0,0,0.25)", boxSizing: "border-box",
          }}
        >
          <RotatingImage srcs={RINGS} bgSize="cover" bgPos="center" />
        </div>
      </div>
    </section>
  );
}
