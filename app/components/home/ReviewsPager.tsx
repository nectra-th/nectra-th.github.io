"use client";

import { useState } from "react";
import { TestimonialCard, type Review } from "./Reviews";

/* Desktop 3-across grid, paged 3-reviews-per-page. Figma's dot pager (Frame
   302/303) has exactly 3 dots regardless of review count, so with 9 reviews
   that's 3 pages of 3 — dots switch pages rather than pointing at individual
   cards. */
export default function ReviewsPager({ reviews }: { reviews: Review[] }) {
  const pageSize = 3;
  const pages: Review[][] = [];
  for (let i = 0; i < reviews.length; i += pageSize) pages.push(reviews.slice(i, i + pageSize));
  const [page, setPage] = useState(0);

  return (
    <>
      {/* desktop: 3 across — Figma's real cards row is a 1448px band (inset
         236px symmetric on the 1920 canvas), wider than the standard 1180
         Container used everywhere else, so it gets its own width here
         instead of going through <Container>. max-w is 1448 + the lg:px-8
         (32px/side) safety padding, so the grid itself lands at exactly
         1448px once there's room — not 1448 minus the padding. */}
      <div
        className="mx-auto hidden w-full max-w-[1512px] px-8 lg:mt-14 lg:grid lg:grid-cols-3 lg:gap-4"
        aria-live="polite"
      >
        {pages[page].map((r, i) => <TestimonialCard key={i} r={r} />)}
      </div>

      {/* dot pager below the desktop row too (Figma "Frame 302/303" — 3× 12px
         dots, 12px gap, first one gold-dark/active, others #d9d9d9), not just
         the tablet/mobile carousel's own pager. Frame 302 (y=7152) sits 10px
         below the cards row (bottom y=7142) but is itself a 15px-padded
         wrapper around Frame 303 (y=7167) — so the dots' true visual gap
         from the cards is 10+15=25px, not 10. */}
      {pages.length > 1 && (
        <div className="hidden lg:mt-[25px] lg:flex lg:justify-center lg:gap-3">
          {pages.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to reviews page ${i + 1} of ${pages.length}`}
              aria-current={page === i}
              onClick={() => setPage(i)}
              className={`h-3 w-3 rounded-full transition-colors duration-300 ${i === page ? "bg-gold-dark" : "bg-[#d9d9d9]"}`}
            />
          ))}
        </div>
      )}
    </>
  );
}
