// verify.mjs — measure every [data-fig] element on the preview page and diff
// its box against the transpiled Figma spec. Prints a per-element dx/dy/dw/dh
// table (section-relative) and a screenshot of the section.
//
// usage: node scripts/verify.mjs <sectionName> [url] [outPng]
import fs from "node:fs";
import { chromium } from "playwright";

const SECTION = process.argv[2] || "hero";
const URL = process.argv[3] || "http://localhost:3000/figma-preview";
const LAYOUT = process.argv[5] || "app/generated/desktop.layout.json";
const OUT = process.argv[4] || `C:/Users/Phil/AppData/Local/Temp/claude/C--Users-Phil-Grech-Jew/6950c6cb-33de-4ed0-9934-7bb20e4b677e/scratchpad/verify_${SECTION}.png`;

const spec = JSON.parse(fs.readFileSync(LAYOUT, "utf8"));
const sec = spec.sections.find((s) => s.name === SECTION);
if (!sec) { console.error("no section", SECTION); process.exit(1); }
const expected = new Map();
for (const n of sec.nodes) expected.set(n.id, n);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: spec.width || 1920, height: 1200 }, deviceScaleFactor: 1 });
await page.goto(URL, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);

const secHandle = await page.$(`[data-fig-section="${SECTION}"]`);
if (!secHandle) { console.error("section not found in DOM"); await browser.close(); process.exit(1); }
const secBox = await secHandle.boundingBox();

const measured = await page.evaluate((name) => {
  const sec = document.querySelector(`[data-fig-section="${name}"]`);
  const sr = sec.getBoundingClientRect();
  const out = {};
  sec.querySelectorAll("[data-fig]").forEach((el) => {
    const r = el.getBoundingClientRect();
    const id = el.getAttribute("data-fig");
    // keep the first (outermost) measurement per id
    if (!out[id]) out[id] = { x: r.left - sr.left, y: r.top - sr.top, w: r.width, h: r.height };
  });
  return out;
}, SECTION);

// screenshot just the section element (works regardless of scroll position)
await secHandle.screenshot({ path: OUT });
await browser.close();

// report
const rows = [];
let maxD = 0, nBad = 0;
for (const n of sec.nodes) {
  const m = measured[n.id];
  if (!m) { rows.push({ name: n.name, render: n.render, note: "NOT IN DOM" }); continue; }
  const dx = +(m.x - n.x).toFixed(1), dy = +(m.y - n.y).toFixed(1);
  const dw = +(m.w - n.w).toFixed(1), dh = +(m.h - n.h).toFixed(1);
  // position always counts; for text also count width/height blow-outs (a bad
  // wrap keeps top-left correct but explodes the box). Multi-line soft-wrap
  // copy may reflow by up to ~1 line vs Figma (browser vs Figma metrics) — that
  // is non-cascading under absolute positioning, so tolerate ~1 line there.
  const lh = n.text?.lineHeightPx || 20;
  const multiline = (n.h || 0) > lh * 1.6;
  const sizeSlack = n.render === "text" ? (multiline ? lh * 1.2 : 2) : Infinity;
  const sizeErr = n.render === "text" ? Math.max(Math.abs(dw), Math.abs(dh)) - sizeSlack : 0;
  const worst = Math.max(Math.abs(dx), Math.abs(dy), Math.max(0, sizeErr));
  maxD = Math.max(maxD, worst);
  if (worst > 1.5) nBad++;
  rows.push({ name: n.name, render: n.render, dx, dy, dw, dh, flag: worst > 1.5 ? "  <=" : "" });
}
console.log(`\n=== VERIFY ${SECTION}  (section ${Math.round(secBox.width)}x${Math.round(secBox.height)}, expected 1920x${sec.height}) ===`);
console.log("render  dx     dy     dw     dh    name");
for (const r of rows) {
  if (r.note) { console.log(`${(r.render||"").padEnd(7)} ${r.note.padEnd(28)} ${r.name}`); continue; }
  const f = (v) => String(v).padStart(6);
  console.log(`${r.render.padEnd(7)}${f(r.dx)} ${f(r.dy)} ${f(r.dw)} ${f(r.dh)}  ${r.name}${r.flag}`);
}
console.log(`\nmaxΔ(pos)=${maxD}px   offBy>1.5px=${nBad}/${sec.nodes.length}   shot=${OUT}`);
