"use client";

import Image from "next/image";
import { useState } from "react";
import { Container, Eyebrow } from "./ui";
import { Clock, MapIcon, MapPin, Mail, Phone, Store } from "./icons";
import Reveal from "./Reveal";

const MAPS_DIR =
  "https://www.google.com/maps/dir/?api=1&destination=Grech+Jewellers+Fulham+Gardens+Shopping+Centre+Tapleys+Hill+Road+SA+5024";
const MAPS_EMBED =
  "https://www.google.com/maps?q=Fulham+Gardens+Shopping+Centre+457+Tapleys+Hill+Road+SA+5024&output=embed";

const DIRECTIONS = [
  "Park near the northern entrance of the centre",
  "Enter through the main entrance",
  "Walk straight past Drakes Supermarket",
  "Grech Jewellers is located directly opposite",
];

const TABS = [
  { id: "store", label: "OUR STORE", Icon: Store },
  { id: "centre", label: "SHOPPING CENTRE MAP", Icon: MapIcon },
  { id: "google", label: "GOOGLE MAPS", Icon: MapPin },
] as const;

export default function FindUs() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("store");

  return (
    <section id="find-us" className="relative overflow-hidden bg-ink py-20 md:py-16 lg:pt-[189px] lg:pb-[280px]">
      {/* Blurred store backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <Image src="/assets/findus-blur-bg.jpg" alt="" fill className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-ink/70" />
      </div>

      <Container className="relative">
        <Reveal className="text-center">
          <Eyebrow>Plan Your Visit</Eyebrow>
          <h2 className="mt-3 font-serif text-[1.95rem] font-bold text-cream-light md:text-[3.4rem]">Find Us</h2>
          <div className="mx-auto mt-4 h-[2px] w-14 bg-gold lg:w-[114px] lg:bg-gold-dark" />
        </Reveal>

        <Reveal delay={100} className="mt-16 overflow-hidden rounded-2xl bg-cream-light shadow-2xl">
          {/* Tabs */}
          <div className="flex flex-col border-b border-line/60 sm:flex-row">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`relative flex flex-1 items-center justify-center gap-2 px-4 py-5 text-[13px] font-medium tracking-wide transition-colors duration-200 ease-out after:absolute after:inset-x-4 after:bottom-0 after:h-[2px] after:origin-center after:bg-gold after:transition-transform after:duration-300 after:ease-out focus-visible:outline-none focus-visible:text-gold ${
                  tab === id
                    ? "text-gold after:scale-x-100"
                    : "text-body hover:text-ink-text after:scale-x-0 hover:after:scale-x-100 hover:after:bg-gold/40"
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-6 md:p-10">
            {tab === "store" && (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_0.9fr_0.9fr]">
                <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-md">
                  <Image src="/assets/findus-store.jpg" alt="Grech Jewellers storefront" fill className="object-cover transition-transform duration-500 ease-out group-hover:scale-105" sizes="(max-width:1024px) 90vw, 420px" />
                </div>

                <div>
                  <h3 className="text-[14px] font-semibold uppercase tracking-wide text-gold">Directions</h3>
                  <ol className="mt-4 space-y-4">
                    {DIRECTIONS.map((d, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold text-[13px] font-semibold text-gold">
                          {i + 1}
                        </span>
                        <span className="text-[14px] leading-snug text-body">{d}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="rounded-lg border border-gold/40 bg-cream p-6 text-center transition-shadow duration-300 hover:shadow-lg hover:shadow-black/5">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-gold text-lg font-bold text-gold font-serif">
                    GJ
                  </div>
                  <h4 className="mt-4 text-[13px] font-semibold uppercase tracking-wide text-ink-text">First time visiting?</h4>
                  <p className="mt-2 text-[13px] leading-relaxed text-body">
                    Our shopping centre map makes finding us quick and easy.
                  </p>
                  <h4 className="mt-5 text-[13px] font-semibold uppercase tracking-wide text-ink-text">Need help finding us?</h4>
                  <p className="mt-2 text-[13px] leading-relaxed text-body">
                    Give us a call and we&rsquo;ll happily guide you to our showroom.
                  </p>
                  <a href="tel:+61883567764" className="mt-4 flex items-center justify-center gap-2 text-[16px] font-bold text-ink-text transition-colors duration-200 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream rounded-sm">
                    <Phone className="h-5 w-5 text-gold" /> (08) 8356 7764
                  </a>
                </div>
              </div>
            )}

            {tab === "centre" && (
              <div className="flex flex-col items-center gap-6 py-6">
                <div className="grid w-full max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="flex aspect-[4/3] items-center justify-center rounded-lg border border-dashed border-line bg-cream text-center">
                    <div className="px-6">
                      <MapIcon className="mx-auto h-10 w-10 text-gold" />
                      <p className="mt-3 text-[14px] text-body">
                        Fulham Gardens Shopping Centre — enter via the northern
                        entrance, walk past Drakes Supermarket; we&rsquo;re directly
                        opposite.
                      </p>
                    </div>
                  </div>
                  <ol className="space-y-4 self-center">
                    {DIRECTIONS.map((d, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold text-[13px] font-semibold text-gold">{i + 1}</span>
                        <span className="text-[14px] leading-snug text-body">{d}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {tab === "google" && (
              <div className="overflow-hidden rounded-lg">
                <iframe
                  title="Grech Jewellers on Google Maps"
                  src={MAPS_EMBED}
                  className="h-[360px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>

          {/* Info bar */}
          <div className="grid grid-cols-1 gap-6 border-t border-line/60 bg-cream px-6 py-8 sm:grid-cols-2 md:grid-cols-4 md:px-8">
            <InfoBlock icon={<MapPin className="h-5 w-5 text-gold" />} title="Location">
              Fulham Gardens Shopping Centre<br />Shop 90/457 Tapleys Hill Road<br />Fulham Gardens SA 5024
            </InfoBlock>
            <div className="space-y-4">
              <InfoBlock icon={<Phone className="h-5 w-5 text-gold" />} title="Phone">(08) 8356 7764</InfoBlock>
              <InfoBlock icon={<Mail className="h-5 w-5 text-gold" />} title="Email">jeweller@grechjewllers.com.au</InfoBlock>
            </div>
            <InfoBlock icon={<Clock className="h-5 w-5 text-gold" />} title="Hours">
              <span className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5">
                <span>Mon &ndash; Fri</span><span>9:00am &ndash; 5:00pm</span>
                <span>Saturday</span><span>9:00am &ndash; 1:00pm</span>
                <span>Sunday</span><span>Closed</span>
              </span>
            </InfoBlock>
            <div className="flex flex-col items-start justify-center md:items-end">
              <span className="text-[12px] font-semibold uppercase tracking-wide text-body">Open in</span>
              <span className="font-serif text-2xl font-semibold text-ink-text">Google Maps</span>
              <a
                href={MAPS_DIR}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 rounded-[2px] bg-gold px-5 py-3 text-[12px] font-bold tracking-[0.08em] text-ink transition-[background-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:bg-gold-dark hover:shadow-lg hover:shadow-gold/25 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
              >
                LAUNCH NAVIGATION
              </a>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function InfoBlock({
  icon, title, children,
}: {
  icon: React.ReactNode; title: string; children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5">{icon}</span>
      <div>
        <h4 className="text-[13px] font-bold uppercase tracking-wide text-gold">{title}</h4>
        <div className="mt-1 text-[13.5px] leading-relaxed text-body">{children}</div>
      </div>
    </div>
  );
}
