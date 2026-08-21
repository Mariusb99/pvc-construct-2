import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { StatusBadge, type EquipmentStatus } from "@/components/ui/StatusBadge";
import { Gallery } from "@/components/equipment/Gallery";
import { SpecTable } from "@/components/equipment/SpecTable";
import { PriceBlock } from "@/components/equipment/PriceBlock";
import { EquipmentCard } from "@/components/equipment/EquipmentCard";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";
import { getEquipmentBySlug, getRelatedEquipment } from "@/lib/queries/equipment";
import { getDict } from "@/lib/i18n";

export const revalidate = 60;

type Params = { category: string; slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getEquipmentBySlug(slug);
  if (!item) return {};

  return {
    title: item.metaTitle || `${item.model} — ${item.categoryName}`,
    description:
      item.metaDescription ||
      item.description ||
      `${item.model}, an ${item.year ?? ""}. Disponibil pentru vânzare și/sau închiriere la PVC Construct.`,
    openGraph: {
      images: item.images[0]?.imageUrl ? [item.images[0].imageUrl] : undefined,
    },
  };
}

export default async function EquipmentDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category, slug } = await params;
  const item = await getEquipmentBySlug(slug);

  if (!item || item.categorySlug !== category) notFound();

  const [related, { locale, dict }] = await Promise.all([
    getRelatedEquipment(item.categoryId, item.id, 4),
    getDict(),
  ]);
  const t = dict.detail;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.model,
    brand: item.brandName || undefined,
    image: item.images.map((img) => img.imageUrl),
    description: item.description || item.metaDescription || item.model,
    offers: item.salePrice
      ? {
          "@type": "Offer",
          priceCurrency: "EUR",
          price: item.salePrice,
          availability: "https://schema.org/InStock",
        }
      : undefined,
  };

  return (
    <Container className="py-10">
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-[13px] text-slate">
        <Link href="/utilaje" className="hover:text-carbon-black">
          {t.breadcrumbRoot}
        </Link>
        <span>/</span>
        <Link href={`/utilaje/${item.categorySlug}`} className="hover:text-carbon-black">
          {item.categoryName}
        </Link>
        <span>/</span>
        <span className="text-carbon-black">{item.model}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-10">
          <div>
            <Gallery images={item.images} model={item.model} />
          </div>

          <div>
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <StatusBadge status={item.status as EquipmentStatus} locale={locale} />
              {item.brandName && (
                <span className="text-[13px] font-medium uppercase tracking-[0.3px] text-steel">
                  {item.brandName}
                </span>
              )}
            </div>
            <h1 className="text-[32px] font-medium tracking-[-0.192px] text-carbon-black">
              {item.model}
            </h1>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[14px] text-slate">
              {item.year && <span>{t.year} {item.year}</span>}
              {item.hours !== null && item.hours !== undefined && (
                <span>{item.hours.toLocaleString("ro-RO")} {t.hours}</span>
              )}
              {item.location && <span>{t.location} {item.location}</span>}
            </div>
            {item.description && (
              <p className="mt-5 max-w-[640px] text-[15px] leading-relaxed text-carbon-black">
                {item.description}
              </p>
            )}
          </div>

          {item.specifications.length > 0 && (
            <div>
              <h2 className="mb-4 text-[22px] font-medium text-carbon-black">{t.specs}</h2>
              <SpecTable specifications={item.specifications} />
            </div>
          )}
        </div>

        <aside className="flex flex-col gap-6">
          <div className="lg:sticky lg:top-24 lg:flex lg:flex-col lg:gap-6">
            <PriceBlock
              status={item.status}
              salePrice={item.salePrice}
              rentalPriceDay={item.rentalPriceDay}
              rentalPriceWeek={item.rentalPriceWeek}
              rentalPriceMonth={item.rentalPriceMonth}
            />
            <div
              id="cerere-oferta"
              className="rounded-cards border border-silver-lining bg-pure-white p-6"
            >
              <h2 className="mb-4 text-[18px] font-medium text-carbon-black">
                {t.requestQuote}
              </h2>
              <QuoteRequestForm
                locale={locale}
                equipment={{
                  id: item.id,
                  model: item.model,
                  status: item.status,
                  rentalPriceDay: item.rentalPriceDay,
                  rentalPriceWeek: item.rentalPriceWeek,
                  rentalPriceMonth: item.rentalPriceMonth,
                }}
              />
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-[22px] font-medium text-carbon-black">{t.similar}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <EquipmentCard key={r.id} item={r} locale={locale} />
            ))}
          </div>
        </div>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Container>
  );
}
