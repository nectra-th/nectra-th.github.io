import Image from "next/image";
import { Container } from "./ui";
import SectionHeader from "./SectionHeader";

/* eslint-disable @next/next/no-img-element */

const BLUEPRINT = "/assets/figma-img/c14f17656e3eed8c249125dc63041ce9154d0701.png";

const SERVICES = [
  { title: ["Custom", "Jewellery"], icon: "ic-custom", img: "/assets/figma-img/170a0dc03a4a67f171f5bbfcbc64747037945dde.png", desc: "Designed and handcrafted to reflect your story, style and vision." },
  { title: ["Engagement &", "Wedding Rings"], icon: "ic-rings", img: "/assets/figma-img/c5c992b48e443701e426c3606eda9e7413009670.png", desc: "Beautifully crafted rings for life’s most important moments." },
  { title: ["Jewellery", "Repairs"], icon: "ic-anvil", img: "/assets/figma-img/f481b2b8396296b95352a977041180e3aafb449a.png", desc: "Expert repairs and restorations to bring treasured pieces back to life." },
  { title: ["Valuations"], icon: "ic-magnifier", img: "/assets/figma-img/4ac7c8fe6797951d87385b00fd3ba3e144263657.png", desc: "Independent jewellery valuations for insurance, estates and peace of mind." },
  { title: ["Antique", "Jewellery"], icon: "ic-pendant", img: "/assets/figma-img/a3a7e179e1e16f7a5392d7ee70b87cf294ca2051.png", desc: "Restoring and preserving antique jewellery while respecting its original character." },
  { title: ["Watch", "Services"], icon: "ic-watch", img: "/assets/figma-img/a0ea27c7ddd271697692c04050ca9bbdd77a11ec.png", desc: "Professional servicing, repairs and battery replacements provided for quality timepieces." },
];

function ServiceCard({ s }: { s: (typeof SERVICES)[number] }) {
  return (
    <article className="group flex gap-4 transition-transform duration-500 ease-[cubic-bezier(0.45,0,0.55,1)] will-change-transform hover:-translate-y-1 md:gap-5">
      <div className="relative aspect-[188/240] w-[92px] shrink-0 overflow-hidden rounded-xl sm:w-[110px] md:w-[150px] lg:w-[172px]">
        <Image src={s.img} alt={s.title.join(" ")} fill sizes="(min-width: 1024px) 172px, (min-width: 768px) 150px, (min-width: 640px) 110px, 92px" className="object-cover" />
      </div>
      <div className="min-w-0 pt-1">
        <img src={`/assets/icons/${s.icon}.png`} alt="" aria-hidden loading="lazy" decoding="async" className="h-7 w-auto lg:h-8" />
        <h3 className="mt-2.5 font-serif font-normal leading-[1.1] text-cream-light [font-variant:small-caps] text-[21px] md:text-[24px] lg:text-[28px] lg:tracking-[0.02em]">
          {s.title.map((t, i) => (
            <span key={i} className="block">{t}</span>
          ))}
        </h3>
        <span aria-hidden className="mt-3 block h-0.5 w-8 bg-gold-dark transition-all duration-500 group-hover:w-11" />
        <p className="mt-3 max-w-[15rem] font-sans text-[13px] leading-relaxed text-cream-light/70">{s.desc}</p>
      </div>
    </article>
  );
}

/* What We Do — dark editorial band. Header + faint ring blueprint on the left,
   six service cards on the right: 2×3 grid on tablet/desktop, a swipeable row
   (with a peek of the next card) on mobile. */
export default function WhatWeDo() {
  return (
    <section id="whatwedo" className="relative overflow-hidden bg-ink py-16 md:py-24 lg:py-28">
      <img
        src={BLUEPRINT}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute bottom-0 left-[-40px] hidden w-[560px] opacity-20 xl:block"
      />

      <Container className="relative">
        <div className="grid gap-12 xl:grid-cols-[0.82fr_1.5fr] xl:gap-16">
          <div data-reveal>
            <SectionHeader
              tone="dark"
              eyebrow="What We Do"
              title={<>Crafted Around<br />Your Story</>}
              body="From bespoke engagement rings to treasured family heirlooms, every piece receives the same care, precision and craftsmanship that has defined Grech Jewellers since 1978."
            />
          </div>

          <ul
            data-reveal
            tabIndex={0}
            aria-label="Our services"
            className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold sm:mx-0 sm:px-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 md:overflow-visible"
          >
            {SERVICES.map((s) => (
              <li key={s.title.join(" ")} className="w-[80%] shrink-0 snap-center sm:w-[46%] md:w-auto">
                <ServiceCard s={s} />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
