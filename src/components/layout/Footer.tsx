import Link from "next/link";
import { getSettings } from "@/lib/queries/settings";
import { getActiveCategories } from "@/lib/queries/categories";
import { getDict } from "@/lib/i18n";

export async function Footer() {
  const [settingsRow, categoriesList, { dict }] = await Promise.all([
    getSettings(),
    getActiveCategories(),
    getDict(),
  ]);

  const year = new Date().getFullYear();
  const addressLine = [settingsRow.address, settingsRow.postalCode]
    .filter(Boolean)
    .join(", ");
  const localityLine = [settingsRow.city, settingsRow.county]
    .filter(Boolean)
    .join(", ");

  return (
    <footer className="bg-carbon-black text-pure-white">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <span className="text-[14px] font-semibold uppercase tracking-[0.025em] text-pure-white">
            {settingsRow.companyName}
          </span>
          <p className="text-[14px] leading-relaxed text-slate">
            {addressLine}
            {addressLine && <br />}
            {localityLine}
          </p>
          {settingsRow.cui && (
            <p className="text-[13px] text-slate">CUI {settingsRow.cui}</p>
          )}
          {settingsRow.regCom && (
            <p className="text-[13px] text-slate">Reg. Com. {settingsRow.regCom}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-[14px] font-semibold text-pure-white">{dict.footer.equipmentColumn}</span>
          <ul className="flex flex-col gap-2">
            {categoriesList.slice(0, 8).map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/utilaje/${cat.slug}`}
                  className="text-[14px] text-slate hover:text-pure-white"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-[14px] font-semibold text-pure-white">{dict.footer.companyColumn}</span>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/despre-noi" className="text-[14px] text-slate hover:text-pure-white">
                {dict.nav.about}
              </Link>
            </li>
            <li>
              <Link href="/utilaje" className="text-[14px] text-slate hover:text-pure-white">
                {dict.footer.allEquipment}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-[14px] text-slate hover:text-pure-white">
                {dict.nav.contact}
              </Link>
            </li>
            <li>
              <Link
                href="/politica-de-confidentialitate"
                className="text-[14px] text-slate hover:text-pure-white"
              >
                {dict.footer.privacy}
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-[14px] font-semibold text-pure-white">{dict.footer.contactColumn}</span>
          <ul className="flex flex-col gap-2">
            {settingsRow.phone && (
              <li>
                <a
                  href={`tel:${settingsRow.phone.replace(/\s+/g, "")}`}
                  className="text-[14px] text-slate hover:text-pure-white"
                >
                  {settingsRow.phone}
                </a>
              </li>
            )}
            {settingsRow.email && (
              <li>
                <a
                  href={`mailto:${settingsRow.email}`}
                  className="text-[14px] text-slate hover:text-pure-white"
                >
                  {settingsRow.email}
                </a>
              </li>
            )}
            <li>
              <Link href="/contact#cerere-oferta" className="text-[14px] text-slate hover:text-pure-white">
                {dict.nav.requestQuote}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between gap-2 px-6 py-5 text-[12px] text-slate sm:flex-row">
          <span>
            © {year} {settingsRow.companyName}. {dict.footer.rightsReserved}
          </span>
          <Link href="/admin/login" className="hover:text-pure-white">
            {dict.nav.admin}
          </Link>
        </div>
      </div>
    </footer>
  );
}
