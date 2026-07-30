"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Container } from "./ui";
import SectionHeader from "./SectionHeader";
import BookingWidget from "./BookingWidget";

/* Book a Design Consultation — header + consultation photo, then the booking
   widget. The widget renders three columns on desktop and a single stacked
   column below `lg`; we default to stacked so it never overflows before
   hydration and on mobile. */
export default function Booking() {
  const [stacked, setStacked] = useState(true);
  useEffect(() => {
    // 3-column layout only once there's genuinely room for it (the checklist
    // labels don't wrap); below this the widget stacks to a single column.
    const mq = window.matchMedia("(min-width: 1180px)");
    const apply = () => setStacked(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <section id="book" className="relative overflow-hidden bg-cream-light py-16 md:py-20 lg:py-24">
      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div data-reveal>
            <SectionHeader
              eyebrow="Book A Design Consultation"
              title={<>Every Meaningful<br />Piece Begins With<br /><span className="text-gold">A Conversation</span></>}
              body="Meet directly with the jeweller to discuss your ideas, explore options and receive honest, obligation-free advice tailored to you."
            />
          </div>
          <div data-reveal style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
            <div
              className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl"
              style={{ boxShadow: "0 22px 60px rgba(20,19,18,0.16)" }}
            >
              <Image
                src="/assets/booking-consult.jpg"
                alt="A jeweller discussing a custom design with clients at the counter"
                fill
                sizes="(min-width: 1024px) 46vw, 90vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 lg:mt-16" data-reveal>
          <BookingWidget stacked={stacked} />
        </div>
      </Container>
    </section>
  );
}
