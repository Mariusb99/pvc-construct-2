import type { MetadataRoute } from "next";
import { getActiveCategories } from "@/lib/queries/categories";
import { getAllEquipmentForSitemap } from "@/lib/queries/equipment";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pvcconstruct.ro";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Dacă baza de date e momentan inaccesibilă în timpul build-ului, livrăm
  // doar paginile fixe în loc să oprim tot deploy-ul.
  let categoriesList: Awaited<ReturnType<typeof getActiveCategories>> = [];
  let equipmentList: Awaited<ReturnType<typeof getAllEquipmentForSitemap>> = [];
  try {
    [categoriesList, equipmentList] = await Promise.all([
      getActiveCategories(),
      getAllEquipmentForSitemap(),
    ]);
  } catch (error) {
    console.error("sitemap: baza de date indisponibilă, folosesc doar rutele fixe", error);
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/utilaje`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/despre-noi`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.5 },
    {
      url: `${siteUrl}/politica-de-confidentialitate`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categoriesList.map((c) => ({
    url: `${siteUrl}/utilaje/${c.slug}`,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const equipmentRoutes: MetadataRoute.Sitemap = equipmentList.map((e) => ({
    url: `${siteUrl}/utilaje/${e.categorySlug}/${e.slug}`,
    lastModified: e.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...equipmentRoutes];
}
