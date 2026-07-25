import type { ReactNode } from "react";
import iconsMap from "@/app/generated/icons.map.json";
import FigmaSection, { type FigSection } from "./FigmaSection";
import BookingWidget from "./BookingWidget";
import FeaturedGallery from "./FeaturedGallery";
import FindUsTabs from "./FindUsTabs";
import { Instagram, Facebook } from "../icons";

const ICONS = iconsMap as { byName: Record<string, string>; byId: Record<string, string> };

type Layout = { width: number; height: number; sections: FigSection[] };

/* eslint-disable @next/next/no-img-element */
const img = (src: string, alt = ""): ReactNode => (
  <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
);

// booking-widget slot ids per breakpoint (mobile stacks; tablet scales the
// fixed 1180px 3-column card down to its 807px island)
const BOOKING_IDS: Record<string, { stacked: boolean; w: number }> = {
  "1:3907": { stacked: false, w: 1180 },
  "1:5197": { stacked: false, w: 807 },
  "1:4641": { stacked: true, w: 374 },
};
// footer-logo lockup slot ids per breakpoint
const FOOTER_LOGO_IDS = ["1:3837", "1:5472", "1:4516"];

function buildIslands(): Record<string, ReactNode> {
  const islands: Record<string, ReactNode> = {
    "Logo - Grech Big": img("/assets/logo-header.svg", "Grech Jewellers"),
    "1:4861": img("/assets/logo-header.svg", "Grech Jewellers"), // tablet header logo
    "1:4803": img("/assets/logo-header.svg", "Grech Jewellers"), // mobile header logo
    "Navigation / CTA / DESKTOP": (
      <a href="#book" style={{
        display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%",
        border: "1px solid #b58a47", borderRadius: 2, fontFamily: "var(--font-manrope), sans-serif",
        fontSize: 14, fontWeight: 500, letterSpacing: "0.04em", color: "#f8f3ea",
        textDecoration: "none", textTransform: "uppercase",
      }}>Book a Consultation</a>
    ),
  };
  for (const [name, src] of Object.entries(ICONS.byName)) islands[name] = img(src);
  for (const [id, src] of Object.entries(ICONS.byId)) islands[id] = img(src);
  for (const [id, cfg] of Object.entries(BOOKING_IDS)) islands[id] = <BookingWidget stacked={cfg.stacked} cardWidth={cfg.w} />;
  for (const id of FOOTER_LOGO_IDS) islands[id] = img("/assets/logo-footer.svg", "Grech Jewellers");
  islands["1:4186"] = <FeaturedGallery />; // featured creations carousel (desktop)
  // footer social row — gold-outlined circles with gold Instagram/Facebook glyphs
  const socialCircle = (icon: ReactNode, label: string, href: string) => (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} style={{
      display: "flex", alignItems: "center", justifyContent: "center", width: 48, height: 48,
      borderRadius: "50%", border: "1.5px solid #b58a47", color: "#b58a47",
    }}>{icon}</a>
  );
  islands["1:3864"] = (
    <div style={{ display: "flex", alignItems: "center", gap: 24, width: "100%", height: "100%" }}>
      {socialCircle(<Instagram style={{ width: 20, height: 20 }} />, "Instagram", "https://www.instagram.com/grechjewellers/")}
      {socialCircle(<Facebook style={{ width: 11, height: 20 }} />, "Facebook", "https://www.facebook.com/grechjewellery")}
    </div>
  );
  return islands;
}

const MAP_URL = "https://www.google.com/maps/search/?api=1&query=Grech+Jewellers+457+Tapleys+Hill+Road+Fulham+Gardens+SA+5024";

function linkFor(text: string): { href: string; external?: boolean } | null {
  const raw = text.trim();
  // Phone number → tel: so tapping it on mobile opens the dialer. Matches the
  // showroom number "(08) 8356 7764" in any standalone node (NEED HELP / info bar),
  // but not the combined phone+email footer node (has "@").
  if (!raw.includes("@") && /83567764$/.test(raw.replace(/\D/g, ""))) return { href: "tel:+61883567764" };
  // Standalone email → mailto:
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(raw)) return { href: `mailto:${raw}` };
  const t = raw.toUpperCase().replace(/\s*›?\s*>?$/, "");
  if (t === "WHY GRECH" || t === "ABOUT") return { href: "#why" };
  if (t === "WHAT WE DO" || t === "SERVICES") return { href: "#whatwedo" };
  if (t === "OUR PROCESS" || t === "PROCESS") return { href: "#process" };
  if (t === "OUR CREATIONS" || t === "SEE OUR WORK" || t === "CREATIONS") return { href: "#featured" };
  if (t === "CONTACT") return { href: "#findus" };
  if (t.includes("BOOK A CONSULTATION") || t.includes("START A CONVERSATION")) return { href: "#book" };
  if (t.includes("LAUNCH NAVIGATION")) return { href: MAP_URL, external: true };
  // note: "GOOGLE MAPS" / "OUR STORE" / "SHOPPING CENTRE MAP" are interactive Find Us tabs (FindUsTabs), not links
  return null;
}

/* Transparent <a> overlays so every button / nav item jumps to its section
   (or opens the map). Positioned in stage coords via each node's yAbs; buttons
   expand to their containing "Button" rect so the whole button is clickable. */
function buildLinkOverlays(layout: Layout): ReactNode[] {
  const out: ReactNode[] = [];
  for (const s of layout.sections) {
    const rects = s.nodes.filter((n) => n.render === "rect" && /Button/.test(n.name));
    for (const n of s.nodes) {
      if (n.render !== "text" || !n.text) continue;
      const link = linkFor(n.text.characters);
      if (!link) continue;
      const cx = n.x + n.w / 2;
      const r = rects.find((b) => cx >= b.x && cx <= b.x + b.w && n.yAbs >= b.yAbs - 30 && n.yAbs <= b.yAbs + b.h + 12);
      const box = r ? { x: r.x, y: r.yAbs, w: r.w, h: r.h } : { x: n.x - 8, y: n.yAbs - 6, w: n.w + 16, h: n.h + 12 };
      out.push(
        <a key={`${s.name}-${n.key}`} href={link.href} aria-label={n.text.characters.trim()}
          {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          style={{ position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h, zIndex: 9000, cursor: "pointer" }} />
      );
    }
  }
  return out;
}

// #book / #findus anchors (both live inside the "closing" section)
function anchorY(layout: Layout, re: RegExp): number | null {
  for (const s of layout.sections) for (const n of s.nodes)
    if (n.render === "text" && n.text && re.test(n.text.characters)) return n.yAbs;
  return null;
}

// geometry for the interactive Find Us tabs. Beyond the tab rects + store-photo
// region we also pull each tab's icon + text label and the baked active underline
// so the tabs can swap gold/dark + move the (name-width) underline dynamically —
// the matching transpiled nodes are collected into `hide` and skipped on render.
function iconSrc(id: string) {
  return ICONS.byId[id] || `/assets/figma/${id.replace(/[:;]/g, "_")}.svg`;
}
function findUsGeom(layout: Layout) {
  const nodes = layout.sections.flatMap((s) => s.nodes);
  const tabRects = ["Store Tab", "Centre Map Tab", "Google Tab"].map((nm) => nodes.find((n) => n.render === "rect" && n.name === nm));
  const img = nodes.find((n) => n.render === "image" && n.name === "Grech-J-Shop-Curent 2");
  if (tabRects.some((t) => !t) || !img) return null;
  const rects = tabRects.map((t) => t!);

  const hide = new Set<string>();
  const inRect = (n: FigSection["nodes"][number], r: (typeof rects)[number]) => {
    const cx = n.x + n.w / 2;
    return cx >= r.x && cx <= r.x + r.w && n.yAbs >= r.yAbs - 4 && n.yAbs <= r.yAbs + r.h + 4;
  };
  const labels = rects.map((r) => {
    const text = nodes.find((n) => n.render === "text" && n.text && inRect(n, r));
    const icon = nodes.find((n) => n.render === "vector" && n.w > 3 && n.h > 3 && inRect(n, r));
    if (text) hide.add(text.id);
    if (icon) hide.add(icon.id);
    return {
      text: text ? { chars: text.text!.characters, x: text.x, y: text.yAbs, w: text.w, h: text.h, size: text.text!.fontSize ?? 16, lh: text.text!.lineHeightPx ?? 24 } : null,
      icon: icon ? { src: iconSrc(icon.id), x: icon.x, y: icon.yAbs, w: icon.w, h: icon.h } : null,
    };
  });

  // baked active underline: a thin gold rule just under the label row, centred on a tab
  const r0 = rects[0];
  const uNode = nodes.find((n) => (n.render === "rect" || n.render === "line" || n.render === "vector") &&
    n.h <= 3 && n.w > 20 && n.w < r0.w &&
    n.yAbs > r0.yAbs && n.yAbs < r0.yAbs + r0.h + 12 &&
    rects.some((t) => Math.abs(n.x + n.w / 2 - (t.x + t.w / 2)) < t.w / 2));
  if (uNode) hide.add(uNode.id);
  const underline = uNode
    ? { w: uNode.w, y: uNode.yAbs, h: Math.max(2, uNode.h) }
    : { w: Math.min(147, r0.w * 0.5), y: r0.yAbs + r0.h - 6, h: 2 };

  return {
    tabs: rects.map((t) => ({ x: t.x, y: t.yAbs, w: t.w, h: t.h })),
    image: { x: img.x, y: img.yAbs, w: img.w, h: img.h },
    labels,
    underline,
    hide,
  };
}

export default function FigmaPage({ layout, background = "#ede5d7" }: { layout: Layout; background?: string }) {
  const islands = buildIslands();
  const bookY = anchorY(layout, /Book A Design Consultation|Every Meaningful/i);
  const findusY = anchorY(layout, /^Find Us$/i);
  const findUs = findUsGeom(layout);
  const hidden = findUs?.hide ?? new Set<string>();
  return (
    <div style={{ width: layout.width, margin: "0 auto", position: "relative", background, overflow: "visible" }}>
      {layout.sections.map((s) => (
        <FigmaSection key={s.name} section={s} islands={islands} hidden={hidden} width={layout.width} />
      ))}
      {bookY != null && <div id="book" style={{ position: "absolute", top: bookY - 120, left: 0, width: 1, height: 1, scrollMarginTop: 100 }} />}
      {findusY != null && <div id="findus" style={{ position: "absolute", top: findusY - 120, left: 0, width: 1, height: 1, scrollMarginTop: 100 }} />}
      {findUs && <FindUsTabs tabs={findUs.tabs} image={findUs.image} labels={findUs.labels} underline={findUs.underline} />}
      {buildLinkOverlays(layout)}
    </div>
  );
}
