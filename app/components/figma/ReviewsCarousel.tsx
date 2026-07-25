"use client";

import Carousel from "./Carousel";

/* Mobile-only carousel for the "What Our Clients Say" testimonial row.
   Reconstructs the quote cards (gold quote mark · body · author) inside the
   shared <Carousel> (auto-slide, buttons, swipe + snap). */

export type Review = { text: string; author: string };

const CARD_W = 296, CARD_H = 232;

export default function ReviewsCarousel({
  reviews, x, y, viewportW,
}: { reviews: Review[]; x: number; y: number; viewportW: number }) {
  return (
    <Carousel x={x} y={y} viewportW={viewportW} cardW={CARD_W} cardH={CARD_H} count={reviews.length} gap={12} pad={47}
      renderCard={(i) => {
        const r = reviews[i];
        return (
          <div style={{ width: CARD_W, height: CARD_H, background: "#f3eddf", border: "1px solid #d8cbb7", borderRadius: 8, position: "relative" }}>
            <div style={{ position: "absolute", left: 16, top: 4, fontFamily: "var(--font-cormorant), serif", fontSize: 64, fontWeight: 700, color: "#9c7430", lineHeight: "58px" }} aria-hidden>&ldquo;</div>
            <div style={{ position: "absolute", left: 51, top: 24, width: 229, fontFamily: "var(--font-manrope), sans-serif", fontSize: 12, fontWeight: 500, color: "#403b37", lineHeight: "24px" }}>{r.text}</div>
            <div style={{ position: "absolute", left: 51, top: 184, fontFamily: "var(--font-manrope), sans-serif", fontSize: 12, fontWeight: 500, color: "#2e2926", lineHeight: "24px" }}>{r.author}</div>
          </div>
        );
      }}
    />
  );
}
