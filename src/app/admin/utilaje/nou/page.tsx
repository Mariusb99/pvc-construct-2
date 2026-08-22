import { EquipmentForm } from "@/components/admin/EquipmentForm";
import { createEquipmentAction } from "@/lib/actions/equipment";
import { getAllCategories } from "@/lib/queries/categories";
import { getAllBrands } from "@/lib/queries/brands";

export const dynamic = "force-dynamic";

export default async function NewEquipmentPage() {
  const [categories, brands] = await Promise.all([getAllCategories(), getAllBrands()]);

  return (
    <div className="max-w-3xl">
      <h1 className="mb-3 text-[26px] font-medium text-carbon-black">Adaugă utilaj</h1>
      <p className="mb-6 rounded-tags border border-silver-lining bg-mist-gray px-4 py-3 text-[13px] text-slate">
        Pasul 1 din 2: completează datele de bază și apasă &bdquo;Creează utilaj&rdquo;.
        Imediat după salvare se deschide pagina utilajului, unde poți adăuga
        fotografiile și specificațiile tehnice.
      </p>
      <EquipmentForm
        action={createEquipmentAction}
        categories={categories}
        brands={brands}
        submitLabel="Creează utilaj"
      />
    </div>
  );
}
