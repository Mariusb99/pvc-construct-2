import { db } from "@/lib/db";
import { rentals, equipment, leads, availabilityBlocks } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getRentals() {
  return db
    .select({
      id: rentals.id,
      startDate: rentals.startDate,
      endDate: rentals.endDate,
      status: rentals.status,
      estimatedPrice: rentals.estimatedPrice,
      notes: rentals.notes,
      createdAt: rentals.createdAt,
      equipmentId: rentals.equipmentId,
      equipmentModel: equipment.model,
      leadId: rentals.leadId,
      customerName: leads.customerName,
      customerPhone: leads.phone,
    })
    .from(rentals)
    .innerJoin(equipment, eq(rentals.equipmentId, equipment.id))
    .leftJoin(leads, eq(rentals.leadId, leads.id))
    .orderBy(desc(rentals.createdAt));
}

export async function getAvailabilityBlocks() {
  return db
    .select({
      id: availabilityBlocks.id,
      startDate: availabilityBlocks.startDate,
      endDate: availabilityBlocks.endDate,
      reason: availabilityBlocks.reason,
      equipmentId: availabilityBlocks.equipmentId,
      equipmentModel: equipment.model,
    })
    .from(availabilityBlocks)
    .innerJoin(equipment, eq(availabilityBlocks.equipmentId, equipment.id))
    .orderBy(desc(availabilityBlocks.startDate));
}
