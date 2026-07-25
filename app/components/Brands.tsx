import Image from "next/image";
import { Container } from "./ui";
import Reveal from "./Reveal";

const BRANDS = [
  { src: "brand-coeurdelion", alt: "Coeur de Lion", w: 179, h: 32 },
  { src: "brand-ellani", alt: "Ellani Collections", w: 108, h: 48 },
  { src: "brand-orogreco", alt: "Orogreco", w: 161, h: 48 },
];

export default function Brands() {
  return (
    <section className="bg-ink py-16 md:py-14 lg:pt-[67px] lg:pb-[76px]">
      <Container>
        <h2 className="text-center font-serif text-3xl font-semibold text-cream-light md:text-4xl">
          Selected Brands In Store
        </h2>
        <div className="mx-auto mt-4 h-[2px] w-14 bg-gold lg:w-[124px] lg:bg-gold-dark" />

        <Reveal className="mt-12 flex flex-wrap items-center justify-center gap-x-20 gap-y-10">
          {BRANDS.map((b) => (
            <Image
              key={b.src}
              src={`/assets/${b.src}.png`}
              alt={b.alt}
              width={b.w}
              height={b.h}
              className="h-9 w-auto opacity-70 grayscale transition duration-300 ease-out hover:scale-105 hover:opacity-100 hover:grayscale-0"
            />
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
