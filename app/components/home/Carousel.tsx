"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/* Layout-agnostic scroll-snap carousel. Fills its container (no absolute
   coords); card widths are set responsively by `cardClassName` (Tailwind).
   Native finger-swipe + snap, a dot pager, and gentle auto-advance while in
   view (pauses on manual interaction, resumes after 5s). Used for the mobile
   Services row and the Reviews row (tablet + mobile). */
export default function Carousel({
  slides, cardClassName = "w-[82%]", gap = 16, snap = "center",
  dots = true, intervalMs = 5000, ariaLabel,
}: {
  slides: ReactNode[];
  cardClassName?: string;
  gap?: number;
  snap?: "center" | "start";
  dots?: boolean;
  intervalMs?: number;
  ariaLabel?: string;
}) {
  const count = slides.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const inView = useRef(false);
  const programmatic = useRef(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null; }
    if (resumeRef.current) { clearTimeout(resumeRef.current); resumeRef.current = null; }
  }, []);

  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[i] as HTMLElement | undefined;
    if (!card) return;
    programmatic.current = true;
    card.scrollIntoView({ behavior: "smooth", inline: snap, block: "nearest" });
    setActive(i);
    activeRef.current = i;
    window.setTimeout(() => { programmatic.current = false; }, 650);
  }, [snap]);

  const startAuto = useCallback(() => {
    clearTimers();
    // honour reduced-motion: no auto-advance (swipe/dots still work)
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    autoRef.current = setInterval(() => {
      if (inView.current) goTo((activeRef.current + 1) % count);
    }, intervalMs);
  }, [clearTimers, count, goTo, intervalMs]);

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

  // track the active card on manual scroll (closest card centre to viewport centre)
  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const mid = track.scrollLeft + track.clientWidth / 2;
    let best = 0, bestD = Infinity;
    Array.from(track.children).forEach((c, i) => {
      const el = c as HTMLElement;
      const centre = el.offsetLeft + el.offsetWidth / 2;
      const d = Math.abs(centre - mid);
      if (d < bestD) { bestD = d; best = i; }
    });
    setActive(best);
    activeRef.current = best;
    if (!programmatic.current) onManual();
  };

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={onScroll}
        role="group"
        aria-label={ariaLabel}
        aria-roledescription="carousel"
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory overflow-x-auto px-5 sm:-mx-6 sm:px-6"
        style={{ gap, scrollPadding: "0 20px" }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            className={`shrink-0 ${snap === "center" ? "snap-center" : "snap-start"} ${cardClassName}`}
          >
            {slide}
          </div>
        ))}
      </div>

      {dots && count > 1 && (
        <div className="mt-6 flex justify-center gap-2.5">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to item ${i + 1}`}
              aria-current={active === i}
              onClick={() => { goTo(i); onManual(); }}
              className="h-2.5 rounded-full transition-all duration-300"
              style={{
                width: active === i ? 26 : 10,
                background: active === i ? "var(--color-gold)" : "var(--color-divider)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
