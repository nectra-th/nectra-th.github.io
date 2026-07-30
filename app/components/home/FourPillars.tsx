import { Container } from "./ui";
import { GoldRule } from "./SectionHeader";
import QualityStrip from "./QualityStrip";

/* eslint-disable @next/next/no-img-element */

const PILLARS = [
  { icon: "ic-diamond", title: ["Family", "Craftsmanship"], desc: "Family owned since 1978, creating every piece with decades of hands-on experience." },
  { icon: "ic-anvil", title: ["Manufactured", "On Site"], desc: "Designed and manufactured in our Adelaide workshop. No middlemen. No markups." },
  { icon: "ic-magnifier", title: ["Trusted", "Expertise"], desc: "Professional advice, repairs, valuations and remodelling from experienced jewellers." },
  { icon: "ic-hand", title: ["Personal", "Service"], desc: "Work directly with the jeweller. Honest guidance with no pressure, just personal service." },
];

/* Four Pillars of Trust — 4 across (desktop) → 2×2 (tablet) → 1 column (mobile).
   Each pillar is a centred icon + two-line small-caps title + gold rule + body,
   and lifts on hover. */
export default function FourPillars() {
  return (
    <section className="bg-cream pb-16 pt-4 md:pb-20 lg:pb-24">
      <Container>
        <div className="text-center" data-reveal>
          <h2 className="font-serif text-[28px] font-semibold tracking-[0.03em] text-ink-text [font-variant:small-caps] md:text-[32px] lg:text-[36px]">
            Our Four Pillars of Trust
          </h2>
          <GoldRule width={64} center className="mt-5" />
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-6" data-reveal>
          {PILLARS.map((p) => (
            <li
              key={p.title.join(" ")}
              className="group flex flex-col items-center text-center transition-transform duration-500 ease-[cubic-bezier(0.45,0,0.55,1)] will-change-transform hover:-translate-y-1"
            >
              <img src={`/assets/icons/${p.icon}.png`} alt="" aria-hidden loading="lazy" decoding="async" width={64} height={64} className="h-14 w-auto lg:h-[64px]" />
              <h3 className="mt-6 font-serif text-[22px] font-semibold leading-[1.15] text-ink-text [font-variant:small-caps] lg:mt-8 lg:text-[24px]">
                {p.title[0]}
                <br />
                {p.title[1]}
              </h3>
              <span aria-hidden className="mt-3 h-0.5 w-8 bg-gold-dark/70 transition-all duration-500 group-hover:w-11 group-hover:bg-gold-dark" />
              <p className="mt-4 max-w-[15rem] font-sans text-[13.5px] leading-relaxed text-[#403b37] lg:text-sm">
                {p.desc}
              </p>
            </li>
          ))}
        </ul>

        <QualityStrip className="mt-16 lg:mt-24" />
      </Container>
    </section>
  );
}
