import Image from "next/image";
import { Button, Container, Eyebrow } from "./ui";
import Reveal from "./Reveal";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-rule bg-cream lg:h-[988px] lg:overflow-visible lg:border-b-4"
    >
      {/* Dark upper area — matches the Figma hero band height, fills the section exactly */}
      <div className="absolute inset-x-0 top-0 h-[660px] overflow-hidden bg-ink md:h-[520px] lg:h-full">
        <Image
          src="/assets/hero-poster.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/70 to-ink" />
      </div>

      <Container className="relative">
        <div className="grid min-h-[760px] grid-cols-1 items-center gap-8 pt-[150px] md:min-h-[560px] md:pt-0 md:grid-cols-[1fr_0.95fr] lg:block lg:min-h-[988px] lg:pt-0">
          {/* Left: copy */}
          <Reveal className="relative z-10 pb-24 md:pb-0 lg:absolute lg:left-[24px] lg:top-[373px] lg:w-[540px] lg:pb-0">
            <Eyebrow className="text-gold lg:text-[15px]">Since 1978</Eyebrow>
            <h1 className="mt-4 font-serif text-[2rem] font-semibold leading-[1.12] text-cream-light md:text-[2.75rem] md:leading-[1.08] lg:mt-[9px] lg:text-[56px] lg:leading-[0.9]">
              Expert Craftsmanship.
              <br />
              Personally Made.
            </h1>
            <div className="mt-6 h-[2px] w-14 bg-gold lg:mt-[18px] lg:w-[114px] lg:bg-gold-dark" />
            <p className="mt-7 max-w-md text-[15px] leading-relaxed text-cream-light/75 md:text-base lg:mt-[38px] lg:max-w-[480px] lg:text-[18px] lg:leading-[1.5]">
              Since 1978, Grech Jewellers has combined traditional craftsmanship
              with modern design technology to create custom jewellery that&rsquo;s
              personally designed, precision manufactured and made to last for
              generations.
            </p>
            <div className="mt-9 flex flex-wrap gap-4 lg:mt-[14px] lg:gap-[12px]">
              <Button href="#booking" variant="gold" className="lg:px-[36px] lg:text-[16px]">
                Book a Consultation
              </Button>
              <Button href="#creations" variant="dark" className="lg:px-[36px] lg:text-[16px]">
                See Our Work
              </Button>
            </div>
          </Reveal>

          {/* Right: intersecting rings — straddle the dark/cream boundary */}
          <div className="pointer-events-none relative z-20 mx-auto w-full max-w-[620px] md:mx-0 md:self-end md:-mb-[40px] lg:absolute lg:left-1/2 lg:top-[652px] lg:mb-0 lg:-ml-[44px] lg:w-[720px] lg:max-w-none">
            <Image
              src="/assets/hero-rings.png"
              alt="Grech Jewellers diamond engagement ring and wedding band"
              width={720}
              height={720}
              priority
              className="h-auto w-full drop-shadow-2xl"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
