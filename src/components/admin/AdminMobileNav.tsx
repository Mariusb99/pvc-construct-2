"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ExternalLink } from "lucide-react";
import { ADMIN_NAV, ADMIN_NAV_ADMIN_ONLY } from "./nav-items";
import { cn } from "@/lib/utils";

/**
 * Navigația de admin pe telefon: bară fixă sus cu buton hamburger și un
 * sertar care alunecă din stânga. Înlocuiește vechiul rând cu derulare
 * orizontală, care obliga utilizatorul să tragă pagina ca să ajungă la
 * ultimele secțiuni.
 *
 * `children` este formularul de deconectare (Server Action), primit ca slot.
 */
export function AdminMobileNav({
  userName,
  userRole,
  children,
}: {
  userName: string;
  userRole: "ADMIN" | "VANZARI";
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = [...ADMIN_NAV, ...(userRole === "ADMIN" ? ADMIN_NAV_ADMIN_ONLY : [])];
  const current = items.find((i) =>
    "exact" in i && i.exact ? pathname === i.href : pathname.startsWith(i.href)
  );

  // Se închide singur după navigare.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Cât timp sertarul e deschis, pagina din spate nu se derulează.
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
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-silver-lining bg-pure-white px-3 py-2 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Deschide meniul"
          aria-expanded={open}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-tags text-carbon-black hover:bg-mist-gray"
        >
          <Menu size={22} strokeWidth={1.75} />
        </button>
        <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-carbon-black">
          {current?.label ?? "Admin"}
        </span>
      </header>

      <div
        className={cn("fixed inset-0 z-50 lg:hidden", !open && "pointer-events-none")}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-carbon-black/60 transition-opacity duration-300 motion-reduce:transition-none",
            open ? "opacity-100" : "opacity-0"
          )}
        />
        <nav
          aria-label="Meniu administrare"
          className={cn(
            "absolute inset-y-0 left-0 flex w-[min(20rem,85vw)] flex-col bg-pure-white transition-transform duration-300 ease-out motion-reduce:transition-none",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-silver-lining px-4 py-3">
            <span className="text-[14px] font-semibold uppercase tracking-[0.025em] text-carbon-black">
              PVC Construct
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Închide meniul"
              className="-mr-1 flex h-11 w-11 items-center justify-center rounded-tags text-slate hover:bg-mist-gray hover:text-carbon-black"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3">
            {items.map((item) => {
              const active =
                "exact" in item && item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-12 items-center gap-3 rounded-tags px-3 text-[15px] font-medium",
                    active
                      ? "bg-carbon-black text-pure-white"
                      : "text-carbon-black hover:bg-mist-gray"
                  )}
                >
                  <item.icon size={19} strokeWidth={1.75} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="shrink-0 border-t border-silver-lining p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <Link
              href="/"
              target="_blank"
              className="flex min-h-12 items-center gap-2 rounded-tags px-3 text-[14px] text-slate hover:bg-mist-gray hover:text-carbon-black"
            >
              <ExternalLink size={16} /> Vezi site-ul
            </Link>
            <div className="mt-1 flex items-center justify-between gap-2 px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-[14px] font-medium text-carbon-black">{userName}</p>
                <p className="text-[11px] uppercase tracking-[0.3px] text-steel">
                  {userRole === "ADMIN" ? "Administrator" : "Vânzări"}
                </p>
              </div>
              {children}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
