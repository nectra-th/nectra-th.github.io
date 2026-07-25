import Image from "next/image";
import { Container } from "./ui";
import { Facebook, Instagram } from "./icons";
import Reveal from "./Reveal";

const EXPLORE = [
  { label: "About", href: "#why" },
  { label: "Services", href: "#what-we-do" },
  { label: "Process", href: "#process" },
  { label: "Creations", href: "#creations" },
  { label: "Contact", href: "#find-us" },
];

export default function Footer() {
  return (
    <footer className="bg-ink pb-8 pt-14">
      <Container>
        <Reveal className="grid grid-cols-1 gap-10 border-t border-white/10 pt-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Logo + socials */}
          <div>
            <Image src="/assets/logo-footer.svg" alt="Grech Jewellers" width={350} height={96} className="h-20 w-auto" />
            <div className="mt-6 flex items-center gap-4">
              <a href="#" aria-label="Instagram" className="flex h-12 w-12 items-center justify-center text-white transition-opacity duration-200 ease-out hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" aria-label="Facebook" className="flex h-12 w-12 items-center justify-center text-white transition-opacity duration-200 ease-out hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink">
                <Facebook className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-[14px] font-bold uppercase tracking-wide text-gold">Explore</h4>
            <ul className="mt-4 space-y-2.5">
              {EXPLORE.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="link-underline inline-block text-[14px] text-cream-light/70 transition-colors duration-200 hover:text-gold">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[14px] font-bold uppercase tracking-wide text-gold">Contact</h4>
            <div className="mt-4 space-y-1 text-[14px] text-cream-light/70">
              <p><a href="tel:+61883567764" className="link-underline inline-block transition-colors duration-200 hover:text-gold">(08) 8356 7764</a></p>
              <p><a href="mailto:jeweller@grechjewllers.com.au" className="link-underline inline-block transition-colors duration-200 hover:text-gold">jeweller@grechjewllers.com.au</a></p>
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-[14px] font-bold uppercase tracking-wide text-gold">Location</h4>
            <p className="mt-4 text-[14px] leading-relaxed text-cream-light/70">
              Fulham Gardens Shopping Centre<br />
              Shop 90/457 Tapleys Hill Road<br />
              Fulham Gardens SA 5024
            </p>
          </div>
        </Reveal>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-white/10 pt-6 text-center md:flex-row md:justify-between">
          <p className="text-[13px] font-semibold text-cream-light/60">© 2026 Grech Jewellers. All rights reserved.</p>
          <span className="font-serif text-lg font-semibold text-gold">GJ</span>
          <p className="text-[13px] font-semibold text-cream-light/60">Family-owned. Personally made. Since 1978.</p>
        </div>
      </Container>
    </footer>
  );
}
