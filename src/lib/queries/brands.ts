import { cache } from "react";
import { db } from "@/lib/db";
import { brands } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";

export const getActiveBrands = cache(async () => {
  return db.select().from(brands).where(eq(brands.active, true)).orderBy(asc(brands.name));
});

export const getAllBrands = cache(async () => {
  return db.select().from(brands).orderBy(asc(brands.name));
});
