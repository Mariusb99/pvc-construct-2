import { cache } from "react";
import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const getSettings = cache(async () => {
  const [row] = await db.select().from(settings).where(eq(settings.id, 1)).limit(1);
  return (
    row ?? {
      id: 1,
      companyName: "PVC CONSTRUCT SRL",
      cui: null,
      regCom: null,
      euid: null,
      foundedAt: null,
      county: null,
      city: null,
      address: null,
      postalCode: null,
      phone: null,
      email: null,
      logoUrl: null,
      heroHeadline: "Utilaje de construcții pentru proiectele tale.",
      heroSubheadline: null,
      heroImageUrl: null,
      updatedAt: new Date(),
    }
  );
});
