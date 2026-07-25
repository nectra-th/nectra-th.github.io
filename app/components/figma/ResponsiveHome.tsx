"use client";

import { useEffect, useState, type ReactNode } from "react";

/* Picks the Figma artboard that matches the viewport (mobile 390 / tablet 834 /
   desktop 1920) and scales it to fill the viewport width — the standard way to
   present fixed-width pixel-perfect artboards responsively. Only the active
   breakpoint is mounted. Scale is capped at 1 so artboards never upscale past
   their design size (desktop centres on very wide screens). */

type Stage = { node: ReactNode; width: number; height: number };

export default function ResponsiveHome({
  desktop, tablet, mobile,
}: {
  desktop: Stage; tablet: Stage; mobile: Stage;
}) {
  const [vw, setVw] = useState<number | null>(null);

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // pre-hydration / SSR: render desktop unscaled to keep markup stable
  if (vw === null) {
    return (
      <div style={{ width: desktop.width, margin: "0 auto", overflow: "hidden" }}>{desktop.node}</div>
    );
  }

  const stage: Stage = vw < 700 ? mobile : vw < 1200 ? tablet : desktop;
  const scale = Math.min(1, vw / stage.width);

  return (
    <div style={{ width: "100%", overflowX: "hidden", display: "flex", justifyContent: "center" }}>
      {/* wrapper reserves the scaled layout box; overflow is NOT clipped here so
          full-bleed backgrounds & bleeding images can extend past the centred
          content (the outer div clips them at the viewport edges). */}
      <div style={{ width: stage.width * scale, height: stage.height * scale, position: "relative" }}>
        <div style={{ width: stage.width, height: stage.height, transform: `scale(${scale})`, transformOrigin: "top left" }}>
          {stage.node}
        </div>
      </div>
    </div>
  );
}
