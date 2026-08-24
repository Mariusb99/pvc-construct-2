"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { dictionaries, type Locale } from "@/lib/i18n/dictionaries";

/**
 * Bara de deasupra rezultatelor: numărul de utilaje, sortarea, comutatorul
 * grilă/listă și — doar pe mobil — butonul care deschide filtrele într-un
 * panou glisant de jos (bottom sheet).
 *
 * `children` este formularul de filtre randat pe server (FilterPanel), pe care
 * îl primim ca slot ca să nu dublăm logica de filtrare în client.
 */
export function CatalogToolbar({
  total,
  activeFilterCount = 0,
  locale = "ro",
  children,
}: {
  total: number;
  activeFilterCount?: number;
  locale?: Locale;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = dictionaries[locale].catalog;

  const [filtersOpen, setFiltersOpen] = useState(false);

  const currentSort = searchParams.get("sort") ?? "recent";
  const currentView = searchParams.get("view") ?? "grid";

  const sortOptions = [
    { value: "recent", label: t.sortRecent },
    { value: "price-asc", label: t.sortPriceAsc },
    { value: "price-desc", label: t.sortPriceDesc },
    { value: "year-desc", label: t.sortYearDesc },
  ];

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== "page") params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  // Cât timp panoul e deschis, pagina din spate nu se derulează.
  useEffect(() => {
    if (!filtersOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setFiltersOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [filtersOpen]);

  return (
    <>
      {/* Un singur rând flexibil, reordonat cu `order` la fiecare prag:
          pe telefon [Filtre][Sortare] pe un rând și numărul de rezultate
          dedesubt; pe desktop numărul la stânga, sortarea și comutatorul de
          vizualizare la dreapta. */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          aria-expanded={filtersOpen}
          className="order-1 flex h-11 shrink-0 items-center gap-2 rounded-inputs border border-carbon-black bg-pure-white px-4 text-[14px] font-medium text-carbon-black lg:hidden"
        >
          <SlidersHorizontal size={16} strokeWidth={1.75} />
          {t.filtersButton}
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-peloton-red px-1.5 text-[11px] font-semibold text-pure-white">
              {activeFilterCount}
            </span>
          )}
        </button>

        <select
          value={currentSort}
          aria-label={t.sortRecent}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="order-2 h-11 min-w-0 flex-1 rounded-inputs border border-steel bg-pure-white px-3 text-[13px] text-carbon-black focus:border-peloton-red focus:outline-none lg:order-3 lg:h-9 lg:flex-none"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <p className="order-3 w-full text-[14px] text-slate lg:order-1 lg:w-auto lg:flex-1">
          {total} {total === 1 ? t.foundOne : t.foundMany}
        </p>

        <div className="order-4 hidden overflow-hidden rounded-inputs border border-steel sm:flex">
          <button
            type="button"
            aria-label={t.gridView}
              aria-pressed={currentView === "grid"}
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
              aria-pressed={currentView === "list"}
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

      {/* Panoul de filtre — doar pe mobil. Rămâne montat pentru animație, dar
          este inert și fără evenimente cât timp e închis. */}
      <div
        className={cn("fixed inset-0 z-[90] lg:hidden", !filtersOpen && "pointer-events-none")}
        aria-hidden={!filtersOpen}
      >
        <div
          onClick={() => setFiltersOpen(false)}
          className={cn(
            "absolute inset-0 bg-carbon-black/60 transition-opacity duration-300 motion-reduce:transition-none",
            filtersOpen ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          role="dialog"
          aria-modal={filtersOpen}
          aria-label={t.filtersTitle}
          className={cn(
            "absolute inset-x-0 bottom-0 top-16 flex flex-col overflow-hidden rounded-t-cards bg-pure-white transition-transform duration-300 ease-out motion-reduce:transition-none",
            filtersOpen ? "translate-y-0" : "translate-y-full"
          )}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-silver-lining px-5 py-3">
            <h2 className="text-[16px] font-medium text-carbon-black">{t.filtersTitle}</h2>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              aria-label={t.closeFilters}
              className="-mr-2 flex h-11 w-11 items-center justify-center rounded-tags text-slate hover:bg-mist-gray hover:text-carbon-black"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        </div>
      </div>
    </>
  );
}
