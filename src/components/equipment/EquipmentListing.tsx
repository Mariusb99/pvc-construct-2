import { FilterPanel } from "./FilterPanel";
import { SortBar } from "./SortBar";
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

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
      <aside>
        <FilterPanel
          action={basePath}
          filters={filters}
          categories={categoriesList}
          brands={brandsList}
          lockedCategory={lockedCategory}
        />
      </aside>

      <div>
        <SortBar total={results.total} locale={locale} />

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
