import Image from "next/image";
import { Container } from "./ui";
import { GoldRule } from "./SectionHeader";

const BRANDS = [
  { src: "/assets/brand-coeurdelion.png", alt: "Cœur de Lion", w: 800, h: 143, cls: "h-6 lg:h-7" },
  { src: "/assets/brand-ellani.png", alt: "Ellani Collection", w: 800, h: 356, cls: "h-11 lg:h-14" },
  { src: "/assets/brand-orogreco.png", alt: "Oro Greco", w: 768, h: 153, cls: "h-6 lg:h-7" },
];

/* Selected Brands In Store — dark strip with three brand logos: a row on
   desktop/tablet, stacked on mobile. */
export default function Brands() {
  return (
    <section className="bg-ink py-14 lg:py-16">
      <Container>
        <div className="text-center" data-reveal>
          <h2 className="font-serif text-[26px] font-semibold tracking-[0.03em] text-cream-light [font-variant:small-caps] md:text-[32px] lg:text-[36px]">
            Selected Brands In Store
          </h2>
          <GoldRule width={64} center className="mt-5" />
        </div>
        <div className="mt-10 flex flex-col items-center justify-center gap-10 sm:flex-row sm:gap-16 lg:mt-12 lg:gap-24" data-reveal>
          {BRANDS.map((b) => (
            <Image key={b.src} src={b.src} alt={b.alt} width={b.w} height={b.h} sizes="200px" className={`w-auto opacity-90 ${b.cls}`} />
          ))}
        </div>
      </Container>
    </section>
  );
}
