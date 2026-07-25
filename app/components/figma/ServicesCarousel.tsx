"use client";

import { useEffect, useRef, useState } from "react";

/* Mobile-only carousel for the "Crafted Around Your Story" services row.
   The transpiled cards are a fixed horizontal row wider than the phone (so
   cards 2–6 were clipped). This reconstructs the six cards in a scroll-snap
   track with: auto-advance every 3s once in view, working prev/next buttons,
   native finger-swipe + snap, and auto-resume 5s after any manual action. */

export type SvcCard = { icon: string; title: string; img: string; desc: string };

const CARD_W = 280, GAP = 16, IMG_H = 240, CARD_H = 440;
const PITCH = CARD_W + GAP;
const GOLD = "#9c7430";

/* eslint-disable @next/next/no-img-element */
export default function ServicesCarousel({
  cards, x, y, viewportW,
}: { cards: SvcCard[]; x: number; y: number; viewportW: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const inView = useRef(false);
  const programmatic = useRef(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const N = cards.length;

  const clearTimers = () => {
    if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null; }
    if (resumeRef.current) { clearTimeout(resumeRef.current); resumeRef.current = null; }
  };
  const scrollTo = (i: number) => {
    const el = ref.current; if (!el) return;
    programmatic.current = true;
    el.scrollTo({ left: i * PITCH, behavior: "smooth" });
    setActive(i);
    window.setTimeout(() => { programmatic.current = false; }, 650);
  };
  const startAuto = () => {
    clearTimers();
    autoRef.current = setInterval(() => {
      if (!inView.current) return;
      setActive((a) => { const next = (a + 1) % N; scrollTo(next); return next; });
    }, 3000);
  };
  // any manual action → pause, then resume auto 5s later
  const onManual = () => {
    clearTimers();
    resumeRef.current = setTimeout(startAuto, 5000);
  };

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      inView.current = e.isIntersecting;
      if (e.isIntersecting) { if (!autoRef.current && !resumeRef.current) startAuto(); }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); clearTimers(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onScroll = () => {
    const el = ref.current; if (!el) return;
    const i = Math.max(0, Math.min(N - 1, Math.round(el.scrollLeft / PITCH)));
    setActive(i);
    if (!programmatic.current) onManual(); // user swipe
  };
  const nav = (dir: number) => { scrollTo((active + dir + N) % N); onManual(); };

  const arrow = (dir: number, side: "left" | "right", chevron: string): React.CSSProperties => ({
    position: "absolute", top: y + 20 + IMG_H / 2, [side]: 6, width: 36, height: 36, zIndex: 8600,
    display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%",
    border: "none", cursor: "pointer", color: "#f8f3ea", fontSize: 20, lineHeight: 1,
    background: "rgba(20,19,18,0.5)", backdropFilter: "blur(2px)", padding: 0,
  });

  return (
    <>
      <div
        ref={ref} onScroll={onScroll}
        className="svc-carousel-track"
        style={{
          position: "absolute", left: x, top: y, width: viewportW, height: CARD_H,
          display: "flex", gap: GAP, paddingLeft: 21, paddingRight: Math.max(21, viewportW - CARD_W - 21),
          overflowX: "auto", overflowY: "hidden", zIndex: 8550,
          scrollSnapType: "x mandatory", scrollPaddingLeft: 21, WebkitOverflowScrolling: "touch",
        }}
      >
        {cards.map((c, i) => (
          <div key={i} style={{ flex: `0 0 ${CARD_W}px`, height: CARD_H, position: "relative", scrollSnapAlign: "start" }}>
            <img src={c.icon} alt="" style={{ position: "absolute", left: (CARD_W - 48) / 2, top: 0, width: 48, height: 48, objectFit: "contain" }} />
            <div style={{ position: "absolute", top: 64, left: 0, width: CARD_W, textAlign: "center", fontFamily: "var(--font-cormorant), serif", fontSize: 24, fontWeight: 400, fontVariant: "small-caps", color: "#f8f3ea", lineHeight: "26px" }}>{c.title}</div>
            <div style={{ position: "absolute", top: 97, left: (CARD_W - 41) / 2, width: 41, height: 1, background: GOLD }} />
            <img src={c.img} alt={c.title} style={{ position: "absolute", top: 114, left: 0, width: CARD_W, height: IMG_H, objectFit: "cover", borderRadius: 12 }} />
            <div style={{ position: "absolute", top: 371, left: 0, width: CARD_W, padding: "0 8px", textAlign: "center", fontFamily: "var(--font-manrope), sans-serif", fontSize: 14, fontWeight: 500, color: "#cfc6b8", lineHeight: "22px", whiteSpace: "pre-line" }}>{c.desc}</div>
          </div>
        ))}
      </div>

      <button aria-label="Previous service" onClick={() => nav(-1)} style={arrow(-1, "left", "‹")}>‹</button>
      <button aria-label="Next service" onClick={() => nav(1)} style={arrow(1, "right", "›")}>›</button>
    </>
  );
}
