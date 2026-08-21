"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { dictionaries, type Locale } from "@/lib/i18n/dictionaries";

export function SortBar({ total, locale = "ro" }: { total: number; locale?: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = dictionaries[locale].catalog;

  const sortOptions: { value: string; label: string }[] = [
    { value: "recent", label: t.sortRecent },
    { value: "price-asc", label: t.sortPriceAsc },
    { value: "price-desc", label: t.sortPriceDesc },
    { value: "year-desc", label: t.sortYearDesc },
  ];

  const currentSort = searchParams.get("sort") ?? "recent";
  const currentView = searchParams.get("view") ?? "grid";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== "page") params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <p className="text-[14px] text-slate">
        {total} {total === 1 ? t.foundOne : t.foundMany}
      </p>
      <div className="flex items-center gap-3">
        <select
          value={currentSort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="rounded-inputs border border-steel bg-pure-white px-3 py-2 text-[13px] text-carbon-black focus:border-peloton-red focus:outline-none"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="flex overflow-hidden rounded-inputs border border-steel">
          <button
            type="button"
            aria-label={t.gridView}
            onClick={() => updateParam("view", "grid")}
            className={cn(
              "flex h-9 w-9 items-center justify-center",
              currentView === "grid" ? "bg-carbon-black text-pure-white" : "bg-pure-white text-slate"
            )}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            type="button"
            aria-label={t.listView}
            onClick={() => updateParam("view", "list")}
            className={cn(
              "flex h-9 w-9 items-center justify-center border-l border-steel",
              currentView === "list" ? "bg-carbon-black text-pure-white" : "bg-pure-white text-slate"
            )}
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
