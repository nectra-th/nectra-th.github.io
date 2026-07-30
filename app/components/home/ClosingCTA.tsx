import { Container } from "./ui";
import { Eyebrow } from "./SectionHeader";

/* eslint-disable @next/next/no-img-element */

const RING = "/assets/figma-img/a9d1b22585ed4478f4ae22a79b5a0c37d0f09e70.png";
const STAMP = "/assets/figma-img/a15446604381559e8dde90720667fc5fa3dcb262.png";

/* Closing CTA — centred invitation flanked by a ring render and the GJ stamp on
   desktop; the stamp sits above the copy on smaller screens. */
export default function ClosingCTA() {
  return (
    <section className="relative overflow-hidden bg-ink py-16 md:py-20 lg:py-24">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.6fr_1fr]">
          <img src={RING} alt="" aria-hidden loading="lazy" decoding="async" className="hidden justify-self-start lg:block lg:w-[240px]" />

          <div className="text-center" data-reveal>
            <img src={STAMP} alt="" aria-hidden loading="lazy" decoding="async" className="mx-auto mb-6 h-24 w-24 lg:hidden" />
            <Eyebrow tone="gold-light" className="mx-auto">We Look Forward to Meeting You</Eyebrow>
            <h2 className="mx-auto mt-4 max-w-[18ch] font-serif text-[28px] font-semibold leading-[1.15] text-cream-light [font-variant:small-caps] md:text-[34px] lg:text-[40px]">
              A Conversation Today Creates a Legacy For Generations
            </h2>
            <a href="#book" className="group mt-7 inline-flex items-center gap-2 font-sans text-[15px] font-bold uppercase tracking-[0.08em] text-gold transition-colors hover:text-gold-light">
              Start a Conversation
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">›</span>
            </a>
          </div>

          <img src={STAMP} alt="" aria-hidden loading="lazy" decoding="async" className="hidden justify-self-end lg:block lg:w-[190px]" />
        </div>
      </Container>
    </section>
  );
}
