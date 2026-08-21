"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth/session";

const LEAD_STATUSES = ["NOU", "CONTACTAT", "OFERTA_TRIMISA", "NEGOCIERE", "CASTIGAT", "PIERDUT"] as const;

export async function updateLeadStatusAction(leadId: string, status: string) {
  await requireUser();
  if (!LEAD_STATUSES.includes(status as (typeof LEAD_STATUSES)[number])) return;

  await db
    .update(leads)
    .set({ status: status as typeof leads.$inferSelect.status })
    .where(eq(leads.id, leadId));

  revalidatePath("/admin/leads");
}

export async function deleteLeadAction(leadId: string) {
  await requireUser();
  await db.delete(leads).where(eq(leads.id, leadId));
  revalidatePath("/admin/leads");
}
