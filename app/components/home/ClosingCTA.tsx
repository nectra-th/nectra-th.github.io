import { Container } from "./ui";

/* eslint-disable @next/next/no-img-element */

// Figma's ring fill uses a non-uniform STRETCH transform on the source photo
// (not a plain crop) — reproducing that matrix in CSS distorted the round
// diamond into an oval. Exported directly from Figma instead (the real
// rendered crop, already square) and used at its own size below.
const RING = "/assets/figma-img/ring-closing-crop.png";
const STAMP = "/assets/figma-img/a15446604381559e8dde90720667fc5fa3dcb262.png";

/* Closing CTA — Figma's copy is LEFT-aligned (not centred) with 3 hard line
   breaks in the heading. Tablet (834px ref) keeps the same 3-column
   ring+text+stamp layout as desktop — just smaller and truly centred
   (unlike desktop's off-centre block) — so the grid activates at `md:`, not
   `lg:`; only mobile (<768px) falls back to the stacked/stamp-above layout.
   Flanking images and the gap scale as vw-fractions of each tier's own
   reference width (834 at md, 1920 at lg) so the text column isn't crushed
   at the narrow end of either range; section padding keeps the same
   ~2.41:1 bottom:top ratio at both tiers (extra breathing room before the
   footer), and the eyebrow gets an explicit break at md to match Figma's
   authored "We Look Forward / to Meeting You" line split. */
export default function ClosingCTA() {
  return (
    <section id="closing" aria-label="Closing" className="relative overflow-hidden bg-ink pt-16 pb-16 md:pt-[52px] md:pb-[124px] lg:pt-[80px] lg:pb-[193px]">
      {/* Figma's own row (ring+gap+text+gap+stamp) fills the full content
         band with no internal padding at md/lg — cancel Container's default
         gutter there so the flanking images sit flush like the design. */}
      <Container className="md:!px-[min(5.42vw,45px)] lg:!px-0">
        <div className="grid items-center gap-8 md:grid-cols-[auto_1fr_auto] md:gap-[min(7.65vw,63.78px)] lg:grid-cols-[auto_1fr_auto] lg:gap-[min(5.1563vw,99px)]">
          <img
            src={RING}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            className="hidden aspect-square justify-self-start object-cover md:block md:w-[min(21.58vw,180px)] lg:w-[min(14.4792vw,278px)]"
          />

          <div className="text-center md:text-left">
            <img src={STAMP} alt="" aria-hidden loading="lazy" decoding="async" className="mx-auto mb-6 h-24 w-24 md:hidden" />
            <p className="fig-trim text-eyebrow-lg text-gold-light">
              We Look Forward<br className="hidden md:inline lg:hidden" /> to Meeting You
            </p>
            <h2 className="fig-trim mx-auto mt-[18px] max-w-[18ch] text-h2-closing text-cream-light md:mx-0 md:max-w-none">
              A Conversation Today
              <br />
              Creates a Legacy
              <br />
              For Generations
            </h2>
            <a href="#book" className="group mt-10 inline-flex items-center gap-1 font-sans text-cta tracking-[0em] text-[#B58A47] transition-colors hover:text-gold-light">
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
            className="hidden aspect-square justify-self-end object-cover md:block md:w-[min(21.58vw,180px)] lg:w-[min(14.4792vw,278px)]"
          />
        </div>
      </Container>
    </section>
  );
}
