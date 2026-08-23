import Link from "next/link";
import { Phone } from "lucide-react";
import { getSettings } from "@/lib/queries/settings";
import { getDict } from "@/lib/i18n";

/**
 * Bară fixă de acțiune, doar pe mobil. Înlocuiește butonul roșu din header:
 * rămâne la îndemână tot timpul, dar în subsol și într-un ton sobru.
 * z-index-ul e sub cel al panoului de filtre, ca să nu-l acopere.
 */
export async function MobileCtaBar() {
  const [settingsRow, { dict }] = await Promise.all([getSettings(), getDict()]);
  const phone = settingsRow.phone?.trim();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-silver-lining bg-pure-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm lg:hidden">
      <div className="flex items-center gap-3">
        {phone && (
          <a
            href={`tel:${phone.replace(/\s+/g, "")}`}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-buttons border-[1.5px] border-carbon-black text-[15px] font-medium text-carbon-black"
          >
            <Phone size={16} strokeWidth={1.75} />
            {dict.common.callNow}
          </a>
        )}
        <Link
          href="/contact#cerere-oferta"
          className="flex h-12 flex-[2] items-center justify-center rounded-buttons bg-carbon-black text-[15px] font-medium text-pure-white"
        >
          {dict.common.requestQuote}
        </Link>
      </div>
    </div>
  );
}
