// map-icons.mjs — FALLBACK icon mapping used only until real Figma vector
// geometry lands (scripts/fetch-geometry.mjs). Classifies each un-exported icon
// by its NEAREST non-numeric text label, mapping to the one exported SVG we
// have per category. Once geometry arrives those nodes become render:"path" and
// bypass this map entirely. Merges into app/generated/icons.map.json (byId).
import fs from "node:fs";

const ICONS_MAP = "app/generated/icons.map.json";
const map = JSON.parse(fs.readFileSync(ICONS_MAP, "utf8"));
map.byId ||= {};

const RULES = [
  [/family|manufactured on site|trusted expertise|personal service|pillars of trust/i, "/assets/icons/diamond.svg"],
  [/custom jewellery|engagement|wedding rings|jewellery repairs|valuations|antique jewellery|watch services/i, "/assets/icons/ring-icon.svg"],
  [/^consultation$|concept|sketch|digital design|design approval|manufacturing|stone setting|final polish|^collection$/i, "/assets/icons/process-icon.svg"],
  [/location/i, "/assets/icons/info-location.svg"],
  [/phone|8356/i, "/assets/icons/info-phone.svg"],
  [/hours/i, "/assets/icons/info-hours.svg"],
  [/email/i, "/assets/icons/info-email.svg"],
  [/our store/i, "/assets/icons/tab-store.svg"],
  [/centre map|shopping centre/i, "/assets/icons/tab-map.svg"],
  [/google maps/i, "/assets/icons/tab-pin.svg"],
  [/wedding rings made|grandmother|first sketch|couldn|treasure|craftsmanship is outstanding|reworked|handled with such care/i, "/assets/icons/quote.svg"],
];
// size fallback (never returns quote — quote only via explicit review text)
function bySize(w, h) {
  const s = Math.max(w, h);
  if (s >= 60) return "/assets/icons/diamond.svg";
  if (s >= 30) return "/assets/icons/ring-icon.svg";
  return "/assets/icons/process-icon.svg";
}

let mapped = 0, total = 0;
for (const src of process.argv.slice(2)) {
  const j = JSON.parse(fs.readFileSync(src, "utf8"));
  const texts = [], icons = [];
  for (const s of j.sections) for (const n of s.nodes) {
    if (n.render === "text") texts.push({ cx: n.x + n.w / 2, cy: n.yAbs + n.h / 2, t: n.text.characters });
    else if (n.render === "vector" && n.needsSvg && n.h > 2 && n.w > 2) icons.push(n);
  }
  for (const ic of icons) {
    total++;
    const cx = ic.x + ic.w / 2, cy = ic.yAbs + ic.h / 2;
    const near = texts
      .map((t) => ({ t: t.t.replace(/\s+/g, " ").trim(), d: Math.hypot(t.cx - cx, t.cy - cy) }))
      .filter((t) => t.d < 220 && !/^\d{1,2}$/.test(t.t) && t.t.length > 1)
      .sort((a, b) => a.d - b.d)
      .slice(0, 6);
    let svg = null;
    outer: for (const t of near) for (const [re, s] of RULES) if (re.test(t.t)) { svg = s; break outer; }
    if (!svg) svg = bySize(ic.w, ic.h);
    map.byId[ic.id] = svg;
    mapped++;
  }
  console.log(`${src}: ${icons.length} icons, ${texts.length} texts`);
}
// Explicit overrides — nodes the nearest-text heuristic misclassifies. The
// "FIRST TIME VISITING?" find-us panels use the Grech "GJ" monogram (not a
// location pin / map icon), so pin them here after the auto-mapping.
const OVERRIDES = {
  // find-us "FIRST TIME VISITING?" GJ monogram (heuristic misreads it as a pin)
  "1:4108": "/assets/icons/gj-monogram.svg", // desktop
  "1:5403": "/assets/icons/gj-monogram.svg", // tablet
  // distinct pillar / service / process icons exported from Figma (PNG). Desktop
  // uses component-instance ids (islands); tablet/mobile use flattened vector ids.
  "1:4925": "/assets/icons/ic-diamond.png",
  "1:4932": "/assets/icons/ic-anvil.png",
  "1:4940": "/assets/icons/ic-magnifier.png",
  "1:4949": "/assets/icons/ic-hand.png",
  "1:4991": "/assets/icons/ic-rings.png",
  "1:5003": "/assets/icons/ic-anvil.png",
  "1:5013": "/assets/icons/ic-magnifier.png",
  "1:5026": "/assets/icons/ic-pendant.png",
  "1:5038": "/assets/icons/ic-watch.png",
  "1:5060": "/assets/icons/ic-people.png",
  "1:5071": "/assets/icons/ic-pliers.png",
  "1:5079": "/assets/icons/ic-pencil.png",
  "1:5087": "/assets/icons/ic-diamond.png",
  "1:5093": "/assets/icons/ic-monitor.png",
  "1:5101": "/assets/icons/ic-sparkles.png",
  "1:5110": "/assets/icons/ic-check.png",
  "1:5118": "/assets/icons/ic-ringbox.png",
  "1:4247": "/assets/icons/ic-diamond.png",
  "1:4254": "/assets/icons/ic-anvil.png",
  "1:4261": "/assets/icons/ic-magnifier.png",
  "1:4270": "/assets/icons/ic-hand.png",
  "1:4432": "/assets/icons/ic-rings.png",
  "1:4441": "/assets/icons/ic-anvil.png",
  "1:4450": "/assets/icons/ic-magnifier.png",
  "1:4461": "/assets/icons/ic-pendant.png",
  "1:4472": "/assets/icons/ic-watch.png",
  "1:4299": "/assets/icons/ic-people.png",
  "1:4312": "/assets/icons/ic-pencil.png",
  "1:4321": "/assets/icons/ic-monitor.png",
  "1:4331": "/assets/icons/ic-check.png",
  "1:4340": "/assets/icons/ic-pliers.png",
  "1:4350": "/assets/icons/ic-diamond.png",
  "1:4357": "/assets/icons/ic-sparkles.png",
  "1:4368": "/assets/icons/ic-ringbox.png",
  "I1:4178;307:1248;306:1226": "/assets/icons/ic-diamond.png",
  "I1:4178;307:1257;306:1226": "/assets/icons/ic-anvil.png",
  "I1:4178;307:1266;306:1226": "/assets/icons/ic-magnifier.png",
  "I1:4178;307:1275;306:1226": "/assets/icons/ic-hand.png",
  "I1:4183;318:2091;317:1855": "/assets/icons/ic-rings.png",
  "I1:4183;318:2106;317:1855": "/assets/icons/ic-anvil.png",
  "I1:4183;318:2107;317:1855": "/assets/icons/ic-magnifier.png",
  "I1:4183;318:2132;317:1855": "/assets/icons/ic-pendant.png",
  "I1:4183;318:2133;317:1855": "/assets/icons/ic-watch.png",
  "I1:4185;338:963;332:411": "/assets/icons/ic-people.png",
  "I1:4185;338:977;332:411": "/assets/icons/ic-pencil.png",
  "I1:4185;338:991;332:411": "/assets/icons/ic-monitor.png",
  "I1:4185;338:1005;332:411": "/assets/icons/ic-check.png",
  "I1:4185;338:1019;332:411": "/assets/icons/ic-pliers.png",
  "I1:4185;338:1020;332:411": "/assets/icons/ic-diamond.png",
  "I1:4185;338:1021;332:411": "/assets/icons/ic-sparkles.png",
  "I1:4185;338:1022;332:411": "/assets/icons/ic-ringbox.png",
  // footer social row, gallery arrows, footer copyright GJ (flattened vectors)
  "1:5529": "/assets/icons/gj-monogram.svg",
  "1:4570": "/assets/icons/gj-monogram.svg",
  "1:5499": "/assets/icons/social-row.svg",
  "1:4543": "/assets/icons/social-row.svg",
  "1:5152": "/assets/icons/gallery-arrows.svg",
  // process steps 2-8: circle+icon composites (step 1 keeps its own circle rect)
  "1:5079": "/assets/icons/ic-proc-pencil.png",
  "1:5093": "/assets/icons/ic-proc-monitor.png",
  "1:5110": "/assets/icons/ic-proc-check.png",
  "1:5071": "/assets/icons/ic-proc-pliers.png",
  "1:5087": "/assets/icons/ic-proc-diamond.png",
  "1:5101": "/assets/icons/ic-proc-sparkles.png",
  "1:5118": "/assets/icons/ic-proc-ringbox.png",
  "1:4312": "/assets/icons/ic-proc-pencil.png",
  "1:4321": "/assets/icons/ic-proc-monitor.png",
  "1:4331": "/assets/icons/ic-proc-check.png",
  "1:4340": "/assets/icons/ic-proc-pliers.png",
  "1:4350": "/assets/icons/ic-proc-diamond.png",
  "1:4357": "/assets/icons/ic-proc-sparkles.png",
  "1:4368": "/assets/icons/ic-proc-ringbox.png",
  // mobile: header hamburger + info-bar location/email/hours (heuristic misreads)
  "1:4830": "/assets/icons/menu.svg",
  "1:4607": "/assets/icons/info-location.svg",
  "1:4617": "/assets/icons/info-email.svg",
  "1:4621": "/assets/icons/info-hours.svg",
  // Custom Jewellery uses the solitaire-ring icon (design-system "Custom-Jewellery")
  "1:4421": "/assets/icons/ic-custom.png", // mobile
  "1:4978": "/assets/icons/ic-custom.png", // tablet
};
Object.assign(map.byId, OVERRIDES);

fs.writeFileSync(ICONS_MAP, JSON.stringify(map, null, 2) + "\n");
console.log(`mapped ${mapped}/${total} icons → ${ICONS_MAP}`);
