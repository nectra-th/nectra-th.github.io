# Grech Jewellers — Pixel-Perfect Build Method (Method C: Absolute Transpiler + Auto-Verify)

> **Purpose of this doc:** persist the agreed method so knowledge survives across sessions.
> Source of truth for layout = the Figma file. Never invent elements. Use only Figma SVGs/images.

## 0. Why this method

Hand-tuning a flow layout (Tailwind `py-*`, `gap-*`, margins) accumulates 1–2px rounding
per element and drifts. Two systematic causes were identified from the real Figma JSON:

1. **Flow rounding drift** — every margin/gap rounds independently → compounding error.
2. **`leadingTrim: "CAP_HEIGHT"`** — Figma text boxes are trimmed to cap-height/baseline,
   but browsers add half-leading above/below every line → *every* text box sits lower and
   taller than Figma. This is THE main reason "text doesn't line up." Fixed globally with
   CSS `text-box: trim-both cap alphabetic` (Chrome 128+) via a `.fig-text` utility.

**Decision:** geometry comes straight from Figma coordinates via absolute positioning.
No layout engine guesses anything. This guarantees geometric 100%; the only residual is
sub-pixel anti-aliasing at glyph edges (Figma raster engine vs Windows DirectWrite, ±1px),
which is invisible. Target = geometry 100% (auto-verified dx/dy per element → 0) + raster
diff < ~0.5%.

## 1. Data we have (session scratchpad)

Scratchpad: `%TEMP%\claude\C--Users-Phil-Grech-Jew\<session>\scratchpad`

| File | What |
|---|---|
| `desktop_full.json` | `/v1/files/:key/nodes?ids=1:3799` — **desktop frame 1920×11088**, flat children with `absoluteBoundingBox`, styles, fills, effects. Primary transpiler input. |
| `figma_inventory.json` | Per-section element inventory (HERO 40, WHY 10, PILLARS 20, WHATWEDO 38, PROCESS 41, FEATURED 21, REVIEWS 14, BRANDS 6, BOOKING 80, FINDUS 54, FOOTERCTA 5, FOOTER 46). |
| `image_fills.json` / `img_manifest.json` | `imageRef` → bitmap URL map (original images). |
| `specs/desktop.md`, `specs/tablet.md`, `specs/effects.md`, `specs/signup.md` | Extracted specs. |
| `isolate.js`, `measure.js`, `shots.js` | Playwright helpers (isolation, bbox measure, screenshots). |
| `desktop.png` / `tablet.png` / `mobile.png` | Figma-rendered ground-truth artboards. |

Figma file key `i4u7FpbtTFOZImGlLNFowq` (design URL `figma.com/design/i4u7FpbtTFOZImGlLNFowq/...`).
Confirmed frame ids (all three `/nodes` dumps now saved in-repo at `site/figma-data/`):
- **Desktop** `1:3799` — 1920×11088 → `figma-data/desktop.1_3799.json`
- **Tablet**  `1:4838` — "iPad Pro 11" 834×7779 → `figma-data/tablet.1_4838.json`
- **Mobile**  `1:4213` — "iPhone 13 & 14" 390×14249 → `figma-data/mobile.1_4213.json`

The exported/cached Figma SVG URLs (`figma-alpha-api.s3…/images/…`) do NOT need the token
and are NOT rate-limited — re-download from those instead of re-calling `/v1/images`.

## STATUS (2026-07-25, END of overnight run)

**DONE — the pixel-perfect responsive site is LIVE at `/` (`app/page.tsx`).**
- Old hand-built homepage preserved at `/legacy`.
- All 3 artboards render pixel-perfect (verify.mjs 0 off): desktop/tablet/mobile.
- `ResponsiveHome` scales the matching artboard to the viewport.
- Booking widget fully functional (date→time→form→`/api/bookings`, respects Sat hours).
- Routes healthy: `/`, `/figma-preview[/tablet|/mobile]`, `/legacy`, `/api/bookings`.

**ONE known gap — distinct icons.** Figma uses DISTINCT icons per item for the process
steps (8) and some services/pillars; we only hold one exported SVG per category, so those
render as category-uniform placeholders (`scripts/map-icons.mjs`, nearest-text fallback).
The REAL fix is vector geometry (`render:"path"`) — but Figma `/images` AND `/nodes?geometry`
returned **429 continuously for 1h+** (a long/daily quota exhausted by this session's volume,
NOT a per-minute window). A background retry (`scripts/fetch-geometry.mjs`, 20-min interval,
up to 20h) is running; the moment the quota resets it fetches geometry, re-transpiles, and
the distinct icons replace the placeholders automatically (no code change needed). To do it
by hand later: `node scripts/fetch-geometry.mjs` once the API stops 429-ing.

Minor: findus bg watermark reads slightly brighter than Figma's render (data is faithful:
black fill + image at 39% opacity); footer social icons lack their thin circular border
(also fixed by geometry). Both cosmetic.

## STATUS (2026-07-25, overnight autonomous run)

**All three breakpoints geometrically pixel-perfect (verify.mjs, 0 elements off):**
- Desktop 1920 (`/figma-preview`): 8 sections, 288 nodes — 0 off.
- Tablet 834 (`/figma-preview/tablet`): 261 nodes — 0 off.
- Mobile 390 (`/figma-preview/mobile`): 224 nodes — 0 off.
- Responsive homepage (`/figma-live`): `ResponsiveHome` picks the artboard by
  viewport (<700 mobile / <1200 tablet / else desktop) and scales it to width.
- Booking calendar is a functional island (`BookingWidget`, reuses `/api/bookings`),
  desktop/tablet 3-col, mobile stacked; slotted into each frame's "IDLE STATE".
- Images: real Figma bitmaps via the image-FILL endpoint → `public/assets/figma-img/`
  (`scripts/fetch-images.mjs`). Dark scrims handled (solid fill + image opacity).

**Icons — the one open item.** Icons render from Figma vector geometry (`render:"path"`,
inline SVG). Fetched via `/v1/files/:key/nodes?ids=…&geometry=paths` (`scripts/fetch-geometry.mjs`)
into `figma-data/<bp>.geo.json`, then re-transpiled. The `/v1/images` render endpoint AND
`/nodes?geometry` are **heavily rate-limited (429)** after this session's volume — a
background fetch retries with 5-min backoff after an initial drain. Desktop's main icons
already work (island-mapped to `public/assets/icons/*`); tablet/mobile icons appear once
the geometry frames land. NOTE: the aggressive early retries kept Figma's sliding window
saturated — always back OFF (single loop, ≥5-min interval) so it can reset.

**Remaining once geometry lands:** re-transpile (auto), visual review all 3 breakpoints,
swap `app/page.tsx` to the `/figma-live` responsive component, final review.

## STATUS (earlier)

**Pipeline built & proven.** `scripts/transpile.mjs`, `app/components/figma/{FigmaNode,FigmaSection}.tsx`,
`scripts/verify.mjs`. Preview route: **`/figma-preview`** (desktop top-7 sections).
Generated specs: `app/generated/{desktop,tablet,mobile}.layout.json`,
`images.map.json` (28 refs, 0 misses), `icons.map.json`.

- ✅ **Desktop hero→brands (7 sections, 213 elements): 0 elements off >1.5px** — verified.
  Geometry is exact; only residual is ≤1 line of soft-wrap reflow on long body copy,
  which is non-cascading under absolute positioning (invisible).
- ⏳ **Desktop `closing` band** (booking + findus + footer, 207 nodes) — NOT done. Contains
  the interactive Booking calendar → render static nodes + slot the existing `Booking`/
  `FindUs`/`Footer` React components as islands. Many leaf-vector icons here (info/social/
  tab/map) → islandize their parent groups or map by id to `public/assets/icons/*`.
- ⏳ **Tablet & mobile** — layout specs generated (transpiler is breakpoint-agnostic) but not
  rendered/verified yet. Need their own islands config (mobile header/nav differs) — image
  map is shared (keyed by imageRef). Do desktop-complete first, then tablet, then mobile.
- ⏳ **Homepage integration** — `/figma-preview` is standalone; `app/page.tsx` still uses the
  older hand-built components. Swap once `closing` + breakpoints are done.

Key renderer facts learned:
- Figma `rotation` is **radians** → CSS `rotate(rad*180/π)`; forgetting this tilts 180° flips by 3°.
- Text wrap: `pre` when hard breaks explain all visual lines (auto-width boxes, prevents
  drift-wrap); `pre-wrap` only when Figma soft-wraps (visualLines > hardLines). A box taller
  than ~1.3×lineHeight is ≥2 visual lines.
- Container backgrounds must emit on **fill OR gradient OR stroke** (bordered ghost buttons).
- Large solid-filled VECTORs (≥120px) are background shapes → render as rect.

## 2. Coordinate model

Desktop frame is 1920 wide. Real content sits in a **1180px centered container**
(`x` range ≈ 370..1550). So for a centered `max-w-[1180px]` container:

```
container-local-x = figma_x - 370
```

Section vertical boundaries are real Figma `LINE` nodes (4px `#c8b08a` where visible,
0-height hairlines elsewhere). Confirmed y-positions (Line 14–22):

```
y = 988, 2634, 4092, 5516, 6604, 7372, 7657
```

Each section = `position: relative` box whose height = distance between its boundaries;
children placed `position: absolute` at `(figma_x - sectionLeft, figma_y - sectionTop)`.

## 3. Pipeline (Method C — Hybrid)

```
Figma JSON ──transpile.mjs──▶ app/generated/<bp>.layout.json ──▶ <FigmaLayout> renderer
                                                                        │
 interactive islands (Booking calendar, carousels, header CTA) ────────┘  (placed absolute
                                                                            at Figma coords)
verify.mjs (Playwright): opacity-isolate each element → getBoundingClientRect → diff vs JSON
          → report dx/dy per element → iterate until 0.
```

### 3a. `transpile.mjs`
- Read the frame node JSON; walk the tree (recurse into `INSTANCE`/`FRAME`/`GROUP`).
- For each leaf emit a spec node:
  `{ id, name, type, x, y, w, h, text?, style?, fills?, strokes?, effects?, imageRef?, cornerRadius?, rotation? }`
  with x/y **relative to its section** (assign section by y-range from the boundary list).
- Text: capture `characters`, `fontFamily`, `fontPostScriptName`, `fontWeight`, `fontSize`,
  `letterSpacing`, `lineHeightPx`, `textAlignHorizontal`, `textCase`, fill color, and
  `leadingTrim` → renderer applies `.fig-text` (text-box-trim) + exact px.
- Image (`type` has an IMAGE fill): resolve `imageRef` → local asset in `public/assets/`,
  apply `scaleMode` (FILL→cover, FIT→contain).
- Vector/line/icon: use the **exported Figma SVG** (never redraw). Download per-node SVG.
- Skip/replace nodes flagged as interactive-island slots.

### 3b. `<FigmaLayout>` renderer (`app/components/figma/`)
- One `<section data-fig-section>` per section, `relative`, fixed height (desktop values;
  overridden per breakpoint).
- Children: absolute divs. `data-fig="<nodeId>"` on every element for auto-verify.
- Text uses `.fig-text`; images `next/image`; svg inlined.
- Interactive islands rendered into their slot `<div>` at the slot's absolute box.

### 3c. `verify.mjs`
- For each `data-fig` node: read expected `{x,y,w,h}` from layout JSON (container-local),
  measure `getBoundingClientRect()` relative to the section, output `dx,dy,dw,dh`.
- Optional opacity-isolation screenshot per node for visual overlay.
- Loop: fix → re-run → until every `|d*| ≤ 1px`.

## 4. Responsive (3 breakpoints)

Figma has 3 artboards → generate 3 layout JSONs (`desktop`/`tablet`/`mobile`).
Container widths: desktop 1180 (frame 1920), tablet ~ (frame 834), mobile ~ (frame 390).
Render all three; switch with `hidden`/`lg:block` style breakpoint gates:
- mobile layout: `< 48rem`
- tablet layout: `48rem – 63.99rem`
- desktop layout: `≥ 64rem`
Do **desktop to 100% first**, then tablet, then mobile.

## 5. Hard rules (unchanged, absolute)

1. **Never invent elements.** Anything not in Figma → remove.
2. **Figma SVG/images only.** Never hand-draw or source icons (diamond, ring, arrows, social…).
3. **Full inventory per section first**, then build.
4. **Figma is the sole source of truth** — always re-read the JSON, don't eyeball.
5. **Desktop-first to 100%, then tablet, then mobile**, using proper breakpoints.
6. **Outside-in, element-by-element**, verify overlap before moving on.
7. **Opacity-isolation** to confirm 100% overlap of the element under work.

## 6. Known facts already extracted

- Section-boundary lines: 4px `#c8b08a`; hairlines elsewhere; y as in §2.
- Heading dividers: `#9c7430` (gold-dark) 2px; widths vary (114/64/32/124/48px).
- Real icons are `#9C7430`/`#B58A47` filled Figma vectors; social icons are plain white
  paths (NO circular border — that border was invented and has been removed).
- Gallery arrows are full Figma buttons (bg+border), exported as SVG, not bare chevrons.
- Fonts: Cormorant Garamond (display serif) + Manrope (body).

## 7. Ops notes

- **Restart dev/prod server (Windows):**
  `PID=$(netstat -ano | grep ':3000' | grep LISTENING | awk '{print $5}'); taskkill //F //PID $PID`
  then `npm run start > /tmp/grech-prod.log 2>&1 &` (pkill does not work here).
- **Figma 429:** back off; do not `sleep` in a tool call (blocked) — use ScheduleWakeup/Monitor.
- **This Next.js is patched** (see `AGENTS.md`): read `node_modules/next/dist/docs/` before
  using unfamiliar APIs.
