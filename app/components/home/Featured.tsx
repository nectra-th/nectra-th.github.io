import { Container } from "./ui";
import SectionHeader from "./SectionHeader";
import FeaturedGallery from "./FeaturedGallery";

/* eslint-disable @next/next/no-img-element */

const SKETCH = "/assets/figma-img/5f6008f58d9a12cc23a117e06c212f06004cb655.png";

/* Featured Creations — dark band. Copy + pull-quote on the left, the gallery
   slider on the right (stacks on tablet/mobile). Closes with a centred tagline. */
export default function Featured() {
  return (
    <section id="featured" className="relative overflow-hidden bg-ink py-16 md:py-24 lg:py-28">
      <img
        src={SKETCH}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute -left-16 top-1/3 hidden w-[360px] opacity-10 lg:block"
      />
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.5fr] lg:gap-16">
          <div data-reveal>
            <SectionHeader
              tone="dark"
              eyebrow="Our Work"
              title={<>Featured<br />Creations</>}
              body="Explore a selection of custom jewellery designed and handcrafted for our clients, each piece reflecting a unique story, style and vision."
            />
            <p className="mt-6 max-w-[22rem] font-sans text-[15px] italic leading-relaxed text-gold lg:text-[18px]">
              No two stories are the same. Neither are our creations.
            </p>
          </div>

          <div data-reveal style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
            <FeaturedGallery />
          </div>
        </div>

        <div className="relative mt-14 border-t border-cream-light/12 pt-7">
          <p className="text-center font-serif text-[16px] tracking-[0.12em] text-cream-light/55 [font-variant:small-caps] lg:text-[20px]">
            each piece is unique, just like the person who wears it.
          </p>
        </div>
      </Container>
    </section>
  );
}
