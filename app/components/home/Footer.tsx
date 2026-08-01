import { Container } from "./ui";
import { Instagram, Facebook, Monogram } from "../icons";

/* eslint-disable @next/next/no-img-element */

const EXPLORE = [
  { label: "About", href: "#why" },
  { label: "Services", href: "#whatwedo" },
  { label: "Process", href: "#process" },
  { label: "Creations", href: "#featured" },
  { label: "Contact", href: "#findus" },
];

function ColHeading({ children }: { children: string }) {
  return <h3 className="font-sans text-[16px] font-bold text-gold md:text-[12px] lg:text-[16px]">{children}</h3>;
}

/* Footer — logo + social (left) and a 3-column link block (right), matching
   Figma's own two-group space-between row: it doesn't fill the full 1180px
   container (hugs to 1059px, same "doesn't reach the standard right edge"
   quirk as Four Pillars' x=543), plus a near-full-bleed copyright bar with a
   centred GJ mark between the two closing lines. Figma's tablet artboard
   (834px reference) keeps this exact two-column layout — not a mobile-style
   stack — with most measurements scaling to ~76% of desktop, except social
   icons (83%), the 3-column link gap (72px→26px, tightened by hand, not
   proportionally), and the copyright bar's own text (67%); icon size, bar
   height and social-icon gap don't scale at all. So the side-by-side layout
   switches on at md (tablet), not lg — lg only re-scales the numbers up. */
export default function Footer() {
  return (
    <footer className="bg-ink text-cream-light">
      <Container className="py-14 md:!px-[32px] md:!pt-[49px] md:!pb-[33px] lg:!px-0 lg:!pt-[46px] lg:!pb-[66px]">
        <div className="flex flex-col items-center gap-10 text-center md:flex-row md:min-h-[173px] md:items-stretch md:justify-between md:gap-[43px] md:text-left lg:max-w-[1059px] lg:min-h-[224px] lg:gap-[57px]">
          {/* logo + social — Figma centres both children within the 353px
             column (counterAxisAlignItems: CENTER), not left-aligned; the
             logo (350w) barely shifts since it nearly fills the column, but
             the narrower social row (120w) visibly sits centred under it. */}
          <div className="flex flex-col items-center gap-10">
            <img src="/assets/logo-footer.svg" alt="Grech Jewellers" width={350} height={96} loading="lazy" decoding="async" className="h-16 w-auto md:h-[73px] lg:h-24" />
            <div className="flex gap-6">
              <a href="https://instagram.com" aria-label="Instagram" className="text-gold transition-colors hover:text-cream-light">
                <Instagram className="h-10 w-10 lg:h-12 lg:w-12" />
              </a>
              <a href="https://facebook.com" aria-label="Facebook" className="text-gold transition-colors hover:text-cream-light">
                <Facebook className="h-10 w-10 lg:h-12 lg:w-12" />
              </a>
            </div>
          </div>

          {/* 3-column link block — Figma bottom-aligns this whole block
             against the logo column (both stretch to the same row height,
             this one's content anchored to the bottom); self-end reproduces
             that without a magic-number height. The 3 sub-columns only go
             horizontal at md too — same moment as the outer row, matching
             Figma's tablet reference rather than switching early at sm. */}
          <div className="flex flex-col gap-10 md:flex-row md:gap-[26px] md:self-end lg:gap-[72px]">
            <nav aria-label="Footer">
              <ColHeading>Explore</ColHeading>
              {/* Figma trims each link to a tight cap-height box with a 14px
                 gap — .fig-trim alone only shaves ~2px off the browser's
                 natural line-height here, so an explicit tight leading gets
                 materially closer to Figma's rhythm. */}
              <ul className="mt-4 space-y-3.5 md:space-y-[10.5px] lg:space-y-3.5">
                {EXPLORE.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="fig-trim block leading-[14px] font-sans text-[14px] text-[#CFC6B8] transition-colors hover:text-gold md:text-[10.5px] lg:text-[14px]">{l.label}</a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <ColHeading>Contact</ColHeading>
              {/* Figma renders this as one text node, 30px line-height —
                 reproduced as 30px leading per line with no extra list gap,
                 instead of the Explore list's separate cap-trimmed rows. */}
              <ul className="mt-4 font-sans text-[14px] leading-[30px] text-[#CFC6B8] md:text-[10.5px] md:leading-[23px] lg:text-[14px] lg:leading-[30px]">
                <li><a href="tel:+61883567764" className="transition-colors hover:text-gold">(08) 8356 7764</a></li>
                <li><a href="mailto:jeweller@grechjewellers.com.au" className="break-all transition-colors hover:text-gold">jeweller@grechjewellers.com.au</a></li>
              </ul>
            </div>

            <div className="md:max-w-[164px] lg:max-w-[217px]">
              <ColHeading>Location</ColHeading>
              <p className="mt-4 font-sans text-[14px] leading-[30px] text-[#CFC6B8] md:text-[10.5px] md:leading-[23px] lg:text-[14px] lg:leading-[30px]">
                Fulham Gardens Shopping Centre
                <br />
                Shop 90/457 Tapleys Hill Road
                <br />
                Fulham Gardens SA 5024
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* Figma has no stroke between the main content and this bar — same
         solid #141312 both sides, flush with no divider. Bar is a fixed
         80px tall (BG rect 2's own height) at both tablet and desktop —
         doesn't scale down — content vertically centred within it rather
         than padding-driven. */}
      <div className="px-[22px] py-5 md:flex md:h-[80px] md:items-center md:py-0">
        <div className="mx-auto grid w-full max-w-[1875px] grid-cols-1 items-center gap-3 text-center sm:grid-cols-3 sm:text-left">
          <p className="font-sans text-[13px] font-bold text-[#9F968A] sm:text-[15px] md:text-[10px] lg:text-[15px]">© 2026 Grech Jewellers. All rights reserved.</p>
          <Monogram aria-hidden className="order-first h-[30px] w-auto text-[#b58a47] justify-self-center sm:order-none" />
          <p className="font-sans text-[13px] font-bold text-[#CFC6B8] sm:justify-self-end sm:text-[15px] md:text-[10px] lg:text-[15px]">Family-owned. Personally made. Since 1978.</p>
        </div>
      </div>
    </footer>
  );
}
