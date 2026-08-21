import { db } from "@/lib/db";
import { leads, equipment } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getLeads(status?: string) {
  const rows = await db
    .select({
      id: leads.id,
      customerName: leads.customerName,
      company: leads.company,
      email: leads.email,
      phone: leads.phone,
      requestType: leads.requestType,
      startDate: leads.startDate,
      endDate: leads.endDate,
      projectLocation: leads.projectLocation,
      quantity: leads.quantity,
      message: leads.message,
      status: leads.status,
      createdAt: leads.createdAt,
      equipmentId: leads.equipmentId,
      equipmentModel: equipment.model,
      equipmentSlug: equipment.slug,
    })
    .from(leads)
    .leftJoin(equipment, eq(leads.equipmentId, equipment.id))
    .orderBy(desc(leads.createdAt));

  return status ? rows.filter((r) => r.status === status) : rows;
}

export async function getLeadById(id: string) {
  const [row] = await db
    .select({
      id: leads.id,
      customerName: leads.customerName,
      company: leads.company,
      email: leads.email,
      phone: leads.phone,
      requestType: leads.requestType,
      startDate: leads.startDate,
      endDate: leads.endDate,
      projectLocation: leads.projectLocation,
      quantity: leads.quantity,
      message: leads.message,
      status: leads.status,
      createdAt: leads.createdAt,
      equipmentId: leads.equipmentId,
      equipmentModel: equipment.model,
      equipmentSlug: equipment.slug,
    })
    .from(leads)
    .leftJoin(equipment, eq(leads.equipmentId, equipment.id))
    .where(eq(leads.id, id))
    .limit(1);

  return row ?? null;
}

export async function getLeadCounts() {
  const rows = await db.select({ status: leads.status }).from(leads);
  const counts: Record<string, number> = {};
  for (const r of rows) counts[r.status] = (counts[r.status] ?? 0) + 1;
  return counts;
}
