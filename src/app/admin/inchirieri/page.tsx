import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { getRentals, getAvailabilityBlocks } from "@/lib/queries/rentals";
import { updateRentalStatusAction, deleteRentalAction, deleteAvailabilityBlockAction } from "@/lib/actions/rentals";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

const RENTAL_STATUS_LABELS: Record<string, string> = {
  SOLICITAT: "Solicitat",
  CONFIRMAT: "Confirmat",
  ACTIV: "Activ",
  FINALIZAT: "Finalizat",
  ANULAT: "Anulat",
};

const REASON_LABELS: Record<string, string> = {
  INCHIRIAT: "Închiriat",
  MENTENANTA: "Mentenanță",
  REZERVAT: "Rezervat",
};

export default async function AdminRentalsPage() {
  const [rentalsList, blocks] = await Promise.all([getRentals(), getAvailabilityBlocks()]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-[26px] font-medium text-carbon-black">Închirieri</h1>
        <Link
          href="/admin/inchirieri/noua"
          className="flex items-center gap-2 rounded-buttons bg-peloton-red px-5 py-2.5 text-[14px] font-medium text-pure-white hover:bg-[#c11826]"
        >
          <Plus size={16} /> Închiriere nouă
        </Link>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {rentalsList.map((r) => (
          <div key={r.id} className="rounded-cards border border-silver-lining bg-pure-white p-4">
            <Link href={`/admin/utilaje/${r.equipmentId}`} className="break-words text-[15px] font-medium text-carbon-black hover:text-peloton-red">
              {r.equipmentModel}
            </Link>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
              <div className="col-span-2">
                <dt className="text-[11px] uppercase tracking-[0.3px] text-steel">Client</dt>
                <dd className="break-words text-slate">
                  {r.customerName ?? "—"}
                  {r.customerPhone ? ` · ${r.customerPhone}` : ""}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[11px] uppercase tracking-[0.3px] text-steel">Perioadă</dt>
                <dd className="text-slate">{r.startDate} → {r.endDate}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.3px] text-steel">Valoare</dt>
                <dd className="text-slate">{formatPrice(r.estimatedPrice) ?? "—"}</dd>
              </div>
            </dl>
            <div className="mt-3 border-t border-silver-lining pt-3">
              <StatusSelect
                value={r.status}
                options={Object.entries(RENTAL_STATUS_LABELS).map(([value, label]) => ({ value, label }))}
                onChange={async (value) => {
                  "use server";
                  await updateRentalStatusAction(r.id, value);
                }}
              />
              <div className="mt-3">
                <ConfirmButton
                  confirmMessage="Ștergi această înregistrare de închiriere?"
                  action={deleteRentalAction.bind(null, r.id)}
                  className="min-h-11 text-[13px] text-slate hover:text-peloton-red"
                >
                  Șterge
                </ConfirmButton>
              </div>
            </div>
          </div>
        ))}
        {rentalsList.length === 0 && (
          <div className="rounded-cards border border-dashed border-silver-lining px-4 py-10 text-center text-[14px] text-slate">
            Nicio închiriere înregistrată.
          </div>
        )}
      </div>

      <div className="hidden overflow-hidden rounded-cards border border-silver-lining bg-pure-white md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-[13px]">
            <thead className="border-b border-silver-lining bg-mist-gray text-[11px] uppercase tracking-[0.3px] text-steel">
              <tr>
                <th className="px-4 py-3">Utilaj</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Perioadă</th>
                <th className="px-4 py-3">Valoare estimată</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {rentalsList.map((r) => (
                <tr key={r.id} className="border-b border-silver-lining last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/utilaje/${r.equipmentId}`} className="font-medium text-carbon-black hover:text-peloton-red">
                      {r.equipmentModel}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate">
                    {r.customerName ?? "—"}
                    {r.customerPhone && <div className="text-[12px]">{r.customerPhone}</div>}
                  </td>
                  <td className="px-4 py-3 text-slate">{r.startDate} → {r.endDate}</td>
                  <td className="px-4 py-3 text-slate">{formatPrice(r.estimatedPrice) ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusSelect
                      value={r.status}
                      options={Object.entries(RENTAL_STATUS_LABELS).map(([value, label]) => ({ value, label }))}
                      onChange={async (value) => {
                        "use server";
                        await updateRentalStatusAction(r.id, value);
                      }}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ConfirmButton
                      confirmMessage="Ștergi această înregistrare de închiriere?"
                      action={deleteRentalAction.bind(null, r.id)}
                      className="text-[12px] text-slate hover:text-peloton-red"
                    >
                      Șterge
                    </ConfirmButton>
                  </td>
                </tr>
              ))}
              {rentalsList.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate">
                    Nicio închiriere înregistrată.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <h2 className="mb-4 mt-10 text-[18px] font-medium text-carbon-black">
        Perioade de indisponibilitate
      </h2>
      <div className="flex flex-col gap-3 md:hidden">
        {blocks.map((b) => (
          <div key={b.id} className="flex items-start justify-between gap-3 rounded-cards border border-silver-lining bg-pure-white p-4">
            <div className="min-w-0">
              <p className="break-words text-[14px] font-medium text-carbon-black">{b.equipmentModel}</p>
              <p className="text-[13px] text-slate">{b.startDate} → {b.endDate}</p>
              <p className="text-[12px] text-steel">{REASON_LABELS[b.reason]}</p>
            </div>
            <form
              action={async () => {
                "use server";
                await deleteAvailabilityBlockAction(b.id);
              }}
            >
              <button type="submit" aria-label="Șterge" className="flex h-11 w-11 items-center justify-center text-slate hover:text-peloton-red">
                <Trash2 size={16} />
              </button>
            </form>
          </div>
        ))}
        {blocks.length === 0 && (
          <div className="rounded-cards border border-dashed border-silver-lining px-4 py-8 text-center text-[14px] text-slate">
            Nicio perioadă blocată.
          </div>
        )}
      </div>

      <div className="hidden overflow-hidden rounded-cards border border-silver-lining bg-pure-white md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-[13px]">
            <thead className="border-b border-silver-lining bg-mist-gray text-[11px] uppercase tracking-[0.3px] text-steel">
              <tr>
                <th className="px-4 py-3">Utilaj</th>
                <th className="px-4 py-3">Perioadă</th>
                <th className="px-4 py-3">Motiv</th>
                <th className="px-4 py-3 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {blocks.map((b) => (
                <tr key={b.id} className="border-b border-silver-lining last:border-0">
                  <td className="px-4 py-3 font-medium text-carbon-black">{b.equipmentModel}</td>
                  <td className="px-4 py-3 text-slate">{b.startDate} → {b.endDate}</td>
                  <td className="px-4 py-3 text-slate">{REASON_LABELS[b.reason]}</td>
                  <td className="px-4 py-3 text-right">
                    <form
                      action={async () => {
                        "use server";
                        await deleteAvailabilityBlockAction(b.id);
                      }}
                    >
                      <button type="submit" className="text-slate hover:text-peloton-red">
                        <Trash2 size={14} className="ml-auto" />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {blocks.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate">
                    Nicio perioadă blocată.
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
