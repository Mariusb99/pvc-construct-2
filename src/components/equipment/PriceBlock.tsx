import { formatPrice } from "@/lib/utils";
import { getDict } from "@/lib/i18n";

type PriceBlockProps = {
  status: string;
  salePrice: string | null;
  rentalPriceDay: string | null;
  rentalPriceWeek: string | null;
  rentalPriceMonth: string | null;
};

const canSell = (s: string) => s === "DE_VANZARE" || s === "DE_VANZARE_SI_INCHIRIAT";
const canRent = (s: string) => s === "DE_INCHIRIAT" || s === "DE_VANZARE_SI_INCHIRIAT";

export async function PriceBlock(props: PriceBlockProps) {
  const { status, salePrice, rentalPriceDay, rentalPriceWeek, rentalPriceMonth } = props;
  const { dict } = await getDict();
  const t = dict.detail;

  const sale = canSell(status) ? formatPrice(salePrice) : null;
  const rows = canRent(status)
    ? [
        { label: t.perDay, value: formatPrice(rentalPriceDay) },
        { label: t.perWeek, value: formatPrice(rentalPriceWeek) },
        { label: t.perMonth, value: formatPrice(rentalPriceMonth) },
      ].filter((r) => r.value)
    : [];

  if (!sale && rows.length === 0) {
    return (
      <div className="rounded-cards border border-silver-lining bg-mist-gray p-5">
        <p className="text-[15px] font-medium text-carbon-black">{t.priceOnRequest}</p>
        <p className="mt-1 text-[13px] text-slate">{t.priceOnRequestDesc}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-cards border border-silver-lining bg-pure-white p-5">
      {sale && (
        <div className="flex items-baseline justify-between">
          <span className="text-[14px] text-slate">{t.salePrice}</span>
          <span className="text-[22px] font-semibold text-carbon-black">{sale}</span>
        </div>
      )}
      {rows.length > 0 && (
        <div className="flex flex-col gap-1.5 border-t border-silver-lining pt-3">
          <span className="text-[13px] font-medium text-slate">{t.rentalTitle}</span>
          {rows.map((r) => (
            <div key={r.label} className="flex items-baseline justify-between">
              <span className="text-[13px] text-slate">{r.label}</span>
              <span className="text-[16px] font-semibold text-carbon-black">{r.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
