import { Container } from "./ui";
import { Instagram, Facebook } from "../icons";

/* eslint-disable @next/next/no-img-element */

const EXPLORE = [
  { label: "About", href: "#why" },
  { label: "Services", href: "#whatwedo" },
  { label: "Process", href: "#process" },
  { label: "Creations", href: "#featured" },
  { label: "Contact", href: "#findus" },
];

function ColHeading({ children }: { children: string }) {
  return <h3 className="font-sans text-[15px] font-bold uppercase tracking-[0.08em] text-gold">{children}</h3>;
}

/* Footer — brand logo + three link/info columns (row on desktop, stacked on
   mobile), a social row, and the copyright bar. */
export default function Footer() {
  return (
    <footer className="bg-ink-2 text-cream-light">
      <Container className="py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1.4fr]">
          <div>
            <img src="/assets/logo-footer.svg" alt="Grech Jewellers" width={238} height={65} loading="lazy" decoding="async" className="h-11 w-auto" />
            <p className="mt-5 max-w-[22rem] font-sans text-[13px] leading-relaxed text-cream-light/70">
              Family-owned manufacturing jewellers in Adelaide, crafting personally designed pieces to last for generations.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="https://instagram.com" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-light/20 text-cream-light/80 transition-colors hover:border-gold hover:text-gold">
                <Instagram className="h-[18px] w-[18px]" />
              </a>
              <a href="https://facebook.com" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-light/20 text-cream-light/80 transition-colors hover:border-gold hover:text-gold">
                <Facebook className="h-[18px] w-[18px]" />
              </a>
            </div>
          </div>

          <nav aria-label="Footer">
            <ColHeading>Explore</ColHeading>
            <ul className="mt-4 space-y-2.5">
              {EXPLORE.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="font-sans text-[14px] text-cream-light/70 transition-colors hover:text-gold">{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <ColHeading>Contact</ColHeading>
            <ul className="mt-4 space-y-2.5 font-sans text-[14px] text-cream-light/70">
              <li><a href="tel:+61883567764" className="transition-colors hover:text-gold">(08) 8356 7764</a></li>
              <li><a href="mailto:jeweller@grechjewellers.com.au" className="break-all transition-colors hover:text-gold">jeweller@grechjewellers.com.au</a></li>
            </ul>
          </div>

          <div>
            <ColHeading>Location</ColHeading>
            <p className="mt-4 max-w-[20rem] font-sans text-[14px] leading-relaxed text-cream-light/70">
              Fulham Gardens Shopping Centre, Shop 90/457 Tapleys Hill Road, Fulham Gardens SA 5024
            </p>
          </div>
        </div>
      </Container>

      <div className="border-t border-cream-light/10">
        <Container className="flex flex-col gap-2 py-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="font-sans text-[13px] text-cream-light/70">© 2026 Grech Jewellers. All rights reserved.</p>
          <p className="font-sans text-[13px] text-cream-light/80">Family-owned. Personally made. Since 1978.</p>
        </Container>
      </div>
    </footer>
  );
}
