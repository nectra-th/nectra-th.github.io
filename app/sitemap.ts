import type { MetadataRoute } from "next";

const SITE = "https://www.grechjewellers.com.au";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE}/`, changeFrequency: "monthly", priority: 1 }];
}
