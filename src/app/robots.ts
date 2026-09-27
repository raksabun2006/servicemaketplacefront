import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = siteConfig.url;

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/services",
          "/services/*",
          "/providers",
          "/providers/*",
          "/locations",
          "/locations/*",
          "/about",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/customer",
          "/customer/*",
          "/provider/dashboard",
          "/provider/dashboard/*",
          "/provider/profile",
          "/provider/bookings",
          "/provider/offers",
          "/provider/messages",
          "/provider/availability",
          "/provider/application",
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/api/*",
          "/_next/*",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
