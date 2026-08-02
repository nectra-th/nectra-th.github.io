import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import NoContextMenu from "./components/NoContextMenu";
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

// The business's real domain — canonical for every deployed copy (GH Pages
// mirror, Vercel), so search engines consolidate ranking signals here
// instead of treating the mirrors as duplicate content.
const SITE_URL = "https://www.grechjewellers.com.au";
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

// JewelryStore structured data — real business details (matches FindUs.tsx),
// so Google can surface address/phone/hours directly in local search results.
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  name: "Grech Jewellers",
  image: `${SITE_URL}/assets/grech-hero-poster.jpg`,
  url: SITE_URL,
  telephone: "+61883567764",
  email: "jeweller@grechjewellers.com.au",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Shop 90/457 Tapleys Hill Road",
    addressLocality: "Fulham Gardens",
    addressRegion: "SA",
    postalCode: "5024",
    addressCountry: "AU",
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "17:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "13:00" },
  ],
  sameAs: [
    "https://www.facebook.com/grechjewellery",
    "https://www.instagram.com/grechjewellers/?hl=en",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      </head>
      <body className="antialiased bg-ink text-ink font-sans"><NoContextMenu />{children}</body>
    </html>
  );
}
