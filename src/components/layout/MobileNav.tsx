"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

type NavLink = { href: string; label: string };

/**
 * Meniul de pe telefon: buton hamburger în bara de sus și un sertar care
 * alunecă din dreapta. Înlocuiește vechiul rând de linkuri cu derulare
 * orizontală — acolo ultimele intrări rămâneau ascunse sub marginea ecranului.
 *
 * `languageToggle` vine ca slot, fiind o componentă care apelează o acțiune
 * de server pentru schimbarea limbii.
 */
export function MobileNav({
  links,
  phone,
  requestQuoteLabel,
  languageToggle,
}: {
  links: NavLink[];
  phone: string | null;
  requestQuoteLabel: string;
  languageToggle: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Deschide meniul"
        aria-expanded={open}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-tags text-pure-white hover:bg-white/10 lg:hidden"
      >
        <Menu size={22} strokeWidth={1.75} />
      </button>

      <div
        className={cn("fixed inset-0 z-[60] lg:hidden", !open && "pointer-events-none")}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-carbon-black/70 transition-opacity duration-300 motion-reduce:transition-none",
            open ? "opacity-100" : "opacity-0"
          )}
        />
        <nav
          aria-label="Meniu principal"
          className={cn(
            "absolute inset-y-0 right-0 flex w-[min(20rem,88vw)] flex-col bg-carbon-black transition-transform duration-300 ease-out motion-reduce:transition-none",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
            {languageToggle}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Închide meniul"
              className="-mr-1 flex h-11 w-11 items-center justify-center rounded-tags text-pure-white/80 hover:bg-white/10 hover:text-pure-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-3">
            {links.map((link) => {
              const active = pathname === link.href.split("?")[0];
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-12 items-center rounded-tags px-3 text-[16px] font-medium",
                    active ? "bg-white/10 text-pure-white" : "text-pure-white/85 hover:bg-white/5"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="shrink-0 border-t border-white/10 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {phone && (
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="mb-2 flex min-h-12 items-center justify-center gap-2 rounded-buttons border-[1.5px] border-pure-white/70 text-[15px] font-medium text-pure-white"
              >
                <Phone size={16} strokeWidth={1.75} />
                {phone}
              </a>
            )}
            <Link
              href="/contact#cerere-oferta"
              className="flex min-h-12 items-center justify-center rounded-buttons bg-peloton-red text-[15px] font-medium text-pure-white"
            >
              {requestQuoteLabel}
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
