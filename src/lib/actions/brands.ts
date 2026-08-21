"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { brands } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth/session";
import { slugify } from "@/lib/utils";
import { uploadImage } from "@/lib/storage";

export async function createBrandAction(formData: FormData) {
  await requireUser();
  const name = String(formData.get("name") || "").trim();
  if (!name) return;

  const logoFile = formData.get("logo") as File | null;
  let logoUrl: string | null = null;
  if (logoFile && logoFile.size > 0) {
    logoUrl = await uploadImage(logoFile, "brand-logos");
  }

  await db.insert(brands).values({ name, slug: slugify(name), logoUrl, active: true });
  revalidatePath("/admin/marci");
}

export async function updateBrandAction(brandId: string, formData: FormData) {
  await requireUser();
  const name = String(formData.get("name") || "").trim();
  const active = formData.get("active") === "on";
  if (!name) return;

  const logoFile = formData.get("logo") as File | null;
  const updates: Partial<typeof brands.$inferInsert> = { name, active };
  if (logoFile && logoFile.size > 0) {
    updates.logoUrl = await uploadImage(logoFile, "brand-logos");
  }

  await db.update(brands).set(updates).where(eq(brands.id, brandId));
  revalidatePath("/admin/marci");
  revalidatePath("/utilaje");
}

export async function deleteBrandAction(brandId: string) {
  await requireUser();
  await db.delete(brands).where(eq(brands.id, brandId));
  revalidatePath("/admin/marci");
}
