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
    <li className="group relative z-10 flex flex-col items-center text-center transition-[transform] duration-500 ease-[cubic-bezier(0.45,0,0.55,1)] hover:[transform:translateY(-2px)]">
      {/* Hover spec straight from Figma's "01 CONSULTATION, State=Hover":
         1px border darkens to gold-dark, "Elevation/Small" shadow
         (0 2px 8px rgba(0,0,0,.25)) appears behind it, and the whole step
         (icon + number + label) lifts -2px together — the same lift used
         everywhere else on the site. */}
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-divider bg-cream-alt transition-[border-color,box-shadow] duration-500 ease-[cubic-bezier(0.45,0,0.55,1)] group-hover:border-gold-dark group-hover:shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
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
      {/* Ring-sketch backdrop — tablet (834px reference) pins it at x=615,
         y=9, 272×362 (32.6139vw); desktop (1920px reference) at x=1340,
         y=62, 440×585 (22.9167vw). Different position/size per breakpoint,
         not just a scaled-down version of the same numbers. */}
      <img
        src={SKETCH}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute hidden md:block md:left-[min(73.741vw,615px)] md:top-[9px] md:w-[min(32.6139vw,272px)] lg:left-[min(69.7917vw,1340px)] lg:top-[62px] lg:w-[min(22.9167vw,440px)]"
      />
      {/* Consultation photo — bleeds flush against the viewport's left edge
         at both tablet and desktop (not just the Container's), each with its
         own Figma position: tablet x=0,y=71, 526×447 (63.0695vw); desktop
         x=-1,y=446, 781×664 (40.6771vw). The in-grid <Image> below stays for
         true mobile (no equivalent Figma reference to bleed against) and is
         hidden from md up in favour of this. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 hidden aspect-[781/664] overflow-hidden rounded-r-2xl border border-divider md:block md:top-[71px] md:w-[min(63.0695vw,526px)] lg:top-[446px] lg:w-[min(40.6771vw,781px)]"
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
      <div className="pb-16 pt-16 md:pb-[74px] md:pt-[330px] lg:pb-[104px] lg:pt-[354px]">
      {/* max-w-none/px-0 at lg: this Container would otherwise impose its own
         ~402px centred inset, which the header's margin-left below would
         stack on top of (measuring from viewport 0, not from the header's
         normal in-flow position) — cancelling it here makes the margin
         genuinely viewport-relative, matching the ring-sketch/photo technique.
         Mobile/tablet keep the normal centred Container untouched. */}
      {/* md:!max-w-none/!px-0 too, not just lg: — without it, Container's own
         ~24px side padding at this width stacks on top of the header/steps
         margins below (same double-counting bug as the lg-only case), same
         reason those margins are viewport-relative vw fractions. */}
      <Container className="relative md:!max-w-none md:!px-0 lg:!max-w-none lg:!px-0">
        <div className="grid items-start gap-12 md:block md:gap-0">
          {/* consultation photo — true mobile only; md and up use the
             viewport-edge-bled version above instead */}
          <div className="order-2 md:hidden">
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

          {/* header — Figma pins this column's own left edge at the photo's
             real right edge plus its gap to this column: tablet x=544
             (65.2278vw), desktop x=895 (46.6146vw), independent of the
             photo's now-absolute positioning, so it's a direct vw-based
             margin rather than a shared grid fr-split (fr-ratios don't scale
             1:1 with vw across breakpoints/max-width capping the way two
             independent vw values do). Width is likewise each breakpoint's
             own column width (240px tablet, 676px desktop) — without an
             explicit cap this column stretches to fill whatever space
             margin-left leaves, spreading things out on wide screens. */}
          <div className="relative order-1 md:order-2 md:!ml-[min(65.2278vw,544px)] md:!w-[min(28.777vw,240px)] lg:!ml-[min(46.6146vw,895px)] lg:!w-[min(35.2083vw,676px)]">
            <div className="relative">
              <SectionHeader
                eyebrow="Our Process"
                title={<>From Concept<br />to Creation</>}
                body={
                  <>
                    Every custom piece follows a carefully considered{" "}
                    <br className="hidden lg:block" />
                    process, combining traditional craftsmanship{" "}
                    <br className="hidden lg:block" />
                    with modern design technology to ensure{" "}
                    <br className="hidden lg:block" />
                    exceptional quality from beginning to end.
                  </>
                }
              />
              {/* Figma: body-bottom to CTA-top is 24px at desktop, 16px at
                 tablet — not the same flat 32px at both. */}
              <div className="mt-8 md:mt-4 lg:mt-6">
                <CTAButton href="#book" variant="outlineGoldOnCream">Book a Consultation</CTAButton>
              </div>
            </div>
          </div>

          {/* steps — a sibling of the header column, not nested inside it:
             Figma's tablet steps grid (660px, x=106 → 12.71vw/79.14vw) is far
             wider than the header column (240px) and isn't indented to match
             it at all, unlike desktop where the steps column shares the
             header's own width (676px, x=895 → 46.6146vw/35.2083vw) — the
             lg:ml-[calc(...)] trick below depends on staying that width at
             lg specifically, since that calc's "12.5%" resolves against THIS
             element's containing block. */}
          {/* Figma: CTA-bottom to steps-top is 71px at desktop, 69px at
             tablet — not the flat 56px (mt-14) this used before. */}
          <div className="mt-14 md:mt-[69px] md:!ml-[min(12.7098vw,106px)] md:!w-[min(79.1367vw,660px)] lg:mt-[71px] lg:!ml-[min(46.6146vw,895px)] lg:!w-[min(35.2083vw,676px)]">
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
            <div className="space-y-10 lg:ml-[calc(32px-12.5%)] lg:w-[min(35.2083vw,676px)]">
              <StepRow steps={STEPS.slice(0, 4)} start={1} />
              <StepRow steps={STEPS.slice(4, 8)} start={5} />
            </div>
          </div>
        </div>
      </Container>

      {/* Tablet has this text genuinely centred (103px margin both sides of
         a 834px artboard) — QualityStrip already centres itself within
         whatever wraps it, so no offset override needed there, just the
         Figma-measured gap above it. Desktop positions this text at a fixed
         x=939, width=511 (48.906vw/26.615vw) — not centred in the section at
         all (its real centre sits ~234px right of true centre); sizing/
         positioning this wrapper to match the text's own real Figma box
         reproduces that, without needing a left-align variant on the shared
         component (Four Pillars' usage, centred in its own differently-sized
         box, is unaffected). */}
      <Container className="relative lg:!max-w-none lg:!px-0">
        <div className="lg:!ml-[min(48.9063vw,939px)] lg:w-[min(26.6146vw,511px)]">
          <QualityStrip className="mt-16 md:mt-[75px] lg:mt-[184px]" />
        </div>
      </Container>
      </div>
      </div>
    </section>
  );
}
