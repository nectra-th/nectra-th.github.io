// export-svc-icons.mjs — export the 6 "Crafted Around Your Story" service-card
// icons (mobile flattened-vector nodes) from Figma as crisp SVG, then repoint
// the icon map at them. Fixes both wrong/low-res service icons in one shot.
//
// Requires a Figma token. Provide it WITHOUT pasting it in chat — either:
//   $env:FIGMA_TOKEN="figd_..."; node scripts/export-svc-icons.mjs      (PowerShell, this session)
//   setx FIGMA_TOKEN "figd_..."  (persist for future sessions, then reopen shell)
//   or put  FIGMA_TOKEN=figd_...  in a gitignored .env.local (loaded below)
import fs from "node:fs";
import path from "node:path";

// .env.local fallback so the token never needs to touch the shell/chat
if (!process.env.FIGMA_TOKEN && fs.existsSync(".env.local")) {
  for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*FIGMA_TOKEN\s*=\s*(.+?)\s*$/);
    if (m) process.env.FIGMA_TOKEN = m[1].replace(/^["']|["']$/g, "");
  }
}

const KEY = "i4u7FpbtTFOZImGlLNFowq";
const TOK = process.env.FIGMA_TOKEN;
if (!TOK) { console.error("FIGMA_TOKEN not set — see header of this file."); process.exit(1); }

// mobile service-icon node id -> asset basename
const ICONS = {
  "1:4421": "ic-diamond",    // Custom Jewellery
  "1:4432": "ic-rings",      // Engagement & Wedding Rings
  "1:4441": "ic-anvil",      // Jewellery Repairs
  "1:4450": "ic-magnifier",  // Valuations
  "1:4461": "ic-pendant",    // Antique Jewellery
  "1:4472": "ic-watch",      // Watch Services
};
const OUTDIR = "public/assets/icons";

const ids = Object.keys(ICONS);
const url = `https://api.figma.com/v1/images/${KEY}?ids=${encodeURIComponent(ids.join(","))}&format=svg`;
const r = await fetch(url, { headers: { "X-Figma-Token": TOK } });
const j = await r.json();
if (j.err) { console.error("figma error:", j.err); process.exit(1); }

let ok = 0;
for (const id of ids) {
  const u = j.images?.[id];
  if (!u) { console.warn("no image url for", id); continue; }
  const svg = await (await fetch(u)).text();
  const file = path.join(OUTDIR, ICONS[id] + ".svg");
  fs.writeFileSync(file, svg);
  console.log("wrote", file, `(${svg.length}b)`);
  ok++;
}

// repoint icons.map.json byId at the new .svg files (drop the .png)
if (ok) {
  const MAP = "app/generated/icons.map.json";
  const map = JSON.parse(fs.readFileSync(MAP, "utf8"));
  // also repoint any byName entries that used these png basenames
  const swap = (v) => (typeof v === "string" ? v.replace(/\/(ic-(?:diamond|rings|anvil|magnifier|pendant|watch))\.png$/, "/$1.svg") : v);
  for (const k of Object.keys(map.byId || {})) map.byId[k] = swap(map.byId[k]);
  for (const k of Object.keys(map.byName || {})) map.byName[k] = swap(map.byName[k]);
  fs.writeFileSync(MAP, JSON.stringify(map, null, 2));
  console.log(`repointed icon map to .svg (${ok}/${ids.length} icons exported)`);
  console.log("NOTE: also update SERVICE_IMAGES fallback / map-icons.mjs OVERRIDES if you rebuild the layout.");
}
