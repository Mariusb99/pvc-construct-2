"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  equipment,
  equipmentImages,
  equipmentSpecifications,
} from "@/lib/db/schema";
import { and, desc, eq, ne } from "drizzle-orm";
import { equipmentSchema } from "@/lib/validations/equipment";
import { requireUser } from "@/lib/auth/session";
import { uploadImage } from "@/lib/storage";
import { slugify } from "@/lib/utils";

export type FormActionState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

async function ensureUniqueSlug(baseSlug: string, excludeId?: string) {
  let slug = baseSlug;
  let counter = 2;
  while (true) {
    const conditions = excludeId
      ? and(eq(equipment.slug, slug), ne(equipment.id, excludeId))
      : eq(equipment.slug, slug);
    const [existing] = await db.select({ id: equipment.id }).from(equipment).where(conditions).limit(1);
    if (!existing) return slug;
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

export async function createEquipmentAction(
  _prevState: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  await requireUser();
  const raw = Object.fromEntries(formData.entries());
  const parsed = equipmentSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "Verifică datele completate.", fieldErrors };
  }

  const data = parsed.data;
  const baseSlug = slugify(data.slug || data.model);
  const slug = await ensureUniqueSlug(baseSlug);

  const [created] = await db
    .insert(equipment)
    .values({
      categoryId: data.categoryId,
      brandId: data.brandId,
      model: data.model,
      slug,
      year: data.year,
      hours: data.hours,
      description: data.description,
      location: data.location,
      salePrice: data.salePrice,
      rentalPriceDay: data.rentalPriceDay,
      rentalPriceWeek: data.rentalPriceWeek,
      rentalPriceMonth: data.rentalPriceMonth,
      status: data.status,
      featured: data.featured,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
    })
    .returning();

  revalidatePath("/admin/utilaje");
  revalidatePath("/utilaje");
  redirect(`/admin/utilaje/${created.id}`);
}

export async function updateEquipmentAction(
  equipmentId: string,
  _prevState: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  await requireUser();
  const raw = Object.fromEntries(formData.entries());
  const parsed = equipmentSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "Verifică datele completate.", fieldErrors };
  }

  const data = parsed.data;
  const baseSlug = slugify(data.slug || data.model);
  const slug = await ensureUniqueSlug(baseSlug, equipmentId);

  await db
    .update(equipment)
    .set({
      categoryId: data.categoryId,
      brandId: data.brandId,
      model: data.model,
      slug,
      year: data.year,
      hours: data.hours,
      description: data.description,
      location: data.location,
      salePrice: data.salePrice,
      rentalPriceDay: data.rentalPriceDay,
      rentalPriceWeek: data.rentalPriceWeek,
      rentalPriceMonth: data.rentalPriceMonth,
      status: data.status,
      featured: data.featured,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      updatedAt: new Date(),
    })
    .where(eq(equipment.id, equipmentId));

  revalidatePath("/admin/utilaje");
  revalidatePath(`/admin/utilaje/${equipmentId}`);
  revalidatePath("/utilaje");
  return { status: "idle", message: "Salvat." };
}

export async function deleteEquipmentAction(equipmentId: string) {
  await requireUser();
  await db.delete(equipment).where(eq(equipment.id, equipmentId));
  revalidatePath("/admin/utilaje");
  revalidatePath("/utilaje");
}

export async function duplicateEquipmentAction(equipmentId: string) {
  await requireUser();
  const [source] = await db.select().from(equipment).where(eq(equipment.id, equipmentId)).limit(1);
  if (!source) return;

  const newSlug = await ensureUniqueSlug(`${source.slug}-copie`);

  const [copy] = await db
    .insert(equipment)
    .values({
      categoryId: source.categoryId,
      brandId: source.brandId,
      model: `${source.model} (copie)`,
      slug: newSlug,
      year: source.year,
      hours: source.hours,
      description: source.description,
      location: source.location,
      salePrice: source.salePrice,
      rentalPriceDay: source.rentalPriceDay,
      rentalPriceWeek: source.rentalPriceWeek,
      rentalPriceMonth: source.rentalPriceMonth,
      status: "INDISPONIBIL",
      featured: false,
    })
    .returning();

  const images = await db
    .select()
    .from(equipmentImages)
    .where(eq(equipmentImages.equipmentId, equipmentId));
  if (images.length) {
    await db.insert(equipmentImages).values(
      images.map((img) => ({
        equipmentId: copy.id,
        imageUrl: img.imageUrl,
        altText: img.altText,
        sortOrder: img.sortOrder,
      }))
    );
  }

  const specs = await db
    .select()
    .from(equipmentSpecifications)
    .where(eq(equipmentSpecifications.equipmentId, equipmentId));
  if (specs.length) {
    await db.insert(equipmentSpecifications).values(
      specs.map((s) => ({
        equipmentId: copy.id,
        specKey: s.specKey,
        specValue: s.specValue,
        specGroup: s.specGroup,
        sortOrder: s.sortOrder,
      }))
    );
  }

  revalidatePath("/admin/utilaje");
  redirect(`/admin/utilaje/${copy.id}`);
}

export async function updateEquipmentStatusAction(equipmentId: string, status: string) {
  await requireUser();
  await db
    .update(equipment)
    .set({ status: status as typeof equipment.$inferSelect.status, updatedAt: new Date() })
    .where(eq(equipment.id, equipmentId));
  revalidatePath("/admin/utilaje");
  revalidatePath("/utilaje");
}

// ---------- Imagini ----------

export async function addEquipmentImageAction(equipmentId: string, formData: FormData) {
  await requireUser();
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return;

  const url = await uploadImage(file, "equipment");

  // Poziția noii imagini = după ultima existentă (sau 0 dacă galeria e goală).
  const [last] = await db
    .select({ max: equipmentImages.sortOrder })
    .from(equipmentImages)
    .where(eq(equipmentImages.equipmentId, equipmentId))
    .orderBy(desc(equipmentImages.sortOrder))
    .limit(1);

  await db.insert(equipmentImages).values({
    equipmentId,
    imageUrl: url,
    sortOrder: (last?.max ?? -1) + 1,
  });

  revalidatePath(`/admin/utilaje/${equipmentId}`);
  revalidatePath("/utilaje");
}

export async function deleteEquipmentImageAction(imageId: string, equipmentId: string) {
  await requireUser();
  await db.delete(equipmentImages).where(eq(equipmentImages.id, imageId));
  revalidatePath(`/admin/utilaje/${equipmentId}`);
  revalidatePath("/utilaje");
}

// ---------- Specificații ----------

export async function addEquipmentSpecAction(equipmentId: string, formData: FormData) {
  await requireUser();
  const specKey = String(formData.get("specKey") || "").trim();
  const specValue = String(formData.get("specValue") || "").trim();
  const specGroup = String(formData.get("specGroup") || "").trim() || null;
  if (!specKey || !specValue) return;

  await db.insert(equipmentSpecifications).values({
    equipmentId,
    specKey,
    specValue,
    specGroup,
    sortOrder: 0,
  });

  revalidatePath(`/admin/utilaje/${equipmentId}`);
  revalidatePath("/utilaje");
}

export async function deleteEquipmentSpecAction(specId: string, equipmentId: string) {
  await requireUser();
  await db.delete(equipmentSpecifications).where(eq(equipmentSpecifications.id, specId));
  revalidatePath(`/admin/utilaje/${equipmentId}`);
  revalidatePath("/utilaje");
}
