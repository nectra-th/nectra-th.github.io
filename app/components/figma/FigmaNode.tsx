import type { CSSProperties, ReactNode } from "react";
import imagesMap from "@/app/generated/images.map.json";
import iconsMap from "@/app/generated/icons.map.json";

/* One transpiled Figma node → an absolutely-positioned element.
   Coordinates are section-relative (x, y already offset by section top). */

export type FigNode = {
  id: string;
  key: string;
  name: string;
  type: string;
  render: "text" | "image" | "rect" | "line" | "vector" | "ellipse" | "island" | "path";
  path?: { paths: { d: string; rule: "evenodd" | "nonzero" }[]; vw: number; vh: number; fill: string; fillOpacity: number };
  x: number; y: number; w: number; h: number;
  rotation?: number;
  opacity?: number;
  z?: number;
  radius?: number;
  radii?: number[];
  fill?: { hex: string; opacity: number };
  gradient?: { type: string; stops: { pos: number; hex: string; a: number }[]; handles?: { x: number; y: number }[] };
  stroke?: { hex: string; opacity: number; weight: number; align: string };
  effects?: { type: string; x?: number; y?: number; blur: number; spread?: number; hex?: string; a?: number }[];
  text?: {
    characters: string;
    runs?: { text: string; color: string | null }[] | null;
    fontFamily: string; fontWeight: number; fontSize: number;
    letterSpacing: number; lineHeightPx: number;
    align: string; valign: string; textCase?: string; textDecoration?: string;
    italic?: boolean; fill?: string; fillOpacity?: number;
  };
  image?: { imageRef: string; scaleMode: string; opacity?: number; transform?: number[][]; rotation?: number };
  componentId?: string;
  fullBleed?: boolean;
  bleedEdge?: "left" | "right";
};

const IMAP = imagesMap as Record<string, string>;
const ICONS = iconsMap as { byName: Record<string, string>; byId: Record<string, string> };
const r2 = (n: number) => Math.round(n * 100) / 100;

function fontStack(family?: string) {
  if (!family) return "var(--font-manrope), system-ui, sans-serif";
  if (/cormorant/i.test(family)) return "var(--font-cormorant), Georgia, serif";
  if (/manrope/i.test(family)) return "var(--font-manrope), system-ui, sans-serif";
  return `"${family}", system-ui, sans-serif`;
}

function boxShadow(effects?: FigNode["effects"]) {
  if (!effects) return undefined;
  return effects
    .filter((e) => e.type === "DROP_SHADOW" || e.type === "INNER_SHADOW")
    .map((e) => {
      const rgba = e.hex
        ? `rgba(${parseInt(e.hex.slice(1, 3), 16)},${parseInt(e.hex.slice(3, 5), 16)},${parseInt(e.hex.slice(5, 7), 16)},${e.a ?? 1})`
        : "rgba(0,0,0,0.2)";
      return `${e.type === "INNER_SHADOW" ? "inset " : ""}${e.x ?? 0}px ${e.y ?? 0}px ${e.blur ?? 0}px ${e.spread ?? 0}px ${rgba}`;
    })
    .join(", ") || undefined;
}

// Figma gradient → CSS linear-gradient (angle from the handle positions)
function gradientCss(g: NonNullable<FigNode["gradient"]>): string {
  const stops = g.stops.map((s) => {
    const r = parseInt(s.hex.slice(1, 3), 16), gg = parseInt(s.hex.slice(3, 5), 16), b = parseInt(s.hex.slice(5, 7), 16);
    return `rgba(${r},${gg},${b},${s.a}) ${Math.round(s.pos * 100)}%`;
  }).join(", ");
  let angle = 180;
  const h = g.handles;
  if (h && h.length >= 2) {
    const dx = h[1].x - h[0].x, dy = h[1].y - h[0].y;
    angle = Math.round((Math.atan2(dx, -dy) * 180) / Math.PI);
  }
  return `linear-gradient(${angle}deg, ${stops})`;
}

function radiusStyle(n: FigNode): string | undefined {
  if (n.radii && n.radii.length === 4) return n.radii.map((r) => `${r}px`).join(" ");
  if (n.radius) return `${n.radius}px`;
  return undefined;
}

// Figma TITLE case: capitalise the first letter of each whitespace-delimited
// word (NOT after apostrophes, so "Adelaide's" stays as-is). Done in JS because
// CSS `text-transform: capitalize` doesn't paint under `text-box-trim`.
const titleCase = (s: string) => s.replace(/(^|\s)(\p{L})/gu, (_m, ws, ch) => ws + ch.toUpperCase());

function textTransform(tc?: string): CSSProperties {
  switch (tc) {
    case "UPPER": return { textTransform: "uppercase" };
    case "LOWER": return { textTransform: "lowercase" };
    // TITLE is applied in JS (titleCase) — CSS `capitalize` doesn't paint under
    // `text-box-trim` and would wrongly uppercase after apostrophes (Adelaide's).
    case "TITLE": return {};
    case "SMALL_CAPS": return { fontVariant: "small-caps" };
    case "SMALL_CAPS_FORCED": return { fontVariant: "all-small-caps" as unknown as string };
    default: return {};
  }
}

export default function FigmaNode({ node, island, frameW = 1920 }: { node: FigNode; island?: ReactNode; frameW?: number }) {
  // full-bleed *solid* backgrounds extend to both viewport edges on ultra-wide
  // screens (content stays centred & unmoved). Edge-flush photos keep their
  // natural size and simply bleed out via overflow:visible (no stretching).
  let bleed: { left: string; width: string };
  if (node.fullBleed) {
    bleed = { left: `calc((${frameW}px - max(${frameW}px, 100vw)) / 2)`, width: `max(${frameW}px, 100vw)` };
  } else {
    bleed = { left: `${node.x}px`, width: `${node.w}px` };
  }
  const base: CSSProperties = {
    position: "absolute",
    left: bleed.left,
    top: `${node.y}px`,
    width: bleed.width,
    height: `${node.h}px`,
    opacity: node.opacity ?? 1,
    zIndex: node.z,
    transform: node.rotation ? `rotate(${(-node.rotation * 180) / Math.PI}deg)` : undefined,
  };
  const common = { "data-fig": node.id, "data-name": node.name } as Record<string, string>;

  // island slot (logo, interactive component…)
  if (node.render === "island") {
    return <div style={base} {...common}>{island}</div>;
  }

  if (node.render === "text" && node.text) {
    const t = node.text;
    // Decide wrapping: if the box's visual line count is fully explained by the
    // hard line breaks in `characters`, it's an auto-width box → `pre` (honour
    // breaks, never soft-wrap, so browser metric drift can't add a line).
    // If Figma shows more lines than there are hard breaks, it soft-wraps →
    // `pre-wrap` so the copy wraps inside its fixed width.
    // Wrapping: single-line boxes and headings use `pre` (honour hard breaks,
    // never soft-wrap → no metric-drift wrap). Multi-line body copy uses
    // `pre-wrap` so it soft-wraps inside its fixed width like Figma.
    const oneLine = node.h <= t.lineHeightPx * 1.4;
    const heading = t.fontSize >= 30;
    const whiteSpace: CSSProperties["whiteSpace"] = oneLine || heading ? "pre" : "pre-wrap";
    const style: CSSProperties = {
      position: "absolute",
      left: `${node.x}px`,
      top: `${node.y}px`,
      width: `${node.w}px`,
      margin: 0,
      fontFamily: fontStack(t.fontFamily),
      fontSize: `${t.fontSize}px`,
      fontWeight: t.fontWeight,
      lineHeight: `${t.lineHeightPx}px`,
      letterSpacing: `${t.letterSpacing}px`,
      color: t.fill || "#000",
      opacity: (node.opacity ?? 1) * (t.fillOpacity ?? 1),
      zIndex: node.z,
      textAlign: (t.align || "LEFT").toLowerCase() as CSSProperties["textAlign"],
      fontStyle: t.italic ? "italic" : undefined,
      textDecoration: t.textDecoration === "UNDERLINE" ? "underline" : undefined,
      whiteSpace,
      transform: node.rotation ? `rotate(${(-node.rotation * 180) / Math.PI}deg)` : undefined,
      ...textTransform(t.textCase),
    };
    // Only cap-trim when Figma does (leadingTrim CAP_HEIGHT). Labels with no
    // trim keep the full line-box so their height matches Figma's box.
    const capTrim = t.leadingTrim === "CAP_HEIGHT";
    const tc = (s: string) => (t.textCase === "TITLE" ? titleCase(s) : s);
    const body = t.runs
      ? t.runs.map((r, i) => <span key={i} style={{ color: r.color ?? undefined }}>{tc(r.text)}</span>)
      : tc(t.characters);
    return <p className={capTrim ? "fig-text" : undefined} style={style} {...common}>{body}</p>;
  }

  if (node.render === "image" && node.image) {
    const src = IMAP[node.image.imageRef];
    const blur = (node.effects || []).find((e) => e.type === "LAYER_BLUR")?.blur;
    const objectFit: CSSProperties["objectFit"] = node.image.scaleMode === "FIT" ? "contain" : "cover";
    const imgOpacity = node.image.opacity ?? 1;
    if (!src) return <div style={{ ...base, background: "repeating-linear-gradient(45deg,#eee,#eee 6px,#ddd 6px,#ddd 12px)" }} {...common} title={`missing ${node.image.imageRef}`} />;

    // Figma imageTransform → exact background-size/position (the crop/zoom/pan).
    // Blurred full-bleed backgrounds: skip the transform (its pan can push to a
    // dark corner) and just cover.
    const t = node.image.transform;
    const hasT = !blur && Array.isArray(t) && (Math.abs(t[0][0] - 1) > 0.002 || Math.abs(t[1][1] - 1) > 0.002 || Math.abs(t[0][2]) > 0.002 || Math.abs(t[1][2]) > 0.002);
    let bgSize = objectFit === "contain" ? "contain" : "cover";
    let bgPos = "center";
    if (hasT) {
      const a = t[0][0] || 1, d = t[1][1] || 1, tx = t[0][2] || 0, ty = t[1][2] || 0;
      const sx = 100 / a, sy = 100 / d;
      const px = Math.abs(a - 1) > 0.002 ? (tx / (1 - a)) * 100 : 0;
      const py = Math.abs(d - 1) > 0.002 ? (ty / (1 - d)) * 100 : 0;
      bgSize = `${r2(sx)}% ${r2(sy)}%`;
      bgPos = `${r2(px)}% ${r2(py)}%`;
    }

    // The "David-Sketch-Alpha-Grey02" backdrop is mirrored horizontally in Figma.
    const flipX = /David-Sketch-Alpha-Grey02/i.test(node.name);
    const imgTransform = [blur ? "scale(1.08)" : "", flipX ? "scaleX(-1)" : ""].filter(Boolean).join(" ") || undefined;
    // Image borders (e.g. the store photo's #d8cbb7 outline) as box-shadow so
    // they don't resize the box — same rule as rects.
    let imgShadow: string | undefined;
    if (node.stroke) {
      const w = node.stroke.weight, c = node.stroke.hex, al = node.stroke.align || "CENTER";
      imgShadow = al === "INSIDE" ? `inset 0 0 0 ${w}px ${c}` : al === "OUTSIDE" ? `0 0 0 ${w}px ${c}` : `inset 0 0 0 ${w / 2}px ${c}, 0 0 0 ${w / 2}px ${c}`;
    }
    // Layer: scrim (base fill) + image (bg-image so the transform applies, plus
    // blur/opacity) + optional gradient fade overlay.
    if (node.fill || node.gradient || imgOpacity < 1 || blur || hasT || flipX || imgShadow) {
      return (
        <div style={{ ...base, transform: undefined, background: node.fill?.hex, borderRadius: radiusStyle(node), overflow: "hidden", boxShadow: imgShadow }} {...common}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${src})`, backgroundSize: bgSize, backgroundPosition: bgPos, backgroundRepeat: "no-repeat", opacity: imgOpacity, filter: blur ? `blur(${blur}px)` : undefined, transform: imgTransform }} />
          {node.gradient && <div style={{ position: "absolute", inset: 0, background: gradientCss(node.gradient) }} />}
        </div>
      );
    }
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={node.name} style={{ ...base, transform: undefined, objectFit, borderRadius: radiusStyle(node), boxShadow: imgShadow }} {...common} />;
  }

  if (node.render === "rect" || node.render === "ellipse") {
    let background: string | undefined = node.fill?.hex;
    if (node.gradient && node.gradient.stops.length) background = gradientCss(node.gradient);
    // Stroke as box-shadow (not `border`) so it never enlarges the box / shifts
    // the element — honours Figma strokeAlign (inside / outside / centre).
    const shadows: string[] = [];
    const fx = boxShadow(node.effects);
    if (fx) shadows.push(fx);
    if (node.stroke) {
      const w = node.stroke.weight, c = node.stroke.hex, al = node.stroke.align || "CENTER";
      if (al === "INSIDE") shadows.push(`inset 0 0 0 ${w}px ${c}`);
      else if (al === "OUTSIDE") shadows.push(`0 0 0 ${w}px ${c}`);
      else shadows.push(`inset 0 0 0 ${w / 2}px ${c}`, `0 0 0 ${w / 2}px ${c}`);
    }
    const style: CSSProperties = {
      ...base,
      background,
      opacity: (node.opacity ?? 1) * (node.fill?.opacity ?? 1),
      borderRadius: node.render === "ellipse" ? "50%" : radiusStyle(node),
      boxShadow: shadows.length ? shadows.join(", ") : undefined,
    };
    return <div style={style} {...common} />;
  }

  if (node.render === "path" && node.path) {
    const p = node.path;
    return (
      <svg viewBox={`0 0 ${p.vw} ${p.vh}`} preserveAspectRatio="none" style={base} {...common} aria-hidden>
        {p.paths.map((pp, i) => (
          <path key={i} d={pp.d} fill={p.fill} fillRule={pp.rule} fillOpacity={p.fillOpacity} />
        ))}
      </svg>
    );
  }

  if (node.render === "line" || node.render === "vector") {
    // thin vectors / lines → a solid rule using the stroke (or fill) colour
    const thin = node.h <= 2 || node.w <= 2;
    if (thin || node.render === "line") {
      const horizontal = node.w >= node.h;
      const color = node.stroke?.hex || node.fill?.hex || "#9c7430";
      // thickness = stroke weight, else the SMALL dimension (a zero-height line
      // ⇒ 1px). Using max() here made w56×h0 connectors render as 56×56 squares.
      const weight = node.stroke?.weight || Math.max(Math.min(node.h, node.w), 1);
      // Figma strokeAlign CENTER: the stroke is centred on the line position, so
      // a 4px rule at y sits at y±2. Offset the top/left by half the weight so
      // the brown section borders land exactly on the boundary (not shifted down).
      const align = node.stroke?.align || "CENTER";
      const off = align === "CENTER" ? weight / 2 : align === "OUTSIDE" ? weight : 0;
      const style: CSSProperties = {
        position: "absolute",
        left: horizontal ? (node.fullBleed ? bleed.left : `${node.x}px`) : `${node.x - off}px`,
        top: horizontal ? `${node.y - off}px` : `${node.y}px`,
        width: horizontal ? (node.fullBleed ? bleed.width : `${node.w}px`) : `${weight}px`,
        height: horizontal ? `${weight}px` : `${node.h}px`,
        background: color,
        opacity: node.opacity ?? 1,
        zIndex: node.z,
      };
      return <div style={style} {...common} />;
    }
    // real icon vector → mapped Figma SVG (by node id), else exported by id
    const file = ICONS.byId[node.id] || `/assets/figma/${node.id.replace(/[:;]/g, "_")}.svg`;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={file} alt={node.name} style={{ ...base, objectFit: "contain" }} {...common} />;
  }

  return null;
}
