import Image from "next/image";
import { CTAButton, Container } from "./ui";
import SectionHeader from "./SectionHeader";
import QualityStrip from "./QualityStrip";

/* eslint-disable @next/next/no-img-element */

const PHOTO = "/assets/figma-img/93008b2255e0cb4ff383e1f248edae1148054651.png";
const SKETCH = "/assets/figma-img/5f6008f58d9a12cc23a117e06c212f06004cb655.png";

const STEPS = [
  { n: 1, label: ["Consultation"], icon: "ic-people" },
  { n: 2, label: ["Concept &", "Sketch"], icon: "ic-proc-pencil" },
  { n: 3, label: ["Digital", "Design"], icon: "ic-proc-monitor" },
  { n: 4, label: ["Design", "Approval"], icon: "ic-proc-check" },
  { n: 5, label: ["Manufacturing"], icon: "ic-proc-pliers" },
  { n: 6, label: ["Stone", "Setting"], icon: "ic-proc-diamond" },
  { n: 7, label: ["Final", "Polish"], icon: "ic-proc-sparkles" },
  { n: 8, label: ["Collection"], icon: "ic-proc-ringbox" },
];

function Step({ s }: { s: (typeof STEPS)[number] }) {
  return (
    <li className="relative z-10 flex flex-col items-center text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-divider bg-cream-alt">
        <img src={`/assets/icons/${s.icon}.png`} alt="" aria-hidden loading="lazy" decoding="async" className="h-8 w-auto" />
      </span>
      <span className="mt-3 font-sans text-sm font-normal text-gold-dark">{s.n}</span>
      <span className="mt-1 font-sans text-sm font-medium uppercase leading-tight tracking-[0.07em] text-ink-text">
        {s.label.map((l, i) => <span key={i} className="block">{l}</span>)}
      </span>
    </li>
  );
}

// Column centres in a 4-equal-column row: 12.5%, 37.5%, 62.5%, 87.5%.
const COL_CENTERS = [12.5, 37.5, 62.5];
// Figma's 3 line segments stop well short of each circle — measured gaps
// ranged ~21.5-31px across the row (icon hug-widths vary slightly per step),
// averaging ~25px. Offset from a column centre to where the segment starts/
// ends = icon radius (32px) + that margin.
const SEGMENT_OFFSET = 32 + 25;

function StepRow({ steps, start }: { steps: typeof STEPS; start: number }) {
  return (
    <ol start={start} className="relative grid grid-cols-2 gap-y-9 md:grid-cols-4">
      {/* 3 separate segments, one per gap between adjacent icons, each inset
         from both circles by the icon's radius plus Figma's own ~25px
         margin — not one continuous line hidden behind the circles (that
         technique left zero gap between the line and each circle, unlike
         the real design). */}
      {COL_CENTERS.map((center) => (
        <span
          key={center}
          aria-hidden
          className="absolute hidden top-8 h-0.5 bg-[#c8b08a] md:block"
          style={{ left: `calc(${center}% + ${SEGMENT_OFFSET}px)`, width: `calc(25% - ${SEGMENT_OFFSET * 2}px)` }}
        />
      ))}
      {steps.map((s) => <Step key={s.n} s={s} />)}
    </ol>
  );
}

/* Process — cream band. Consultation photo left; header + faint ring blueprint
   top-right; eight numbered steps (4×2 desktop/tablet → 2×4 mobile) with gold
   circle icons and connector lines. Closes with the quality strip. */
export default function Process() {
  return (
    <section id="process" aria-label="Our Process" className="relative overflow-hidden border-b-4 border-[#c8b08a] bg-cream">
      {/* Everything below is positioned against THIS 1920px-capped, centred
         wrapper rather than the raw section (which spans the true, possibly
         much wider, viewport). Every vw-based position here is a
         min(Xvw, Ypx) that freezes at its px value once the viewport passes
         1920 — correct on its own, but without this wrapper each element
         would freeze relative to the true (wide) viewport's left edge,
         leaving the whole photo/header/steps group pinned to the left with
         a large empty gap on the right at ultra-wide widths instead of
         re-centring as a group, the way every max-w-1180 Container elsewhere
         on the page does.
         The section's own top/bottom padding used to live on <section> itself,
         but that pushed THIS wrapper (and so its absolutely-positioned
         children's coordinate origin) down by the padding amount too — double-
         counting it on top of the sketch/photo's own "top" offsets, which are
         already measured from the section's true top. Padding now lives on
         the inner content div below instead, so this wrapper — and the
         sketch/photo positioned against it — stays flush with the section's
         real top edge. */}
      <div className="relative mx-auto max-w-[1920px]">
      {/* Ring-sketch backdrop — Figma pins it at x=1340,y=4154 (62px below this
         section's own top) on the 1920 canvas, 440×585. This is a direct
         Figma "Crop" export of the node itself (not the raw source image),
         so the 65% opacity from Figma is already baked into the PNG —
         no CSS opacity here, or it'd be double-dimmed. It bleeds well past
         the Container's own right edge, so it's positioned against the
         section (full viewport width) rather than nested inside the
         Container/grid, using the same vw-fraction technique as the other
         bleeding photos. */}
      <img
        src={SKETCH}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute top-[62px] left-[min(69.7917vw,1340px)] hidden w-[min(22.9167vw,440px)] lg:block"
      />
      {/* Consultation photo (desktop) — Figma pins it at x=-1,y=4538 (446px
         below this section's own top), 781×664, i.e. bled flush against the
         viewport's left edge, not just the Container's. The in-grid <Image>
         below stays for mobile/tablet (where there's no equivalent Figma
         reference to bleed against) and is hidden at lg in favour of this. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-[446px] hidden aspect-[781/664] w-[min(40.6771vw,781px)] overflow-hidden rounded-2xl border border-divider lg:block"
        style={{ boxShadow: "0 22px 60px rgba(20,19,18,0.12)" }}
      >
        <Image
          src={PHOTO}
          alt="A couple with the jeweller during a consultation in the showroom"
          fill
          sizes="41vw"
          className="object-cover"
        />
      </div>
      <div className="pb-16 pt-16 md:pb-20 md:pt-20 lg:pb-[111px] lg:pt-[354px]">
      {/* max-w-none/px-0 at lg: this Container would otherwise impose its own
         ~402px centred inset, which the header's margin-left below would
         stack on top of (measuring from viewport 0, not from the header's
         normal in-flow position) — cancelling it here makes the margin
         genuinely viewport-relative, matching the ring-sketch/photo technique.
         Mobile/tablet keep the normal centred Container untouched. */}
      <Container className="relative lg:!max-w-none lg:!px-0">
        <div className="grid items-start gap-12 lg:block lg:gap-0">
          {/* consultation photo — mobile/tablet only; lg uses the
             viewport-edge-bled version above instead */}
          <div className="order-2 lg:hidden">
            <div
              className="relative aspect-[781/664] w-full overflow-hidden rounded-2xl"
              style={{ boxShadow: "0 22px 60px rgba(20,19,18,0.12)" }}
            >
              <Image
                src={PHOTO}
                alt="A couple with the jeweller during a consultation in the showroom"
                fill
                sizes="90vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* header + steps — Figma pins this column's own left edge at
             x=895 (the photo's real right edge, 781px, plus its gap to this
             column), independent of the photo's now-absolute positioning, so
             it's a direct vw-based margin rather than a shared grid fr-split
             (fr-ratios don't scale 1:1 with vw across breakpoints/max-width
             capping the way two independent vw values do). Width is capped
             at 676px (35.2083vw) — the "Our Process" steps instance's own
             width in Figma — since without an explicit cap this column now
             stretches to fill whatever space margin-left leaves, spreading
             the step icons out edge-to-edge on wide screens. */}
          <div className="relative order-1 lg:order-2 lg:!ml-[min(46.6146vw,895px)] lg:w-[min(35.2083vw,676px)]">
            <div className="relative">
              <SectionHeader
                eyebrow="Our Process"
                title={<>From Concept<br />to Creation</>}
                body={
                  <>
                    Every custom piece follows a carefully considered<br />
                    process, combining traditional craftsmanship<br />
                    with modern design technology to ensure<br />
                    exceptional quality from beginning to end.
                  </>
                }
              />
              <div className="mt-8">
                <CTAButton href="#book" variant="outlineGoldOnCream">Book a Consultation</CTAButton>
              </div>
            </div>

            {/* lg:ml: each row is 4 equal-width cells with its icon centred
               in each — meaning icon 1 sits inset by half a cell (minus its
               own half-width) from the row's left edge, not flush with it.
               Figma has icon 1 (and icon 5, row 2's first) landing at the
               same x as the CTA button above. Shifting the whole block left
               by (cellWidth/2 - iconWidth/2) = 12.5% of the row minus 32px
               (icon is 64px) puts icon 1 exactly there — algebraically
               calc(32px - 12.5%) — while leaving every icon's position
               relative to the others (and the connector line, which is
               positioned relative to each row's own box) untouched.
               lg:w matches the parent's own width cap explicitly — width:auto
               would otherwise absorb the negative margin as extra width
               (browsers expand an auto-width block to fill the remaining
               space after a negative margin), silently changing the cell
               width the whole calc above assumes. */}
            <div className="mt-14 space-y-10 lg:ml-[calc(32px-12.5%)] lg:w-[min(35.2083vw,676px)]">
              <StepRow steps={STEPS.slice(0, 4)} start={1} />
              <StepRow steps={STEPS.slice(4, 8)} start={5} />
            </div>
          </div>
        </div>
      </Container>

      {/* Figma positions this text at a fixed x=939, width=511 (48.906vw /
         26.615vw) — not centred in the section at all (its real centre sits
         ~234px right of true centre). QualityStrip centres its text WITHIN
         whatever box wraps it, so sizing/positioning this wrapper to match
         the text's own real Figma box reproduces that exactly, without
         needing a left-align variant on the shared component (Four Pillars'
         usage, centred in its own differently-sized box, is unaffected). */}
      <Container className="relative lg:!max-w-none lg:!px-0">
        <div className="lg:!ml-[min(48.9063vw,939px)] lg:w-[min(26.6146vw,511px)]">
          <QualityStrip className="mt-16 lg:mt-[184px]" />
        </div>
      </Container>
      </div>
      </div>
    </section>
  );
}
