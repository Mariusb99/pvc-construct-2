import { z } from "zod";

export const equipmentStatusValues = [
  "DE_VANZARE",
  "DE_INCHIRIAT",
  "DE_VANZARE_SI_INCHIRIAT",
  "INDISPONIBIL",
  "VANDUT",
  "INCHIRIAT",
] as const;

// Coloanele numeric() din Drizzle sunt tratate ca string — validăm formatul,
// dar păstrăm valoarea ca text pentru inserare directă în Postgres.
const optionalNumber = z
  .string()
  .optional()
  .transform((v) => (v && v.trim() !== "" ? v.trim() : null))
  .refine((v) => v === null || !Number.isNaN(Number(v)), "Introdu un număr valid.");

const optionalInt = z
  .string()
  .optional()
  .transform((v) => (v && v.trim() !== "" ? Number(v.trim()) : null))
  .refine((v) => v === null || Number.isInteger(v), "Introdu un număr întreg.");

const optionalString = z
  .string()
  .optional()
  .transform((v) => (v && v.trim() !== "" ? v.trim() : null));

export const equipmentSchema = z.object({
  categoryId: z.string().min(1, "Alege o categorie."),
  brandId: z.string().optional().transform((v) => (v && v !== "" ? v : null)),
  model: z.string().min(2, "Introdu modelul utilajului."),
  slug: z.string().min(2, "Introdu un slug valid."),
  year: optionalInt,
  hours: optionalInt,
  description: optionalString,
  location: optionalString,
  salePrice: optionalNumber,
  rentalPriceDay: optionalNumber,
  rentalPriceWeek: optionalNumber,
  rentalPriceMonth: optionalNumber,
  status: z.enum(equipmentStatusValues),
  featured: z
    .union([z.literal("on"), z.literal("true"), z.boolean()])
    .optional()
    .transform((v) => v === "on" || v === "true" || v === true),
  metaTitle: optionalString,
  metaDescription: optionalString,
});

export type EquipmentInput = z.infer<typeof equipmentSchema>;
