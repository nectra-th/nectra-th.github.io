// export-icons.mjs — export every vectorExports id from a layout spec as SVG
// from Figma into public/assets/figma/<sanitised-id>.svg (matches FigmaNode's
// fallback path). Skips ids already downloaded. Usage:
//   node scripts/export-icons.mjs <layout.json>
import fs from "node:fs";
import path from "node:path";

const KEY = "i4u7FpbtTFOZImGlLNFowq";
const TOK = process.env.FIGMA_TOKEN;
const SRC = process.argv[2] || "app/generated/desktop.layout.json";
const OUTDIR = "public/assets/figma";
fs.mkdirSync(OUTDIR, { recursive: true });

const spec = JSON.parse(fs.readFileSync(SRC, "utf8"));
const sanitize = (id) => id.replace(/[:;]/g, "_");
const ids = (spec.vectorExports || []).filter((id) => !fs.existsSync(path.join(OUTDIR, sanitize(id) + ".svg")));
if (!ids.length) { console.log("nothing to export (all present)"); process.exit(0); }
// exit non-zero unless everything succeeds, so a retry loop can detect completion
console.log(`exporting ${ids.length} icons from ${SRC}`);

async function getImageUrls(batch) {
  const url = `https://api.figma.com/v1/images/${KEY}?ids=${encodeURIComponent(batch.join(","))}&format=svg`;
  const r = await fetch(url, { headers: { "X-Figma-Token": TOK } });
  const j = await r.json();
  if (j.err) throw new Error("figma images err: " + j.err);
  return j.images || {};
}

let ok = 0, fail = 0;
const BATCH = 20;
for (let i = 0; i < ids.length; i += BATCH) {
  const batch = ids.slice(i, i + BATCH);
  let urls;
  try { urls = await getImageUrls(batch); }
  catch (e) { console.error("batch failed:", e.message); fail += batch.length; continue; }
  for (const id of batch) {
    const u = urls[id];
    if (!u) { console.warn("no url for", id); fail++; continue; }
    try {
      const res = await fetch(u);
      const svg = await res.text();
      if (!svg.startsWith("<svg")) { console.warn("not svg for", id, svg.slice(0, 40)); fail++; continue; }
      fs.writeFileSync(path.join(OUTDIR, sanitize(id) + ".svg"), svg);
      ok++;
    } catch (e) { console.warn("download failed", id, e.message); fail++; }
  }
  console.log(`  ${Math.min(i + BATCH, ids.length)}/${ids.length}`);
}
console.log(`done: ${ok} ok, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
