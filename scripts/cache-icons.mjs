// cache-icons.mjs — download needed icon SVGs from previously-generated Figma
// S3 export URLs (figma-alpha-api.s3…, NOT rate-limited). Aggregates every
// *url*.json in the scratchpad, matches against a layout's vectorExports, and
// writes public/assets/figma/<sanitised-id>.svg.
import fs from "node:fs";
import path from "node:path";

const SP = process.argv[3] || "C:/Users/Phil/AppData/Local/Temp/claude/C--Users-Phil-Grech-Jew/6950c6cb-33de-4ed0-9934-7bb20e4b677e/scratchpad";
const SRC = process.argv[2] || "app/generated/desktop.layout.json";
const OUTDIR = "public/assets/figma";
fs.mkdirSync(OUTDIR, { recursive: true });
const sanitize = (id) => id.replace(/[:;]/g, "_");

const cache = {};
for (const f of fs.readdirSync(SP)) {
  if (!/url/i.test(f) || !f.endsWith(".json")) continue;
  try { const j = JSON.parse(fs.readFileSync(path.join(SP, f), "utf8")); if (j.images) Object.assign(cache, j.images); } catch {}
}
const need = JSON.parse(fs.readFileSync(SRC, "utf8")).vectorExports || [];
const have = need.filter((id) => cache[id] && !fs.existsSync(path.join(OUTDIR, sanitize(id) + ".svg")));
const miss = need.filter((id) => !cache[id]);
console.log(`cache urls=${Object.keys(cache).length}  needed=${need.length}  downloadable=${have.length}  missing=${miss.length}`);

let ok = 0, fail = 0;
for (const id of have) {
  try {
    const res = await fetch(cache[id]);
    const svg = await res.text();
    if (!svg.startsWith("<svg")) { fail++; continue; }
    fs.writeFileSync(path.join(OUTDIR, sanitize(id) + ".svg"), svg);
    ok++;
  } catch { fail++; }
}
console.log(`downloaded ${ok} ok, ${fail} failed`);
if (miss.length) console.log("STILL MISSING (need Figma /images export):", miss.join(" "));
