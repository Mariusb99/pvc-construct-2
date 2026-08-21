import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { EquipmentListing } from "@/components/equipment/EquipmentListing";
import { parseFilters, type RawSearchParams } from "@/lib/filters";
import { getDict } from "@/lib/i18n";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Utilaje de construcții — vânzare și închiriere",
  description:
    "Catalog complet de utilaje de construcții disponibile pentru vânzare sau închiriere: excavatoare, buldoexcavatoare, nacele, stivuitoare și multe altele.",
};

export default async function UtilajePage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const rawSearchParams = await searchParams;
  const filters = parseFilters(rawSearchParams);
  const { dict } = await getDict();

  return (
    <Container className="py-10">
      <div className="mb-8">
        <h1 className="text-[32px] font-medium tracking-[-0.192px] text-carbon-black">
          {dict.catalog.title}
        </h1>
        <p className="mt-2 max-w-[560px] text-[15px] text-slate">{dict.catalog.subtitle}</p>
      </div>
      <EquipmentListing
        filters={filters}
        rawSearchParams={rawSearchParams}
        basePath="/utilaje"
      />
    </Container>
  );
}
