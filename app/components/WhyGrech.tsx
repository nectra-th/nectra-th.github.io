import Image from "next/image";
import { Button, Container, Eyebrow } from "./ui";
import Reveal from "./Reveal";

export default function WhyGrech() {
  return (
    <section
      id="why"
      className="relative overflow-hidden bg-cream py-20 md:py-16 lg:min-h-[1014px] lg:py-0"
    >
      <Container className="relative lg:h-[1014px]">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 lg:block">
          {/* Left: copy */}
          <Reveal className="relative z-10 lg:absolute lg:left-[20px] lg:top-[428px] lg:w-[543px]">
            <Eyebrow>Why Grech</Eyebrow>
            <h2 className="mt-4 font-serif text-[1.9rem] font-semibold leading-[1.12] text-ink-text md:text-[2.4rem] lg:text-[56px] md:leading-[1.1] lg:mt-[12px] lg:leading-[1.0]">
              Adelaide&rsquo;s Trusted
              <br />
              Manufacturing
              <br />
              Jeweller
            </h2>
            <div className="mt-8 h-[2px] w-16 bg-gold lg:mt-[18px] lg:w-[114px] lg:bg-gold-dark" />
            <p className="mt-10 max-w-lg text-[15px] leading-relaxed text-body md:text-[17px] md:leading-[1.75] lg:mt-[35px] lg:max-w-[543px] lg:text-[18px] lg:leading-[1.55]">
              Since 1978, Grech Jewellers has combined nearly five decades of
              traditional jewellery-making expertise with modern design
              technology to create custom pieces that are personally designed,
              precision manufactured and built to last for generations.
            </p>
            <div className="mt-12 flex flex-wrap gap-4 lg:mt-[10px] lg:gap-[12px]">
              <Button href="#booking" variant="gold" className="lg:px-[36px] lg:text-[16px]">
                Book a Consultation
              </Button>
              <Button href="#creations" variant="outlineDark" className="hidden lg:inline-flex lg:px-[36px] lg:text-[16px]">
                See Our Work
              </Button>
            </div>
          </Reveal>

          {/* Right: workshop photo + overlapping ring card */}
          <Reveal
            delay={120}
            className="relative mx-auto w-full max-w-[560px] lg:absolute lg:left-[820px] lg:top-[315px] lg:mx-0 lg:w-[731px] lg:max-w-none"
          >
            <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-xl lg:aspect-[731/533]">
              <Image
                src="/assets/why-workshop.jpg"
                alt="Grech Jewellers workshop and tools"
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 90vw, 731px"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 w-[42%] overflow-hidden rounded-lg border border-black/10 bg-ink shadow-2xl lg:bottom-auto lg:-left-[82px] lg:top-[394px] lg:h-[190px] lg:w-[228px]">
              <Image
                src="/assets/why-ring-card.jpg"
                alt="Diamond engagement ring by Grech Jewellers"
                width={228}
                height={190}
                className="h-auto w-full lg:h-full lg:object-cover"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
