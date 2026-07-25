"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/* Generic mobile scroll-snap carousel used by the services and reviews rows.
   Auto-advances every 3s once in view, prev/next buttons, native finger swipe
   + snap, and auto-resume 5s after any manual action. */
export default function Carousel({
  x, y, viewportW, cardW, cardH, count, renderCard,
  gap = 16, pad = 21, arrowTop,
}: {
  x: number; y: number; viewportW: number; cardW: number; cardH: number; count: number;
  renderCard: (i: number) => ReactNode; gap?: number; pad?: number; arrowTop?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [, setActive] = useState(0);
  const activeRef = useRef(0);
  const inView = useRef(false);
  const programmatic = useRef(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pitch = cardW + gap;

  const setIdx = (i: number) => { activeRef.current = i; setActive(i); };
  const clearTimers = () => {
    if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null; }
    if (resumeRef.current) { clearTimeout(resumeRef.current); resumeRef.current = null; }
  };
  const goTo = (i: number) => {
    const el = ref.current; if (!el) return;
    programmatic.current = true;
    el.scrollTo({ left: i * pitch, behavior: "smooth" });
    setIdx(i);
    window.setTimeout(() => { programmatic.current = false; }, 650);
  };
  const startAuto = () => {
    clearTimers();
    autoRef.current = setInterval(() => { if (inView.current) goTo((activeRef.current + 1) % count); }, 3000);
  };
  const onManual = () => { clearTimers(); resumeRef.current = setTimeout(startAuto, 5000); };

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      inView.current = e.isIntersecting;
      if (e.isIntersecting && !autoRef.current && !resumeRef.current) startAuto();
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); clearTimers(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onScroll = () => {
    const el = ref.current; if (!el) return;
    setIdx(Math.max(0, Math.min(count - 1, Math.round(el.scrollLeft / pitch))));
    if (!programmatic.current) onManual();
  };
  const nav = (d: number) => { goTo((activeRef.current + d + count) % count); onManual(); };
  const aTop = y + (arrowTop ?? cardH / 2);
  const arrow = (side: "left" | "right"): React.CSSProperties => ({
    position: "absolute", top: aTop, [side]: 6, width: 36, height: 36, zIndex: 8600,
    display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%",
    border: "none", cursor: "pointer", color: "#f8f3ea", fontSize: 20, lineHeight: 1,
    background: "rgba(20,19,18,0.5)", backdropFilter: "blur(2px)", padding: 0,
  });

  return (
    <>
      <div ref={ref} onScroll={onScroll} className="svc-carousel-track"
        style={{
          position: "absolute", left: x, top: y, width: viewportW, height: cardH,
          display: "flex", gap, paddingLeft: pad, paddingRight: Math.max(pad, viewportW - cardW - pad),
          overflowX: "auto", overflowY: "hidden", zIndex: 8550,
          scrollSnapType: "x mandatory", scrollPaddingLeft: pad, WebkitOverflowScrolling: "touch",
        }}>
        {Array.from({ length: count }, (_, i) => (
          <div key={i} style={{ flex: `0 0 ${cardW}px`, height: cardH, position: "relative", scrollSnapAlign: "start" }}>{renderCard(i)}</div>
        ))}
      </div>
      <button aria-label="Previous slide" onClick={() => nav(-1)} style={arrow("left")}>‹</button>
      <button aria-label="Next slide" onClick={() => nav(1)} style={arrow("right")}>›</button>
    </>
  );
}
