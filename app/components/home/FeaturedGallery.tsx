"use client";

import Image from "next/image";
import { useState } from "react";

/* Fluid featured-creations slider: a large active image, prev/next controls, and
   a scrollable thumbnail strip (active thumb gets a gold ring). Fills its
   container — no absolute coordinates. */

const IMAGES = [
  "/assets/figma-img/65f309ab217b0a54da7f69aa805c868bdeea725f.png",
  "/assets/figma-img/81d578de67f967d51b2236c979ea7972051da24b.png",
  "/assets/figma-img/2c63e483982c2795ce6bfb52aaa2beaa608229c5.png",
  "/assets/figma-img/633d28daa0a85b2f44a77bed4fa60769d9c5a3e5.png",
  "/assets/figma-img/47769d2a1b6ed1549bb63b255585b79185ae5985.png",
];

function Arrow({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "left" ? "Previous creation" : "Next creation"}
      /* Figma's "Gallery UI Button" has 3 real states, confirmed via the
         component sheet: Default (fill #211f1c @55%, stroke #625b52, icon
         #efe6d6) → Hover (fill #211f1c @100%, stroke #9c7430 gold-dark, icon
         STILL #efe6d6 — not inverted to a solid gold chip) → Active (same
         fill/stroke as hover, icon also turns #9c7430). */
      className="flex h-14 w-14 items-center justify-center rounded border border-body-2 bg-ink-2/55 text-cream-alt backdrop-blur transition-colors duration-300 hover:border-gold-dark hover:bg-ink-2 active:border-gold-dark active:bg-ink-2 active:text-gold-dark"
    >
      <svg width="15" height="27" viewBox="0 0 15 27" fill="none" aria-hidden>
        <path d={dir === "left" ? "M13 2L2 13.5L13 25" : "M2 2L13 13.5L2 25"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export default function FeaturedGallery() {
  const [active, setActive] = useState(0);
  const prev = () => setActive((a) => (a - 1 + IMAGES.length) % IMAGES.length);
  const next = () => setActive((a) => (a + 1) % IMAGES.length);

  return (
    <div>
      {/* main image — Figma's viewport is 850x523, cornerRadius 16, 1px #39342e border */}
      <div className="relative aspect-[850/523] w-full overflow-hidden rounded-2xl border border-[#39342e]">
        {IMAGES.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt="Featured Grech Jewellers custom creation"
            aria-hidden={i !== active}
            fill
            priority={i === 0}
            sizes="(min-width: 1024px) 62vw, 92vw"
            className="object-cover transition-opacity duration-500"
            style={{ opacity: i === active ? 1 : 0 }}
          />
        ))}
        {/* Figma's arrow pair sits ~30px from the right edge, ~27px from the bottom */}
        <div className="absolute bottom-[27px] right-[30px] flex gap-4">
          <Arrow dir="left" onClick={prev} />
          <Arrow dir="right" onClick={next} />
        </div>
      </div>

      {/* thumbnails — Figma: 187x195 each, ~8px below the viewport, tight ~4-5px
         gaps, cornerRadius ~4px, 1px border. This is a real Default/Selected
         component variant: border is #39342e at rest, swapping to gold-dark
         when selected — a plain colour swap, nothing else. Only border-color
         transitions (not `transition-all`/opacity) so nothing else animates
         alongside it and the image never visibly shifts. */}
      <div className="no-scrollbar mt-2 flex gap-1 overflow-x-auto">
        {IMAGES.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`View creation ${i + 1}`}
            aria-current={active === i}
            className={`relative aspect-[187/195] w-[22%] shrink-0 overflow-hidden rounded border transition-[border-color] duration-300 ${
              active === i ? "border-gold-dark" : "border-[#39342e] hover:border-gold"
            }`}
          >
            <Image src={src} alt="" fill sizes="140px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
