import { db } from "@/lib/db";
import { rentals, equipment, leads, availabilityBlocks } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getRentals() {
  const rows = await db
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
      // Datele clientului vin fie din lead-ul asociat, fie — pentru
      // închirierile create manual, fără lead — direct de pe rând.
      leadCustomerName: leads.customerName,
      leadCompany: leads.company,
      leadCustomerPhone: leads.phone,
      leadCustomerEmail: leads.email,
      rentalCustomerName: rentals.customerName,
      rentalCompany: rentals.company,
      rentalCustomerPhone: rentals.customerPhone,
      rentalCustomerEmail: rentals.customerEmail,
    })
    .from(rentals)
    .innerJoin(equipment, eq(rentals.equipmentId, equipment.id))
    .leftJoin(leads, eq(rentals.leadId, leads.id))
    .orderBy(desc(rentals.createdAt));

  return rows.map((r) => ({
    id: r.id,
    startDate: r.startDate,
    endDate: r.endDate,
    status: r.status,
    estimatedPrice: r.estimatedPrice,
    notes: r.notes,
    createdAt: r.createdAt,
    equipmentId: r.equipmentId,
    equipmentModel: r.equipmentModel,
    leadId: r.leadId,
    customerName: r.leadCustomerName ?? r.rentalCustomerName,
    company: r.leadCompany ?? r.rentalCompany,
    customerPhone: r.leadCustomerPhone ?? r.rentalCustomerPhone,
    customerEmail: r.leadCustomerEmail ?? r.rentalCustomerEmail,
  }));
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
