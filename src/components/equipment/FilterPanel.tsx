import { Input, Select, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getDict } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Category, Brand } from "@/lib/db/types";
import type { EquipmentFilters } from "@/lib/queries/equipment";

export async function FilterPanel({
  action,
  filters,
  categories,
  brands,
  lockedCategory = false,
  layout = "sidebar",
  idPrefix = "",
}: {
  action: string;
  filters: EquipmentFilters;
  categories: Category[];
  brands: Brand[];
  lockedCategory?: boolean;
  /**
   * "sidebar" — card static, afișat pe desktop în coloana din stânga.
   * "sheet"   — panoul de pe mobil: câmpurile se derulează, iar butoanele
   *             de acțiune rămân fixe jos.
   */
  layout?: "sidebar" | "sheet";
  /** Prefix pentru id-uri: panoul apare de două ori în pagină (desktop + mobil). */
  idPrefix?: string;
}) {
  const { dict } = await getDict();
  const t = dict.catalog;
  const s = dict.status;
  const isSheet = layout === "sheet";
  const id = (name: string) => `${idPrefix}${name}`;

  return (
    <form
      action={action}
      method="GET"
      className={cn(
        isSheet
          ? "flex h-full min-h-0 flex-col"
          : "flex flex-col gap-5 rounded-cards border border-silver-lining bg-pure-white p-6"
      )}
    >
      <div
        className={cn(
          isSheet && "flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 pb-6 pt-1",
          !isSheet && "contents"
        )}
      >
        <div>
          <Label htmlFor={id("q")}>{t.searchLabel}</Label>
          <Input
            id={id("q")}
            name="q"
            type="text"
            placeholder={t.searchPlaceholder}
            defaultValue={filters.q ?? ""}
          />
        </div>

        {!lockedCategory && (
          <div>
            <Label htmlFor={id("category")}>{t.category}</Label>
            <Select id={id("category")} name="category" defaultValue={filters.categorySlug ?? ""}>
              <option value="">{t.allCategories}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
        )}

        <div>
          <Label htmlFor={id("brand")}>{t.brand}</Label>
          <Select id={id("brand")} name="brand" defaultValue={filters.brandSlug ?? ""}>
            <option value="">{t.allBrands}</option>
            {brands.map((b) => (
              <option key={b.id} value={b.slug}>
                {b.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor={id("listingType")}>{t.listingType}</Label>
          <Select id={id("listingType")} name="listingType" defaultValue={filters.listingType ?? ""}>
            <option value="">{t.saleAndRent}</option>
            <option value="vanzare">{t.sale}</option>
            <option value="inchiriere">{t.rent}</option>
          </Select>
        </div>

        <div>
          <Label htmlFor={id("status")}>{t.availability}</Label>
          <Select id={id("status")} name="status" defaultValue={filters.status ?? ""}>
            <option value="">{t.all}</option>
            <option value="DE_VANZARE">{s.DE_VANZARE}</option>
            <option value="DE_INCHIRIAT">{s.DE_INCHIRIAT}</option>
            <option value="DE_VANZARE_SI_INCHIRIAT">{s.DE_VANZARE_SI_INCHIRIAT}</option>
            <option value="INCHIRIAT">{t.rentedNow}</option>
            <option value="VANDUT">{s.VANDUT}</option>
            <option value="INDISPONIBIL">{s.INDISPONIBIL}</option>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor={id("yearMin")}>{t.yearMin}</Label>
            <Input
              id={id("yearMin")}
              name="yearMin"
              type="number"
              inputMode="numeric"
              placeholder="2010"
              defaultValue={filters.yearMin ?? ""}
            />
          </div>
          <div>
            <Label htmlFor={id("yearMax")}>{t.yearMax}</Label>
            <Input
              id={id("yearMax")}
              name="yearMax"
              type="number"
              inputMode="numeric"
              placeholder="2026"
              defaultValue={filters.yearMax ?? ""}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor={id("priceMin")}>{t.priceMin}</Label>
            <Input
              id={id("priceMin")}
              name="priceMin"
              type="number"
              inputMode="numeric"
              placeholder="0"
              defaultValue={filters.priceMin ?? ""}
            />
          </div>
          <div>
            <Label htmlFor={id("priceMax")}>{t.priceMax}</Label>
            <Input
              id={id("priceMax")}
              name="priceMax"
              type="number"
              inputMode="numeric"
              placeholder="100000"
              defaultValue={filters.priceMax ?? ""}
            />
          </div>
        </div>
      </div>

      <div
        className={cn(
          "flex gap-2",
          isSheet &&
            "shrink-0 border-t border-silver-lining bg-pure-white px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4"
        )}
      >
        <Button type="submit" variant="primary" className="flex-1">
          {t.filter}
        </Button>
        <Button href={action} variant="subtle">
          {t.reset}
        </Button>
      </div>
    </form>
  );
}
