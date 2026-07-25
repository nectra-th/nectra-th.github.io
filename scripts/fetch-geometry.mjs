// fetch-geometry.mjs — fetch the 3 frames WITH geometry=paths (so vectors carry
// fillGeometry we can render inline, no /images render endpoint needed), with
// backoff on 429. Re-transpiles each layout as its geometry arrives.
import fs from "node:fs";
import { execSync } from "node:child_process";

const KEY = "i4u7FpbtTFOZImGlLNFowq";
const TOK = process.env.FIGMA_TOKEN;
const FRAMES = [
  { id: "1:3799", name: "desktop" },
  { id: "1:4838", name: "tablet" },
  { id: "1:4213", name: "mobile" },
];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchFrame(f) {
  const url = `https://api.figma.com/v1/files/${KEY}/nodes?ids=${f.id}&geometry=paths`;
  const res = await fetch(url, { headers: { "X-Figma-Token": TOK } });
  if (res.status === 429) return "429";
  const text = await res.text();
  let j; try { j = JSON.parse(text); } catch { return "badjson"; }
  if (j.status === 429 || j.err) return "429";
  if (!j.nodes?.[f.id]?.document) return "nonode";
  fs.writeFileSync(`figma-data/${f.name}.geo.json`, text);
  return "ok";
}

const done = new Set();
for (let attempt = 1; attempt <= 60 && done.size < FRAMES.length; attempt++) {
  for (const f of FRAMES) {
    if (done.has(f.name)) continue;
    const r = await fetchFrame(f);
    console.log(`[${new Date().toISOString().slice(11, 19)}] attempt ${attempt} ${f.name}: ${r}`);
    if (r === "ok") {
      done.add(f.name);
      try {
        execSync(`node scripts/transpile.mjs figma-data/${f.name}.geo.json ${f.id} app/generated/${f.name}.layout.json`, { stdio: "inherit" });
      } catch (e) { console.error("transpile failed", f.name, e.message); }
    }
    await sleep(8000);
  }
  if (done.size < FRAMES.length) await sleep(300000);
}
console.log("fetch-geometry done. fetched:", [...done].join(", ") || "none");
