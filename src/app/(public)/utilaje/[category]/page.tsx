import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { EquipmentListing } from "@/components/equipment/EquipmentListing";
import { getCategoryBySlug } from "@/lib/queries/categories";
import { parseFilters, type RawSearchParams } from "@/lib/filters";

export const revalidate = 60;

type Params = { category: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category } = await params;
  const categoryRow = await getCategoryBySlug(category);
  if (!categoryRow) return {};

  return {
    title: `${categoryRow.name} — vânzare și închiriere`,
    description:
      categoryRow.description ??
      `${categoryRow.name} de vânzare și de închiriat, verificate tehnic și disponibile pentru livrare rapidă.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<RawSearchParams>;
}) {
  const { category } = await params;
  const categoryRow = await getCategoryBySlug(category);
  if (!categoryRow) notFound();

  const rawSearchParams = await searchParams;
  const filters = parseFilters(rawSearchParams);
  filters.categorySlug = categoryRow.slug;

  return (
    <Container className="py-10">
      <div className="mb-8">
        <h1 className="text-[32px] font-medium tracking-[-0.192px] text-carbon-black">
          {categoryRow.name}
        </h1>
        {categoryRow.description && (
          <p className="mt-2 max-w-[560px] text-[15px] text-slate">{categoryRow.description}</p>
        )}
      </div>
      <EquipmentListing
        filters={filters}
        rawSearchParams={rawSearchParams}
        basePath={`/utilaje/${categoryRow.slug}`}
        lockedCategory
      />
    </Container>
  );
}
