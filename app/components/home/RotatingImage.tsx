"use client";

import { useEffect, useState } from "react";

/* Crossfades a stack of background images inside a positioned, clipped parent:
   each layer fades in/out so the photo swaps every `intervalMs` with a `fadeMs`
   crossfade. Used for the "David Ring" media card, which cycles three rings. */
export default function RotatingImage({
  srcs, intervalMs = 3000, fadeMs = 1000, bgSize = "cover", bgPos = "center",
}: {
  srcs: string[]; intervalMs?: number; fadeMs?: number; bgSize?: string; bgPos?: string;
}) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (srcs.length < 2) return;
    // honour reduced-motion: hold on the first image, no cycling
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % srcs.length), intervalMs);
    return () => clearInterval(t);
  }, [srcs.length, intervalMs]);

  return (
    <>
      {srcs.map((src, i) => (
        <div key={src + i} aria-hidden style={{
          position: "absolute", inset: 0, backgroundImage: `url(${src})`,
          backgroundSize: bgSize, backgroundPosition: bgPos, backgroundRepeat: "no-repeat",
          opacity: i === idx ? 1 : 0, transition: `opacity ${fadeMs}ms ease-in-out`,
        }} />
      ))}
    </>
  );
}
