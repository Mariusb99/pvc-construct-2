import { Input, Select, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getDict } from "@/lib/i18n";
import type { Category, Brand } from "@/lib/db/types";
import type { EquipmentFilters } from "@/lib/queries/equipment";

export async function FilterPanel({
  action,
  filters,
  categories,
  brands,
  lockedCategory = false,
}: {
  action: string;
  filters: EquipmentFilters;
  categories: Category[];
  brands: Brand[];
  lockedCategory?: boolean;
}) {
  const { dict } = await getDict();
  const t = dict.catalog;
  const s = dict.status;

  return (
    <form
      action={action}
      method="GET"
      className="flex flex-col gap-5 rounded-cards border border-silver-lining bg-pure-white p-6"
    >
      <div>
        <Label htmlFor="q">{t.searchLabel}</Label>
        <Input
          id="q"
          name="q"
          type="text"
          placeholder={t.searchPlaceholder}
          defaultValue={filters.q ?? ""}
        />
      </div>

      {!lockedCategory && (
        <div>
          <Label htmlFor="category">{t.category}</Label>
          <Select id="category" name="category" defaultValue={filters.categorySlug ?? ""}>
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
        <Label htmlFor="brand">{t.brand}</Label>
        <Select id="brand" name="brand" defaultValue={filters.brandSlug ?? ""}>
          <option value="">{t.allBrands}</option>
          {brands.map((b) => (
            <option key={b.id} value={b.slug}>
              {b.name}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="listingType">{t.listingType}</Label>
        <Select id="listingType" name="listingType" defaultValue={filters.listingType ?? ""}>
          <option value="">{t.saleAndRent}</option>
          <option value="vanzare">{t.sale}</option>
          <option value="inchiriere">{t.rent}</option>
        </Select>
      </div>

      <div>
        <Label htmlFor="status">{t.availability}</Label>
        <Select id="status" name="status" defaultValue={filters.status ?? ""}>
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
          <Label htmlFor="yearMin">{t.yearMin}</Label>
          <Input
            id="yearMin"
            name="yearMin"
            type="number"
            placeholder="2010"
            defaultValue={filters.yearMin ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="yearMax">{t.yearMax}</Label>
          <Input
            id="yearMax"
            name="yearMax"
            type="number"
            placeholder="2026"
            defaultValue={filters.yearMax ?? ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="priceMin">{t.priceMin}</Label>
          <Input
            id="priceMin"
            name="priceMin"
            type="number"
            placeholder="0"
            defaultValue={filters.priceMin ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="priceMax">{t.priceMax}</Label>
          <Input
            id="priceMax"
            name="priceMax"
            type="number"
            placeholder="100000"
            defaultValue={filters.priceMax ?? ""}
          />
        </div>
      </div>

      <div className="flex gap-2">
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
