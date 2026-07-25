// transpile.mjs — Figma frame JSON -> absolute layout spec (Method C)
// Reads a /v1/files/:key/nodes response for one frame and emits a per-section
// layout spec: each element carries its exact box (relative to its section),
// full text style, fills, strokes, effects, and a marker for vector/icon nodes
// that must be rendered from an exported Figma SVG.
//
// Usage: node scripts/transpile.mjs <nodes.json> <frameId> <out.json> [sectionsMode]
//   sectionsMode "lines" (default) = cut sections at 4px #c8b08a boundary lines.
import fs from "node:fs";

const [, , SRC, FRAME_ID, OUT] = process.argv;
if (!SRC || !FRAME_ID || !OUT) {
  console.error("usage: node transpile.mjs <nodes.json> <frameId> <out.json>");
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(SRC, "utf8"));
const root = (raw.nodes?.[FRAME_ID]?.document) || raw.document || raw;
const FRAME = root.absoluteBoundingBox;
const FW = Math.round(FRAME.width), FH = Math.round(FRAME.height);

// ---- helpers ---------------------------------------------------------------
const r2 = (n) => Math.round(n * 100) / 100;
function hex(c) {
  if (!c) return null;
  const h = (x) => Math.round(x * 255).toString(16).padStart(2, "0");
  return "#" + h(c.r) + h(c.g) + h(c.b);
}
function solidFill(node) {
  const f = (node.fills || []).find((x) => x.visible !== false && x.type === "SOLID");
  return f ? { hex: hex(f.color), opacity: r2((f.opacity ?? 1) * (f.color?.a ?? 1)) } : null;
}
function imageFill(node) {
  const f = (node.fills || []).find((x) => x.visible !== false && x.type === "IMAGE");
  return f ? { imageRef: f.imageRef, scaleMode: f.scaleMode, opacity: r2(f.opacity ?? 1), transform: f.imageTransform, rotation: f.rotation } : null;
}
function gradientFill(node) {
  const f = (node.fills || []).find((x) => x.visible !== false && x.type?.startsWith("GRADIENT"));
  if (!f) return null;
  return {
    type: f.type,
    stops: (f.gradientStops || []).map((s) => ({ pos: r2(s.position), hex: hex(s.color), a: r2(s.color?.a ?? 1) })),
    handles: f.gradientHandlePositions,
  };
}
function strokeInfo(node) {
  const s = (node.strokes || []).find((x) => x.visible !== false && x.type === "SOLID");
  if (!s) return null;
  return { hex: hex(s.color), opacity: r2(s.color?.a ?? 1), weight: node.strokeWeight ?? 1, align: node.strokeAlign };
}
function effectInfo(node) {
  const out = [];
  for (const e of node.effects || []) {
    if (e.visible === false) continue;
    if (e.type === "DROP_SHADOW" || e.type === "INNER_SHADOW") {
      out.push({ type: e.type, x: r2(e.offset?.x || 0), y: r2(e.offset?.y || 0), blur: r2(e.radius || 0), spread: r2(e.spread || 0), hex: hex(e.color), a: r2(e.color?.a ?? 1) });
    } else if (e.type === "LAYER_BLUR" || e.type === "BACKGROUND_BLUR") {
      out.push({ type: e.type, blur: r2(e.radius || 0) });
    }
  }
  return out.length ? out : null;
}
// split characters into colour runs when the text has per-character overrides
// (e.g. a gold accent word inside a dark heading)
function textRuns(node) {
  const chars = node.characters || "";
  const ov = node.characterStyleOverrides;
  const table = node.styleOverrideTable || {};
  if (!ov || !ov.length) return null;
  const runs = [];
  let cur = null;
  for (let i = 0; i < chars.length; i++) {
    const idx = ov[i] || 0;
    const st = table[idx];
    const f = st && st.fills && st.fills.find((x) => x.type === "SOLID");
    const color = f ? hex(f.color) : null; // null → use base fill
    if (!cur || cur.color !== color) { cur = { text: "", color }; runs.push(cur); }
    cur.text += chars[i];
  }
  return runs.length > 1 ? runs : null;
}
// clear typo corrections in the Figma source (kept minimal & explicit)
const TEXT_FIX = [
  ["obligatoin-free adviced", "obligation-free advice"],
  ["grechjewllers", "grechjewellers"],
];
function fixText(str) {
  let out = str || "";
  for (const [bad, good] of TEXT_FIX) out = out.split(bad).join(good);
  // Figma soft line-separators (U+2028/U+2029) and nbsp (U+00A0) -> space, then collapse
  out = out.split(String.fromCharCode(0x2028)).join(" ").split(String.fromCharCode(0x2029)).join(" ").split(String.fromCharCode(0xA0)).join(" ");
  out = out.replace(/ {2,}/g, " ");
  return out;
}
function textStyle(node) {
  const s = node.style || {};
  if (node.characters) node = { ...node, characters: fixText(node.characters) };
  const runs = textRuns(node);
  return {
    characters: node.characters,
    runs,
    textAutoResize: s.textAutoResize,
    fontFamily: s.fontFamily,
    fontPostScriptName: s.fontPostScriptName,
    fontWeight: s.fontWeight,
    fontSize: r2(s.fontSize),
    letterSpacing: r2(s.letterSpacing || 0),
    lineHeightPx: r2(s.lineHeightPx),
    lineHeightPercent: s.lineHeightPercentFontSize,
    align: s.textAlignHorizontal,
    valign: s.textAlignVertical,
    textCase: s.textCase,
    textDecoration: s.textDecoration,
    leadingTrim: s.leadingTrim,
    italic: !!s.italic,
    fill: solidFill(node)?.hex,
    fillOpacity: solidFill(node)?.opacity,
  };
}

// ---- section boundaries (4px #c8b08a lines) --------------------------------
const kids = root.children || [];
const boundaries = kids
  .filter((n) => n.type === "LINE" && n.absoluteBoundingBox.width >= FW - 4 && (n.strokeWeight >= 3))
  .map((n) => Math.round(n.absoluteBoundingBox.y - FRAME.y))
  .sort((a, b) => a - b);
const cuts = [0, ...boundaries.filter((y) => y > 4 && y < FH - 4), FH];
const SECTION_NAMES = [
  "hero", "why", "whatwedo", "process", "featured", "reviews", "brands", "closing",
];
const sections = [];
for (let i = 0; i < cuts.length - 1; i++) {
  sections.push({ name: SECTION_NAMES[i] || `sec${i}`, top: cuts[i], bottom: cuts[i + 1], height: cuts[i + 1] - cuts[i], nodes: [] });
}
function sectionFor(yAbs) {
  const y = yAbs - FRAME.y;
  for (const s of sections) if (y >= s.top - 2 && y < s.bottom - 2) return s;
  return sections[sections.length - 1];
}

// ---- node classification ---------------------------------------------------
const VECTORY = new Set(["VECTOR", "BOOLEAN_OPERATION", "STAR", "REGULAR_POLYGON"]);
const CONTAINER = new Set(["FRAME", "GROUP", "INSTANCE", "COMPONENT", "COMPONENT_SET"]);
// Instances kept atomic (rendered from one exported SVG or a React island) instead of
// being flattened into their child vectors. Matched by exact node name.
const ISLAND_INSTANCES = new Set([
  "Logo - Grech Big",
  "Navigation / CTA / DESKTOP",
  // icon instances → mapped to exported Figma SVGs in the renderer
  "Diamond",            // 1:191  four-pillars
  "Custom-Jewellery",   // 1:236  what-we-do (ring icon)
  "Consultation",       // 1:287  our-process (32px step icon)
  "Gallery UI Button",  // 1:356  featured carousel arrows
]);
// Specific node ids kept as islands (interactive components / branded lockups).
const ISLAND_IDS = new Set([
  // desktop
  "1:3907", // "IDLE STATE" — booking calendar widget → interactive island
  "1:3837", // footer "Grech Jewellers" logo lockup (350x96) → logo-footer.svg
  "1:3864", // footer social row (Instagram + Facebook)
  "1:4186", // "Gallery - Desktop" — featured creations carousel
  // tablet
  "1:5197", // booking widget
  "1:5472", // footer logo (265x73)
  "1:4861", // header logo (146x40)
  // mobile
  "1:4641", // booking widget (stacked)
  "1:4516", // footer logo (350x96)
  "1:4803", // header logo (174x48)
]);

// An "icon container" = a small group/frame/instance whose whole subtree is
// vector art (no TEXT, no IMAGE fill) → export the WHOLE node as one SVG rather
// than flatten it into dozens of path fragments (logos, multi-path icons).
function subtreeHasTextOrImage(node) {
  if (node.type === "TEXT") return true;
  if ((node.fills || []).some((f) => f.visible !== false && f.type === "IMAGE")) return true;
  return (node.children || []).some(subtreeHasTextOrImage);
}
function hasVector(node) {
  if (VECTORY.has(node.type)) return true;
  return (node.children || []).some(hasVector);
}
function subtreeHasIsland(node) {
  if (ISLAND_INSTANCES.has(node.name) || ISLAND_IDS.has(node.id)) return true;
  return (node.children || []).some(subtreeHasIsland);
}
function hasGeometry(node) {
  if (Array.isArray(node.fillGeometry) && node.fillGeometry.length) return true;
  return (node.children || []).some(hasGeometry);
}
function isIconContainer(node) {
  const b = node.absoluteBoundingBox;
  if (!b || b.width > 260 || b.height > 260) return false;
  if (!(node.children && node.children.length)) return false;
  // don't collapse a container that holds an icon we already island-map — let
  // it recurse so the mapped island (diamond, ring, gallery button…) is emitted
  if (subtreeHasIsland(node)) return false;
  // if the frame carries vector path geometry, recurse and render the paths
  // inline (no external SVG export needed) rather than collapse to one file
  if (hasGeometry(node)) return false;
  return hasVector(node) && !subtreeHasTextOrImage(node);
}
// build an inline-path spec from a vector/boolean node's fillGeometry
function pathSpec(node) {
  const paths = (node.fillGeometry || []).map((g) => ({ d: g.path, rule: g.windingRule === "EVENODD" ? "evenodd" : "nonzero" }));
  if (!paths.length) return null;
  const sz = node.size || { x: node.absoluteBoundingBox.width, y: node.absoluteBoundingBox.height };
  const fill = solidFill(node);
  // per-fill colour list (some vectors carry multiple solid fills but one geometry)
  return { paths, vw: r2(sz.x), vh: r2(sz.y), fill: fill?.hex || "#000", fillOpacity: fill?.opacity ?? 1 };
}

let idSeq = 0;
let zSeq = 0; // global Figma paint order — assigned to every node as z-index so
              // cross-section stacking (e.g. hero rings over the next section's
              // background) matches Figma's single paint order
function emit(node, parentAbs) {
  const bb = node.absoluteBoundingBox;
  if (!bb) return null;
  const sec = sectionFor(bb.y);
  const base = {
    id: node.id,
    key: `f${idSeq++}`,
    z: ++zSeq,
    name: node.name,
    type: node.type,
    // coords relative to the FRAME (stage is 1920 wide); renderer subtracts section top for y
    x: r2(bb.x - FRAME.x),
    yAbs: r2(bb.y - FRAME.y),
    y: r2(bb.y - FRAME.y - sec.top),
    w: r2(bb.width),
    h: r2(bb.height),
    section: sec.name,
    rotation: node.rotation ? r2(node.rotation) : 0,
    opacity: node.opacity != null ? r2(node.opacity) : 1,
  };
  // full-bleed background = spans the whole frame width from x≈0 → on ultra-wide
  // screens it extends to both viewport edges (content stays centred, unmoved)
  if (base.x <= 2 && base.x + base.w >= FW - 2) base.fullBleed = true;
  const solid = solidFill(node);
  const img = imageFill(node);
  const grad = gradientFill(node);
  const stroke = strokeInfo(node);
  const fx = effectInfo(node);
  if (node.cornerRadius) base.radius = node.cornerRadius;
  if (node.rectangleCornerRadii) base.radii = node.rectangleCornerRadii;
  if (stroke) base.stroke = stroke;
  if (fx) base.effects = fx;

  if (CONTAINER.has(node.type) && ISLAND_INSTANCES.has(node.name)) {
    base.render = "island"; base.componentId = node.componentId; sec.nodes.push(base); return;
  }
  if (ISLAND_IDS.has(node.id)) { base.render = "island"; base.componentId = node.componentId; sec.nodes.push(base); return; }
  // whole-icon export: a small all-vector container becomes one SVG
  if (CONTAINER.has(node.type) && isIconContainer(node)) {
    base.render = "vector"; base.needsSvg = true; sec.nodes.push(base); return;
  }
  if (node.type === "TEXT") { base.render = "text"; base.text = textStyle(node); sec.nodes.push(base); return; }
  if (img) {
    base.render = "image"; base.image = img; if (solid) base.fill = solid; if (grad) base.gradient = grad;
    // edge-flush photo: square corners on the frame edge + rounded inner → it's
    // meant to sit flush to the screen edge, so extend it there on ultra-wide.
    if (!base.fullBleed) {
      const rr = base.radii || (base.radius ? [base.radius, base.radius, base.radius, base.radius] : [0, 0, 0, 0]);
      if (base.x <= 2 && rr[0] < 2 && rr[3] < 2 && rr[1] + rr[2] > 0) base.bleedEdge = "left";
      else if (base.x + base.w >= FW - 2 && rr[1] < 2 && rr[2] < 2 && rr[0] + rr[3] > 0) base.bleedEdge = "right";
    }
    sec.nodes.push(base); return;
  }
  if (VECTORY.has(node.type)) {
    // large solid-filled vector = a background shape → render as a coloured box
    if (solid && !stroke && base.w >= 120 && base.h >= 120 && !node.fillGeometry) { base.render = "rect"; base.fill = solid; sec.nodes.push(base); return; }
    // inline vector path geometry (preferred — no external SVG export needed)
    const ps = pathSpec(node);
    if (ps) { base.render = "path"; base.path = ps; sec.nodes.push(base); return; }
    base.render = "vector"; base.needsSvg = true; if (solid) base.fill = solid; sec.nodes.push(base); return;
  }
  if (node.type === "LINE") { base.render = "line"; sec.nodes.push(base); return; }
  if (node.type === "ELLIPSE") { base.render = "ellipse"; if (solid) base.fill = solid; if (grad) base.gradient = grad; sec.nodes.push(base); return; }
  if (node.type === "RECTANGLE") { base.render = "rect"; if (solid) base.fill = solid; if (grad) base.gradient = grad; sec.nodes.push(base); return; }

  // containers: record a bg rect if they paint anything (fill, gradient or a
  // visible border), then recurse into children
  if (CONTAINER.has(node.type)) {
    if ((solid || grad || stroke) && node.clipsContent !== undefined) {
      const bg = { ...base, key: `f${idSeq++}`, render: "rect", isContainerBg: true };
      if (solid) bg.fill = solid; if (grad) bg.gradient = grad;
      sec.nodes.push(bg);
    }
    for (const c of node.children || []) if (c.visible !== false) emit(c, bb);
    return;
  }
  return;
}

for (const c of kids) if (c.visible !== false) emit(c, FRAME);

// collect vector nodes that must be exported as SVG (real icons, not thin rules)
const vectorExports = [];
for (const s of sections) for (const n of s.nodes) {
  if (n.render === "vector" && n.needsSvg && n.h > 2 && n.w > 2) vectorExports.push(n.id);
}
const spec = { frameId: FRAME_ID, width: FW, height: FH, boundaries, vectorExports: [...new Set(vectorExports)], sections };
fs.writeFileSync(OUT, JSON.stringify(spec, null, 2));
const total = sections.reduce((a, s) => a + s.nodes.length, 0);
console.log(`frame ${FW}x${FH}  sections=${sections.length}  nodes=${total}`);
for (const s of sections) console.log(`  ${s.name.padEnd(10)} y${s.top}-${s.bottom} (${s.height}h)  ${s.nodes.length} nodes`);
