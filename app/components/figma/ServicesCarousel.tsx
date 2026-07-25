"use client";

import Carousel from "./Carousel";

/* Mobile-only carousel for the "Crafted Around Your Story" services row.
   Reconstructs the six cards (icon · title · underline · image · description)
   inside the shared <Carousel> (auto-slide, buttons, swipe + snap). */

export type SvcCard = { icon: string; title: string; img: string; desc: string };

const CARD_W = 280, IMG_H = 240, CARD_H = 440;
const GOLD = "#9c7430";

/* eslint-disable @next/next/no-img-element */
export default function ServicesCarousel({
  cards, x, y, viewportW,
}: { cards: SvcCard[]; x: number; y: number; viewportW: number }) {
  return (
    <Carousel x={x} y={y} viewportW={viewportW} cardW={CARD_W} cardH={CARD_H} count={cards.length} arrowTop={20 + IMG_H / 2}
      renderCard={(i) => {
        const c = cards[i];
        return (
          <>
            <img src={c.icon} alt="" style={{ position: "absolute", left: (CARD_W - 48) / 2, top: 0, width: 48, height: 48, objectFit: "contain" }} />
            <div style={{ position: "absolute", top: 64, left: 0, width: CARD_W, textAlign: "center", fontFamily: "var(--font-cormorant), serif", fontSize: 24, fontWeight: 400, fontVariant: "small-caps", color: "#f8f3ea", lineHeight: "26px" }}>{c.title}</div>
            <div style={{ position: "absolute", top: 97, left: (CARD_W - 41) / 2, width: 41, height: 1, background: GOLD }} />
            <img src={c.img} alt={c.title} style={{ position: "absolute", top: 114, left: 0, width: CARD_W, height: IMG_H, objectFit: "cover", borderRadius: 12 }} />
            <div style={{ position: "absolute", top: 371, left: 0, width: CARD_W, padding: "0 8px", textAlign: "center", fontFamily: "var(--font-manrope), sans-serif", fontSize: 14, fontWeight: 500, color: "#cfc6b8", lineHeight: "22px", whiteSpace: "pre-line" }}>{c.desc}</div>
          </>
        );
      }}
    />
  );
}
