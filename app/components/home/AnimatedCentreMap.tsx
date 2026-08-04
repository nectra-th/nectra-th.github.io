"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { DotLottie as DotLottiePlayer } from "@lottiefiles/dotlottie-web";

/* Animated Fulham Gardens centre map (art-supplied dotLottie: gold GJ hexagon
   + pulsing pin + five animated direction arrows, 10s loop, pure vectors).

   Rendered with @lottiefiles/dotlottie-web — the official ThorVG/WASM player.
   NOT lottie-web: this particular export loads there without error but every
   path stays empty (verified against both its svg and canvas renderers), so
   the official player is a requirement, not a preference.

   Cost control: this component only mounts when the "Shopping Centre Map"
   tab is opened, and the player module + ~1.8MB wasm (≈600KB compressed,
   cached after first load) are dynamically imported inside the effect — the
   homepage bundle carries none of it. The old static PNG renders underneath
   as an instant poster and the canvas fades in over it on first frame.
   prefers-reduced-motion holds a complete still frame instead of looping. */
export default function AnimatedCentreMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    let player: DotLottiePlayer | null = null;
    let io: IntersectionObserver | null = null;

    (async () => {
      const { DotLottie } = await import("@lottiefiles/dotlottie-web");
      if (cancelled) return;
      DotLottie.setWasmUrl("/assets/dotlottie-player.wasm");
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      player = new DotLottie({
        canvas,
        src: "/assets/grech-centre-map.lottie",
        loop: true,
        autoplay: false,
        layout: { fit: "cover", align: [0.5, 0.5] },
      });
      player.addEventListener("load", () => {
        if (cancelled || !player) return;
        if (reduced) player.setFrame(150);
        else player.play();
        setReady(true);
      });
      if (!reduced) {
        // pause the loop while scrolled out of view
        io = new IntersectionObserver(([e]) => {
          if (!player) return;
          if (e.isIntersecting) player.play(); else player.pause();
        }, { threshold: 0.2 });
        io.observe(canvas);
      }
    })();

    return () => { cancelled = true; io?.disconnect(); player?.destroy(); };
  }, []);

  return (
    <>
      <Image
        src="/assets/figma-img/shopping-centre-map.png"
        alt=""
        aria-hidden
        fill
        sizes="(min-width: 1024px) 32vw, 90vw"
        className="object-cover"
      />
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Fulham Gardens shopping centre map with Grech Jewellers highlighted and animated directions to the store"
        className="absolute inset-0 h-full w-full transition-opacity duration-500"
        style={{ opacity: ready ? 1 : 0 }}
      />
    </>
  );
}
