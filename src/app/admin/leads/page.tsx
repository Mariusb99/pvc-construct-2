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
            "inline-flex min-h-11 items-center rounded-tags px-3.5 text-[13px] font-medium sm:min-h-0 sm:py-1.5",
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
              "inline-flex min-h-11 items-center rounded-tags px-3.5 text-[13px] font-medium sm:min-h-0 sm:py-1.5",
              status === value ? "bg-carbon-black text-pure-white" : "bg-pure-white text-slate border border-silver-lining"
            )}
          >
            {label} ({counts[value] ?? 0})
          </Link>
        ))}
      </div>

      {/* Pe telefon fiecare cerere devine un card. */}
      <div className="flex flex-col gap-3 md:hidden">
        {leadsList.map((lead) => (
          <div key={lead.id} className="rounded-cards border border-silver-lining bg-pure-white p-4">
            <div className="min-w-0">
              <p className="break-words text-[15px] font-medium text-carbon-black">{lead.customerName}</p>
              {lead.company && <p className="break-words text-[12px] text-slate">{lead.company}</p>}
            </div>
            <div className="mt-2 flex flex-col gap-0.5 text-[13px]">
              <a href={`tel:${lead.phone.replace(/\s+/g, "")}`} className="text-carbon-black underline">
                {lead.phone}
              </a>
              <a href={`mailto:${lead.email}`} className="break-all text-slate underline">
                {lead.email}
              </a>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
              <div>
                <dt className="text-[11px] uppercase tracking-[0.3px] text-steel">Tip</dt>
                <dd className="text-slate">{REQUEST_TYPE_LABELS[lead.requestType]}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.3px] text-steel">Data</dt>
                <dd className="text-slate">{new Date(lead.createdAt).toLocaleDateString("ro-RO")}</dd>
              </div>
              {lead.equipmentModel && (
                <div className="col-span-2">
                  <dt className="text-[11px] uppercase tracking-[0.3px] text-steel">Utilaj</dt>
                  <dd>
                    <Link href={`/admin/utilaje/${lead.equipmentId}`} className="break-words text-carbon-black underline">
                      {lead.equipmentModel}
                    </Link>
                  </dd>
                </div>
              )}
              {lead.startDate && (
                <div className="col-span-2">
                  <dt className="text-[11px] uppercase tracking-[0.3px] text-steel">Perioadă</dt>
                  <dd className="text-slate">{lead.startDate} → {lead.endDate}</dd>
                </div>
              )}
              {lead.projectLocation && (
                <div className="col-span-2">
                  <dt className="text-[11px] uppercase tracking-[0.3px] text-steel">Locație</dt>
                  <dd className="break-words text-slate">{lead.projectLocation}</dd>
                </div>
              )}
              {lead.message && (
                <div className="col-span-2">
                  <dt className="text-[11px] uppercase tracking-[0.3px] text-steel">Mesaj</dt>
                  <dd className="whitespace-pre-wrap break-words text-slate">{lead.message}</dd>
                </div>
              )}
            </dl>
            <div className="mt-3 border-t border-silver-lining pt-3">
              <StatusSelect
                value={lead.status}
                options={Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => ({ value, label }))}
                onChange={async (value) => {
                  "use server";
                  await updateLeadStatusAction(lead.id, value);
                }}
              />
              <div className="mt-3 flex flex-wrap items-center gap-4 text-[13px]">
                {lead.requestType === "INCHIRIERE" && lead.equipmentId && (
                  <Link
                    href={`/admin/inchirieri/noua?leadId=${lead.id}&equipmentId=${lead.equipmentId}`}
                    className="min-h-11 text-peloton-red hover:underline"
                  >
                    Creează închiriere
                  </Link>
                )}
                <ConfirmButton
                  confirmMessage="Ștergi acest lead?"
                  action={deleteLeadAction.bind(null, lead.id)}
                  className="min-h-11 text-slate hover:text-peloton-red"
                >
                  Șterge
                </ConfirmButton>
              </div>
            </div>
          </div>
        ))}
        {leadsList.length === 0 && (
          <div className="rounded-cards border border-dashed border-silver-lining px-4 py-10 text-center text-[14px] text-slate">
            Niciun lead momentan.
          </div>
        )}
      </div>

      <div className="hidden overflow-hidden rounded-cards border border-silver-lining bg-pure-white md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-left text-[13px]">
            <thead className="border-b border-silver-lining bg-mist-gray text-[11px] uppercase tracking-[0.3px] text-steel">
              <tr>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Tip</th>
                <th className="px-4 py-3">Utilaj</th>
                <th className="px-4 py-3">Perioadă</th>
                <th className="px-4 py-3">Locație</th>
                <th className="px-4 py-3">Mesaj</th>
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
                  <td className="px-4 py-3 max-w-[220px] whitespace-pre-wrap break-words text-slate">
                    {lead.message ?? "—"}
                  </td>
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
                  <td colSpan={10} className="px-4 py-10 text-center text-slate">
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
