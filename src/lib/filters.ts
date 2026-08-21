import type { EquipmentFilters } from "@/lib/queries/equipment";

export type RawSearchParams = Record<string, string | string[] | undefined>;

function str(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

function num(v: string | string[] | undefined) {
  const s = str(v);
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

export function parseFilters(searchParams: RawSearchParams): EquipmentFilters {
  return {
    q: str(searchParams.q) || undefined,
    categorySlug: str(searchParams.category) || undefined,
    brandSlug: str(searchParams.brand) || undefined,
    listingType: (str(searchParams.listingType) as "vanzare" | "inchiriere" | undefined) || undefined,
    status: str(searchParams.status) || undefined,
    yearMin: num(searchParams.yearMin),
    yearMax: num(searchParams.yearMax),
    priceMin: num(searchParams.priceMin),
    priceMax: num(searchParams.priceMax),
    sort: (str(searchParams.sort) as EquipmentFilters["sort"]) || "recent",
    page: num(searchParams.page) || 1,
  };
}

export function queryStringWithPage(searchParams: RawSearchParams, page: number) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (key === "page") continue;
    const v = str(value);
    if (v) params.set(key, v);
  }
  params.set("page", String(page));
  return `?${params.toString()}`;
}
