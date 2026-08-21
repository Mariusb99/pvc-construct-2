import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/Card";
import { getActiveCategories } from "@/lib/queries/categories";
import { countEquipmentByCategory } from "@/lib/queries/equipment";

export async function CategoryGrid() {
  const [categoriesList, counts] = await Promise.all([
    getActiveCategories(),
    countEquipmentByCategory(),
  ]);

  if (categoriesList.length === 0) return null;

  return (
    <section className="py-16">
      <Container>
        <SectionHeader
          eyebrow="Catalog"
          title="Categorii de utilaje"
          description="Răsfoiește după tipul de utilaj de care ai nevoie pentru șantier."
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categoriesList.map((cat) => {
            const count = counts.get(cat.id) ?? 0;
            return (
              <Link
                key={cat.id}
                href={`/utilaje/${cat.slug}`}
                className="group flex flex-col justify-between gap-6 rounded-cards border border-silver-lining bg-pure-white p-6 transition-colors hover:border-carbon-black"
              >
                <span className="text-[16px] font-medium text-carbon-black">
                  {cat.name}
                </span>
                <span className="text-[13px] text-slate">
                  {count} {count === 1 ? "utilaj" : "utilaje"}
                  <span className="ml-2 text-peloton-red opacity-0 transition-opacity group-hover:opacity-100">
                    →
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
