import Image from "next/image";
import { Container } from "./ui";
import Reveal from "./Reveal";

export default function FooterCTA() {
  return (
    <section className="bg-ink pb-12 pt-14 md:pb-16 md:pt-16 lg:pb-24 lg:pt-28">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-3">
          {/* Ring */}
          <div className="relative mx-auto h-48 w-full max-w-[280px]">
            <Image src="/assets/footer-ring.jpg" alt="Solitaire diamond ring" fill className="object-contain" sizes="280px" />
          </div>

          {/* Copy */}
          <Reveal className="text-center md:text-left">
            <span className="eyebrow-lg text-[13px] text-gold">We Look Forward to Meeting You</span>
            <h2
              className="mt-3 font-serif text-[2rem] font-semibold leading-tight text-cream-light md:text-[2.4rem]"
              style={{ fontVariant: "small-caps" }}
            >
              A Conversation Today Creates a Legacy For Generations
            </h2>
            <a
              href="#booking"
              className="group mt-6 inline-flex items-center gap-1.5 text-[14px] font-bold uppercase tracking-[0.1em] text-gold transition-colors duration-200 hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-sm"
            >
              Start a Conversation
              <span className="transition-transform duration-200 ease-out group-hover:translate-x-1">&rsaquo;</span>
            </a>
          </Reveal>

          {/* Seal */}
          <div className="relative mx-auto h-52 w-52">
            <Image src="/assets/gj-seal.png" alt="Grech Jewellers — Established 1978, Adelaide" fill className="object-contain" sizes="208px" />
          </div>
        </div>
      </Container>
    </section>
  );
}
