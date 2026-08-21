import { Container } from "@/components/ui/Container";
import { Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getActiveCategories } from "@/lib/queries/categories";
import { getDict } from "@/lib/i18n";

export async function QuickSearch() {
  const [categoriesList, { dict }] = await Promise.all([getActiveCategories(), getDict()]);

  return (
    <section className="border-b border-silver-lining bg-pure-white py-8">
      <Container>
        <form action="/utilaje" method="GET" className="flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            name="q"
            placeholder={dict.search.placeholder}
            className="w-full flex-1 rounded-inputs border border-steel bg-pure-white px-4 py-3 text-[15px] text-carbon-black placeholder:text-fog focus:border-peloton-red focus:outline-none focus:ring-4 focus:ring-peloton-red/15"
          />
          <Select name="category" defaultValue="" className="md:w-56">
            <option value="">{dict.search.allCategories}</option>
            {categoriesList.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </Select>
          <Select name="listingType" defaultValue="" className="md:w-52">
            <option value="">{dict.search.saleAndRent}</option>
            <option value="vanzare">{dict.search.saleOnly}</option>
            <option value="inchiriere">{dict.search.rentOnly}</option>
          </Select>
          <Button type="submit" variant="primary" className="md:w-auto">
            {dict.search.submit}
          </Button>
        </form>
      </Container>
    </section>
  );
}
