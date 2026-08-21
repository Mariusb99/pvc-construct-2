import Link from "next/link";
import { Wrench, Inbox, CalendarRange, TrendingUp, ArrowRight } from "lucide-react";
import { getEquipmentList } from "@/lib/queries/equipment";
import { getLeads, getLeadCounts } from "@/lib/queries/leads";
import { getRentals } from "@/lib/queries/rentals";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

const REQUEST_TYPE_LABELS: Record<string, string> = {
  VANZARE: "Cumpărare",
  INCHIRIERE: "Închiriere",
  GENERAL: "General",
};

export default async function AdminDashboardPage() {
  const [{ total: totalEquipment }, leadCounts, allLeads, rentalsList] = await Promise.all([
    getEquipmentList({ perPage: 1 }),
    getLeadCounts(),
    getLeads(),
    getRentals(),
  ]);

  const activeRentals = rentalsList.filter((r) => r.status === "ACTIV" || r.status === "CONFIRMAT").length;
  const newLeads = leadCounts["NOU"] ?? 0;
  const totalLeads = Object.values(leadCounts).reduce((a, b) => a + b, 0);
  const recentLeads = allLeads.slice(0, 5);

  const stats = [
    {
      label: "Utilaje în platformă",
      value: totalEquipment,
      icon: Wrench,
      href: "/admin/utilaje",
    },
    {
      label: "Lead-uri noi",
      value: newLeads,
      sub: `${totalLeads} total`,
      icon: Inbox,
      href: "/admin/leads",
    },
    {
      label: "Închirieri active",
      value: activeRentals,
      sub: `${rentalsList.length} total`,
      icon: CalendarRange,
      href: "/admin/inchirieri",
    },
  ];

  return (
    <div>
      <h1 className="mb-1 text-[26px] font-medium text-carbon-black">Dashboard</h1>
      <p className="mb-8 text-[13px] text-slate">Prezentare generală a activității PVC Construct.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-cards border border-silver-lining bg-pure-white p-6 transition-colors hover:border-peloton-red"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-tags bg-mist-gray text-carbon-black group-hover:bg-peloton-red/10 group-hover:text-peloton-red">
                <stat.icon size={18} strokeWidth={1.75} />
              </div>
              <ArrowRight size={16} className="text-fog group-hover:text-peloton-red" />
            </div>
            <p className="text-[32px] font-medium leading-none text-carbon-black">{stat.value}</p>
            <p className="mt-2 text-[13px] text-slate">{stat.label}</p>
            {stat.sub && <p className="text-[12px] text-fog">{stat.sub}</p>}
          </Link>
        ))}
      </div>

      <div className="mt-10 overflow-hidden rounded-cards border border-silver-lining bg-pure-white">
        <div className="flex items-center justify-between border-b border-silver-lining px-5 py-4">
          <h2 className="text-[15px] font-medium text-carbon-black">Cereri recente</h2>
          <Link href="/admin/leads" className="text-[13px] text-peloton-red hover:underline">
            Vezi toate
          </Link>
        </div>
        {recentLeads.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-5 py-14 text-center">
            <TrendingUp size={22} className="text-fog" />
            <p className="text-[14px] text-slate">Nicio cerere primită încă.</p>
            <p className="text-[12px] text-fog">
              Cererile trimise prin formularele de pe site vor apărea aici.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-[13px]">
              <thead className="border-b border-silver-lining bg-mist-gray text-[11px] uppercase tracking-[0.3px] text-steel">
                <tr>
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Tip</th>
                  <th className="px-5 py-3">Utilaj</th>
                  <th className="px-5 py-3">Data</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-silver-lining last:border-0">
                    <td className="px-5 py-3 font-medium text-carbon-black">{lead.customerName}</td>
                    <td className="px-5 py-3 text-slate">{REQUEST_TYPE_LABELS[lead.requestType]}</td>
                    <td className="px-5 py-3 text-slate">{lead.equipmentModel ?? "—"}</td>
                    <td className="px-5 py-3 text-slate">
                      {new Date(lead.createdAt).toLocaleDateString("ro-RO")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-10 overflow-hidden rounded-cards border border-silver-lining bg-pure-white">
        <div className="border-b border-silver-lining px-5 py-4">
          <h2 className="text-[15px] font-medium text-carbon-black">Închirieri recente</h2>
        </div>
        {rentalsList.length === 0 ? (
          <p className="px-5 py-10 text-center text-[14px] text-slate">
            Nicio închiriere înregistrată încă.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-[13px]">
              <thead className="border-b border-silver-lining bg-mist-gray text-[11px] uppercase tracking-[0.3px] text-steel">
                <tr>
                  <th className="px-5 py-3">Utilaj</th>
                  <th className="px-5 py-3">Perioadă</th>
                  <th className="px-5 py-3">Valoare</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {rentalsList.slice(0, 5).map((r) => (
                  <tr key={r.id} className="border-b border-silver-lining last:border-0">
                    <td className="px-5 py-3 font-medium text-carbon-black">{r.equipmentModel}</td>
                    <td className="px-5 py-3 text-slate">
                      {r.startDate} → {r.endDate}
                    </td>
                    <td className="px-5 py-3 text-slate">{formatPrice(r.estimatedPrice) ?? "—"}</td>
                    <td className="px-5 py-3 text-slate">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
