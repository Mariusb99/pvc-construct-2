import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EquipmentCard } from "@/components/equipment/EquipmentCard";
import { getFeaturedEquipment, getEquipmentList } from "@/lib/queries/equipment";
import { getDict } from "@/lib/i18n";

export async function FeaturedEquipment() {
  const { locale, dict } = await getDict();

  // Preferăm utilajele marcate „Recomandat" din admin; dacă nu există încă
  // niciunul, afișăm cele mai recente utilaje adăugate, ca secțiunea să nu
  // fie niciodată goală.
  let items = await getFeaturedEquipment(8);
  let isFeaturedSelection = true;

  if (items.length === 0) {
    const recent = await getEquipmentList({ perPage: 8, sort: "recent" });
    items = recent.items;
    isFeaturedSelection = false;
  }

  if (items.length === 0) return null;

  return (
    <section className="bg-pure-white py-16">
      <Container>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <SectionHeader
            eyebrow={isFeaturedSelection ? dict.home.featuredEyebrow : dict.home.recentEyebrow}
            title={isFeaturedSelection ? dict.home.featuredTitle : dict.home.recentTitle}
            description={isFeaturedSelection ? dict.home.featuredDesc : dict.home.recentDesc}
          />
          <Button href="/utilaje" variant="subtle" size="sm">
            {dict.common.viewAllEquipment}
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <EquipmentCard key={item.id} item={item} locale={locale} />
          ))}
        </div>
      </Container>
    </section>
  );
}
