import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

declare global {
  var __pgPool: Pool | undefined;
}

/**
 * Pe găzduire serverless (Netlify, Vercel) fiecare cerere poate porni o
 * instanță nouă, iar fiecare instanță și-ar deschide propriile conexiuni.
 * Supabase are o limită de conexiuni simultane, așa că:
 *  - ținem puține conexiuni per instanță (`max`),
 *  - le eliberăm repede când stau degeaba (`idleTimeoutMillis`),
 *  - refolosim același pool cât timp instanța rămâne caldă (cache global).
 */
const pool =
  global.__pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: Number(process.env.PG_POOL_MAX ?? 3),
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 15_000,
    allowExitOnIdle: true,
  });

global.__pgPool = pool;

export const db = drizzle(pool, { schema });
