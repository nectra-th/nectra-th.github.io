import { Container } from "./ui";

/* eslint-disable @next/next/no-img-element */

// Figma's ring fill uses a non-uniform STRETCH transform on the source photo
// (not a plain crop) — reproducing that matrix in CSS distorted the round
// diamond into an oval. Exported directly from Figma instead (the real
// rendered crop, already square) and used at its own size below.
const RING = "/assets/figma-img/ring-closing-crop.png";
const STAMP = "/assets/figma-img/a15446604381559e8dde90720667fc5fa3dcb262.png";

/* Closing CTA — Figma's copy is LEFT-aligned (not centred) with 3 hard line
   breaks in the heading, flanked by a ring render and the GJ stamp (278×278).
   Both flanking images and the 99px gap scale as vw-fractions of the 1920
   reference so the text column isn't crushed at narrower "lg" widths; the
   stamp sits above the copy, centred, on smaller screens. */
export default function ClosingCTA() {
  return (
    <section id="closing" aria-label="Closing" className="relative overflow-hidden bg-ink pt-16 pb-16 md:pt-20 md:pb-20 lg:pt-[80px] lg:pb-[193px]">
      {/* Figma's own row (ring+gap+text+gap+stamp) fills the full 1180px
         content band with no internal padding — cancel Container's default
         lg:px-8 gutter here so the flanking images sit flush like the design. */}
      <Container className="lg:!px-0">
        <div className="grid items-center gap-8 lg:grid-cols-[auto_1fr_auto] lg:gap-[min(5.1563vw,99px)]">
          <img
            src={RING}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            className="hidden aspect-square justify-self-start object-cover lg:block lg:w-[min(14.4792vw,278px)]"
          />

          <div className="text-center lg:text-left">
            <img src={STAMP} alt="" aria-hidden loading="lazy" decoding="async" className="mx-auto mb-6 h-24 w-24 lg:hidden" />
            <p className="fig-trim text-eyebrow-lg text-gold-light">
              We Look Forward to Meeting You
            </p>
            <h2 className="fig-trim mx-auto mt-[18px] max-w-[18ch] text-h2-closing text-cream-light lg:mx-0 lg:max-w-none">
              A Conversation Today
              <br />
              Creates a Legacy
              <br />
              For Generations
            </h2>
            <a href="#book" className="group mt-10 inline-flex items-center gap-1 font-sans text-[16px] font-bold uppercase text-[#B58A47] transition-colors hover:text-gold-light">
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
            className="hidden aspect-square justify-self-end object-cover lg:block lg:w-[min(14.4792vw,278px)]"
          />
        </div>
      </Container>
    </section>
  );
}
