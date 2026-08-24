import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { getEquipmentList } from "@/lib/queries/equipment";
import { STATUS_LABELS, type EquipmentStatus } from "@/components/ui/StatusBadge";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import {
  updateEquipmentStatusAction,
  deleteEquipmentAction,
  duplicateEquipmentAction,
} from "@/lib/actions/equipment";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminEquipmentListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const { items, total } = await getEquipmentList({ q, perPage: 100, sort: "recent" });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-medium text-carbon-black">Utilaje</h1>
          <p className="text-[13px] text-slate">{total} utilaje în total</p>
        </div>
        <Link
          href="/admin/utilaje/nou"
          className="flex items-center gap-2 rounded-buttons bg-peloton-red px-5 py-2.5 text-[14px] font-medium text-pure-white hover:bg-[#c11826]"
        >
          <Plus size={16} /> Adaugă utilaj
        </Link>
      </div>

      <form className="mb-5">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Caută marcă sau model..."
          className="w-full max-w-sm rounded-inputs border border-steel bg-pure-white px-3.5 py-2 text-[14px] focus:border-peloton-red focus:outline-none"
        />
      </form>

      {/* Pe telefon fiecare utilaj devine un card — un tabel de 900px ar
          obliga utilizatorul sa traga pagina lateral. */}
      <div className="flex flex-col gap-3 md:hidden">
        {items.map((item) => (
          <div key={item.id} className="rounded-cards border border-silver-lining bg-pure-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  href={`/admin/utilaje/${item.id}`}
                  className="block break-words text-[15px] font-medium text-carbon-black hover:text-peloton-red"
                >
                  {item.model}
                </Link>
                <p className="mt-0.5 text-[12px] text-slate">
                  {item.brandName ? `${item.brandName} · ` : ""}
                  {item.categoryName}
                </p>
              </div>
              {item.featured && (
                <Star size={16} className="mt-1 shrink-0 fill-peloton-red text-peloton-red" />
              )}
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
              <div>
                <dt className="text-[11px] uppercase tracking-[0.3px] text-steel">An / Ore</dt>
                <dd className="text-slate">
                  {item.year ?? "—"}
                  {item.hours ? ` / ${item.hours.toLocaleString("ro-RO")} ore` : ""}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.3px] text-steel">Preț</dt>
                <dd className="text-slate">
                  {formatPrice(item.salePrice) ??
                    (item.rentalPriceDay ? `${formatPrice(item.rentalPriceDay)}/zi` : "—")}
                </dd>
              </div>
            </dl>

            <div className="mt-3 border-t border-silver-lining pt-3">
              <StatusSelect
                value={item.status as EquipmentStatus}
                options={Object.entries(STATUS_LABELS).map(([value, label]) => ({
                  value: value as EquipmentStatus,
                  label,
                }))}
                onChange={async (status) => {
                  "use server";
                  await updateEquipmentStatusAction(item.id, status);
                }}
              />
              <div className="mt-3 flex items-center gap-4 text-[13px]">
                <form
                  action={async () => {
                    "use server";
                    await duplicateEquipmentAction(item.id);
                  }}
                >
                  <button type="submit" className="min-h-11 text-slate hover:text-carbon-black">
                    Duplică
                  </button>
                </form>
                <ConfirmButton
                  confirmMessage={`Ștergi definitiv „${item.model}”?`}
                  action={async () => {
                    "use server";
                    await deleteEquipmentAction(item.id);
                  }}
                  className="min-h-11 text-peloton-red hover:underline"
                >
                  Șterge
                </ConfirmButton>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="rounded-cards border border-dashed border-silver-lining px-4 py-10 text-center text-[14px] text-slate">
            Niciun utilaj adăugat încă.
          </div>
        )}
      </div>

      <div className="hidden overflow-hidden rounded-cards border border-silver-lining bg-pure-white md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-[13px]">
            <thead className="border-b border-silver-lining bg-mist-gray text-[11px] uppercase tracking-[0.3px] text-steel">
              <tr>
                <th className="px-4 py-3">Utilaj</th>
                <th className="px-4 py-3">Categorie</th>
                <th className="px-4 py-3">An / Ore</th>
                <th className="px-4 py-3">Preț</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Recomandat</th>
                <th className="px-4 py-3 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-silver-lining last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/utilaje/${item.id}`}
                      className="font-medium text-carbon-black hover:text-peloton-red"
                    >
                      {item.model}
                    </Link>
                    {item.brandName && (
                      <div className="text-[12px] text-slate">{item.brandName}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate">{item.categoryName}</td>
                  <td className="px-4 py-3 text-slate">
                    {item.year ?? "—"} {item.hours ? `/ ${item.hours.toLocaleString("ro-RO")} ore` : ""}
                  </td>
                  <td className="px-4 py-3 text-slate">
                    {formatPrice(item.salePrice) ?? (item.rentalPriceDay ? `${formatPrice(item.rentalPriceDay)}/zi` : "—")}
                  </td>
                  <td className="px-4 py-3">
                    <StatusSelect
                      value={item.status as EquipmentStatus}
                      options={Object.entries(STATUS_LABELS).map(([value, label]) => ({
                        value: value as EquipmentStatus,
                        label,
                      }))}
                      onChange={async (status) => {
                        "use server";
                        await updateEquipmentStatusAction(item.id, status);
                      }}
                    />
                  </td>
                  <td className="px-4 py-3">
                    {item.featured && <Star size={15} className="fill-peloton-red text-peloton-red" />}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3 text-[12px]">
                      <form
                        action={async () => {
                          "use server";
                          await duplicateEquipmentAction(item.id);
                        }}
                      >
                        <button type="submit" className="text-slate hover:text-carbon-black">
                          Duplică
                        </button>
                      </form>
                      <ConfirmButton
                        confirmMessage={`Ștergi definitiv „${item.model}”?`}
                        action={async () => {
                          "use server";
                          await deleteEquipmentAction(item.id);
                        }}
                        className="text-peloton-red hover:underline"
                      >
                        Șterge
                      </ConfirmButton>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate">
                    Niciun utilaj adăugat încă.
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
