import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const SITE_URL = "https://grech-jewellers.vercel.app";
const TITLE = "Grech Jewellers | Expert Craftsmanship, Personally Made — Since 1978";
const DESCRIPTION =
  "Adelaide's trusted manufacturing jeweller since 1978. Custom jewellery, engagement & wedding rings, repairs, valuations and more — personally designed and precision manufactured on site.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "jeweller Adelaide", "custom jewellery", "engagement rings Adelaide",
    "wedding rings", "manufacturing jeweller", "jewellery repairs", "valuations",
    "Grech Jewellers", "Fulham Gardens",
  ],
  applicationName: "Grech Jewellers",
  authors: [{ name: "Grech Jewellers" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Grech Jewellers",
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "en_AU",
    images: [{ url: "/assets/grech-hero-poster.jpg", width: 1920, height: 1080, alt: "Grech Jewellers — custom jewellery, handcrafted in Adelaide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/assets/grech-hero-poster.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <head>
        {/* If JS is unavailable, never hide scroll-reveal content. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important;}`}</style>
        </noscript>
      </head>
      <body className="antialiased bg-ink text-ink font-sans">{children}</body>
    </html>
  );
}
