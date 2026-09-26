import { MetadataRoute } from "next";
import { siteConfig, SERVICE_CATEGORIES_SEO, LOCATIONS_SEO } from "@/lib/seo";
import { providerApi } from "@/lib/api/provider.api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = siteConfig.url;
  const now = new Date();

  // 1. Core Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/providers`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // 2. Service Category Pages
  const categoryRoutes: MetadataRoute.Sitemap = Object.keys(SERVICE_CATEGORIES_SEO).map((slug) => ({
    url: `${siteUrl}/services/${slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  // 3. Location Hub Pages
  const locationRoutes: MetadataRoute.Sitemap = Object.keys(LOCATIONS_SEO).map((slug) => ({
    url: `${siteUrl}/locations/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 4. Public Providers (Safely fetched from API)
  let providerRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await providerApi.list({ page: 0, size: 100 });
    const providers = res?.content || [];
    providerRoutes = providers
      .filter((p) => Boolean(p.id))
      .map((p) => ({
        url: `${siteUrl}/providers/${p.id}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.75,
      }));
  } catch {
    // If API unavailable during build, proceed with static routes
    providerRoutes = [];
  }

  return [...staticRoutes, ...categoryRoutes, ...locationRoutes, ...providerRoutes];
}
