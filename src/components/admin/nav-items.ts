import {
  LayoutDashboard,
  Wrench,
  Tags,
  BadgeCheck,
  Inbox,
  CalendarRange,
  Settings,
  Users,
} from "lucide-react";

/** Sursa unică pentru navigația din admin — folosită de sidebar-ul de desktop
 *  și de meniul mobil, ca să nu se desincronizeze. */
export const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/utilaje", label: "Utilaje", icon: Wrench },
  { href: "/admin/categorii", label: "Categorii", icon: Tags },
  { href: "/admin/marci", label: "Mărci", icon: BadgeCheck },
  { href: "/admin/leads", label: "Lead-uri", icon: Inbox },
  { href: "/admin/inchirieri", label: "Închirieri", icon: CalendarRange },
] as const;

export const ADMIN_NAV_ADMIN_ONLY = [
  { href: "/admin/setari", label: "Setări", icon: Settings },
  { href: "/admin/useri", label: "Useri", icon: Users },
] as const;
