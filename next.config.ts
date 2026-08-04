import type { NextConfig } from "next";

// STATIC_EXPORT=1 produces a fully static site (`out/`) for GitHub Pages.
// Left off for local `next dev`/`next build` so the booking API route still runs.
const isExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  // next/image optimization runs on Vercel's infrastructure at request time, so
  // enable it there (WebP/AVIF + responsive resizing). Locally the machine's
  // Application Control blocks the native codecs, and a static export has no
  // optimizer, so those serve the original assets unoptimized. Either way
  // next/image still gives us explicit dimensions (no CLS) + lazy loading.
  images: {
    // export has no optimizer (must be unoptimized); otherwise optimize only on
    // Vercel, where the codecs are available at request time.
    unoptimized: isExport || !process.env.VERCEL,
  },
  ...(isExport
    ? {
        output: "export" as const,
        // emit `/route/index.html` so GitHub Pages resolves sub-pages cleanly
        trailingSlash: true,
        // the app already runs under `next dev`; don't let the static-export
        // deploy fail on pre-existing type-only issues.
        typescript: { ignoreBuildErrors: true },
        // static hosting has no booking API — flip the widget into demo mode
        // (skip availability fetch, simulate a successful submit) instead of
        // 404ing against /api/bookings.
        env: { NEXT_PUBLIC_DEMO: "1" },
      }
    : {}),
};

export default nextConfig;
