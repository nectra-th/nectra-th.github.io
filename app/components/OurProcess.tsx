import Image from "next/image";
import { Button, Container, Eyebrow } from "./ui";
import { ProcessIcon } from "./icons";
import Reveal from "./Reveal";

const STEPS = [
  ["1", "CONSULTATION"],
  ["2", "CONCEPT\n& SKETCH"],
  ["3", "DIGITAL\nDESIGN"],
  ["4", "DESIGN\nAPPROVAL"],
  ["5", "MANUFACTURING"],
  ["6", "STONE\nSETTING"],
  ["7", "FINAL\nPOLISH"],
  ["8", "COLLECTION"],
];

function Step({ n, label }: { n: string; label: string }) {
  return (
    <div className="group flex flex-1 flex-col items-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-cream-light transition-[border-color,box-shadow,transform] duration-300 ease-out group-hover:-translate-y-1 group-hover:border-gold group-hover:shadow-md group-hover:shadow-gold/20">
        <ProcessIcon className="h-8 w-8 text-gold-dark transition-colors duration-300 group-hover:text-gold" />
      </div>
      <span className="mt-3 text-[13px] font-normal text-gold">{n}</span>
      <span className="mt-1 whitespace-pre-line text-[12px] font-medium leading-tight tracking-[0.06em] text-ink-text">
        {label}
      </span>
    </div>
  );
}

export default function OurProcess() {
  return (
    <section id="process" className="relative overflow-hidden bg-cream py-20 md:py-16 lg:pt-[354px] lg:pb-[47px]">
      {/* Faint ring sketch top-right */}
      <div className="pointer-events-none absolute right-6 top-16 hidden h-[560px] w-[420px] opacity-[0.16] lg:block">
        <Image src="/assets/process-sketch.png" alt="" fill className="object-contain" />
      </div>

      <Container className="relative">
        {/* Intro */}
        <Reveal className="max-w-xl lg:ml-[460px] lg:max-w-[560px]">
          <Eyebrow>Our Process</Eyebrow>
          <h2 className="mt-4 font-serif text-[1.95rem] font-semibold leading-[1.08] text-ink-text md:text-[2.4rem] lg:text-[56px] lg:leading-[1.0]">
            From Concept
            <br />
            to Creation
          </h2>
          <p className="mt-7 max-w-md text-[15px] leading-relaxed text-body md:text-base">
            Every custom piece follows a carefully considered process, combining
            traditional craftsmanship with modern design technology to ensure
            exceptional quality from beginning to end.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button href="#booking" variant="gold">Book a Consultation</Button>
            <Button href="#creations" variant="outlineDark">See Our Work</Button>
          </div>
        </Reveal>

        {/* Photo + steps */}
        <Reveal delay={120} className="mt-20 md:mt-12 lg:mt-24 grid grid-cols-1 items-center gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div className="group relative aspect-[5/4] lg:aspect-[7/6] w-full overflow-hidden rounded-lg shadow-xl">
            <Image
              src="/assets/process-couple.jpg"
              alt="A couple consulting with the jeweller"
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="(max-width: 1024px) 90vw, 460px"
            />
          </div>

          <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4">
            {STEPS.map(([n, label]) => (
              <Step key={n} n={n} label={label} />
            ))}
          </div>
        </Reveal>

        {/* Divider tagline */}
        <div className="mt-20 border-t border-line/70 pt-8">
          <p className="text-center font-serif text-lg tracking-[0.12em] text-body-2">
            <span className="text-ink-text">QUALITY. INTEGRITY. CRAFTSMANSHIP. </span>
            <span className="text-gold">SINCE 1978.</span>
          </p>
        </div>
      </Container>
    </section>
  );
}
