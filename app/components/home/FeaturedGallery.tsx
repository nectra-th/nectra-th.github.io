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
      className="flex h-11 w-11 items-center justify-center rounded-full border border-cream-light/30 bg-ink/45 text-cream-light backdrop-blur transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-ink"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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
      {/* main image */}
      <div className="relative aspect-[850/520] w-full overflow-hidden rounded-2xl">
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
        <div className="absolute bottom-4 right-4 flex gap-2.5">
          <Arrow dir="left" onClick={prev} />
          <Arrow dir="right" onClick={next} />
        </div>
      </div>

      {/* thumbnails */}
      <div className="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto">
        {IMAGES.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`View creation ${i + 1}`}
            aria-current={active === i}
            className={`relative aspect-[187/158] w-[23%] shrink-0 overflow-hidden rounded-lg transition-all duration-300 ${
              active === i ? "opacity-100 outline outline-2 outline-offset-[-2px] outline-gold" : "opacity-70 hover:opacity-100"
            }`}
          >
            <Image src={src} alt="" fill sizes="140px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
