import Image from "next/image";
import { Container } from "./ui";
import { GoldRule } from "./SectionHeader";

/* Logo heights per Figma artboard: mobile (390) draws them at the SAME sizes as
   desktop, tablet (834) scales them down — `md:` carries the tablet values and
   `lg:` restores the desktop ones, so every tier in this section flips at the
   same artboard boundaries the shared type scale uses (<768 / 768 / 1024).
   orogreco's Figma box is non-uniformly squashed (161×48 = 3.35 ratio desktop,
   144×43 tablet, vs the file's natural 5.02), which would visibly distort a
   real brand logo — so this keeps the file's true ratio and matches height only. */
const BRANDS = [
  { src: "/assets/brand-coeurdelion.webp", alt: "Cœur de Lion", w: 800, h: 143, cls: "h-8 md:h-[29px] lg:h-8" },
  { src: "/assets/brand-ellani.webp", alt: "Ellani Collection", w: 800, h: 356, cls: "h-12 md:h-10 lg:h-12" },
  { src: "/assets/brand-orogreco.webp", alt: "Oro Greco", w: 768, h: 153, cls: "h-12 md:h-[43px] lg:h-12" },
];

/* Selected Brands In Store — dark strip with three brand logos: a row on
   desktop/tablet, stacked on mobile.
   Spacing is Figma's, per artboard: padding 48/60 (mobile), 49/45 (tablet),
   67/78 (desktop); title→rule 18px (16 on desktop); rule→logos 65/24/48; logo
   gaps 48 (stacked) / 61 (tablet) / 88 (desktop). Those add up to the mobile
   artboard's own 471px, so the section no longer needs a hardcoded height
   clamp — a max-height there would clip the stack rather than fit it. */
export default function Brands() {
  return (
    <section id="brands" aria-label="Selected Brands In Store" className="bg-ink border-b-4 border-[#c8b08a] pb-[60px] pt-12 md:pb-[45px] md:pt-[49px] lg:pb-[78px] lg:pt-[67px]">
      <Container>
        <div className="text-center">
          {/* NOT .text-h2-caps: this heading is the one place the artboards
             genuinely disagree with that shared scale. Desktop draws it
             small-caps SemiBold 36px/+0.04em (what the token encodes), but
             mobile and tablet draw it Cormorant BOLD title-case with no
             tracking — 32px over two lines, and 24px on one. Reproduced
             as-drawn per the design decision to follow the artboards here;
             the mobile two-line block is also what makes this section reach
             its artboard's own 471px height. */}
          <h2 className="fig-trim font-serif text-[32px] font-bold leading-[36px] text-cream-light md:text-[24px] md:leading-[110%] lg:text-[36px] lg:font-semibold lg:leading-[115%] lg:tracking-[0.04em] lg:[font-variant:small-caps]">
            Selected<br className="md:hidden" /> Brands In Store
          </h2>
          <GoldRule width={124} center color="bg-[#c8b08a]" thickness="h-px" className="mt-[18px] lg:mt-4" />
        </div>
        <div className="mt-[65px] flex flex-col items-center justify-center gap-12 md:mt-6 md:flex-row md:gap-[61px] lg:mt-12 lg:gap-[88px]">
          {BRANDS.map((b) => (
            <Image
              key={b.src}
              src={b.src}
              alt={b.alt}
              width={b.w}
              height={b.h}
              sizes="200px"
              className={`w-auto opacity-[0.83] transition-opacity duration-500 hover:opacity-100 ${b.cls}`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
