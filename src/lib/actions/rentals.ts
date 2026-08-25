"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { rentals, availabilityBlocks, leads } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth/session";

const RENTAL_STATUSES = ["SOLICITAT", "CONFIRMAT", "ACTIV", "FINALIZAT", "ANULAT"] as const;

export async function createRentalFromLeadAction(formData: FormData) {
  await requireUser();
  const leadId = String(formData.get("leadId") || "");
  const equipmentId = String(formData.get("equipmentId") || "");
  const startDate = String(formData.get("startDate") || "");
  const endDate = String(formData.get("endDate") || "");
  const estimatedPrice = String(formData.get("estimatedPrice") || "").trim() || null;
  const notes = String(formData.get("notes") || "").trim() || null;

  if (!equipmentId || !startDate || !endDate) return;

  // Fără lead (închiriere creată manual din admin) — clientul se
  // completează direct pe formular: nume și telefon sunt obligatorii,
  // firma și email-ul sunt opționale.
  const customerName = leadId ? null : String(formData.get("customerName") || "").trim() || null;
  const company = leadId ? null : String(formData.get("company") || "").trim() || null;
  const customerPhone = leadId ? null : String(formData.get("customerPhone") || "").trim() || null;
  const customerEmail = leadId ? null : String(formData.get("customerEmail") || "").trim() || null;

  if (!leadId && (!customerName || !customerPhone)) return;

  await db.insert(rentals).values({
    equipmentId,
    leadId: leadId || null,
    customerName,
    company,
    customerPhone,
    customerEmail,
    startDate,
    endDate,
    estimatedPrice,
    notes,
    status: "SOLICITAT",
  });

  if (leadId) {
    await db.update(leads).set({ status: "OFERTA_TRIMISA" }).where(eq(leads.id, leadId));
  }

  revalidatePath("/admin/inchirieri");
  revalidatePath("/admin/leads");
  redirect("/admin/inchirieri");
}

export async function updateRentalStatusAction(rentalId: string, status: string) {
  await requireUser();
  if (!RENTAL_STATUSES.includes(status as (typeof RENTAL_STATUSES)[number])) return;

  const [rental] = await db.select().from(rentals).where(eq(rentals.id, rentalId)).limit(1);
  if (!rental) return;

  await db
    .update(rentals)
    .set({ status: status as typeof rentals.$inferSelect.status })
    .where(eq(rentals.id, rentalId));

  // La confirmare, blocăm automat perioada în calendarul de disponibilitate.
  if (status === "CONFIRMAT" || status === "ACTIV") {
    await db.insert(availabilityBlocks).values({
      equipmentId: rental.equipmentId,
      startDate: rental.startDate,
      endDate: rental.endDate,
      reason: "INCHIRIAT",
    });
  }

  revalidatePath("/admin/inchirieri");
  revalidatePath("/utilaje");
}

export async function deleteRentalAction(rentalId: string) {
  await requireUser();
  await db.delete(rentals).where(eq(rentals.id, rentalId));
  revalidatePath("/admin/inchirieri");
}

export async function addAvailabilityBlockAction(formData: FormData) {
  await requireUser();
  const equipmentId = String(formData.get("equipmentId") || "");
  const startDate = String(formData.get("startDate") || "");
  const endDate = String(formData.get("endDate") || "");
  const reason = String(formData.get("reason") || "REZERVAT");
  if (!equipmentId || !startDate || !endDate) return;

  await db.insert(availabilityBlocks).values({
    equipmentId,
    startDate,
    endDate,
    reason: reason as typeof availabilityBlocks.$inferSelect.reason,
  });

  revalidatePath("/admin/inchirieri");
  revalidatePath(`/admin/utilaje/${equipmentId}`);
}

export async function deleteAvailabilityBlockAction(blockId: string) {
  await requireUser();
  await db.delete(availabilityBlocks).where(eq(availabilityBlocks.id, blockId));
  revalidatePath("/admin/inchirieri");
}
