import { db } from "@/lib/db";
import {
  equipment,
  categories,
  brands,
  equipmentImages,
  equipmentSpecifications,
} from "@/lib/db/schema";
import { and, asc, desc, eq, gte, ilike, inArray, lte, or, sql } from "drizzle-orm";

export type EquipmentListItem = {
  id: string;
  model: string;
  slug: string;
  year: number | null;
  hours: number | null;
  location: string | null;
  salePrice: string | null;
  rentalPriceDay: string | null;
  rentalPriceWeek: string | null;
  rentalPriceMonth: string | null;
  status: (typeof equipment.$inferSelect)["status"];
  featured: boolean;
  categoryName: string;
  categorySlug: string;
  brandName: string | null;
  primaryImage: string | null;
};

const baseSelect = {
  id: equipment.id,
  model: equipment.model,
  slug: equipment.slug,
  year: equipment.year,
  hours: equipment.hours,
  location: equipment.location,
  salePrice: equipment.salePrice,
  rentalPriceDay: equipment.rentalPriceDay,
  rentalPriceWeek: equipment.rentalPriceWeek,
  rentalPriceMonth: equipment.rentalPriceMonth,
  status: equipment.status,
  featured: equipment.featured,
  createdAt: equipment.createdAt,
  categoryName: categories.name,
  categorySlug: categories.slug,
  brandName: brands.name,
};

async function attachPrimaryImages<T extends { id: string }>(
  rows: T[]
): Promise<(T & { primaryImage: string | null })[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);
  const images = await db
    .select({
      equipmentId: equipmentImages.equipmentId,
      imageUrl: equipmentImages.imageUrl,
      sortOrder: equipmentImages.sortOrder,
    })
    .from(equipmentImages)
    .where(inArray(equipmentImages.equipmentId, ids))
    .orderBy(asc(equipmentImages.sortOrder));

  const firstImageByEquipment = new Map<string, string>();
  for (const img of images) {
    if (!firstImageByEquipment.has(img.equipmentId)) {
      firstImageByEquipment.set(img.equipmentId, img.imageUrl);
    }
  }

  return rows.map((row) => ({
    ...row,
    primaryImage: firstImageByEquipment.get(row.id) ?? null,
  }));
}

export async function getFeaturedEquipment(limit = 8) {
  const rows = await db
    .select(baseSelect)
    .from(equipment)
    .innerJoin(categories, eq(equipment.categoryId, categories.id))
    .leftJoin(brands, eq(equipment.brandId, brands.id))
    .where(eq(equipment.featured, true))
    .orderBy(desc(equipment.createdAt))
    .limit(limit);

  return attachPrimaryImages(rows);
}

export type EquipmentFilters = {
  q?: string;
  categorySlug?: string;
  brandSlug?: string;
  listingType?: "vanzare" | "inchiriere";
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  status?: string;
  sort?: "recent" | "price-asc" | "price-desc" | "year-desc";
  page?: number;
  perPage?: number;
};

export async function getEquipmentList(filters: EquipmentFilters) {
  const {
    q,
    categorySlug,
    brandSlug,
    listingType,
    yearMin,
    yearMax,
    priceMin,
    priceMax,
    status,
    sort = "recent",
    page = 1,
    perPage = 12,
  } = filters;

  const conditions = [];

  if (q) {
    conditions.push(
      or(ilike(equipment.model, `%${q}%`), ilike(brands.name, `%${q}%`))
    );
  }
  if (categorySlug) conditions.push(eq(categories.slug, categorySlug));
  if (brandSlug) conditions.push(eq(brands.slug, brandSlug));
  if (listingType === "vanzare") {
    conditions.push(
      inArray(equipment.status, ["DE_VANZARE", "DE_VANZARE_SI_INCHIRIAT"])
    );
  }
  if (listingType === "inchiriere") {
    conditions.push(
      inArray(equipment.status, ["DE_INCHIRIAT", "DE_VANZARE_SI_INCHIRIAT"])
    );
  }
  if (status) {
    conditions.push(eq(equipment.status, status as typeof equipment.$inferSelect.status));
  }
  if (yearMin) conditions.push(gte(equipment.year, yearMin));
  if (yearMax) conditions.push(lte(equipment.year, yearMax));
  if (priceMin) conditions.push(gte(equipment.salePrice, String(priceMin)));
  if (priceMax) conditions.push(lte(equipment.salePrice, String(priceMax)));

  const whereClause = conditions.length ? and(...conditions) : undefined;

  const orderBy = {
    recent: desc(equipment.createdAt),
    "price-asc": asc(equipment.salePrice),
    "price-desc": desc(equipment.salePrice),
    "year-desc": desc(equipment.year),
  }[sort];

  const query = db
    .select(baseSelect)
    .from(equipment)
    .innerJoin(categories, eq(equipment.categoryId, categories.id))
    .leftJoin(brands, eq(equipment.brandId, brands.id))
    .where(whereClause)
    .orderBy(orderBy)
    .limit(perPage)
    .offset((page - 1) * perPage);

  const countQuery = db
    .select({ count: sql<number>`count(*)::int` })
    .from(equipment)
    .innerJoin(categories, eq(equipment.categoryId, categories.id))
    .leftJoin(brands, eq(equipment.brandId, brands.id))
    .where(whereClause);

  const [rows, [{ count }]] = await Promise.all([query, countQuery]);
  const withImages = await attachPrimaryImages(rows);

  return {
    items: withImages,
    total: count,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(count / perPage)),
  };
}

export async function getEquipmentById(id: string) {
  const [row] = await db.select().from(equipment).where(eq(equipment.id, id)).limit(1);
  if (!row) return null;

  const [images, specifications] = await Promise.all([
    db
      .select()
      .from(equipmentImages)
      .where(eq(equipmentImages.equipmentId, id))
      .orderBy(asc(equipmentImages.sortOrder)),
    db
      .select()
      .from(equipmentSpecifications)
      .where(eq(equipmentSpecifications.equipmentId, id))
      .orderBy(asc(equipmentSpecifications.sortOrder)),
  ]);

  return { ...row, images, specifications };
}

export async function getEquipmentBySlug(slug: string) {
  const [row] = await db
    .select({
      ...baseSelect,
      description: equipment.description,
      metaTitle: equipment.metaTitle,
      metaDescription: equipment.metaDescription,
      categoryId: equipment.categoryId,
      brandId: equipment.brandId,
    })
    .from(equipment)
    .innerJoin(categories, eq(equipment.categoryId, categories.id))
    .leftJoin(brands, eq(equipment.brandId, brands.id))
    .where(eq(equipment.slug, slug))
    .limit(1);

  if (!row) return null;

  const [images, specifications] = await Promise.all([
    db
      .select()
      .from(equipmentImages)
      .where(eq(equipmentImages.equipmentId, row.id))
      .orderBy(asc(equipmentImages.sortOrder)),
    db
      .select()
      .from(equipmentSpecifications)
      .where(eq(equipmentSpecifications.equipmentId, row.id))
      .orderBy(asc(equipmentSpecifications.sortOrder)),
  ]);

  return { ...row, images, specifications };
}

export async function getRelatedEquipment(categoryId: string, excludeId: string, limit = 4) {
  const rows = await db
    .select(baseSelect)
    .from(equipment)
    .innerJoin(categories, eq(equipment.categoryId, categories.id))
    .leftJoin(brands, eq(equipment.brandId, brands.id))
    .where(and(eq(equipment.categoryId, categoryId), sql`${equipment.id} != ${excludeId}`))
    .orderBy(desc(equipment.createdAt))
    .limit(limit);

  return attachPrimaryImages(rows);
}

export async function getAllEquipmentForSitemap() {
  return db
    .select({
      slug: equipment.slug,
      categorySlug: categories.slug,
      updatedAt: equipment.updatedAt,
    })
    .from(equipment)
    .innerJoin(categories, eq(equipment.categoryId, categories.id));
}

export async function countEquipmentByCategory() {
  const rows = await db
    .select({
      categoryId: equipment.categoryId,
      count: sql<number>`count(*)::int`,
    })
    .from(equipment)
    .groupBy(equipment.categoryId);

  return new Map(rows.map((r) => [r.categoryId, r.count]));
}
