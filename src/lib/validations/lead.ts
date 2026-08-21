import { z } from "zod";

export const leadSchema = z
  .object({
    equipmentId: z.string().optional(),
    customerName: z.string().min(2, "Introdu numele tău."),
    company: z.string().optional(),
    email: z.string().email("Adresă de email invalidă."),
    phone: z.string().min(6, "Introdu un număr de telefon valid."),
    requestType: z.enum(["VANZARE", "INCHIRIERE", "GENERAL"]),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    projectLocation: z.string().optional(),
    quantity: z.coerce.number().int().min(1).optional(),
    message: z.string().optional(),
    gdprConsent: z
      .union([z.literal("on"), z.literal("true"), z.boolean()])
      .refine((v) => v === "on" || v === "true" || v === true, {
        message: "Trebuie să fii de acord cu prelucrarea datelor pentru a continua.",
      }),
  })
  .refine(
    (data) =>
      data.requestType !== "INCHIRIERE" || (!!data.startDate && !!data.endDate),
    {
      message: "Alege perioada dorită pentru închiriere.",
      path: ["startDate"],
    }
  );

export type LeadInput = z.infer<typeof leadSchema>;
