"use client";

import { useState } from "react";

type Box = { x: number; y: number; w: number; h: number };
type Label = {
  text: { chars: string; x: number; y: number; w: number; h: number; size: number; lh: number } | null;
  icon: { src: string; x: number; y: number; w: number; h: number } | null;
};
type Underline = { w: number; y: number; h: number };

/* Interactive Find Us tabs overlaid on the transpiled findus card. The tab
   labels (icon + text) and the active underline are re-rendered here so the
   selected tab turns gold + bold with a name-width underline, while the others
   stay dark — matching the Figma design (their transpiled counterparts are
   hidden by FigmaPage). Selecting a tab also swaps the main view:
   OUR STORE → transpiled store photo · SHOPPING CENTRE MAP → Figma floor-plan
   · GOOGLE MAPS → live Google Maps embed. */

const GOLD = "#b88c46";
const DARK = "#403b37";
const GOOGLE_EMBED = "https://maps.google.com/maps?q=Grech%20Jewellers%20457%20Tapleys%20Hill%20Road%20Fulham%20Gardens%20SA%205024&z=16&output=embed";

/* eslint-disable @next/next/no-img-element */
export default function FindUsTabs({ tabs, image, labels = [], underline }: { tabs: Box[]; image: Box; labels?: Label[]; underline?: Underline }) {
  const [active, setActive] = useState(0);
  const slot = { position: "absolute" as const, left: image.x, top: image.y, width: image.w, height: image.h, borderRadius: 12, zIndex: 8400, overflow: "hidden" };

  return (
    <>
      {/* re-rendered tab labels — icon (masked so it recolours) + text */}
      {labels.map((lb, i) => {
        const on = active === i;
        const color = on ? GOLD : DARK;
        return (
          <span key={`lbl-${i}`}>
            {lb.icon && (
              <span aria-hidden style={{
                position: "absolute", left: lb.icon.x, top: lb.icon.y, width: lb.icon.w, height: lb.icon.h, zIndex: 8450,
                backgroundColor: color,
                WebkitMaskImage: `url(${lb.icon.src})`, maskImage: `url(${lb.icon.src})`,
                WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
                WebkitMaskSize: "contain", maskSize: "contain",
                WebkitMaskPosition: "center", maskPosition: "center",
              }} />
            )}
            {lb.text && (
              <span style={{
                position: "absolute", left: lb.text.x, top: lb.text.y, width: lb.text.w, height: lb.text.h, zIndex: 8450,
                fontFamily: "var(--font-manrope), system-ui, sans-serif", fontSize: lb.text.size, lineHeight: `${lb.text.lh}px`,
                fontWeight: on ? 700 : 500, color, whiteSpace: "nowrap", letterSpacing: 0, textTransform: "uppercase",
              }}>{lb.text.chars}</span>
            )}
          </span>
        );
      })}

      {/* active underline — spans the selected tab's label (icon→text) plus the
         same ~12px padding the baked Figma underline uses, so every tab gets a
         name-width rule (not a full-width border) */}
      {(() => {
        if (!underline || !tabs[active]) return null;
        const lb = labels[active];
        let uw = underline.w, uLeft = tabs[active].x + tabs[active].w / 2 - underline.w / 2;
        if (lb?.text) {
          const left = lb.icon ? lb.icon.x : lb.text.x;
          const right = lb.text.x + lb.text.w;
          const pad = 12;
          uw = right - left + pad * 2;
          uLeft = left - pad;
        }
        return <div style={{ position: "absolute", top: underline.y, height: underline.h, width: uw, left: uLeft, background: GOLD, zIndex: 8450 }} />;
      })()}

      {/* transparent click targets over each tab */}
      {tabs.map((t, i) => (
        <button key={`tab-${i}`} onClick={() => setActive(i)} aria-pressed={active === i} aria-label={labels[i]?.text?.chars ?? `Tab ${i + 1}`}
          style={{ position: "absolute", left: t.x, top: t.y, width: t.w, height: t.h, zIndex: 8500, background: "transparent", border: "none", cursor: "pointer", padding: 0 }} />
      ))}

      {/* 1 = SHOPPING CENTRE MAP → the Figma floor-plan (Grech highlighted) */}
      {active === 1 && (
        <img src="/assets/figma-img/shopping-centre-map.png" alt="Shopping centre map" style={{ ...slot, objectFit: "cover" }} />
      )}
      {/* 2 = GOOGLE MAPS → live embed. A placeholder (card-colour fill + centred
         maps pin) sits under the iframe so the store photo never flashes while
         the map tiles load. */}
      {active === 2 && (
        <>
          <div style={{ ...slot, zIndex: 8399, background: "#f8f3ea", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span aria-hidden style={{
              width: 52, height: 52, backgroundColor: "rgba(64,59,55,0.35)",
              WebkitMaskImage: "url(/assets/icons/tab-pin.svg)", maskImage: "url(/assets/icons/tab-pin.svg)",
              WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskPosition: "center", maskPosition: "center",
            }} />
          </div>
          <iframe title="Store location map" src={GOOGLE_EMBED} loading="lazy" style={{ ...slot, border: 0, background: "transparent" }} />
        </>
      )}
    </>
  );
}
