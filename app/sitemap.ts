import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://alihsan.sch.ng";

  const publicRoutes = [
    "",
    "/about",
    "/academics",
    "/campuses",
    "/admissions",
    "/careers",
    "/contact",
    "/privacy",
    "/terms",
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}