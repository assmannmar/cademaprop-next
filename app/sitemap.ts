import type { MetadataRoute } from "next";
import { absoluteUrl } from "./lib/seo";

export const dynamic = "force-static";

const staticRoutes = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/propiedades", priority: 0.95, changeFrequency: "daily" },
  { path: "/emprendimientos", priority: 0.9, changeFrequency: "weekly" },
  { path: "/tasar-vender", priority: 0.85, changeFrequency: "monthly" },
  { path: "/industria", priority: 0.85, changeFrequency: "weekly" },
  { path: "/nosotros", priority: 0.75, changeFrequency: "monthly" },
  { path: "/contacto", priority: 0.75, changeFrequency: "monthly" },
  { path: "/simulador", priority: 0.6, changeFrequency: "monthly" },
  {
    path: "/emprendimientos/campo-alto",
    priority: 0.85,
    changeFrequency: "weekly",
  },
  {
    path: "/emprendimientos/islas-barrios-nauticos",
    priority: 0.85,
    changeFrequency: "weekly",
  },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return staticRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
