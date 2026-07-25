"use client";

import Image from "next/image";
import { useState } from "react";
import { Container, Eyebrow } from "./ui";
import Reveal from "./Reveal";

const GALLERY = [
  { src: "featured-main", alt: "Emerald and diamond dress ring in yellow gold" },
  { src: "gallery-thumb-1", alt: "Custom gold ring creation" },
  { src: "gallery-thumb-2", alt: "Solitaire diamond engagement ring" },
  { src: "gallery-thumb-3", alt: "Diamond cluster ring" },
  { src: "gallery-thumb-4", alt: "Diamond eternity band" },
];

export default function FeaturedCreations() {
  const [i, setI] = useState(0);
  const go = (d: number) => setI((p) => (p + d + GALLERY.length) % GALLERY.length);

  return (
    <section id="creations" className="relative overflow-hidden bg-ink py-20 md:py-16 lg:pt-[264px] lg:pb-[127px]">
      <div className="pointer-events-none absolute -left-10 bottom-0 hidden h-[560px] w-[560px] opacity-[0.10] lg:block">
        <Image src="/assets/ourwork-sketch.jpg" alt="" fill className="object-contain" />
      </div>

      <Container className="relative">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.82fr_1.18fr]">
          {/* Copy */}
          <Reveal className="md:text-center lg:text-left">
            <Eyebrow>Our Work</Eyebrow>
            <h2 className="mt-4 font-serif text-[1.95rem] font-semibold leading-[1.05] text-cream-light md:text-[3.5rem]">
              Featured
              <br />
              Creations
            </h2>
            <div className="mt-6 h-[2px] w-14 bg-gold md:mx-auto lg:mx-0 lg:w-[114px] lg:bg-gold-dark" />
            <p className="mt-7 max-w-sm md:mx-auto lg:mx-0 text-[15px] leading-relaxed text-cream-light/70 md:text-base">
              Explore a selection of custom jewellery designed and handcrafted
              for our clients, each piece reflecting a unique story, style and
              vision.
            </p>
            <p className="mt-5 max-w-sm md:mx-auto lg:mx-0 text-[15px] font-medium leading-relaxed text-gold md:text-base">
              No two stories are the same. Neither are our creations.
            </p>
          </Reveal>

          {/* Gallery */}
          <Reveal delay={120}>
            <div className="group relative aspect-[16/10] lg:aspect-[16/11.5] w-full overflow-hidden rounded-lg shadow-2xl">
              <Image
                key={GALLERY[i].src}
                src={`/assets/${GALLERY[i].src}.jpg`}
                alt={GALLERY[i].alt}
                fill
                className="animate-img-fade object-cover transition-transform duration-[600ms] ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 90vw, 700px"
              />
              <div className="absolute bottom-4 right-4 flex gap-4">
                <button
                  onClick={() => go(-1)}
                  aria-label="Previous"
                  className="relative h-14 w-14 transition-transform duration-200 ease-out hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink/40"
                >
                  <Image src="/assets/icons/gallery-arrow-left.svg" alt="" fill />
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Next"
                  className="relative h-14 w-14 transition-transform duration-200 ease-out hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink/40"
                >
                  <Image src="/assets/icons/gallery-arrow-right.svg" alt="" fill />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="mt-5 grid grid-cols-5 gap-3">
              {GALLERY.map((g, idx) => (
                <button
                  key={g.src}
                  onClick={() => setI(idx)}
                  className={`group relative aspect-square overflow-hidden rounded-md transition-[opacity,box-shadow,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink ${
                    idx === i
                      ? "ring-2 ring-gold ring-offset-2 ring-offset-ink"
                      : "opacity-60 hover:-translate-y-0.5 hover:opacity-100"
                  }`}
                >
                  <Image src={`/assets/${g.src}.jpg`} alt={g.alt} fill className="object-cover transition-transform duration-500 ease-out group-hover:scale-110" sizes="130px" />
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Tagline */}
        <div className="mt-20 flex items-center justify-center gap-6">
          <span className="hidden h-px w-24 bg-gold/40 sm:block" />
          <p className="text-center font-serif text-lg tracking-[0.14em] text-cream-light/70">
            EACH PIECE IS UNIQUE, JUST LIKE THE PERSON WHO WEARS IT.
          </p>
          <span className="hidden h-px w-24 bg-gold/40 sm:block" />
        </div>
      </Container>
    </section>
  );
}
