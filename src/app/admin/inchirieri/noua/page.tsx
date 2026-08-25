import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getLeadById } from "@/lib/queries/leads";
import { getEquipmentList, getEquipmentById } from "@/lib/queries/equipment";
import { createRentalFromLeadAction } from "@/lib/actions/rentals";
import { Input, Textarea, Select, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function NewRentalPage({
  searchParams,
}: {
  searchParams: Promise<{ leadId?: string; equipmentId?: string }>;
}) {
  const { leadId, equipmentId } = await searchParams;

  const [lead, preselectedEquipment, { items: equipmentOptions }] = await Promise.all([
    leadId ? getLeadById(leadId) : Promise.resolve(null),
    equipmentId ? getEquipmentById(equipmentId) : Promise.resolve(null),
    getEquipmentList({ perPage: 200, sort: "recent" }),
  ]);

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/inchirieri"
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-slate hover:text-carbon-black"
      >
        <ArrowLeft size={14} /> Înapoi la închirieri
      </Link>

      <h1 className="mb-6 text-[26px] font-medium text-carbon-black">Închiriere nouă</h1>

      {lead && (
        <div className="mb-6 rounded-cards border border-silver-lining bg-mist-gray p-5">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.3px] text-steel">
            Cerere client
          </p>
          <p className="text-[15px] font-medium text-carbon-black">
            {lead.customerName}
            {lead.company && <span className="font-normal text-slate"> · {lead.company}</span>}
          </p>
          <p className="text-[13px] text-slate">
            {lead.phone} · {lead.email}
          </p>
          {lead.projectLocation && (
            <p className="mt-1 text-[13px] text-slate">Locație: {lead.projectLocation}</p>
          )}
          {lead.message && <p className="mt-2 text-[13px] text-slate">„{lead.message}”</p>}
        </div>
      )}

      <form action={createRentalFromLeadAction} className="flex flex-col gap-5">
        <input type="hidden" name="leadId" value={leadId ?? ""} />

        {!lead && (
          <div className="flex flex-col gap-4 rounded-cards border border-silver-lining bg-mist-gray p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.3px] text-steel">
              Date client
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="customerName">Nume</Label>
                <Input id="customerName" name="customerName" required placeholder="Nume și prenume" />
              </div>
              <div>
                <Label htmlFor="company">Companie</Label>
                <Input id="company" name="company" placeholder="Firma (opțional)" />
              </div>
              <div>
                <Label htmlFor="customerPhone">Telefon</Label>
                <Input id="customerPhone" name="customerPhone" type="tel" required placeholder="07xx xxx xxx" />
              </div>
              <div>
                <Label htmlFor="customerEmail">Email</Label>
                <Input id="customerEmail" name="customerEmail" type="email" placeholder="(opțional)" />
              </div>
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="equipmentId">Utilaj</Label>
          {preselectedEquipment ? (
            <>
              <input type="hidden" name="equipmentId" value={preselectedEquipment.id} />
              <div className="rounded-inputs border border-steel bg-mist-gray px-4 py-3 text-[15px] text-carbon-black">
                {preselectedEquipment.model}
              </div>
            </>
          ) : (
            <Select id="equipmentId" name="equipmentId" required defaultValue="">
              <option value="" disabled>
                Alege utilajul
              </option>
              {equipmentOptions.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.model} {eq.brandName ? `— ${eq.brandName}` : ""}
                </option>
              ))}
            </Select>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="startDate">Data început</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              defaultValue={lead?.startDate ?? ""}
              required
            />
          </div>
          <div>
            <Label htmlFor="endDate">Data sfârșit</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              defaultValue={lead?.endDate ?? ""}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="estimatedPrice">Valoare estimată (EUR)</Label>
          <Input
            id="estimatedPrice"
            name="estimatedPrice"
            type="number"
            step="0.01"
            min="0"
            placeholder={
              preselectedEquipment?.rentalPriceDay
                ? `ex. preț/zi: ${formatPrice(preselectedEquipment.rentalPriceDay)}`
                : "ex. 1200"
            }
          />
        </div>

        <div>
          <Label htmlFor="notes">Note interne</Label>
          <Textarea id="notes" name="notes" placeholder="Detalii logistice, condiții, observații..." />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" variant="primary">
            Creează închiriere
          </Button>
          <Link
            href="/admin/inchirieri"
            className="text-[13px] text-slate hover:text-carbon-black"
          >
            Renunță
          </Link>
        </div>
      </form>
    </div>
  );
}
