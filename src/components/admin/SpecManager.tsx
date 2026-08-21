import { Trash2 } from "lucide-react";
import { addEquipmentSpecAction, deleteEquipmentSpecAction } from "@/lib/actions/equipment";
import type { EquipmentSpecification, SpecTemplate } from "@/lib/db/types";

export function SpecManager({
  equipmentId,
  specifications,
  suggestions,
}: {
  equipmentId: string;
  specifications: EquipmentSpecification[];
  suggestions: SpecTemplate[];
}) {
  return (
    <div className="rounded-cards border border-silver-lining p-5">
      <h3 className="mb-4 text-[14px] font-semibold text-carbon-black">Specificații tehnice</h3>

      {specifications.length > 0 && (
        <div className="mb-4 flex flex-col gap-2">
          {specifications.map((spec) => (
            <div
              key={spec.id}
              className="flex items-center justify-between rounded-inputs bg-mist-gray px-3.5 py-2.5 text-[13px]"
            >
              <div>
                <span className="font-medium text-carbon-black">{spec.specKey}</span>
                <span className="mx-2 text-slate">—</span>
                <span className="text-slate">{spec.specValue}</span>
                {spec.specGroup && (
                  <span className="ml-2 text-[11px] uppercase text-steel">({spec.specGroup})</span>
                )}
              </div>
              <form
                action={async () => {
                  "use server";
                  await deleteEquipmentSpecAction(spec.id, equipmentId);
                }}
              >
                <button type="submit" aria-label="Șterge" className="text-slate hover:text-peloton-red">
                  <Trash2 size={14} />
                </button>
              </form>
            </div>
          ))}
        </div>
      )}

      <form
        action={async (formData) => {
          "use server";
          await addEquipmentSpecAction(equipmentId, formData);
        }}
        className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]"
      >
        <input
          name="specKey"
          list="spec-suggestions"
          placeholder="Denumire (ex. Greutate)"
          className="rounded-inputs border border-steel px-3 py-2 text-[13px] focus:border-peloton-red focus:outline-none"
        />
        <input
          name="specValue"
          placeholder="Valoare (ex. 20.500 kg)"
          className="rounded-inputs border border-steel px-3 py-2 text-[13px] focus:border-peloton-red focus:outline-none"
        />
        <input
          name="specGroup"
          placeholder="Grup (opțional, ex. Motor)"
          className="rounded-inputs border border-steel px-3 py-2 text-[13px] focus:border-peloton-red focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-inputs bg-carbon-black px-4 py-2 text-[13px] font-medium text-pure-white hover:bg-black"
        >
          Adaugă
        </button>
      </form>
      <datalist id="spec-suggestions">
        {suggestions.map((s) => (
          <option key={s.id} value={s.specLabel} />
        ))}
      </datalist>
    </div>
  );
}
