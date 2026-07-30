"use client";

import { useEffect } from "react";

/* Staggered scroll-entrance for the homepage. Any element tagged `data-reveal`
   fades/slides up when it scrolls into view (see the `[data-reveal]` CSS in
   globals.css). One page-level observer handles them all.

   IntersectionObserver does not reliably recompute when layout shifts from a
   resize (it can miss elements that scaled into view), so we also re-check live
   geometry on resize (rAF-throttled) — this is what keeps reveals working after
   a viewport change without needing a scroll. */
export default function ScrollReveal() {
  useEffect(() => {
    const initial = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-shown])"));
    if (!initial.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      initial.forEach((el) => el.setAttribute("data-shown", "true"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).setAttribute("data-shown", "true");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    initial.forEach((el) => io.observe(el));

    let raf = 0;
    const revealInView = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const el of document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-shown])")) {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) {
          el.setAttribute("data-shown", "true");
          io.unobserve(el);
        }
      }
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(revealInView); };

    requestAnimationFrame(revealInView);
    window.addEventListener("resize", schedule);

    return () => {
      io.disconnect();
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
