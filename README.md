# Grech Jewellers — Website

A pixel-faithful build of the Grech Jewellers Figma design: a premium single-page
landing site for an Adelaide manufacturing jeweller, plus a working **booking
system** (calendar + time picker) with a file-backed backend and an admin view.

Built with **Next.js 16 (App Router) + React 19 + Tailwind CSS v4**.
Fonts: Cormorant Garamond (display) + Manrope (body), self-hosted via `next/font`.

## Getting started

```bash
cd site
npm install          # first time only
npm run dev          # dev server → http://localhost:3000
```

Production:

```bash
npm run build
npm run start        # → http://localhost:3000
```

## Project structure

```
site/
├─ app/
│  ├─ layout.tsx            # fonts + metadata
│  ├─ globals.css           # design tokens (brand colours, fonts)
│  ├─ page.tsx              # composes all sections
│  ├─ components/           # one file per section (Hero, WhyGrech, … Footer)
│  │  ├─ Booking.tsx        # calendar + time picker + contact form (client)
│  │  ├─ icons.tsx          # inline SVG icons
│  │  └─ ui.tsx             # Container / Button / Eyebrow helpers
│  ├─ (auth)/               # split-screen /signup + /login (UI only, stubbed submit)
│  │  ├─ layout.tsx         # image panel + member benefits
│  │  ├─ signup/page.tsx · login/page.tsx
│  ├─ components/auth/      # AuthField, PasswordMeter, SocialAuth, AuthTabs
│  ├─ components/Reveal.tsx # IntersectionObserver scroll-reveal (reduced-motion aware)
│  ├─ api/bookings/route.ts # GET (taken slots) + POST (create booking)
│  └─ admin/page.tsx        # bookings dashboard (key-protected)
├─ lib/bookings.ts          # data access (reads/writes data/bookings.json)
├─ data/bookings.json       # booking store (created on first booking)
└─ public/assets/           # images exported from Figma (optimised)
```

## Booking system

- **Customer flow:** pick a date → pick an available time → fill name / email /
  phone → confirm. Sundays are disabled; Saturdays only offer 9am–1pm slots;
  past dates/times are disabled; already-booked slots are greyed out.
- **Backend:** `POST /api/bookings` validates input, rejects double-bookings
  (HTTP 409) and past/closed dates (HTTP 400), and appends to
  `data/bookings.json`. `GET /api/bookings` returns taken slots so the UI can
  disable them.
- **Admin:** view all bookings at **`/admin?key=grech1978`**.
  Change the key by setting the `ADMIN_KEY` environment variable.

> The booking store is a JSON file (no database), chosen because this machine's
> Application Control policy blocks native binaries (SQLite/Prisma engines).
> To move to a real database later, only `lib/bookings.ts` needs to change.

## Notes

- `next.config.ts` sets `images.unoptimized` because the native image-optimisation
  codec is blocked on this machine; assets in `public/assets/` are pre-sized and
  compressed instead (~5 MB total).
- Visual/responsive checks were done with Playwright (a dev dependency) capturing
  full-page screenshots at 390 / 834 / 1440 / 1920 px, matched against the Figma
  desktop/iPad/iPhone artboards (desktop ~98%, mobile ~102%, tablet ~117% of the
  Figma heights; the iPad artboard is a bespoke ultra-compact design).
- **Sign up / Sign in** live at `/signup` and `/login` (UI only — the submit is a
  stubbed `fakeAuth` that shows a success state; no auth backend yet).
- **Motion system** (`app/globals.css` + `Reveal.tsx`): one easing curve, gold
  accent, hover lifts/zooms, animated underlines, scroll-reveal, `focus-visible`
  rings, all disabled under `prefers-reduced-motion`. A `<noscript>` fallback keeps
  reveal content visible without JS.
