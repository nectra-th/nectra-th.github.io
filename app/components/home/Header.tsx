"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CTAButton, Container } from "./ui";

/* eslint-disable @next/next/no-img-element */

/* Desktop geometry below (container height, logo/nav/CTA sizes, gaps, radius,
   rest-state border colour) is read directly off the Figma file: a 1920×108
   bar (#141312) with the logo flush to the 1180-wide content band's left edge,
   the nav+CTA group flush to its right edge, and a 30px gap between them. */

const NAV = [
  { label: "Why Grech", href: "#why" },
  { label: "What We Do", href: "#whatwedo" },
  { label: "Our Process", href: "#process" },
  { label: "Our Creations", href: "#featured" },
  { label: "Contact", href: "#findus" },
];

const PHONE = "tel:+61883567764";

// Why Grech / Our Work / Book a Design Consultation each have one hero photo
// as their real focal point, so nav should land 40px above THAT image. Every
// other destination lands above its own title instead — with more breathing
// room (80px) since 40px reads as too tight against plain text. Native
// fragment navigation can only align to a section's top edge, so this is all
// done by hand via window.scrollTo.
const IMAGE_TARGET_IDS = new Set(["why", "featured", "book"]);
const IMAGE_LANDING_GAP = 40;
const TITLE_LANDING_GAP = 80;

function scrollToNavTarget(e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) {
  const id = href.slice(1);
  const section = document.querySelector(href);
  if (!section) return;
  e.preventDefault();

  let target: Element | null = null;
  let gap = TITLE_LANDING_GAP;
  if (IMAGE_TARGET_IDS.has(id)) {
    // mobile/desktop each render their own image element (one hidden via
    // CSS depending on breakpoint) — pick whichever one is actually visible.
    const candidates = document.querySelectorAll(`[data-scroll-image="${id}"]`);
    target = [...candidates].find((el) => el.getBoundingClientRect().width > 0) ?? section;
    gap = IMAGE_LANDING_GAP;
  } else {
    target = section.querySelector("h2") ?? section;
  }

  const top = target.getBoundingClientRect().top + window.scrollY - gap;
  window.scrollTo({ top, behavior: "smooth" });
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  // lock body scroll while the mobile menu is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // focus management: move focus into the dialog on open, restore to the
  // hamburger on close (a real focus trap, matching the aria-modal contract).
  useEffect(() => {
    if (!open) return;
    const first = menuRef.current?.querySelector<HTMLElement>("button, a[href]");
    first?.focus();
    return () => hamburgerRef.current?.focus();
  }, [open]);

  const trapTab = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const f = menuRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
    if (!f || !f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50 bg-ink/[0.72]">
      <Container className="flex h-[72px] items-center justify-between md:h-20 lg:h-[108px] lg:!px-0">
        <a href="#top" aria-label="Grech Jewellers — home" className="shrink-0">
          <img src="/assets/logo-header.svg" alt="Grech Jewellers" width={238} height={65} className="h-8 w-auto md:h-9 lg:h-[65px]" />
        </a>

        {/* nav + CTA — one flush-right group so the 30px gap between them is
            exact and the group's left edge auto-consumes the remaining space
            next to the logo (reproducing the 205px gap at 1920 width). Below
            lg this is a real desktop-style bar too (not the mobile hamburger
            menu — tablet is a full-featured layout, not a shrunk phone one),
            just with its own tighter gaps/CTA size so 5 links + a button
            still fit next to the logo down to 768px. */}
        <div className="hidden md:flex md:items-center md:gap-3 lg:gap-[30px]">
          <nav aria-label="Primary" className="flex items-center gap-3 lg:gap-8">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={(e) => scrollToNavTarget(e, n.href)}
                className="gj-navlink link-underline whitespace-nowrap text-[11px] font-medium uppercase text-line lg:text-[12px]"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <CTAButton
            href="#book"
            onClick={(e) => scrollToNavTarget(e, "#book")}
            variant="outlineGold"
            radius="rounded-[4px]"
            className="!h-10 !px-3 !py-0 !text-[11px] !font-medium !tracking-[0.5px] lg:!h-12 lg:!px-[18px] lg:!py-0 lg:!text-[14px] lg:!font-medium lg:!tracking-[1px]"
          >
            Book a Consultation
          </CTAButton>
        </div>

        {/* mobile hamburger */}
        <button
          ref={hamburgerRef}
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(true)}
          className="flex h-11 w-11 items-center justify-center md:hidden"
        >
          {/* gold bars (not white) — same #b88c46 as the menu's close ring,
             per the mobile design */}
          <span className="relative block h-4 w-6">
            <span className="absolute left-0 top-0 h-0.5 w-full bg-gold" />
            <span className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-gold" />
            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-gold" />
          </span>
        </button>
      </Container>

      {/* full-screen mobile menu (portal) — rebuilt against the "iPhone 13 &
         14 - 2" design export (390×844, pixel-measured): big logo top-left
         (249px wide at x16,y20), 40px gold-ring close button (right 17,
         top 36), then a right-aligned nav list whose first divider sits at
         exactly y=130 — six PURE WHITE 1px full-width lines framing five
         87px rows, 32px uppercase sans items in #cfc6b8 (the --color-line
         token, sampled solid off the export) flush right. 40px below the
         last divider: a 54px gold Book button, a 13px gap, and a 54px
         outlined Call button whose "CALL US" is bold but the number
         regular. Remaining space below stays empty ink. */}
      {mounted && open && createPortal(
        <div ref={menuRef} id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" onKeyDown={trapTab} className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-ink">
          <div className="relative h-[130px] shrink-0">
            <img src="/assets/logo-header.svg" alt="Grech Jewellers" width={238} height={65} className="absolute left-4 top-5 h-auto w-[249px]" />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute right-[17px] top-9 flex h-10 w-10 items-center justify-center rounded-full border border-gold text-gold transition-colors hover:bg-gold hover:text-ink"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav aria-label="Mobile" className="mx-4 shrink-0">
            {NAV.map((n, i) => (
              <a
                key={n.href}
                href={n.href}
                onClick={(e) => { scrollToNavTarget(e, n.href); setOpen(false); }}
                className={`flex h-[87px] items-center justify-end border-t border-white font-sans text-[32px] font-normal uppercase text-line transition-colors hover:text-gold ${i === NAV.length - 1 ? "border-b" : ""}`}
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="mt-10 flex shrink-0 flex-col gap-[13px] px-4 pb-10">
            {/* .btn-primary matches this button's resting spec exactly
               (gold/ink/14px/0.84/radius 4) — only the menu design's 54px
               height differs from the mobile set's 56. */}
            <a
              href="#book"
              onClick={(e) => { scrollToNavTarget(e, "#book"); setOpen(false); }}
              className="btn btn-primary w-full !h-[54px]"
            >
              Book a Consultation
            </a>
            <a
              href={PHONE}
              className="inline-flex h-[54px] w-full items-center justify-center gap-2 rounded-[4px] border border-cream-light/35 text-[14px] uppercase text-cream-light transition-colors hover:bg-cream-light hover:text-ink"
            >
              <span className="font-bold tracking-[0.06em]">Call Us</span>
              <span className="font-normal tracking-normal">(08) 8356 7764</span>
            </a>
          </div>
        </div>,
        document.body,
      )}
    </header>
  );
}
