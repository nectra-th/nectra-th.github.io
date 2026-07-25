import Image from "next/image";
import { Container } from "./ui";
import { Diamond } from "./icons";
import Reveal from "./Reveal";

const PILLARS = [
  {
    title: ["Family", "Craftsmanship"],
    desc: "Family owned since 1978, creating every piece with decades of hands-on experience.",
  },
  {
    title: ["Manufactured", "On Site"],
    desc: "Designed and manufactured in our Adelaide workshop. No middlemen. No markups.",
  },
  {
    title: ["Trusted", "Expertise"],
    desc: "Professional advice, repairs, valuations and remodelling from experienced jewellers.",
  },
  {
    title: ["Personal", "Service"],
    desc: "Work directly with the jeweller. Honest guidance with no pressure, just personal service.",
  },
];

export default function FourPillars() {
  return (
    <section className="relative overflow-hidden bg-cream pb-16 pt-4 lg:pt-0 lg:pb-[173px]">
      {/* Faint sketch backdrop on the left */}
      <div className="pointer-events-none absolute -left-16 top-0 hidden h-full w-[480px] opacity-[0.3] md:block">
        <Image src="/assets/why-sketch.jpg" alt="" fill className="object-contain object-left-top" />
      </div>

      <Container className="relative">
        <div className="lg:ml-[152px] lg:w-[990px]">
        <h2 className="text-center font-serif text-3xl font-semibold tracking-wide text-ink-text md:text-4xl lg:text-[36px] lg:[font-variant:small-caps]">
          Our Four Pillars of Trust
        </h2>
        <div className="mx-auto mt-4 h-[2px] w-14 bg-gold lg:w-[64px] lg:bg-gold-dark" />

        <Reveal delay={120}>
          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-[16px]">
            {PILLARS.map((p) => (
              <div key={p.title.join(" ")} className="group flex flex-col items-center text-center transition-transform duration-300 ease-out hover:-translate-y-1">
                <Diamond className="h-12 w-14 text-gold-dark transition-colors duration-300 group-hover:text-gold-light lg:h-[65px] lg:w-[80px]" />
                <h3 className="mt-6 font-serif text-2xl font-semibold leading-tight text-ink-text lg:mt-[31px] lg:[font-variant:small-caps]">
                  {p.title[0]}
                  <br />
                  {p.title[1]}
                </h3>
                <div className="mt-3 h-[2px] w-8 bg-gold/70 transition-all duration-300 group-hover:w-12 group-hover:bg-gold lg:bg-gold-dark lg:group-hover:bg-gold-dark" />
                <p className="mt-4 max-w-[15rem] text-[13.5px] leading-relaxed text-body lg:capitalize">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
        </div>

        {/* Divider tagline */}
        <div className="mt-16 border-t border-line/70 pt-8 lg:mt-[140px]">
          <p className="text-center font-serif text-lg tracking-[0.12em] text-body-2">
            <span className="text-ink-text">QUALITY. INTEGRITY. CRAFTSMANSHIP. </span>
            <span className="text-gold">SINCE 1978.</span>
          </p>
        </div>
      </Container>
    </section>
  );
}
