import { cache } from "react";
import { db } from "@/lib/db";
import { specTemplates } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";

export const getSpecTemplatesByCategory = cache(async (categoryId: string) => {
  return db
    .select()
    .from(specTemplates)
    .where(eq(specTemplates.categoryId, categoryId))
    .orderBy(asc(specTemplates.sortOrder));
});
