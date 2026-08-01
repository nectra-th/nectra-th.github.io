import { Container } from "./ui";

/* eslint-disable @next/next/no-img-element */

/* Two different framings of the same source photo, both straight from Figma:
   md/lg render a near-square crop (aspect 0.9964) that had to be exported
   from Figma directly — reproducing its STRETCH transform in CSS distorted
   the round diamond into an oval. Mobile's frame (278×227, aspect 1.2247)
   instead shows the photo essentially uncropped, so the original bitmap with
   object-cover reproduces it to within ~0.4% of Figma's own crop. */
const RING_SQUARE = "/assets/figma-img/ring-closing-crop.png";
const RING_FULL = "/assets/figma-img/a9d1b22585ed4478f4ae22a79b5a0c37d0f09e70.png";
const STAMP = "/assets/figma-img/a15446604381559e8dde90720667fc5fa3dcb262.png";

/* Closing CTA — one DOM order (ring → copy → stamp) serves every breakpoint:
   md/lg lay it out as three columns (ring | copy | stamp) with the copy
   left-aligned, mobile stacks the same three blocks with the copy centred.
   Note the stamp is BELOW the copy on mobile and large (280px) — not a small
   badge above it — and the ring stays visible rather than being dropped.

   Sizes/gaps scale as vw-fractions of each tier's own reference artboard
   (390 / 834 / 1920) so nothing is crushed at the narrow end of a range,
   each capped at the Figma px value so it never overshoots. Section padding
   holds a ~2.4:1 bottom:top ratio at all three tiers (43/102, 52/124,
   80/193) — the extra room before the footer is intentional. The eyebrow
   only breaks to two lines at md, where Figma authors it that way. */
export default function ClosingCTA() {
  return (
    <section id="closing" aria-label="Closing" className="relative overflow-hidden bg-ink pt-[43px] pb-[102px] md:pt-[52px] md:pb-[124px] lg:pt-[80px] lg:pb-[193px]">
      {/* Mobile keeps Figma's own 24px gutters; at md/lg the ring+copy+stamp
         row fills the content band edge-to-edge, so the Container gutter is
         cancelled there instead. */}
      <Container className="!px-6 md:!px-[min(5.42vw,45px)] lg:!px-0">
        <div className="grid items-center justify-items-center gap-[61px] md:grid-cols-[auto_1fr_auto] md:justify-items-stretch md:gap-[min(7.65vw,63.78px)] lg:gap-[min(5.1563vw,99px)]">
          {/* ring, mobile framing — the photo essentially uncropped (1.2247) */}
          <img
            src={RING_FULL}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            className="aspect-[278/227] w-[min(71.2821vw,278px)] object-cover md:hidden"
          />
          {/* ring, md/lg framing — Figma's exported near-square crop */}
          <img
            src={RING_SQUARE}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            className="hidden aspect-square justify-self-start object-cover md:block md:w-[min(21.58vw,180px)] lg:w-[min(14.4792vw,278px)]"
          />

          <div className="text-center md:text-left">
            <p className="fig-trim text-eyebrow-lg text-gold-light">
              We Look Forward<br className="hidden md:inline lg:hidden" /> to Meeting You
            </p>
            <h2 className="fig-trim mt-[18px] text-h2-closing text-cream-light">
              A Conversation Today
              <br />
              Creates a Legacy
              <br />
              For Generations
            </h2>
            {/* not .text-cta: that token is the button-label scale (14/12/16 at
               0.06em) and this link genuinely differs from the buttons on
               mobile — 16px at 0 tracking, per Figma. */}
            <a href="#book" className="group mt-10 inline-flex items-center gap-1 font-sans text-[16px] font-bold uppercase leading-[150%] tracking-[0em] text-[#B58A47] transition-colors hover:text-gold-light md:text-[12px] md:leading-[128.85%] lg:text-[16px] lg:leading-[150%]">
              Start a Conversation
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">&gt;</span>
            </a>
          </div>

          <img
            src={STAMP}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            className="aspect-square w-[min(71.7949vw,280px)] object-cover md:w-[min(21.58vw,180px)] md:justify-self-end lg:w-[min(14.4792vw,278px)]"
          />
        </div>
      </Container>
    </section>
  );
}
