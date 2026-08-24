import Link from "next/link";
import { LogOut, ExternalLink } from "lucide-react";
import { signOut } from "@/lib/auth";
import { ADMIN_NAV, ADMIN_NAV_ADMIN_ONLY } from "./nav-items";
import { AdminMobileNav } from "./AdminMobileNav";

function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/admin/login" });
      }}
    >
      <button
        type="submit"
        aria-label="Deconectare"
        className="flex h-11 w-11 items-center justify-center rounded-tags text-slate hover:bg-mist-gray hover:text-peloton-red"
      >
        <LogOut size={18} />
      </button>
    </form>
  );
}

export function AdminShell({
  children,
  userName,
  userRole,
}: {
  children: React.ReactNode;
  userName: string;
  userRole: "ADMIN" | "VANZARI";
}) {
  return (
    <div className="flex min-h-screen bg-mist-gray">
      {/* Sidebar — doar pe desktop, neschimbat */}
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-silver-lining bg-pure-white lg:flex">
        <div className="flex items-center gap-2 border-b border-silver-lining px-6 py-5">
          <span className="text-[14px] font-semibold uppercase tracking-[0.025em] text-carbon-black">
            PVC Construct
          </span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-tags px-3 py-2.5 text-[14px] font-medium text-carbon-black hover:bg-mist-gray"
            >
              <item.icon size={17} strokeWidth={1.75} />
              {item.label}
            </Link>
          ))}
          {userRole === "ADMIN" && (
            <>
              <div className="my-2 border-t border-silver-lining" />
              {ADMIN_NAV_ADMIN_ONLY.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-tags px-3 py-2.5 text-[14px] font-medium text-carbon-black hover:bg-mist-gray"
                >
                  <item.icon size={17} strokeWidth={1.75} />
                  {item.label}
                </Link>
              ))}
            </>
          )}
        </nav>
        <div className="border-t border-silver-lining p-4">
          <Link
            href="/"
            target="_blank"
            className="mb-3 flex items-center gap-2 text-[13px] text-slate hover:text-carbon-black"
          >
            <ExternalLink size={14} /> Vezi site-ul
          </Link>
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-carbon-black">{userName}</p>
              <p className="text-[11px] uppercase tracking-[0.3px] text-steel">
                {userRole === "ADMIN" ? "Administrator" : "Vânzări"}
              </p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </aside>

      {/*
        `min-w-0` este esențial: fără el, acest element flex refuză să se
        micșoreze sub lățimea conținutului (tabelele late), iar întreaga
        pagină devine mai lată decât ecranul telefonului.
      */}
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminMobileNav userName={userName} userRole={userRole}>
          <SignOutButton />
        </AdminMobileNav>
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
