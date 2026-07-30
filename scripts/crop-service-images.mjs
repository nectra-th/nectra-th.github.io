// Crop the 6 "What We Do" service photos to match Figma's exact imageTransform
// framing (scaleMode STRETCH maps frame-space [0,1]^2 to image-space [0,1]^2
// via a diagonal affine matrix — off-diagonal terms are 0 for all 6, so each
// crop is just an independent X/Y window: [tx, tx+a] x [ty, ty+d]).
import fs from "fs";
import { PNG } from "pngjs";

const SRC_DIR = "public/assets/figma-img";
const OUT_DIR = "public/assets/figma-img/cropped";
fs.mkdirSync(OUT_DIR, { recursive: true });

const CROPS = [
  { ref: "170a0dc03a4a67f171f5bbfcbc64747037945dde", a: 0.44205743074417114, tx: 0.49900162220001221, d: 0.59276175498962402, ty: 0.10068653523921967 },
  { ref: "c5c992b48e443701e426c3606eda9e7413009670", a: 0.70943397283554077, tx: 0.15094339847564697, d: 0.95129132270812988, ty: -0.0035273781977593899 },
  { ref: "f481b2b8396296b95352a977041180e3aafb449a", a: 0.60206246376037598, tx: 0.23106551170349121, d: 0.76859027147293091, ty: 0.074544742703437805 },
  { ref: "4ac7c8fe6797951d87385b00fd3ba3e144263657", a: 0.70943397283554077, tx: 0.014752603136003017, d: 0.90566039085388184, ty: 0.023648323491215706 },
  { ref: "a3a7e179e1e16f7a5392d7ee70b87cf294ca2051", a: 0.48979163169860840, tx: 0.25435394048690796, d: 0.62526589632034302, ty: 0.18827275931835175 },
  { ref: "a0ea27c7ddd271697692c04050ca9bbdd77a11ec", a: 0.77049183845520020, tx: 0.13599607348442078, d: 0.98360651731491089, ty: 0.014397845603525639 },
];

for (const c of CROPS) {
  const src = fs.readFileSync(`${SRC_DIR}/${c.ref}.png`);
  const png = PNG.sync.read(src);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const x0 = clamp(Math.round(c.tx * png.width), 0, png.width);
  const y0 = clamp(Math.round(c.ty * png.height), 0, png.height);
  const x1 = clamp(Math.round((c.tx + c.a) * png.width), 0, png.width);
  const y1 = clamp(Math.round((c.ty + c.d) * png.height), 0, png.height);
  const w = x1 - x0;
  const h = y1 - y0;
  const out = new PNG({ width: w, height: h });
  PNG.bitblt(png, out, x0, y0, w, h, 0, 0);
  const buf = PNG.sync.write(out);
  fs.writeFileSync(`${OUT_DIR}/${c.ref}.png`, buf);
  console.log(c.ref, `source ${png.width}x${png.height} -> crop ${w}x${h} at (${x0},${y0})`);
}
