"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/* Fluid featured-creations slider: a large active image, prev/next controls, and
   a scrollable thumbnail strip (active thumb gets a gold ring). Fills its
   container — no absolute coordinates. */

const IMAGES = [
  "/assets/figma-img/65f309ab217b0a54da7f69aa805c868bdeea725f.webp",
  "/assets/figma-img/81d578de67f967d51b2236c979ea7972051da24b.webp",
  "/assets/figma-img/2c63e483982c2795ce6bfb52aaa2beaa608229c5.webp",
  "/assets/figma-img/633d28daa0a85b2f44a77bed4fa60769d9c5a3e5.webp",
  "/assets/figma-img/47769d2a1b6ed1549bb63b255585b79185ae5985.webp",
];

function Arrow({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "left" ? "Previous creation" : "Next creation"}
      /* Figma's "Gallery UI Button" has 3 real states, confirmed via the
         component sheet: Default (fill #211f1c @55%, stroke #625b52, icon
         #efe6d6) → Hover (fill #211f1c @100%, stroke #9c7430 gold-dark, icon
         STILL #efe6d6 — not inverted to a solid gold chip) → Active (same
         fill/stroke as hover, icon also turns #9c7430). */
      className="flex h-14 w-14 items-center justify-center rounded border border-body-2 bg-ink-2/55 text-cream-alt backdrop-blur transition-colors duration-300 hover:border-gold-dark hover:bg-ink-2 active:border-gold-dark active:bg-ink-2 active:text-gold-dark"
    >
      <svg width="15" height="27" viewBox="0 0 15 27" fill="none" aria-hidden>
        <path d={dir === "left" ? "M13 2L2 13.5L13 25" : "M2 2L13 13.5L2 25"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export default function FeaturedGallery() {
  const [active, setActive] = useState(0);
  const prev = () => setActive((a) => (a - 1 + IMAGES.length) % IMAGES.length);
  const next = () => setActive((a) => (a + 1) % IMAGES.length);

  /* Mobile (<sm) auto-advance + stepper. The mobile tier is a native
     scroll-snap track (not the sm+ cross-fade), so "advance" means scrolling
     the track one viewport-width right every 3s, wrapping after the last
     slide. Same conventions as the shared Carousel component: pauses while
     scrolled out of view (IntersectionObserver), backs off for 5s after any
     manual swipe/tap, and honours prefers-reduced-motion by not
     auto-advancing at all (swipe + dots still work). All of it no-ops from
     sm up, where the track doesn't overflow (slides stack absolutely) and
     the dots are hidden. */
  const trackRef = useRef<HTMLDivElement>(null);
  const [mobileActive, setMobileActive] = useState(0);
  const mobileActiveRef = useRef(0);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inView = useRef(false);
  const programmatic = useRef(false);

  const clearTimers = useCallback(() => {
    if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null; }
    if (resumeRef.current) { clearTimeout(resumeRef.current); resumeRef.current = null; }
  }, []);

  const goToSlide = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    programmatic.current = true;
    track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
    setMobileActive(i);
    mobileActiveRef.current = i;
    window.setTimeout(() => { programmatic.current = false; }, 650);
  }, []);

  const startAuto = useCallback(() => {
    clearTimers();
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    autoRef.current = setInterval(() => {
      const track = trackRef.current;
      // only the mobile snap-track overflows; from sm up this is a no-op
      if (!track || track.scrollWidth - track.clientWidth < 10) return;
      if (inView.current) goToSlide((mobileActiveRef.current + 1) % IMAGES.length);
    }, 3000);
  }, [clearTimers, goToSlide]);

  const onManual = useCallback(() => {
    clearTimers();
    resumeRef.current = setTimeout(startAuto, 5000);
  }, [clearTimers, startAuto]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const io = new IntersectionObserver(([e]) => {
      inView.current = e.isIntersecting;
      if (e.isIntersecting && !autoRef.current && !resumeRef.current) startAuto();
    }, { threshold: 0.35 });
    io.observe(track);
    return () => { io.disconnect(); clearTimers(); };
  }, [startAuto, clearTimers]);

  const onTrackScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    const i = Math.round(track.scrollLeft / track.clientWidth);
    if (i !== mobileActiveRef.current) { setMobileActive(i); mobileActiveRef.current = i; }
    if (!programmatic.current) onManual();
  };

  return (
    <div>
      {/* Main viewport. Figma gives it 850x523 (desktop) / 390x240 (mobile) —
         the same 1.625 aspect either way, so one ratio covers both; only the
         chrome differs. Mobile has NO arrows and NO thumbnails in Figma, so
         below sm this becomes a native scroll-snap track (all five slides side
         by side, swipeable) rather than a controls-driven fade — that keeps
         every image reachable without inventing chrome the design doesn't
         have. From sm up the slides stack absolutely again and the arrows /
         thumbnails cross-fade between them exactly as before. */}
      <div
        ref={trackRef}
        onScroll={onTrackScroll}
        data-scroll-image="featured"
        className="no-scrollbar relative flex aspect-[850/523] w-full snap-x snap-mandatory overflow-x-auto border-y border-[#39342e] sm:block sm:overflow-hidden sm:rounded-2xl sm:border"
      >
        {IMAGES.map((src, i) => (
          <div
            key={src}
            className={`relative h-full w-full shrink-0 snap-center transition-opacity duration-500 sm:absolute sm:inset-0 ${
              active === i ? "sm:opacity-100" : "sm:opacity-0"
            }`}
          >
            <Image
              src={src}
              alt="Featured Grech Jewellers custom creation"
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 62vw, 100vw"
              className="object-cover"
            />
          </div>
        ))}
        {/* Figma's arrow pair sits ~30px from the right edge, ~27px from the
           bottom — desktop/tablet only, mobile has no controls. */}
        <div className="absolute bottom-[27px] right-[30px] hidden gap-4 sm:flex">
          <Arrow dir="left" onClick={prev} />
          <Arrow dir="right" onClick={next} />
        </div>
      </div>

      {/* mobile stepper — same dot language as the shared Carousel (gold
         26px pill for the active step, 10px divider-coloured dots
         otherwise); hidden from sm up where the thumbnail strip takes over. */}
      <div className="mt-6 flex justify-center gap-2.5 sm:hidden">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to creation ${i + 1}`}
            aria-current={mobileActive === i}
            onClick={() => { goToSlide(i); onManual(); }}
            className="h-2.5 rounded-full transition-all duration-300"
            style={{
              width: mobileActive === i ? 26 : 10,
              background: mobileActive === i ? "var(--color-gold)" : "var(--color-divider)",
            }}
          />
        ))}
      </div>

      {/* thumbnails — Figma: 187x195 each, ~8px below the viewport, tight ~4-5px
         gaps, cornerRadius ~4px, 1.09px border. Three real component states,
         confirmed against the component sheet: Default #39342e (dark-border),
         Hover #625b52 (muted-dark, not gold), Selected #9c7430 (gold-dark) —
         selected stays gold even if also hovered, it doesn't fall back to the
         hover colour. Non-selected, non-hovered thumbs sit at 63% opacity;
         hovering (any thumb) or being the active one brings it to 100%. */}
      {/* image-to-thumbnail gap differs by breakpoint in Figma: ~2px on the
         834px tablet reference vs 8px on desktop — not the same value scaled,
         two genuinely different measurements. Hidden below sm: the mobile
         design has no thumbnail strip at all. */}
      <div className="no-scrollbar mt-[2px] hidden gap-1 overflow-x-auto sm:flex lg:mt-2">
        {IMAGES.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`View creation ${i + 1}`}
            aria-current={active === i}
            className={`relative aspect-[187/195] w-[22%] shrink-0 overflow-hidden rounded border transition-[border-color,opacity] duration-300 hover:opacity-100 ${
              active === i ? "border-gold-dark opacity-100" : "border-[#39342e] opacity-[0.63] hover:border-body-2"
            }`}
          >
            <Image src={src} alt="" fill sizes="140px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
