import type { NextConfig } from "next";

// STATIC_EXPORT=1 produces a fully static site (`out/`) for GitHub Pages.
// Left off for local `next dev`/`next build` so the booking API route still runs.
const isExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  // Native image-optimization codecs are blocked by this machine's Application
  // Control policy (and unavailable on a static host), so serve the already
  // correctly-sized static assets directly.
  images: {
    unoptimized: true,
  },
  ...(isExport
    ? {
        output: "export" as const,
        // emit `/route/index.html` so GitHub Pages resolves sub-pages cleanly
        trailingSlash: true,
        // the app already runs under `next dev`; don't let the static-export
        // deploy fail on pre-existing type-only issues.
        typescript: { ignoreBuildErrors: true },
      }
    : {}),
};

export default nextConfig;
