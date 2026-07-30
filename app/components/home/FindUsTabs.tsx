"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

/* Find Us tab bar + swapping main view. Tab 0 = store photo, tab 1 = the Figma
   shopping-centre floor-plan, tab 2 = a live Google Maps embed. The directions
   panel (passed in) sits beside the view and is the same across tabs. */

const GOOGLE_EMBED =
  "https://maps.google.com/maps?q=Grech%20Jewellers%20457%20Tapleys%20Hill%20Road%20Fulham%20Gardens%20SA%205024&z=16&output=embed";

const TABS = [
  { label: "Our Store", icon: "/assets/icons/tab-store.svg" },
  { label: "Shopping Centre Map", icon: "/assets/icons/tab-map.svg" },
  { label: "Google Maps", icon: "/assets/icons/tab-pin.svg" },
];

function TabIcon({ src, active }: { src: string; active: boolean }) {
  return (
    <span
      aria-hidden
      className="h-[18px] w-[18px]"
      style={{
        backgroundColor: active ? "var(--color-gold)" : "#403b37",
        WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
        WebkitMaskSize: "contain", maskSize: "contain",
        WebkitMaskPosition: "center", maskPosition: "center",
      }}
    />
  );
}

export default function FindUsTabs({ directions }: { directions: ReactNode }) {
  const [tab, setTab] = useState(0);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = e.key === "ArrowRight" ? (tab + 1) % TABS.length : (tab - 1 + TABS.length) % TABS.length;
    setTab(next);
    document.getElementById(`findus-tab-${next}`)?.focus();
  };
  return (
    <div>
      {/* tab bar */}
      <div role="tablist" aria-label="Find us" onKeyDown={onKey} className="flex flex-col gap-3 border-b border-divider pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
        {TABS.map((t, i) => {
          const active = tab === i;
          return (
            <button
              key={t.label}
              id={`findus-tab-${i}`}
              role="tab"
              aria-selected={active}
              aria-controls="findus-panel"
              tabIndex={active ? 0 : -1}
              onClick={() => setTab(i)}
              className={`flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.06em] transition-colors duration-300 ${
                active ? "text-gold" : "text-ink-text/70 hover:text-ink-text"
              }`}
            >
              <TabIcon src={t.icon} active={active} />
              <span className={active ? "border-b-2 border-gold pb-0.5" : "pb-0.5"}>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* view + directions */}
      <div id="findus-panel" role="tabpanel" aria-labelledby={`findus-tab-${tab}`} className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="relative aspect-[16/11] w-full overflow-hidden rounded-xl bg-ink-2">
          {tab === 0 && <Image src="/assets/findus-store.jpg" alt="Inside the Grech Jewellers showroom" fill sizes="(min-width: 1024px) 55vw, 90vw" className="object-cover" />}
          {tab === 1 && <Image src="/assets/figma-img/shopping-centre-map.png" alt="Fulham Gardens shopping centre map with Grech Jewellers highlighted" fill sizes="(min-width: 1024px) 55vw, 90vw" className="object-cover" />}
          {tab === 2 && (
            <iframe title="Grech Jewellers location on Google Maps" src={GOOGLE_EMBED} loading="lazy" className="h-full w-full border-0" />
          )}
        </div>
        {directions}
      </div>
    </div>
  );
}
