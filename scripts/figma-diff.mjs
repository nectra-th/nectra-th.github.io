// figma-diff.mjs — pixel-diff a live section against the real Figma reference
// screenshot (public/compare/figma-desktop.jpg, 1920x11088, 1:1 with the
// Figma canvas). Usage:
//   node scripts/figma-diff.mjs <name> <figmaY> <height> <anchorText> [localUrl]
// Example:
//   node scripts/figma-diff.mjs findus 9093 1216 "Plan Your Visit" "http://localhost:3000"
//
// figmaY MUST be the exact Y of the same text node passed as `anchorText` —
// pull it straight from the cached figma-data/*.json for THAT node, not a
// rough "section starts around here" estimate. Using the wrong node (e.g.
// the outer section's own top edge instead of the text itself) is what
// caused a full-image "ghosting" artifact the first several times this
// ran — every element appeared twice, offset by however far the anchor
// actually sat from the guessed value. Once figmaY was corrected to point
// at the literal anchor node, the ghosting disappeared.
//
// Known residual: expect a small (~tens of px) leftover vertical offset even
// with a correct figmaY, because Figma's text boxes are cap-height-trimmed
// while a browser's getBoundingClientRect includes the full line-height —
// not a bug, just a measurement-convention difference. Don't chase this to
// zero; judge the diff.png by whether content reads as ONE aligned copy
// (small offset, thin edge noise) vs TWO distinguishable copies (wrong
// figmaY, fix that first).
//
// Outputs into scripts/_diff-out/<name>/: figma.png, live.png, diff.png, and
// the % of mismatched pixels. A diff.png with solid red blobs (not just thin
// text-edge antialiasing noise) means "here — this exact spot doesn't
// match", instead of guessing property by property. The store photo and any
// blurred backdrop will always show heavy red — that's real photography,
// not a bug to fix.
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const [, , name, figmaYArg, heightArg, anchorText, localUrl] = process.argv;
if (!name || !figmaYArg || !heightArg || !anchorText) {
  console.error("Usage: node scripts/figma-diff.mjs <name> <figmaY> <height> <anchorText> [localUrl]");
  process.exit(1);
}
const figmaY = Number(figmaYArg);
const height = Number(heightArg);
const url = localUrl || "http://localhost:3000";

const OUT = path.join("scripts", "_diff-out", name);
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

// 1) crop the Figma reference at natural 1:1 scale
{
  const viewerPath = path.join(OUT, "_viewer.html");
  fs.writeFileSync(
    viewerPath,
    `<!DOCTYPE html><html><body style="margin:0;padding:0;">
     <img src="${path.resolve("public/compare/figma-desktop.jpg").replace(/\\/g, "/")}" width="1920" height="11088" style="display:block;width:1920px;height:11088px;">
     </body></html>`
  );
  const page = await browser.newPage({ viewport: { width: 1920, height } });
  await page.goto("file:///" + path.resolve(viewerPath).replace(/\\/g, "/"));
  await page.evaluate((y) => window.scrollTo(0, y), figmaY);
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT, "figma.png") });
  await page.close();
  fs.rmSync(viewerPath);
}

// 2) screenshot the live section, aligned so `anchorText` sits at the exact
//    same viewport-relative Y as it does in the figma.png crop (both should
//    show the anchor right at the top edge, since the crop starts at figmaY).
{
  const page = await browser.newPage({ viewport: { width: 1920, height }, reducedMotion: "no-preference" });
  // Strip any #hash before navigating — the site has `scroll-behavior: smooth`,
  // so a URL fragment triggers the browser's own ANIMATED scroll-to-anchor,
  // which can still be running (or re-fires) after our own scrollTo below and
  // silently overrides it. That was the real cause of the ~190px "ghosting"
  // seen in earlier runs, not a race in our own scroll logic.
  const baseUrl = url.split("#")[0];
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  // The real bug: <header> is `position: fixed`, always pinned to the
  // viewport's top ~108px regardless of scroll position — Figma's flat
  // reference image has no such overlay at this scroll depth, so it was
  // covering/blending with whatever content scrolled underneath it,
  // reading as a ~190px "ghost" offset in the diff. Hide it for a clean
  // content-vs-content comparison.
  await page.addStyleTag({ content: "header { display: none !important; }" });
  await page.waitForTimeout(500); // let data-reveal / layout settle before measuring
  // Find + scroll in ONE atomic evaluate, forcing scroll-behavior:auto so this
  // jump is instant (not smooth-animated, which could still be mid-flight
  // when we screenshot).
  const found = await page.evaluate((text) => {
    document.documentElement.style.scrollBehavior = "auto";
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.textContent.includes(text)) {
        const range = document.createRange();
        range.selectNodeContents(node);
        const rect = range.getBoundingClientRect();
        const absoluteTop = rect.top + window.scrollY;
        window.scrollTo(0, Math.max(0, absoluteTop));
        return { absoluteTop, rectTop: rect.top };
      }
    }
    return null;
  }, anchorText);
  if (!found) {
    console.error(`anchor text "${anchorText}" not found on the live page — alignment skipped, screenshot is from scroll-top.`);
  }
  // re-assert the scroll position after settling, in case anything nudged it
  const finalTop = found ? found.absoluteTop : 0;
  await page.evaluate((y) => window.scrollTo(0, y), finalTop);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, "live.png") });
  await page.close();
}

await browser.close();

// 3) pixel-diff
const img1 = PNG.sync.read(fs.readFileSync(path.join(OUT, "figma.png")));
const img2 = PNG.sync.read(fs.readFileSync(path.join(OUT, "live.png")));
const { width: w, height: h } = img1;
if (img2.width !== w || img2.height !== h) {
  console.error(`size mismatch: figma ${w}x${h} vs live ${img2.width}x${img2.height} — diff skipped, inspect the two PNGs directly.`);
  process.exit(0);
}
const diff = new PNG({ width: w, height: h });
const mismatched = pixelmatch(img1.data, img2.data, diff.data, w, h, { threshold: 0.15 });
fs.writeFileSync(path.join(OUT, "diff.png"), PNG.sync.write(diff));

const pct = ((mismatched / (w * h)) * 100).toFixed(2);
console.log(`${name}: ${mismatched} / ${w * h} px differ (${pct}%)`);
console.log(`  figma.png / live.png / diff.png -> ${OUT}`);
