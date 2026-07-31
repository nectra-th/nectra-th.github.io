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
      <Container className="flex h-[72px] items-center justify-between lg:h-[108px] lg:!px-0">
        <a href="#top" aria-label="Grech Jewellers — home" className="shrink-0">
          <img src="/assets/logo-header.svg" alt="Grech Jewellers" width={238} height={65} className="h-8 w-auto lg:h-[65px]" />
        </a>

        {/* nav + CTA — one flush-right group so the 30px gap between them is
            exact and the group's left edge auto-consumes the remaining space
            next to the logo (reproducing the 205px gap at 1920 width). */}
        <div className="hidden lg:flex lg:items-center lg:gap-[30px]">
          <nav aria-label="Primary" className="flex items-center gap-8">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="gj-navlink link-underline text-[12px] font-medium uppercase text-cream-light/85"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <CTAButton
            href="#book"
            variant="outlineGold"
            radius="rounded-[4px]"
            className="lg:!h-12 lg:!px-[18px] lg:!py-0 lg:!text-[14px] lg:!font-medium lg:!tracking-[1px]"
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
          className="flex h-11 w-11 items-center justify-center lg:hidden"
        >
          <span className="relative block h-4 w-6">
            <span className="absolute left-0 top-0 h-0.5 w-full bg-cream-light" />
            <span className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-cream-light" />
            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-cream-light" />
          </span>
        </button>
      </Container>

      {/* full-screen mobile menu (portal) */}
      {mounted && open && createPortal(
        <div ref={menuRef} id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" onKeyDown={trapTab} className="fixed inset-0 z-[100] flex flex-col bg-ink">
          <div className="flex h-[72px] items-center justify-between px-5">
            <img src="/assets/logo-header.svg" alt="Grech Jewellers" width={238} height={65} className="h-8 w-auto" />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/60 text-gold transition-colors hover:bg-gold hover:text-ink"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center gap-1 px-6">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="border-b border-cream-light/10 py-4 font-serif text-2xl text-cream-light transition-colors hover:text-gold"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3 px-6 pb-10">
            <a
              href="#book"
              onClick={() => setOpen(false)}
              className="inline-flex w-full items-center justify-center rounded-[2px] bg-gold px-9 py-4 text-[15px] font-bold uppercase tracking-[0.06em] text-ink transition-colors hover:bg-gold-dark"
            >
              Book a Consultation
            </a>
            <a
              href={PHONE}
              className="inline-flex w-full items-center justify-center rounded-[2px] border border-cream-light/30 px-9 py-4 text-[15px] font-bold uppercase tracking-[0.06em] text-cream-light transition-colors hover:bg-cream-light hover:text-ink"
            >
              Call Us
            </a>
          </div>
        </div>,
        document.body,
      )}
    </header>
  );
}
