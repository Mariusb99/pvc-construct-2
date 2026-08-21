import Link from "next/link";
import Image from "next/image";
import { StatusBadge, type EquipmentStatus } from "@/components/ui/StatusBadge";
import { formatPrice, cn } from "@/lib/utils";
import { dictionaries, type Locale } from "@/lib/i18n/dictionaries";
import type { EquipmentListItem } from "@/lib/queries/equipment";

function priceLabel(item: EquipmentListItem, t: (typeof dictionaries)["ro"]["card"]) {
  const isForSale =
    item.status === "DE_VANZARE" || item.status === "DE_VANZARE_SI_INCHIRIAT";
  const isForRent =
    item.status === "DE_INCHIRIAT" || item.status === "DE_VANZARE_SI_INCHIRIAT";

  if (isForSale && item.salePrice) {
    return { main: formatPrice(item.salePrice), suffix: null };
  }
  if (isForRent && item.rentalPriceDay) {
    return { main: formatPrice(item.rentalPriceDay), suffix: t.perDay };
  }
  return { main: t.requestQuote, suffix: null };
}

function PlaceholderImage() {
  return (
    <div className="flex h-full w-full items-center justify-center text-fog">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M3 16l4.5-6 3.5 4 3-4L21 16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="3" y="4" width="18" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

export function EquipmentCard({
  item,
  layout = "grid",
  locale = "ro",
}: {
  item: EquipmentListItem;
  layout?: "grid" | "list";
  locale?: Locale;
}) {
  const t = dictionaries[locale].card;
  const price = priceLabel(item, t);
  const href = `/utilaje/${item.categorySlug}/${item.slug}`;

  if (layout === "list") {
    return (
      <Link
        href={href}
        className="group flex gap-5 overflow-hidden rounded-cards border border-silver-lining bg-pure-white p-3 transition-colors hover:border-carbon-black/20 sm:p-4"
      >
        <div className="relative w-32 flex-shrink-0 overflow-hidden rounded-images bg-mist-gray sm:w-48">
          {item.primaryImage ? (
            <Image
              src={item.primaryImage}
              alt={item.model}
              fill
              sizes="200px"
              className="object-cover"
            />
          ) : (
            <PlaceholderImage />
          )}
          <div className="absolute left-2 top-2">
            <StatusBadge status={item.status as EquipmentStatus} locale={locale} />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-1.5 py-1">
          <span className="text-[12px] font-medium uppercase tracking-[0.3px] text-steel">
            {item.brandName ?? item.categoryName}
          </span>
          <h3 className="text-[18px] font-medium leading-snug text-carbon-black">
            {item.model}
          </h3>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-slate">
            {item.year && <span>{item.year}</span>}
            {item.hours !== null && item.hours !== undefined && (
              <span>{item.hours.toLocaleString("ro-RO")} {t.hours}</span>
            )}
            {item.location && <span>{item.location}</span>}
          </div>
          <div className="mt-1 flex items-center gap-4">
            <span className="text-[16px] font-semibold text-carbon-black">
              {price.main}
              {price.suffix && (
                <span className="ml-1 text-[13px] font-normal text-slate">{price.suffix}</span>
              )}
            </span>
            <span className="text-[13px] font-medium text-peloton-red group-hover:underline">
              {t.viewDetails} →
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col overflow-hidden rounded-cards border border-silver-lining bg-pure-white transition-shadow hover:border-carbon-black/20"
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-mist-gray">
        {item.primaryImage ? (
          <Image
            src={item.primaryImage}
            alt={item.model}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <PlaceholderImage />
        )}
        <div className="absolute left-3 top-3">
          <StatusBadge status={item.status as EquipmentStatus} locale={locale} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-6">
        <span className="text-[12px] font-medium uppercase tracking-[0.3px] text-steel">
          {item.brandName ?? item.categoryName}
        </span>
        <h3 className="text-[20px] font-medium leading-snug text-carbon-black">
          {item.model}
        </h3>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-slate">
          {item.year && <span>{item.year}</span>}
          {item.hours !== null && item.hours !== undefined && (
            <span>{item.hours.toLocaleString("ro-RO")} {t.hours}</span>
          )}
          {item.location && <span>{item.location}</span>}
        </div>
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <span className="text-[16px] font-semibold text-carbon-black">
              {price.main}
            </span>
            {price.suffix && (
              <span className="ml-1 text-[13px] text-slate">{price.suffix}</span>
            )}
          </div>
          <span className="text-[13px] font-medium text-peloton-red group-hover:underline">
            {t.viewDetails} →
          </span>
        </div>
      </div>
    </Link>
  );
}
