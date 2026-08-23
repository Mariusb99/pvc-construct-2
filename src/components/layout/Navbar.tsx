import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { getSettings } from "@/lib/queries/settings";
import { getActiveCategories } from "@/lib/queries/categories";
import { getDict } from "@/lib/i18n";

export async function Navbar() {
  const [settingsRow, categoriesList, { locale, dict }] = await Promise.all([
    getSettings(),
    getActiveCategories(),
    getDict(),
  ]);

  const navLinks = [
    { href: "/utilaje", label: dict.footer.allEquipment },
    { href: "/utilaje?listingType=vanzare", label: dict.nav.sale },
    { href: "/utilaje?listingType=inchiriere", label: dict.nav.rent },
    { href: "/despre-noi", label: dict.nav.about },
    { href: "/contact", label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 bg-carbon-black">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-3 px-4 py-4 sm:gap-6 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 text-[13px] font-semibold tracking-[0.02em] text-pure-white sm:text-[16px] sm:tracking-[0.025em]"
        >
          {settingsRow.logoUrl ? (
            <Image
              src={settingsRow.logoUrl}
              alt={settingsRow.companyName}
              width={220}
              height={56}
              className="h-11 w-auto object-contain sm:h-14"
            />
          ) : (
            <span className="truncate uppercase">{settingsRow.companyName}</span>
          )}
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          <div className="group relative">
            <Link
              href="/utilaje"
              className="flex items-center gap-1 text-[14px] font-medium text-pure-white/90 hover:text-pure-white"
            >
              {dict.nav.equipment}
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden>
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </Link>
            {categoriesList.length > 0 && (
              <div className="invisible absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                <div className="grid grid-cols-2 gap-1 rounded-cards bg-carbon-black p-6 shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
                  {categoriesList.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/utilaje/${cat.slug}`}
                      className="rounded-tags px-3 py-2 text-[14px] text-pure-white/80 hover:bg-white/5 hover:text-pure-white"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          {navLinks.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] font-medium text-pure-white/90 hover:text-pure-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <LanguageToggle locale={locale} />
          {settingsRow.phone && (
            <a
              href={`tel:${settingsRow.phone.replace(/\s+/g, "")}`}
              className="hidden text-[14px] font-medium text-pure-white/80 hover:text-pure-white md:block"
            >
              {settingsRow.phone}
            </a>
          )}
          {/* Pe mobil acțiunea trăiește în bara fixă de jos, ca header-ul să
              rămână curat; pe desktop păstrăm un buton sobru, cu contur.
              Ascunderea se face pe un wrapper: `hidden` pus direct pe buton ar
              intra în conflict cu `inline-flex` din stilul lui de bază. */}
          <span className="hidden lg:inline-flex">
            <Button href="/contact#cerere-oferta" size="sm" variant="ghost-dark">
              {dict.nav.requestQuote}
            </Button>
          </span>
        </div>
      </div>

      {/* navigare mobilă simplă, sub bara principală */}
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-white/10 px-4 lg:hidden">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex h-11 shrink-0 items-center whitespace-nowrap px-2 text-[14px] font-medium text-pure-white/80 hover:text-pure-white"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
