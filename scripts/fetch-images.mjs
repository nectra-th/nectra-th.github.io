// fetch-images.mjs — download the real Figma bitmap for every imageRef used by
// the layouts, into public/assets/figma-img/<ref>.<ext>, and rewrite
// app/generated/images.map.json to point at them (no more friendly-name guessing).
import fs from "node:fs";
import path from "node:path";

const KEY = "i4u7FpbtTFOZImGlLNFowq";
const TOK = process.env.FIGMA_TOKEN;
const OUTDIR = "public/assets/figma-img";
fs.mkdirSync(OUTDIR, { recursive: true });

// gather every imageRef referenced across all generated layouts
const refs = new Set();
for (const f of ["desktop", "tablet", "mobile"]) {
  const p = `app/generated/${f}.layout.json`;
  if (!fs.existsSync(p)) continue;
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  for (const s of j.sections) for (const n of s.nodes) if (n.render === "image" && n.image?.imageRef) refs.add(n.image.imageRef);
}

const fills = JSON.parse(fs.readFileSync(process.argv[2] || "C:/Users/Phil/AppData/Local/Temp/claude/C--Users-Phil-Grech-Jew/6950c6cb-33de-4ed0-9934-7bb20e4b677e/scratchpad/imagefills.json", "utf8")).meta.images;

function ext(buf) {
  if (buf[0] === 0xff && buf[1] === 0xd8) return "jpg";
  if (buf[0] === 0x89 && buf[1] === 0x50) return "png";
  if (buf[0] === 0x47 && buf[1] === 0x49) return "gif";
  if (buf[0] === 0x52 && buf[1] === 0x49) return "webp";
  return "png";
}

const map = {};
let ok = 0, miss = 0;
for (const ref of refs) {
  const url = fills[ref];
  if (!url) { console.warn("no fill url for", ref); miss++; continue; }
  const dest = path.join(OUTDIR, ref);
  // reuse if already downloaded (any extension)
  const existing = ["jpg", "png", "gif", "webp"].map((e) => dest + "." + e).find((f) => fs.existsSync(f));
  if (existing) { map[ref] = "/assets/figma-img/" + path.basename(existing); ok++; continue; }
  try {
    const res = await fetch(url);
    const buf = Buffer.from(await res.arrayBuffer());
    const e = ext(buf);
    fs.writeFileSync(dest + "." + e, buf);
    map[ref] = "/assets/figma-img/" + ref + "." + e;
    ok++;
  } catch (err) { console.warn("dl failed", ref, err.message); miss++; }
}
fs.writeFileSync("app/generated/images.map.json", JSON.stringify(map, null, 2) + "\n");
console.log(`images: ${ok} ok, ${miss} missing → images.map.json (${Object.keys(map).length} refs)`);
