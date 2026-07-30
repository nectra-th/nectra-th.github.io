import Image from "next/image";
import { Container } from "./ui";
import { GoldRule } from "./SectionHeader";

/* Figma renders orogreco's logo box at a 3.35 ratio (161×48) via a non-uniform
   imageTransform, but the source file's natural ratio is 5.02 (768×153) —
   replicating the Figma stretch would visibly distort a real brand logo, so
   this keeps the file's true ratio and only matches Figma's height (equal to
   Ellani, 48px at the reference width — not equal to Coeur, as before). */
const BRANDS = [
  { src: "/assets/brand-coeurdelion.png", alt: "Cœur de Lion", w: 800, h: 143, cls: "h-6 lg:h-8" },
  { src: "/assets/brand-ellani.png", alt: "Ellani Collection", w: 800, h: 356, cls: "h-9 lg:h-12" },
  { src: "/assets/brand-orogreco.png", alt: "Oro Greco", w: 768, h: 153, cls: "h-9 lg:h-12" },
];

/* Selected Brands In Store — dark strip with three brand logos: a row on
   desktop/tablet, stacked on mobile. */
export default function Brands() {
  return (
    <section id="brands" aria-label="Selected Brands In Store" className="bg-ink border-b-4 border-[#c8b08a] pb-14 pt-14 md:pt-16 lg:pb-[78px] lg:pt-[67px]">
      <Container>
        <div className="text-center">
          <h2 className="fig-trim text-h2-caps text-cream-light">
            Selected Brands In Store
          </h2>
          <GoldRule width={124} center color="bg-[#c8b08a]" thickness="h-px" className="mt-4" />
        </div>
        <div className="mt-10 flex flex-col items-center justify-center gap-10 sm:flex-row sm:gap-16 lg:mt-12 lg:gap-[88px]">
          {BRANDS.map((b) => (
            <Image
              key={b.src}
              src={b.src}
              alt={b.alt}
              width={b.w}
              height={b.h}
              sizes="200px"
              className={`w-auto opacity-[0.83] transition-opacity duration-500 hover:opacity-100 ${b.cls}`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
