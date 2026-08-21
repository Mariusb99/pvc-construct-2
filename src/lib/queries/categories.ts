import { cache } from "react";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";

export const getActiveCategories = cache(async () => {
  return db
    .select()
    .from(categories)
    .where(eq(categories.active, true))
    .orderBy(asc(categories.sortOrder));
});

export const getAllCategories = cache(async () => {
  return db.select().from(categories).orderBy(asc(categories.sortOrder));
});

export const getCategoryBySlug = cache(async (slug: string) => {
  const [row] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  return row ?? null;
});
