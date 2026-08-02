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
   switches on at md (tablet), not lg — lg only re-scales the numbers up.
   Mobile (390px artboard) is the odd one out: it stacks into one centred
   column, but its type/logo/icons are the DESKTOP sizes, not shrunk — the
   logo is a full-bleed 350×96 (exactly the 390 frame minus its 20px
   gutters), social icons are 48px, and body copy stays 14px/30. Only the
   copyright bar shrinks (12px) while its monogram grows to 48px, and there
   the two lines swap order: tagline above ©.
   The mobile paddings/gaps below sum to Figma's own band heights (main
   929 + copyright 179 = 1108) without pinning a height, so a narrower phone
   that wraps an extra line grows instead of being clipped. */
export default function Footer() {
  return (
    <footer className="bg-ink text-cream-light">
      <Container className="pt-[114px] pb-[63px] md:!px-[32px] md:!pt-[49px] md:!pb-[33px] lg:!px-0 lg:!pt-[46px] lg:!pb-[66px]">
        <div className="flex flex-col items-center gap-[122px] text-center md:flex-row md:min-h-[173px] md:items-stretch md:justify-between md:gap-[43px] md:text-left lg:max-w-[1059px] lg:min-h-[224px] lg:gap-[57px]">
          {/* logo + social — Figma centres both children within the 353px
             column (counterAxisAlignItems: CENTER), not left-aligned; the
             logo (350w) barely shifts since it nearly fills the column, but
             the narrower social row (120w) visibly sits centred under it.
             On mobile the logo is width-driven (fills the 350px gutter box
             at its natural 350×96) rather than height-driven, so narrower
             phones scale it down instead of overflowing. */}
          {/* w-full at base: the outer column is items-center, so this
             wrapper would otherwise shrink to its widest child (the 120px
             social row) and the logo's w-full would resolve against that. */}
          <div className="flex w-full flex-col items-center gap-10 md:w-auto">
            <img src="/assets/logo-footer.svg" alt="Grech Jewellers" width={350} height={96} loading="lazy" decoding="async" className="h-auto w-full max-w-[350px] md:h-[73px] md:w-auto md:max-w-none lg:h-24" />
            <div className="flex gap-6">
              <a href="https://www.instagram.com/grechjewellers/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Instagram (opens in a new tab)" className="text-gold transition-colors hover:text-cream-light">
                <Instagram className="h-12 w-12 md:h-10 md:w-10 lg:h-12 lg:w-12" />
              </a>
              <a href="https://www.facebook.com/grechjewellery" target="_blank" rel="noopener noreferrer" aria-label="Facebook (opens in a new tab)" className="text-gold transition-colors hover:text-cream-light">
                <Facebook className="h-12 w-12 md:h-10 md:w-10 lg:h-12 lg:w-12" />
              </a>
            </div>
          </div>

          {/* 3-column link block — Figma bottom-aligns this whole block
             against the logo column (both stretch to the same row height,
             this one's content anchored to the bottom); self-end reproduces
             that without a magic-number height. The 3 sub-columns only go
             horizontal at md too — same moment as the outer row, matching
             Figma's tablet reference rather than switching early at sm. */}
          <div className="flex flex-col gap-[35px] md:flex-row md:gap-[26px] md:self-end lg:gap-[72px]">
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

            <div className="mx-auto max-w-[217px] md:mx-0 md:max-w-[164px] lg:max-w-[217px]">
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
         than padding-driven. Mobile turns it into a 179px stack (30/21
         padding): a bigger 48px monogram, then the tagline, then © — the
         reverse of the desktop row's left-to-right order, hence the explicit
         order-* swap. The 18px monogram gap is the 14px grid gap + 4px. */}
      <div className="px-[22px] pt-[30px] pb-[21px] md:flex md:h-[80px] md:items-center md:py-0">
        <div className="mx-auto grid w-full max-w-[1875px] grid-cols-1 items-center justify-items-center gap-[14px] text-center md:grid-cols-3 md:justify-items-stretch md:gap-3 md:text-left">
          <Monogram aria-hidden className="order-1 mb-1 h-12 w-auto text-[#b58a47] md:order-2 md:mb-0 md:h-[30px] md:justify-self-center" />
          <p className="order-2 font-sans text-[12px] font-bold leading-6 text-[#CFC6B8] md:order-3 md:justify-self-end md:text-[10px] lg:text-[15px]">Family-owned. Personally made. Since 1978.</p>
          <p className="order-3 font-sans text-[12px] font-bold leading-6 text-[#9F968A] md:order-1 md:text-[10px] lg:text-[15px]">© 2026 Grech Jewellers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
