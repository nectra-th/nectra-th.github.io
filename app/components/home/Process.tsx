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
      <span className="flex h-[54px] w-[54px] items-center justify-center rounded-full border border-gold-dark/55 bg-cream lg:h-[60px] lg:w-[60px]">
        <img src={`/assets/icons/${s.icon}.png`} alt="" aria-hidden loading="lazy" decoding="async" className="h-6 w-auto lg:h-7" />
      </span>
      <span className="mt-3 font-sans text-[15px] font-semibold text-gold-dark">{s.n}</span>
      <span className="mt-1 font-sans text-[12px] font-medium uppercase leading-tight tracking-[0.08em] text-ink-text">
        {s.label.map((l, i) => <span key={i} className="block">{l}</span>)}
      </span>
    </li>
  );
}

function StepRow({ steps, start }: { steps: typeof STEPS; start: number }) {
  return (
    <ol start={start} className="relative grid grid-cols-2 gap-y-9 md:grid-cols-4">
      {/* connector line behind the circles (covered by their cream fill) */}
      <span aria-hidden className="absolute left-[12.5%] right-[12.5%] top-[27px] hidden h-px bg-gold-dark/30 md:block lg:top-[30px]" />
      {steps.map((s) => <Step key={s.n} s={s} />)}
    </ol>
  );
}

/* Process — cream band. Consultation photo left; header + faint ring blueprint
   top-right; eight numbered steps (4×2 desktop/tablet → 2×4 mobile) with gold
   circle icons and connector lines. Closes with the quality strip. */
export default function Process() {
  return (
    <section id="process" className="relative overflow-hidden bg-cream py-16 md:py-20 lg:py-24">
      <Container className="relative">
        <div className="grid items-start gap-12 lg:grid-cols-[0.95fr_1.25fr] lg:gap-16">
          {/* consultation photo */}
          <div data-reveal className="order-2 lg:order-1">
            <div
              className="relative aspect-[781/664] w-full overflow-hidden rounded-2xl lg:-ml-6 lg:w-[calc(100%+1.5rem)]"
              style={{ boxShadow: "0 22px 60px rgba(20,19,18,0.12)" }}
            >
              <Image
                src={PHOTO}
                alt="A couple with the jeweller during a consultation in the showroom"
                fill
                sizes="(min-width: 1024px) 46vw, 90vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* header + steps */}
          <div className="relative order-1 lg:order-2">
            <img
              src={SKETCH}
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
              className="pointer-events-none absolute -top-6 right-0 hidden w-[300px] opacity-30 lg:block"
            />
            <div data-reveal className="relative">
              <SectionHeader
                eyebrow="Our Process"
                title={<>From Concept<br />to Creation</>}
                body="Every custom piece follows a carefully considered process, combining traditional craftsmanship with modern design technology to ensure exceptional quality from beginning to end."
              />
              <div className="mt-8">
                <CTAButton href="#book">Book a Consultation</CTAButton>
              </div>
            </div>

            <div className="mt-14 space-y-10" data-reveal>
              <StepRow steps={STEPS.slice(0, 4)} start={1} />
              <StepRow steps={STEPS.slice(4, 8)} start={5} />
            </div>
          </div>
        </div>

        <QualityStrip className="mt-16 lg:mt-24" />
      </Container>
    </section>
  );
}
