import Image from "next/image";
import { Container, CTAButton } from "./ui";
import { Eyebrow, GoldRule } from "./SectionHeader";
import HeroVideo from "./HeroVideo";

/* Hero — a cinematic dark band with the workshop video playing behind the copy.
   The intersecting-rings product shot is decorative and straddles the dark→cream
   seam on desktop (absolute, `pointer-events-none`); on tablet/mobile it simply
   flows below the copy. Structural content (text + CTAs) stays in the grid. */
export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-ink border-b-4 border-[#c8b08a] lg:z-20 lg:min-h-[988px] lg:overflow-visible">
      {/* full-bleed background video + dark wash (clipped to the hero band) */}
      <div className="absolute inset-0 overflow-hidden">
        <HeroVideo />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/55 to-ink" />
      </div>

      <Container className="relative lg:!px-[24px]">
        <div className="grid grid-cols-1 items-center gap-10 pb-16 pt-28 sm:pt-32 md:pb-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-0 lg:pb-0 lg:pt-0">
          {/* copy — Figma component's own Top:377/Left:394 (Left comes from the
             Container's 24px inset), not vertically centred in the section. */}
          <div data-reveal className="max-w-[520px] lg:max-w-[497px] lg:self-start lg:pt-[377px]">
            <Eyebrow>Since 1978</Eyebrow>
            <h1 className="fig-trim mt-4 font-serif font-semibold text-cream-light text-[34px] leading-[1.05] md:text-[48px] md:leading-[1.02] lg:text-[56px] lg:leading-[64px]">
              Expert Craftsmanship.
              <br />
              Personally Made.
            </h1>
            <GoldRule width={114} className="mt-6 lg:mt-8" />
            <p className="fig-trim mt-7 max-w-[480px] font-sans text-[15px] leading-relaxed text-cream-light/75 md:text-base lg:text-[18px] lg:leading-[27px] lg:text-[#cfc6b8]">
              Since 1978, Grech Jewellers has combined traditional craftsmanship with
              modern design technology to create custom jewellery that&rsquo;s personally
              designed, precision manufactured and made to last for generations.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row lg:mt-6">
              <CTAButton href="#book" variant="gold" className="lg:!h-14">Book a Consultation</CTAButton>
              <CTAButton href="#featured" variant="dark" className="lg:!h-14 lg:!px-[42px]">See Our Work</CTAButton>
            </div>
          </div>

          {/* intersecting rings — in-flow on mobile/tablet; hidden at lg in
             favour of the exact-position version below. */}
          <div className="pointer-events-none relative mx-auto w-full max-w-[520px] md:max-w-[600px] lg:hidden">
            <Image
              src="/assets/hero-rings.png"
              alt="Grech Jewellers diamond engagement ring and matching wedding band"
              width={720}
              height={720}
              priority
              sizes="(min-width: 768px) 600px, 90vw"
              className="h-auto w-full drop-shadow-2xl"
            />
          </div>
        </div>
      </Container>

      {/* intersecting rings, desktop — Figma's box (x=916, y=652, 720×720) is
         page-absolute against a 1920-wide reference artboard, so left/width
         are expressed as vw fractions (47.7083vw / 37.5vw) rather than fixed
         px: 47.7083+37.5=85.2% of viewport width, so the right edge can never
         exceed the viewport at ANY size — reproduces Figma exactly at 1920
         while scaling down (instead of overflowing) at narrower lg widths
         (1024–1919). Width is capped at 720px so it doesn't grow past Figma's
         intended size on ultra-wide screens. Top stays a fixed offset off the
         section (its height doesn't scale with viewport width); the seam
         bleed is proportionally smaller at narrower lg widths, which is an
         acceptable trade-off for real responsiveness. */}
      <Image
        src="/assets/hero-rings.png"
        alt="Grech Jewellers diamond engagement ring and matching wedding band"
        width={720}
        height={720}
        priority
        sizes="720px"
        className="pointer-events-none absolute hidden drop-shadow-2xl lg:top-[652px] lg:block lg:left-[47.7083vw] lg:w-[min(37.5vw,720px)]"
      />
    </section>
  );
}
