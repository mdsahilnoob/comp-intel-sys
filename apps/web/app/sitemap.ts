import type { MetadataRoute } from "next";

import { AI_COMPANY_DEFINITIONS } from "@/server/ai-companies";
import { siteUrl } from "@/lib/site-url";
import { getCatalogOptions } from "@/server/catalog";

const staticRoutes = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/explore", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/companies", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/compare", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/methodology", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/research", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/submit", priority: 0.4, changeFrequency: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const catalog = getCatalogOptions();
  const companyRoutes = catalog.companies.map((company) => ({
    path: `/companies/${company.slug}`,
    priority: 0.65,
    changeFrequency: "weekly" as const,
  }));
  const aiCompanyRoutes = AI_COMPANY_DEFINITIONS.map((company) => ({
    path: `/companies/${company.slug}`,
    priority: 0.75,
    changeFrequency: "weekly" as const,
  }));
  const lastModified = new Date();

  return [...staticRoutes, ...companyRoutes, ...aiCompanyRoutes]
    .filter(
      (route, index, routes) =>
        routes.findIndex((candidate) => candidate.path === route.path) ===
        index,
    )
    .map((route) => ({
      url: `${siteUrl}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }));
}
