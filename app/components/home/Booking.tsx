"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Container } from "./ui";
import { Eyebrow, GoldRule } from "./SectionHeader";
import BookingWidget from "./BookingWidget";

const PHOTO_SRC = "/assets/consultation-02.png";
const PHOTO_ALT = "A jeweller discussing a custom design with clients at the counter";

/* Book a Design Consultation — verified against Figma at all 3 reference
   widths (desktop 1920 `1:3799`, tablet 834 "iPad Pro 11" `1:4838`, mobile
   390 "iPhone 13/14" `1:4213`). The bleed-photo + widget-floating-over-its-
   lower-edge composition isn't desktop-only — it's the same idea at every
   tier, just with different numbers (and mobile's photo bleeds on *both*
   edges, so it has no rounded corners at all, unlike tablet/desktop's
   left-only rounding):
     mobile  — copy natural width; photo 100vw, h=262, no radius, top 401px;
               widget single-column, 374px wide (8px each side), top 615px
               (overlapping the photo's bottom 48px); section min-h 1919px.
     tablet  — copy 220px in Figma, widened to 235px here: "Piece Begins
               With" measures 227.6px at 32px Cormorant, so the literal 220
               wraps mid-phrase (same class of issue as the desktop column,
               just smaller numbers) — Container's own sm:px-6 (24px) gutter
               already matches Figma's x=24, no override needed; photo bleeds
               right only, 532×357 starting 62px past the copy column, top
               80px; widget *stays 3-column* (only true single-column below
               md — the old 1180px stacked threshold was wrong, tablet's
               807px-wide widget is still 3 across), nearly full-bleed
               (13px margin), top 395px (overlapping the photo's bottom
               42px); section min-h 837px.
     desktop — as already built: copy 400px, photo 1137×762 at its Figma
               position, widget 1180px full Container width, both absolute
               and Container-relative so they track re-centring on ultra-
               wide screens (see the lg-specific comments below).
   Typography is Booking-specific, not the shared SectionHeader scale (which
   several other sections also use, verified separately against their own
   Figma instances) — eyebrow 16px/600 (mobile+tablet) → 22px/600 (desktop,
   matches SectionHeader's own lg value); heading 32px/700 (mobile+tablet,
   bold) → 56px/600 (desktop, semibold — the weight itself changes, not just
   size); body 16px/500 (mobile) → 14px/500 (tablet, genuinely *smaller* than
   mobile) → 18px/400 (desktop). Built as custom markup rather than
   <SectionHeader> since none of the three properties are constant across
   tiers the way SectionHeader assumes. */
export default function Booking() {
  const [stacked, setStacked] = useState(true);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    // The widget is 3-column from md (768px) up — verified at tablet's 834px
    // reference (807px-wide widget, still 3 across) — and only truly
    // single-column below that, where mobile's reference (374px) stacks.
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setStacked(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  useEffect(() => {
    // Tablet-only (768–1023px) internal type scale — the widget stays
    // 3-column at this width (same as desktop) but Figma's own tablet
    // reference uses much smaller type throughout (headings 20px not 28px,
    // etc.), verified directly against the tablet IDLE STATE node tree.
    const mq = window.matchMedia("(min-width: 768px) and (max-width: 1023px)");
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <section id="book" aria-label="Book a Design Consultation" className="relative overflow-hidden bg-cream min-h-[1919px] md:min-h-[837px] lg:min-h-[1247px]">
      {/* copy — normal-flow Container; width/typography step at each tier
         per the Figma numbers above. `lg:!px-0` cancels the Container's own
         32px gutter at desktop only — tablet's sm:px-6 (24px) already
         matches Figma's x=24 there. */}
      <Container className="relative z-10 lg:!px-0">
        <div className="pt-8 md:max-w-[235px] md:pt-[80px] lg:max-w-[400px] lg:pt-[244px]">
          <Eyebrow className="fig-trim font-serif font-semibold [font-variant:small-caps] leading-[115%] tracking-[0.12em] text-[16px] lg:text-[22px]">
            Book A Design Consultation
          </Eyebrow>
          <h2 className="fig-trim mt-4 font-serif font-bold leading-[1.08] text-[32px] text-ink-text lg:mt-6 lg:text-[56px] lg:font-semibold lg:leading-[64px]">
            Every Meaningful<br />Piece Begins With<br /><span className="text-gold">A Conversation</span>
          </h2>
          <GoldRule width={114} className="mt-6 lg:mt-8" />
          <p className="fig-trim mt-6 max-w-[26rem] font-sans text-[16px] font-medium leading-relaxed text-[#403b37] md:text-[14px] lg:mt-7 lg:text-[18px] lg:font-normal lg:leading-[27px]">
            Meet directly with the jeweller to discuss your ideas, explore options and receive honest, obligation-free advice tailored to you.
          </p>
        </div>
      </Container>

      {/* photo — mobile: full-bleed both edges (no radius). Tablet/desktop:
         bleeds the right edge only inside a Container-mimicking wrapper
         (matching the copy's own edge), rounded on the left. Sizes/positions
         are fixed per tier, not vw-scaled, per the same reasoning as the
         desktop-only note below. */}
      <div className="absolute inset-x-0 top-[401px] h-[262px] md:top-[80px] md:h-auto md:block lg:top-[153px]">
        <div className="relative h-full md:mx-auto md:max-w-[1180px] lg:max-w-[1180px]">
          <div data-scroll-image="book" className="absolute inset-0 overflow-hidden md:inset-auto md:left-[306px] md:right-0 md:h-[357px] lg:left-[413px] lg:right-auto lg:h-[762px] lg:w-[1137px] lg:rounded-l-2xl md:rounded-l-2xl">
            <Image src={PHOTO_SRC} alt={PHOTO_ALT} fill sizes="(min-width: 1024px) 1137px, (min-width: 768px) 60vw, 100vw" className="object-cover" />
          </div>
        </div>
      </div>

      {/* widget — absolute + frontmost z-index at every tier, floating over
         the photo's lower portion. Mobile/tablet get a small symmetric
         margin (matching Figma's near-full-bleed 8px/13px) via the outer
         div's own inset — `!px-0 sm:!px-0 lg:!px-0` cancels Container's own
         padding at all three of *its* tiers (px-5/sm:px-6/lg:px-8), since
         otherwise it stacked on top of the outer inset and double-margined
         the card (8+20=28px / 13+24=37px instead of the intended 8px/13px). */}
      <div className="absolute inset-x-2 top-[615px] z-30 md:inset-x-[13px] md:top-[395px] lg:inset-x-0 lg:top-[631px]">
        <Container className="!px-0 sm:!px-0 lg:!px-0">
          <BookingWidget stacked={stacked} compact={compact} />
        </Container>
      </div>
    </section>
  );
}
