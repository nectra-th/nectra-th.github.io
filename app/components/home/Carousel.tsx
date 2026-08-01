"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";

/* Layout-agnostic scroll-snap carousel. Fills its container (no absolute
   coords); card widths are set responsively by `cardClassName` (Tailwind).
   Native finger-swipe + snap, a dot pager, and gentle auto-advance while in
   view (pauses on manual interaction, resumes after 5s). Used for the mobile
   Services row and the Reviews row (tablet + mobile).
   cardClassName MUST use vw (not %) when snap="center": the track's own
   side padding is computed FROM the card's rendered width so the first/last
   card can reach true centre (see the sidePad effect below) — a %-based
   card width is relative to that same dynamically-padded box, so growing
   the padding shrinks the card, which demands more padding, collapsing the
   card toward nothing. vw is relative to the viewport instead, so it's
   unaffected by the track's own padding. */
export default function Carousel({
  slides, cardClassName = "w-[82vw]", gap = 16, snap = "center",
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
  // Mouse-drag-to-scroll: the track only responds to native touch-swipe out
  // of the box, so a mouse drag (e.g. testing "mobile" by dragging in a
  // resized desktop browser, rather than a real touch/emulated-touch device)
  // does nothing and the dots never move. Pointer events unify mouse/touch,
  // but we only drive scrollLeft manually for pointerType "mouse" — touch
  // keeps using its already-working native momentum scroll untouched.
  const dragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);
  // How much side padding the track needs so the FIRST/LAST card can still
  // scroll all the way to true centre (not just sit flush at the edge) —
  // the fixed px-5/px-6 fallback below is nowhere near enough once a card is
  // a large fraction of the track's width (e.g. 48% at the md breakpoint),
  // so this is measured from the actual rendered sizes and kept in sync on
  // resize, since card widths are percentage-based per breakpoint.
  const [sidePad, setSidePad] = useState<number | null>(null);

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

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track || snap !== "center") return;
    const recompute = () => {
      const first = track.children[0] as HTMLElement | undefined;
      if (!first) return;
      const next = Math.max(0, (track.clientWidth - first.offsetWidth) / 2);
      // guard against a feedback loop: the card's width is a % of the
      // track's *content*-box, so applying padding shrinks that content-box
      // and would otherwise re-trigger this observer with an even smaller
      // card each time, spiralling the card down to nothing. Watching the
      // stable border-box (unaffected by the track's own padding, since its
      // own width comes from its parent, not its content) fixes the root
      // cause; skipping no-op updates is a second line of defence.
      setSidePad((prev) => (prev !== null && Math.abs(prev - next) < 1 ? prev : next));
    };
    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(track, { box: "border-box" });
    return () => ro.disconnect();
  }, [snap, count]);

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

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return; // touch already scrolls natively
    const track = trackRef.current;
    if (!track) return;
    e.preventDefault(); // a mouse drag would otherwise select the card text
    dragging.current = true;
    dragStartX.current = e.clientX;
    dragStartScrollLeft.current = track.scrollLeft;
    track.setPointerCapture(e.pointerId);
    onManual();
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const track = trackRef.current;
    if (!track) return;
    track.scrollLeft = dragStartScrollLeft.current - (e.clientX - dragStartX.current);
  };
  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    trackRef.current?.releasePointerCapture(e.pointerId);
  };

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        role="group"
        aria-label={ariaLabel}
        aria-roledescription="carousel"
        // -my-14 pairs with py-14 below to give the hover shadow (up to
        // ~56px of blur+offset bleed, see .gj-review-card) clip-room within
        // the track's own box, without shifting the cards' visible position
        // or pushing the dots down — overflow-x-auto forces overflow-y to
        // also become non-visible (a CSS spec quirk, not something we can
        // opt out of per-axis), so without this the shadow was just gone.
        className="no-scrollbar -mx-5 -my-14 flex snap-x snap-mandatory overflow-x-auto px-5 py-14 sm:-mx-6 sm:px-6 cursor-grab active:cursor-grabbing"
        style={
          snap === "center" && sidePad !== null
            ? { gap, paddingLeft: sidePad, paddingRight: sidePad, scrollPaddingLeft: sidePad, scrollPaddingRight: sidePad }
            : { gap, scrollPadding: "0 20px" }
        }
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
