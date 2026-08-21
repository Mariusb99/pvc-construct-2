"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import { uploadImage } from "@/lib/storage";

export type SettingsFormState = { status: "idle" | "success" | "error"; message?: string };

export async function updateSettingsAction(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  await requireAdmin();

  const field = (name: string) => {
    const v = String(formData.get(name) || "").trim();
    return v === "" ? null : v;
  };

  const logoFile = formData.get("logo") as File | null;
  const heroFile = formData.get("heroImage") as File | null;

  const updates: Partial<typeof settings.$inferInsert> = {
    companyName: field("companyName") || "PVC CONSTRUCT SRL",
    cui: field("cui"),
    regCom: field("regCom"),
    euid: field("euid"),
    foundedAt: field("foundedAt"),
    county: field("county"),
    city: field("city"),
    address: field("address"),
    postalCode: field("postalCode"),
    phone: field("phone"),
    email: field("email"),
    heroHeadline: field("heroHeadline"),
    heroSubheadline: field("heroSubheadline"),
    updatedAt: new Date(),
  };

  try {
    if (logoFile && logoFile.size > 0) {
      updates.logoUrl = await uploadImage(logoFile, "branding");
    }
    if (heroFile && heroFile.size > 0) {
      updates.heroImageUrl = await uploadImage(heroFile, "branding");
    }

    await db
      .insert(settings)
      .values({ id: 1, ...updates })
      .onConflictDoUpdate({ target: settings.id, set: updates });

    revalidatePath("/");
    revalidatePath("/admin/setari");
    revalidatePath("/despre-noi");
    revalidatePath("/contact");

    return { status: "success", message: "Setările au fost salvate." };
  } catch (error) {
    console.error("updateSettingsAction failed", error);
    return {
      status: "error",
      message: error instanceof Error ? error.message : "A apărut o eroare.",
    };
  }
}
