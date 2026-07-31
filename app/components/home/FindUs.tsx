import Image from "next/image";
import { Container } from "./ui";
import { Eyebrow, GoldRule } from "./SectionHeader";
import FindUsTabs from "./FindUsTabs";
import LaunchNavigationButton from "./LaunchNavigationButton";

/* eslint-disable @next/next/no-img-element */

const PHONE_DISPLAY = "(08) 8356 7764";
const PHONE_HREF = "tel:+61883567764";
const MAPS_DIR = "https://www.google.com/maps/dir/?api=1&destination=Grech+Jewellers+457+Tapleys+Hill+Road+Fulham+Gardens+SA+5024";

const STEPS = [
  "Park near the northern entrance of the centre",
  "Enter through the main entrance",
  "Walk straight past Drakes Supermarket",
  "Grech Jewellers is located directly opposite",
];

/** Line icon recoloured to gold via CSS mask. Figma's icons here aren't
   square (e.g. email is 32×23, location is 22.7×32) — forcing them into a
   single square `size` under mask-size:contain was shrinking whichever axis
   didn't match, so width/height are specified separately per icon. */
function InfoIcon({ src, width, height }: { src: string; width: number; height: number }) {
  return (
    <span
      aria-hidden
      className="mt-0.5 shrink-0"
      style={{
        width, height,
        backgroundColor: "var(--color-gold-dark)",
        WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
        WebkitMaskSize: "contain", maskSize: "contain",
      }}
    />
  );
}

// Figma stacks these 4 elements (heading + 3 numbered steps) with one
// uniform 27px gap and a hairline divider between each — not a gap+divide-y
// approximation.
function Directions() {
  return (
    <div>
      <p className="text-center font-sans text-[14px] font-semibold text-gold-dark">Directions</p>
      <ol className="mt-5 flex flex-col gap-5">
        {STEPS.flatMap((s, i) => [
          i > 0 && <li key={`div-${i}`} aria-hidden className="h-px w-full bg-[#e1dfdc]" />,
          <li key={i} className="flex items-start gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold-light text-[16px] font-semibold text-gold-light">{i + 1}</span>
            <span className="font-sans text-[14px] leading-snug text-[#403b37]">{s}</span>
          </li>,
        ].filter(Boolean))}
      </ol>
    </div>
  );
}

function FirstTimeCard() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-lg border border-[#c8b08a] bg-cream-light px-4 py-5 text-center">
      {/* cropped directly from the Figma export at its exact 37×48 box —
         already the correct gold-dark colour and shape, no recolouring
         needed (the gj-monogram.svg asset didn't match Figma's icon here). */}
      <img src="/assets/icons/gj-monogram-crop.png" alt="" aria-hidden loading="lazy" decoding="async" className="h-10 w-auto shrink-0" />
      <p className="mt-3 text-label text-gold-dark">First Time Visiting?</p>
      <p className="mt-2 font-sans text-[14px] leading-snug text-[#403b37]">Our shopping centre map makes finding us quick and easy.</p>
      <p className="mt-6 text-label text-gold-dark">Need Help Finding Us?</p>
      <p className="mt-2 font-sans text-[14px] leading-snug text-[#403b37]">Give us a call and we&rsquo;ll happily guide you to our showroom.</p>
      <a href={PHONE_HREF} className="mt-3 inline-flex items-center gap-2 font-sans text-[20px] font-bold text-ink-text hover:text-gold-dark">
        <InfoIcon src="/assets/icons/info-phone.svg" width={46} height={48} />
        {PHONE_DISPLAY}
      </a>
    </div>
  );
}

/* Find Us — a tabbed location card over a blurred storefront backdrop:
   store photo / shopping-centre map / live Google Maps, a directions panel, and
   a contact-info row. Everything reflows to a single column on small screens. */
// pt/pb re-measured directly from the Figma export's actual pixels (not the
// raw backdrop rectangle, which bleeds ~52px above the section's true
// visible top and isn't clipped by any frame in the Figma data). True top =
// y8904 (sharp cream→dark transition). The bottom is y10120 (Closing CTA's
// own background starts there) — an earlier pass mis-measured this as
// y10583 by sampling into a patch of the SAME blurred photo bleeding further
// down, not a real section boundary. 1216px total, matching the original
// skeleton estimate.
export default function FindUs() {
  return (
    <section id="findus" aria-label="Find Us" className="relative overflow-hidden bg-ink pb-16 pt-16 md:pb-20 md:pt-20 lg:pb-[177px] lg:pt-[189px]">
      {/* blurred storefront backdrop — Figma composites this as a single
         rectangle: solid black fill, then the photo drawn over it at 39%
         opacity (blend normal), then the whole thing blurred. The section's
         own bg-ink already stands in for that solid black base, so the
         image just needs its own 39% opacity — no separate darkening
         overlay on top (an extra bg-ink/70 layer here was compounding with
         the image's own opacity down to ~7.5% net visibility, far darker
         than Figma's actual 39%). */}
      <div aria-hidden className="absolute inset-0">
        <Image src="/assets/findus-blur-bg.jpg" alt="" fill sizes="100vw" className="object-cover opacity-[0.39] blur-md" />
      </div>

      <Container className="relative">
        <div className="text-center">
          {/* measured #b58a47 exactly — closer to --color-gold (#b88c46) than
             either existing Eyebrow tone (gold-dark #9c7430 / gold-light
             #c0985a), so overriding the color precisely here rather than
             reusing a token that's off by more than this. */}
          <Eyebrow tone="gold-light" className="mx-auto !text-[#b58a47]">Plan Your Visit</Eyebrow>
          {/* leading-none: Figma sets this heading's own line-height to
             exactly 100% (56px at a 56px font) — the browser's default
             ~150% line-height was adding 28px of invisible space below the
             glyphs, which is what pushed the rule 49px lower than Figma
             specifies. Fixing the real cause instead of nudging the rule.
             mt-[13px]: requested explicitly (was 24px) — the 11px removed
             here is added onto the rule's own margin below so the rule
             itself doesn't move from its verified Figma-matching position. */}
          <h2 className="mt-[13px] font-serif text-[34px] font-bold leading-none text-cream-light md:text-[44px] lg:text-[56px]">Find Us</h2>
          {/* +11px vs the previous 28/7: compensates the h2's margin-top
             drop (24px -> 13px) so the rule stays exactly where it was
             (verified against Figma: 291px from the section's true top). */}
          <GoldRule width={114} center className="mt-[39px] lg:mt-[18px]" />
        </div>

        {/* mt-20: Figma's real gap from the title rule to the card (80px) —
           not the 40px this used before. Padding lives inside FindUsTabs now
           (tabs span edge-to-edge, content below is inset 16px) instead of
           one uniform padding wrapping everything.
           -mx-*: Container's own side padding (px-5/6/8) was shrinking this
           card to 1116px — cancelling it out so the card bleeds to
           Container's true edge and matches Figma's 1180px width exactly. */}
        <div className="-mx-5 mt-10 overflow-hidden rounded-[18px] border border-divider bg-cream-light sm:-mx-6 lg:-mx-8 lg:mt-20">
          <FindUsTabs directions={<Directions />} firstTime={<FirstTimeCard />} />

          {/* contact info row — its own bordered/tinted box (bg-cream-card +
             divider border), not plain text on the panel background. Same
             16px side inset as the content above, 20px gap above it. */}
          <div className="mx-4 mb-4 mt-5 border border-divider bg-cream-card px-6 py-8 sm:mx-6 sm:mb-6 lg:mx-4 lg:mb-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            <div className="flex gap-3">
              <InfoIcon src="/assets/icons/info-location.svg" width={23} height={32} />
              <div>
                <p className="font-sans text-[16px] font-bold uppercase text-gold-dark">Location</p>
                <p className="mt-1.5 font-sans text-[14px] leading-snug text-[#403b37]">Fulham Gardens Shopping Centre, Shop 90/457 Tapleys Hill Road, Fulham Gardens SA 5024</p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex gap-3">
                <InfoIcon src="/assets/icons/info-phone.svg" width={30} height={32} />
                <div>
                  <p className="font-sans text-[16px] font-bold uppercase text-gold-dark">Phone</p>
                  <a href={PHONE_HREF} className="mt-1.5 block font-sans text-[14px] text-[#403b37] hover:text-gold-dark">{PHONE_DISPLAY}</a>
                </div>
              </div>
              <div className="flex gap-3">
                <InfoIcon src="/assets/icons/info-email.svg" width={32} height={23} />
                <div>
                  <p className="font-sans text-[16px] font-bold uppercase text-gold-dark">Email</p>
                  <a href="mailto:jeweller@grechjewellers.com.au" className="mt-1.5 block font-sans text-[14px] text-[#403b37] hover:text-gold-dark lg:whitespace-nowrap">jeweller@grechjewellers.com.au</a>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <InfoIcon src="/assets/icons/info-hours.svg" width={32} height={32} />
              <div>
                <p className="font-sans text-[16px] font-bold uppercase text-gold-dark">Hours</p>
                <dl className="mt-1.5 space-y-0.5 font-sans text-[14px] text-[#403b37]">
                  <div className="flex justify-between gap-3"><dt>Mon – Fri</dt><dd>9:00am – 5:00pm</dd></div>
                  <div className="flex justify-between gap-3"><dt>Saturday</dt><dd>9:00am – 1:00pm</dd></div>
                  <div className="flex justify-between gap-3"><dt>Sunday</dt><dd>Closed</dd></div>
                </dl>
              </div>
            </div>

            {/* Figma (Frame254/Frame255): a right-aligned VERTICAL stack —
               "OPEN IN" label, "Google Maps" serif line, a 48×2px gold-dark
               rule — sitting above the button with a uniform 10px gap
               throughout, not one inline line of mixed-size text. */}
            <div className="flex flex-col items-start justify-center gap-[10px] lg:items-end">
              {/* leading-[10px]/[15px]: Figma's cap-trimmed text boxes for
                 these two lines are 10px and 15px tall — the browser's
                 default line-height (~21px/~36px) was inflating this whole
                 column well past Figma's real 101px, which is what was
                 pushing the section's total height past 1216px. */}
              <div className="flex flex-col items-start gap-[10px] lg:items-end">
                <span className="font-sans text-[14px] font-semibold uppercase leading-[10px] tracking-[0.09em] text-gold-dark">Open In</span>
                <span className="font-serif text-[24px] font-semibold leading-[15px] tracking-[0.09em] text-[#403b37]">Google Maps</span>
                <span aria-hidden className="h-0.5 w-12 bg-gold-dark" />
              </div>
              {/* desktop opens a new tab; mobile navigates same-tab so the OS
                 can intercept it as a universal/app link straight into the
                 native Google Maps app — see LaunchNavigationButton. */}
              <LaunchNavigationButton href={MAPS_DIR} className="inline-flex items-center justify-center rounded-lg bg-gold px-[34px] py-[18px] text-[14px] leading-[10px] font-semibold uppercase tracking-[0.09em] text-cream-light transition-colors hover:bg-gold-dark">
                Launch Navigation
              </LaunchNavigationButton>
            </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
