import { FilterPanel } from "./FilterPanel";
import { CatalogToolbar } from "./CatalogToolbar";
import { EquipmentCard } from "./EquipmentCard";
import { Pagination } from "./Pagination";
import { getActiveCategories } from "@/lib/queries/categories";
import { getActiveBrands } from "@/lib/queries/brands";
import { getEquipmentList, type EquipmentFilters } from "@/lib/queries/equipment";
import { queryStringWithPage, type RawSearchParams } from "@/lib/filters";
import { getDict } from "@/lib/i18n";

export async function EquipmentListing({
  filters,
  rawSearchParams,
  basePath,
  lockedCategory = false,
}: {
  filters: EquipmentFilters;
  rawSearchParams: RawSearchParams;
  basePath: string;
  lockedCategory?: boolean;
}) {
  const view = (rawSearchParams.view as string) === "list" ? "list" : "grid";

  const [categoriesList, brandsList, results, { locale, dict }] = await Promise.all([
    getActiveCategories(),
    getActiveBrands(),
    getEquipmentList(filters),
    getDict(),
  ]);

  // Câte filtre sunt aplicate — afișate ca insignă pe butonul de pe mobil.
  const activeFilterCount = [
    filters.q,
    lockedCategory ? undefined : filters.categorySlug,
    filters.brandSlug,
    filters.listingType,
    filters.status,
    filters.yearMin,
    filters.yearMax,
    filters.priceMin,
    filters.priceMax,
  ].filter(Boolean).length;

  const panelProps = {
    action: basePath,
    filters,
    categories: categoriesList,
    brands: brandsList,
    lockedCategory,
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
      {/* Pe mobil filtrele trăiesc în panoul glisant de mai jos, nu în pagină. */}
      <aside className="hidden lg:block">
        <FilterPanel {...panelProps} layout="sidebar" idPrefix="d-" />
      </aside>

      <div>
        <CatalogToolbar
          total={results.total}
          activeFilterCount={activeFilterCount}
          locale={locale}
        >
          <FilterPanel {...panelProps} layout="sheet" idPrefix="m-" />
        </CatalogToolbar>

        {results.items.length === 0 ? (
          <div className="rounded-cards border border-dashed border-silver-lining p-16 text-center">
            <p className="text-[16px] font-medium text-carbon-black">
              {dict.catalog.emptyTitle}
            </p>
            <p className="mt-2 text-[14px] text-slate">{dict.catalog.emptyDesc}</p>
          </div>
        ) : (
          <div
            className={
              view === "list"
                ? "flex flex-col gap-4"
                : "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
            }
          >
            {results.items.map((item) => (
              <EquipmentCard key={item.id} item={item} layout={view} locale={locale} />
            ))}
          </div>
        )}

        <Pagination
          page={results.page}
          totalPages={results.totalPages}
          buildHref={(p) => `${basePath}${queryStringWithPage(rawSearchParams, p)}`}
          prevLabel={dict.catalog.prev}
          nextLabel={dict.catalog.next}
        />
      </div>
    </div>
  );
}
