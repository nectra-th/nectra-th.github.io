import type { MetadataRoute } from "next";

const SITE = "https://grech-jewellers.vercel.app";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE}/login`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE}/signup`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
