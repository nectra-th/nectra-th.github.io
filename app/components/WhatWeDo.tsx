import Image from "next/image";
import { Button, Container, Eyebrow } from "./ui";
import { RingIcon } from "./icons";
import Reveal from "./Reveal";

const SERVICES = [
  { img: "service-1", title: ["Custom", "Jewellery"], desc: "Designed and handcrafted to reflect your story, style and vision." },
  { img: "service-2", title: ["Engagement &", "Wedding Rings"], desc: "Beautifully crafted rings for life's most important moments." },
  { img: "service-3", title: ["Jewellery", "Repairs"], desc: "Expert repairs and restorations to bring treasured pieces back to life." },
  { img: "service-4", title: ["Valuations"], desc: "Independent jewellery valuations for insurance, estates and peace of mind." },
  { img: "service-5", title: ["Antique", "Jewellery"], desc: "Restoring and preserving antique jewellery while respecting its original character." },
  { img: "service-6", title: ["Watch", "Services"], desc: "Professional servicing, repairs and battery replacements provided for quality timepieces." },
];

export default function WhatWeDo() {
  return (
    <section id="what-we-do" className="relative overflow-hidden bg-ink py-20 md:py-16 lg:pt-[356px] lg:pb-[212px]">
      {/* Faint ring wireframe backdrop */}
      <div className="pointer-events-none absolute left-0 top-1/2 hidden h-[680px] w-[620px] -translate-y-1/2 opacity-[0.16] lg:block">
        <Image src="/assets/whatwedo-wireframe.jpg" alt="" fill className="object-contain" />
      </div>

      <Container className="relative">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-[0.75fr_2fr] md:gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          {/* Intro */}
          <Reveal className="relative z-10">
            <Eyebrow>What We Do</Eyebrow>
            <h2 className="mt-4 font-serif text-[1.95rem] font-semibold leading-[1.08] text-cream-light md:text-[2rem] lg:text-[3.2rem]">
              Crafted Around
              <br />
              Your Story
            </h2>
            <p className="mt-7 max-w-md text-[15px] leading-relaxed text-cream-light/70 md:text-base">
              From bespoke engagement rings to treasured family heirlooms, every
              piece receives the same care, precision and craftsmanship that has
              defined Grech Jewellers since 1978.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button href="#booking" variant="gold">Book a Consultation</Button>
              <Button href="#creations" variant="outlineLight">See Our Work</Button>
            </div>
          </Reveal>

          {/* Service cards */}
          <Reveal delay={120} className="grid grid-cols-1 gap-x-10 gap-y-20 sm:grid-cols-2 md:gap-x-6 md:gap-y-12 lg:gap-x-10 lg:gap-y-[64px]">
            {SERVICES.map((s) => (
              <div key={s.img} className="group flex gap-6 md:gap-4 lg:gap-6">
                <div className="relative h-[215px] w-[165px] md:h-[170px] md:w-[120px] lg:h-[240px] lg:w-[188px] shrink-0 overflow-hidden rounded-lg shadow-lg transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-black/40">
                  <Image
                    src={`/assets/${s.img}.jpg`}
                    alt={s.title.join(" ")}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="118px"
                  />
                </div>
                <div className="pt-1">
                  <RingIcon className="h-[30px] w-6 text-gold transition-colors duration-300 group-hover:text-gold-light" />
                  <h3 className="mt-2 font-serif text-[1.65rem] md:text-[1.3rem] lg:text-[1.75rem] font-normal leading-[1.05] text-cream-light transition-colors duration-300 group-hover:text-gold lg:[font-variant:small-caps]">
                    {s.title.map((t, i) => (
                      <span key={i} className="block">{t}</span>
                    ))}
                  </h3>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-cream-light/60">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
