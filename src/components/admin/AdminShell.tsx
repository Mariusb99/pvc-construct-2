import Link from "next/link";
import {
  LayoutDashboard,
  Wrench,
  Tags,
  BadgeCheck,
  Inbox,
  CalendarRange,
  Settings,
  Users,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { signOut } from "@/lib/auth";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/utilaje", label: "Utilaje", icon: Wrench },
  { href: "/admin/categorii", label: "Categorii", icon: Tags },
  { href: "/admin/marci", label: "Mărci", icon: BadgeCheck },
  { href: "/admin/leads", label: "Lead-uri", icon: Inbox },
  { href: "/admin/inchirieri", label: "Închirieri", icon: CalendarRange },
] as const;

const NAV_ADMIN_ONLY = [
  { href: "/admin/setari", label: "Setări", icon: Settings },
  { href: "/admin/useri", label: "Useri", icon: Users },
] as const;

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
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-silver-lining bg-pure-white lg:flex">
        <div className="flex items-center gap-2 border-b border-silver-lining px-6 py-5">
          <span className="text-[14px] font-semibold uppercase tracking-[0.025em] text-carbon-black">
            PVC Construct
          </span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4">
          {NAV.map((item) => (
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
              {NAV_ADMIN_ONLY.map((item) => (
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
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button
                type="submit"
                aria-label="Deconectare"
                className="flex h-8 w-8 items-center justify-center rounded-tags text-slate hover:bg-mist-gray hover:text-peloton-red"
              >
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="flex-1">
        {/* nav mobilă simplă */}
        <div className="flex items-center gap-4 overflow-x-auto border-b border-silver-lining bg-pure-white px-4 py-3 lg:hidden">
          {[...NAV, ...(userRole === "ADMIN" ? NAV_ADMIN_ONLY : [])].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-[13px] font-medium text-carbon-black"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <main className="p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
