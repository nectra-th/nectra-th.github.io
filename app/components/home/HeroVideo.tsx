"use client";

import { useEffect, useRef } from "react";

/* Hero background video. It has no `autoplay` attribute — so it never plays
   without JS, and we only call play() when the user hasn't asked for reduced
   motion. `preload="metadata"` keeps the file out of the initial load (the
   poster shows immediately), which also helps LCP. */
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const v = ref.current;
    if (v && !reduce) v.play().catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      className="h-full w-full object-cover opacity-40"
      muted
      loop
      playsInline
      preload="metadata"
      poster="/assets/grech-hero-poster.jpg"
      aria-hidden
    >
      <source src="/assets/grech-hero.mp4" type="video/mp4" />
    </video>
  );
}
