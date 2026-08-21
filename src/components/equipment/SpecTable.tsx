import type { EquipmentSpecification } from "@/lib/db/types";

export function SpecTable({ specifications }: { specifications: EquipmentSpecification[] }) {
  if (specifications.length === 0) return null;

  const groups = new Map<string, EquipmentSpecification[]>();
  for (const spec of specifications) {
    const key = spec.specGroup || "Specificații generale";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(spec);
  }

  return (
    <div className="flex flex-col gap-6">
      {Array.from(groups.entries()).map(([group, specs]) => (
        <div key={group}>
          <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.3px] text-slate">
            {group}
          </h3>
          <div className="overflow-hidden rounded-cards border border-silver-lining">
            {specs.map((spec, i) => (
              <div
                key={spec.id}
                className={`flex items-center justify-between px-5 py-3 text-[14px] ${
                  i % 2 === 0 ? "bg-pure-white" : "bg-mist-gray"
                }`}
              >
                <span className="text-slate">{spec.specKey}</span>
                <span className="font-medium text-carbon-black">{spec.specValue}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
