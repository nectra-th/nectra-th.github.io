"use client";

import { useState } from "react";

/* Interactive featured-creations carousel, sized to fill the Figma "Gallery -
   Desktop" slot (850×726). Main viewport image + prev/next + a clipped,
   scrollable thumbnail strip. Clicking a thumbnail sets the main image. */

const THUMBS = [
  "/assets/figma-img/65f309ab217b0a54da7f69aa805c868bdeea725f.png",
  "/assets/figma-img/81d578de67f967d51b2236c979ea7972051da24b.png",
  "/assets/figma-img/2c63e483982c2795ce6bfb52aaa2beaa608229c5.png",
  "/assets/figma-img/633d28daa0a85b2f44a77bed4fa60769d9c5a3e5.png",
  "/assets/figma-img/47769d2a1b6ed1549bb63b255585b79185ae5985.png",
];

const THUMB_W = 187, THUMB_H = 195, GAP = 4, VISIBLE = 4;

/* eslint-disable @next/next/no-img-element */
export default function FeaturedGallery() {
  const [active, setActive] = useState(0);
  const [start, setStart] = useState(0);
  const maxStart = Math.max(0, THUMBS.length - VISIBLE);

  // keep the thumbnail strip scrolled so the active thumbnail is always visible
  // (incl. wrap-around: next past the last resets to the first)
  const showThumb = (idx: number) =>
    setStart((prev) => (idx < prev ? idx : idx >= prev + VISIBLE ? Math.min(maxStart, idx - VISIBLE + 1) : prev));
  const select = (idx: number) => { setActive(idx); showThumb(idx); };
  const prev = () => select((active - 1 + THUMBS.length) % THUMBS.length);
  const next = () => select((active + 1) % THUMBS.length);

  const arrowStyle: React.CSSProperties = {
    position: "absolute", top: 440, width: 56, height: 56,
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
    border: "none", background: "none", padding: 0,
  };

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* main viewport */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 850, height: 523, borderRadius: 16, overflow: "hidden", backgroundImage: `url(${THUMBS[active]})`, backgroundSize: "cover", backgroundPosition: "center", transition: "background-image 0.3s" }} />

      {/* prev / next — original Figma gallery buttons */}
      <button aria-label="Previous" onClick={prev}
        style={{ ...arrowStyle, left: 692 }}><img src="/assets/icons/gallery-arrow-left.svg" alt="" style={{ width: 56, height: 56 }} /></button>
      <button aria-label="Next" onClick={next}
        style={{ ...arrowStyle, left: 764 }}><img src="/assets/icons/gallery-arrow-right.svg" alt="" style={{ width: 56, height: 56 }} /></button>

      {/* thumbnail strip — clipped to the gallery box, scrolls with the arrows */}
      <div style={{ position: "absolute", top: 531, left: 0, width: 850, height: THUMB_H, overflow: "hidden" }}>
        <div style={{ display: "flex", gap: GAP, transform: `translateX(${-start * (THUMB_W + GAP)}px)`, transition: "transform 0.35s ease" }}>
          {THUMBS.map((src, i) => (
            <button key={i} onClick={() => select(i)}
              style={{
                flex: "0 0 auto", width: THUMB_W, height: THUMB_H, borderRadius: 12, cursor: "pointer",
                backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center",
                border: active === i ? "2px solid #b58a47" : "2px solid transparent",
                opacity: active === i ? 1 : 0.85, transition: "opacity 0.2s, border-color 0.2s", padding: 0,
              }} />
          ))}
        </div>
      </div>
    </div>
  );
}
