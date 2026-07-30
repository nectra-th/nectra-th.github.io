import Image from "next/image";
import { Container } from "./ui";
import { Eyebrow, GoldRule } from "./SectionHeader";
import FindUsTabs from "./FindUsTabs";

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

/** Line icon recoloured to gold via CSS mask. */
function InfoIcon({ src }: { src: string }) {
  return (
    <span
      aria-hidden
      className="mt-0.5 h-[18px] w-[18px] shrink-0"
      style={{
        backgroundColor: "var(--color-gold-dark)",
        WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
        WebkitMaskSize: "contain", maskSize: "contain",
      }}
    />
  );
}

function Directions() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-gold-dark">Directions</p>
        <ol className="mt-4 flex flex-col gap-4">
          {STEPS.map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold-dark/50 text-[12px] font-semibold text-gold-dark">{i + 1}</span>
              <span className="font-sans text-[13px] leading-snug text-[#403b37]">{s}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-xl bg-cream-card p-5 text-center">
        <img src="/assets/icons/gj-monogram.svg" alt="" aria-hidden loading="lazy" decoding="async" className="mx-auto h-9 w-auto" />
        <p className="mt-3 font-sans text-[12px] font-bold uppercase tracking-[0.06em] text-gold-dark">First Time Visiting?</p>
        <p className="mt-1 font-sans text-[13px] leading-snug text-[#403b37]">Our shopping centre map makes finding us quick and easy.</p>
        <p className="mt-4 font-sans text-[12px] font-bold uppercase tracking-[0.06em] text-gold-dark">Need Help Finding Us?</p>
        <p className="mt-1 font-sans text-[13px] leading-snug text-[#403b37]">Give us a call and we&rsquo;ll happily guide you to our showroom.</p>
        <a href={PHONE_HREF} className="mt-3 inline-flex items-center gap-2 font-sans text-[15px] font-bold text-ink-text hover:text-gold-dark">
          <InfoIcon src="/assets/icons/info-phone.svg" />
          {PHONE_DISPLAY}
        </a>
      </div>
    </div>
  );
}

/* Find Us — a tabbed location card over a blurred storefront backdrop:
   store photo / shopping-centre map / live Google Maps, a directions panel, and
   a contact-info row. Everything reflows to a single column on small screens. */
export default function FindUs() {
  return (
    <section id="findus" className="relative overflow-hidden bg-ink py-16 md:py-20 lg:py-24">
      {/* blurred storefront backdrop */}
      <div aria-hidden className="absolute inset-0">
        <Image src="/assets/findus-blur-bg.jpg" alt="" fill sizes="100vw" className="object-cover opacity-25 blur-md" />
        <div className="absolute inset-0 bg-ink/70" />
      </div>

      <Container className="relative">
        <div className="text-center" data-reveal>
          <Eyebrow tone="gold-light" className="mx-auto">Plan Your Visit</Eyebrow>
          <h2 className="mt-3 font-serif text-[34px] font-bold text-cream-light md:text-[44px] lg:text-[56px]">Find Us</h2>
          <GoldRule width={64} center className="mt-5" />
        </div>

        <div className="mt-10 rounded-2xl bg-cream-light p-5 shadow-[0_28px_70px_rgba(20,19,18,0.35)] sm:p-7 lg:p-9" data-reveal>
          <FindUsTabs directions={<Directions />} />

          {/* contact info row */}
          <div className="mt-7 grid gap-6 border-t border-divider pt-6 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.1fr_0.9fr] lg:gap-8">
            <div className="flex gap-3">
              <InfoIcon src="/assets/icons/info-location.svg" />
              <div>
                <p className="font-sans text-[12px] font-bold uppercase tracking-[0.06em] text-gold-dark">Location</p>
                <p className="mt-1.5 font-sans text-[13px] leading-snug text-[#403b37]">Fulham Gardens Shopping Centre, Shop 90/457 Tapleys Hill Road, Fulham Gardens SA 5024</p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex gap-3">
                <InfoIcon src="/assets/icons/info-phone.svg" />
                <div>
                  <p className="font-sans text-[12px] font-bold uppercase tracking-[0.06em] text-gold-dark">Phone</p>
                  <a href={PHONE_HREF} className="mt-1.5 block font-sans text-[13px] text-[#403b37] hover:text-gold-dark">{PHONE_DISPLAY}</a>
                </div>
              </div>
              <div className="flex gap-3">
                <InfoIcon src="/assets/icons/info-email.svg" />
                <div>
                  <p className="font-sans text-[12px] font-bold uppercase tracking-[0.06em] text-gold-dark">Email</p>
                  <a href="mailto:jeweller@grechjewellers.com.au" className="mt-1.5 block break-all font-sans text-[13px] text-[#403b37] hover:text-gold-dark">jeweller@grechjewellers.com.au</a>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <InfoIcon src="/assets/icons/info-hours.svg" />
              <div>
                <p className="font-sans text-[12px] font-bold uppercase tracking-[0.06em] text-gold-dark">Hours</p>
                <dl className="mt-1.5 space-y-0.5 font-sans text-[13px] text-[#403b37]">
                  <div className="flex justify-between gap-3"><dt>Mon – Fri</dt><dd>9:00am – 5:00pm</dd></div>
                  <div className="flex justify-between gap-3"><dt>Saturday</dt><dd>9:00am – 1:00pm</dd></div>
                  <div className="flex justify-between gap-3"><dt>Sunday</dt><dd>Closed</dd></div>
                </dl>
              </div>
            </div>

            <div className="flex flex-col items-start justify-center gap-3 lg:items-end">
              <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.06em] text-gold-dark">Open in <span className="font-serif text-[15px] normal-case tracking-normal text-ink-text">Google Maps</span></span>
              <a href={MAPS_DIR} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-[2px] bg-gold px-6 py-3 text-[12px] font-bold uppercase tracking-[0.06em] text-ink transition-colors hover:bg-gold-dark">
                Launch Navigation
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
