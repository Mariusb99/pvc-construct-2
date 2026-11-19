import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { equipment } from "@/lib/db/schema";

/**
 * "Puls" pentru Supabase.
 *
 * Supabase pune automat baza de date pe pauză dacă nu vede activitate
 * suficientă timp de aproximativ o săptămână (planul gratuit). Vercel
 * apelează ruta asta de 2 ori pe săptămână (vezi vercel.json), ea face o
 * interogare reală (un count pe tabelul de utilaje), iar asta ține baza
 * de date trează, fără să coste nimic și fără să fie nevoie de nimic manual.
 *
 * Doar Vercel (cu cheia CRON_SECRET) poate declanșa ruta asta.
 */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(equipment);

  return NextResponse.json({
    ok: true,
    checkedAt: new Date().toISOString(),
    equipmentCount: Number(count),
  });
}
