import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/login", "/register", "/forgot-password", "/routes"];

  return routing.locales.flatMap((locale) =>
    routes.map((route) => {
      const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
      return {
        url: `${siteUrl}${prefix}${route}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: route === "" ? 1 : 0.5,
      };
    })
  );
}
