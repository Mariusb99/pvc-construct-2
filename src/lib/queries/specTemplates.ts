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

/**
 * Toate șabloanele, într-o singură interogare, grupate pe categorie.
 *
 * Pagina de administrare a categoriilor le cerea altfel una câte una (o
 * interogare per categorie). Pe găzduire serverless asta deschide zeci de
 * conexiuni simultane și depășește limita Supabase — de aici eroarea 500.
 */
export const getSpecTemplatesGrouped = cache(async () => {
  const rows = await db
    .select()
    .from(specTemplates)
    .orderBy(asc(specTemplates.sortOrder));

  const byCategory = new Map<string, typeof rows>();
  for (const row of rows) {
    const list = byCategory.get(row.categoryId);
    if (list) list.push(row);
    else byCategory.set(row.categoryId, [row]);
  }
  return byCategory;
});
