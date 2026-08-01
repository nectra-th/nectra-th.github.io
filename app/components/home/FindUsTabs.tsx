"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

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
      // backgroundColor lives in className (not inline) so group-hover can
      // reach it — an inline style would win over the hover class every time.
      // md:h-4/w-4: the tablet frame's own verified icon size (16px, down
      // from 24px) — this was still rendering at the desktop size below lg.
      className={`h-6 w-6 transition-colors duration-300 md:h-4 md:w-4 lg:h-6 lg:w-6 ${active ? "bg-gold" : "bg-[#403b37] group-hover:bg-gold"}`}
      style={{
        WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
        WebkitMaskSize: "contain", maskSize: "contain",
        WebkitMaskPosition: "center", maskPosition: "center",
      }}
    />
  );
}

export default function FindUsTabs({ directions, firstTime }: { directions: ReactNode; firstTime: ReactNode }) {
  const [tab, setTab] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  // Google Maps tab: the view should go full-width instead of sitting in the
  // narrow 610fr column, but keep the SAME height it already has there — not
  // grow taller just because it's wider. aspect-[610/348] can't express that
  // (it re-derives height from whatever width it's given), so once spanning
  // all 3 columns we switch to an explicit px height computed from the
  // panel's own width: (panelWidth - the two 24px column gaps) * 348/1091,
  // i.e. exactly the height the narrow 610fr column would have produced.
  // Only applies at lg (1024px+) — below that the grid is already a single
  // full-width column, so the normal aspect-ratio box is already correct.
  const [mapHeight, setMapHeight] = useState<number | null>(null);
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const GAP = 48;
    const RATIO = 348 / 1091;
    const update = () => {
      if (window.innerWidth < 1024) { setMapHeight(null); return; }
      setMapHeight(Math.round((panel.clientWidth - GAP) * RATIO));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = e.key === "ArrowRight" ? (tab + 1) % TABS.length : (tab - 1 + TABS.length) % TABS.length;
    setTab(next);
    document.getElementById(`findus-tab-${next}`)?.focus();
  };
  return (
    <div>
      {/* tab bar — no border here (Figma has none under the tab row itself,
         only the active tab's own underline); row is 70px tall at lg (48px
         at the tablet frame) with content centered, no side padding and no
         gap between tabs from md on (Figma: Frame233 has zero of its own
         padding at both sizes — the padding I measured earlier was just
         centering math for the content group inside the fixed-height row).
         md:py-[13px]: read directly off "Store Tab"'s own paddingTop/Bottom
         in the Figma data (13.01px) — my first pass back-computed this from
         the row's total height instead of using the stated value, and
         landed 4px short, which is what made the tab text sit closer to
         the card's top edge than the real design. */}
      <div role="tablist" aria-label="Find us" onKeyDown={onKey} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-2 sm:px-6 md:gap-0 md:px-0 md:py-[13px] lg:py-[19px]">
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
              className={`group flex items-center justify-center text-[16px] uppercase tracking-[0.06em] transition-colors duration-300 sm:flex-1 md:text-[11px] lg:text-[16px] ${
                active ? "font-bold text-gold" : "font-medium text-[#403b37] hover:text-gold"
              }`}
            >
              {/* the gold underline spans icon + label together (Figma:
                 147px, matching the whole content group's own width), not
                 just the text. */}
              <span className={`flex items-center gap-2.5 pb-0.5 md:gap-[5px] lg:gap-2.5 ${active ? "border-b-2 border-gold" : ""}`}>
                <TabIcon src={t.icon} active={active} />
                <span>{t.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* content below — 16px side padding, no top padding (starts
         immediately at the tab bar's bottom border, per Figma). The info
         row (a sibling after this component) carries its own matching
         side padding + the bottom padding + the 20px gap up to here.
         md:px-[11px]: Figma's tablet frame ("Frame 236") pads this at
         10.96px, not the 24px inherited from sm — that extra padding was
         narrowing the whole 3-column row (photo included), which is why
         the photo rendered shorter than Figma even though its own
         aspect-ratio math was already correct. */}
      <div className="px-4 sm:px-6 md:px-[11px] lg:px-4">
        {/* view + directions + first-time card — Figma lays these out as 3
           side-by-side columns (610fr/203fr/278fr, 24px gaps at lg) — and
           the tablet artboard confirms the SAME fr ratio already applies at
           md (just a tighter 16px gap), not a single stacked column like
           this used to render between 768–1023px. */}
        {/* md:mt-[14px]: Figma's "Store Map Container" carries its own
           14.4px top padding (not the desktop 24px gap) between the tab
           row and this content — another few px that was inflating the
           card's total height at tablet. */}
        <div id="findus-panel" ref={panelRef} role="tabpanel" aria-labelledby={`findus-tab-${tab}`} className="mt-6 grid gap-6 md:mt-[14px] md:grid-cols-[610fr_203fr_278fr] md:gap-4 lg:mt-6 lg:gap-6">
          <div
            className={`relative aspect-[610/348] w-full overflow-hidden rounded-xl border border-divider bg-ink-2 shadow-[0_6px_8.6px_rgba(20,19,18,0.1)] ${tab === 2 ? "lg:col-span-3" : ""}`}
            style={tab === 2 && mapHeight != null ? { height: mapHeight } : undefined}
          >
            {tab === 0 && <Image src="/assets/findus-store.png" alt="Inside the Grech Jewellers showroom" fill sizes="(min-width: 1024px) 32vw, 90vw" className="object-cover" />}
            {tab === 1 && <Image src="/assets/figma-img/shopping-centre-map.png" alt="Fulham Gardens shopping centre map with Grech Jewellers highlighted" fill sizes="(min-width: 1024px) 32vw, 90vw" className="object-cover" />}
            {tab === 2 && (
              <iframe title="Grech Jewellers location on Google Maps" src={GOOGLE_EMBED} loading="lazy" className="h-full w-full border-0" />
            )}
          </div>
          {/* hidden on the Google Maps tab — the map takes the full width
             in their place instead of pushing them below it. */}
          {tab !== 2 && <div className="lg:col-start-2">{directions}</div>}
          {tab !== 2 && <div className="lg:col-start-3">{firstTime}</div>}
        </div>
      </div>
    </div>
  );
}
