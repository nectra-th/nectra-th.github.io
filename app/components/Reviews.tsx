"use client";

import { useRef, useState } from "react";
import { Container, Eyebrow } from "./ui";
import { Quote } from "./icons";
import Reveal from "./Reveal";

const REVIEWS = [
  {
    text: "We had our wedding rings made by Grech Jewellers and couldn't be happier. The craftsmanship is outstanding and the service was personal from start to finish. The quality and attention to detail is second to none.",
    name: "Michael & Laura",
  },
  {
    text: "David reworked my grandmother's ring into something I'll treasure forever. He listened, guided me honestly, and the result exceeded every expectation. A truly personal experience.",
    name: "Sarah T.",
  },
  {
    text: "From the first sketch to collecting the finished piece, everything was handled with such care. It's rare to deal directly with the jeweller who makes your ring. Highly recommend.",
    name: "James & Priya",
  },
];

export default function Reviews() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scrollTo = (idx: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[idx] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    setActive(idx);
  };

  return (
    <section className="bg-cream py-20 md:py-28 lg:pt-[148px] lg:pb-[121px]">
      <Container>
        <Reveal className="text-center">
          <Eyebrow>Reviews</Eyebrow>
          <h2 className="mt-3 font-serif text-[1.95rem] font-semibold text-ink-text md:text-5xl">
            What Our Clients Say
          </h2>
          <div className="mx-auto mt-4 h-[2px] w-14 bg-gold lg:w-[114px] lg:bg-gold-dark" />
          <p className="mx-auto mt-5 max-w-xl text-[15px] text-body md:text-base">
            Real stories from clients who&rsquo;ve trusted us with life&rsquo;s most
            meaningful pieces.
          </p>
        </Reveal>

        <div
          ref={trackRef}
          className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2"
        >
          {REVIEWS.map((r, idx) => (
            <figure
              key={idx}
              className="group w-full min-w-[85%] snap-start rounded-lg bg-cream-light p-8 shadow-sm transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/5 sm:min-w-0 sm:flex-1 sm:basis-1/3"
            >
              <Quote className="h-[19px] w-5 text-gold-dark transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-105" />
              <blockquote className="mt-4 text-[13.5px] leading-relaxed text-body">
                {r.text}
              </blockquote>
              <figcaption className="mt-5 text-[14px] font-medium text-ink-text">
                &ndash; {r.name}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-2.5">
          {REVIEWS.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Go to review ${idx + 1}`}
              onClick={() => scrollTo(idx)}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${
                active === idx ? "scale-125 bg-gold" : "bg-line hover:bg-gold/50"
              }`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
