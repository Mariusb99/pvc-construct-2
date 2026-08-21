"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { categories, specTemplates } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { requireUser } from "@/lib/auth/session";
import { slugify } from "@/lib/utils";

export async function createCategoryAction(formData: FormData) {
  await requireUser();
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim() || null;
  if (!name) return;

  const all = await db.select().from(categories);
  const slug = slugify(name);

  await db.insert(categories).values({
    name,
    slug,
    description,
    active: true,
    sortOrder: all.length,
  });

  revalidatePath("/admin/categorii");
  revalidatePath("/utilaje");
  revalidatePath("/");
}

export async function updateCategoryAction(categoryId: string, formData: FormData) {
  await requireUser();
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim() || null;
  const active = formData.get("active") === "on";
  if (!name) return;

  await db
    .update(categories)
    .set({ name, description, active })
    .where(eq(categories.id, categoryId));

  revalidatePath("/admin/categorii");
  revalidatePath("/utilaje");
  revalidatePath("/");
}

export async function deleteCategoryAction(categoryId: string) {
  await requireUser();
  await db.delete(categories).where(eq(categories.id, categoryId));
  revalidatePath("/admin/categorii");
  revalidatePath("/utilaje");
  revalidatePath("/");
}

export async function reorderCategoryAction(categoryId: string, direction: "up" | "down") {
  await requireUser();
  const all = await db.select().from(categories).orderBy(asc(categories.sortOrder));
  const index = all.findIndex((c) => c.id === categoryId);
  if (index === -1) return;

  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= all.length) return;

  const a = all[index];
  const b = all[swapWith];

  await db.update(categories).set({ sortOrder: b.sortOrder }).where(eq(categories.id, a.id));
  await db.update(categories).set({ sortOrder: a.sortOrder }).where(eq(categories.id, b.id));

  revalidatePath("/admin/categorii");
  revalidatePath("/");
}

// ---------- Șabloane de specificații (per categorie) ----------

export async function addSpecTemplateAction(categoryId: string, formData: FormData) {
  await requireUser();
  const specKey = String(formData.get("specKey") || "").trim();
  const specLabel = String(formData.get("specLabel") || "").trim();
  const unit = String(formData.get("unit") || "").trim() || null;
  if (!specKey || !specLabel) return;

  await db.insert(specTemplates).values({ categoryId, specKey, specLabel, unit, sortOrder: 0 });
  revalidatePath("/admin/categorii");
}

export async function deleteSpecTemplateAction(templateId: string) {
  await requireUser();
  await db.delete(specTemplates).where(eq(specTemplates.id, templateId));
  revalidatePath("/admin/categorii");
}
