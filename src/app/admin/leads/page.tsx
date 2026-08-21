import Link from "next/link";
import { getLeads, getLeadCounts } from "@/lib/queries/leads";
import { updateLeadStatusAction, deleteLeadAction } from "@/lib/actions/admin-leads";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const LEAD_STATUS_LABELS: Record<string, string> = {
  NOU: "Nou",
  CONTACTAT: "Contactat",
  OFERTA_TRIMISA: "Ofertă trimisă",
  NEGOCIERE: "În negociere",
  CASTIGAT: "Câștigat",
  PIERDUT: "Pierdut",
};

const REQUEST_TYPE_LABELS: Record<string, string> = {
  VANZARE: "Cumpărare",
  INCHIRIERE: "Închiriere",
  GENERAL: "General",
};

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const [leadsList, counts] = await Promise.all([getLeads(status), getLeadCounts()]);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div>
      <h1 className="mb-1 text-[26px] font-medium text-carbon-black">Lead-uri</h1>
      <p className="mb-6 text-[13px] text-slate">{total} cereri primite</p>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/leads"
          className={cn(
            "rounded-tags px-3 py-1.5 text-[13px] font-medium",
            !status ? "bg-carbon-black text-pure-white" : "bg-pure-white text-slate border border-silver-lining"
          )}
        >
          Toate ({total})
        </Link>
        {Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => (
          <Link
            key={value}
            href={`/admin/leads?status=${value}`}
            className={cn(
              "rounded-tags px-3 py-1.5 text-[13px] font-medium",
              status === value ? "bg-carbon-black text-pure-white" : "bg-pure-white text-slate border border-silver-lining"
            )}
          >
            {label} ({counts[value] ?? 0})
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-cards border border-silver-lining bg-pure-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-[13px]">
            <thead className="border-b border-silver-lining bg-mist-gray text-[11px] uppercase tracking-[0.3px] text-steel">
              <tr>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Tip</th>
                <th className="px-4 py-3">Utilaj</th>
                <th className="px-4 py-3">Perioadă</th>
                <th className="px-4 py-3">Locație</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {leadsList.map((lead) => (
                <tr key={lead.id} className="border-b border-silver-lining align-top last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium text-carbon-black">{lead.customerName}</div>
                    {lead.company && <div className="text-[12px] text-slate">{lead.company}</div>}
                  </td>
                  <td className="px-4 py-3 text-slate">
                    <div>{lead.phone}</div>
                    <div className="text-[12px]">{lead.email}</div>
                  </td>
                  <td className="px-4 py-3 text-slate">{REQUEST_TYPE_LABELS[lead.requestType]}</td>
                  <td className="px-4 py-3">
                    {lead.equipmentModel ? (
                      <Link
                        href={`/admin/utilaje/${lead.equipmentId}`}
                        className="text-carbon-black hover:text-peloton-red"
                      >
                        {lead.equipmentModel}
                      </Link>
                    ) : (
                      <span className="text-slate">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate">
                    {lead.startDate ? `${lead.startDate} → ${lead.endDate}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-slate">{lead.projectLocation ?? "—"}</td>
                  <td className="px-4 py-3 text-slate">
                    {new Date(lead.createdAt).toLocaleDateString("ro-RO")}
                  </td>
                  <td className="px-4 py-3">
                    <StatusSelect
                      value={lead.status}
                      options={Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => ({ value, label }))}
                      onChange={async (value) => {
                        "use server";
                        await updateLeadStatusAction(lead.id, value);
                      }}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      {lead.requestType === "INCHIRIERE" && lead.equipmentId && (
                        <Link
                          href={`/admin/inchirieri/noua?leadId=${lead.id}&equipmentId=${lead.equipmentId}`}
                          className="text-[12px] text-peloton-red hover:underline"
                        >
                          Creează închiriere
                        </Link>
                      )}
                      <ConfirmButton
                        confirmMessage="Ștergi acest lead?"
                        action={deleteLeadAction.bind(null, lead.id)}
                        className="text-[12px] text-slate hover:text-peloton-red"
                      >
                        Șterge
                      </ConfirmButton>
                    </div>
                  </td>
                </tr>
              ))}
              {leadsList.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-slate">
                    Niciun lead momentan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
