"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const NAV = [
  { label: "WHY GRECH", href: "#why" },
  { label: "WHAT WE DO", href: "#what-we-do" },
  { label: "OUR PROCESS", href: "#process" },
  { label: "OUR CREATIONS", href: "#creations" },
  { label: "CONTACT", href: "#find-us" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-ink/95 backdrop-blur-sm shadow-lg shadow-black/20" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[84px] max-w-[1520px] items-center justify-between px-6 lg:px-10">
        <Link href="#top" className="flex items-center" aria-label="Grech Jewellers home">
          <Image
            src="/assets/logo-header.svg"
            alt="Grech Jewellers"
            width={238}
            height={65}
            priority
            className="h-[42px] w-auto lg:h-[50px]"
          />
        </Link>

        <nav className="hidden items-center gap-3 md:flex lg:gap-8">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="link-underline text-[11px] lg:text-[12px] font-medium tracking-[0.06em] lg:tracking-[0.14em] text-cream-light/85 transition-colors duration-200 hover:text-gold focus-visible:outline-none focus-visible:text-gold"
            >
              {n.label}
            </a>
          ))}

          <a
            href="#booking"
            className="rounded-[2px] border border-gold/70 px-3 py-2.5 lg:px-5 lg:py-3 text-[12px] font-semibold tracking-[0.08em] lg:tracking-[0.12em] text-gold transition-[background-color,color,box-shadow,transform] duration-200 ease-out hover:bg-gold hover:text-ink hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/25 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            BOOK A CONSULTATION
          </a>
        </nav>

        <button
          className="flex flex-col gap-[5px] rounded-[2px] p-2 transition-colors md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`h-[2px] w-6 bg-cream-light transition-transform duration-300 ease-out ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`h-[2px] w-6 bg-cream-light transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
          <span className={`h-[2px] w-6 bg-cream-light transition-transform duration-300 ease-out ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden bg-ink/98 backdrop-blur transition-[max-height] duration-300 ease-out md:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-6 pb-6 pt-2">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="border-b border-white/5 py-3 text-[13px] font-medium tracking-[0.12em] text-cream-light/85 transition-[color,padding] duration-200 hover:pl-1.5 hover:text-gold focus-visible:outline-none focus-visible:pl-1.5 focus-visible:text-gold"
            >
              {n.label}
            </a>
          ))}

          <a
            href="#booking"
            onClick={() => setOpen(false)}
            className="mt-3 rounded-[2px] bg-gold px-5 py-3 text-center text-[13px] font-bold tracking-[0.1em] text-ink transition-colors duration-200 hover:bg-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            BOOK A CONSULTATION
          </a>
        </nav>
      </div>
    </header>
  );
}
