import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { EquipmentForm } from "@/components/admin/EquipmentForm";
import { ImageManager } from "@/components/admin/ImageManager";
import { SpecManager } from "@/components/admin/SpecManager";
import { updateEquipmentAction } from "@/lib/actions/equipment";
import { getEquipmentById } from "@/lib/queries/equipment";
import { getAllCategories } from "@/lib/queries/categories";
import { getAllBrands } from "@/lib/queries/brands";
import { getSpecTemplatesByCategory } from "@/lib/queries/specTemplates";

export const dynamic = "force-dynamic";

export default async function EditEquipmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getEquipmentById(id);
  if (!item) notFound();

  const [categories, brands, suggestions] = await Promise.all([
    getAllCategories(),
    getAllBrands(),
    getSpecTemplatesByCategory(item.categoryId),
  ]);

  const category = categories.find((c) => c.id === item.categoryId);

  const boundUpdate = updateEquipmentAction.bind(null, id);

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-[26px] font-medium text-carbon-black">{item.model}</h1>
        {category && (
          <Link
            href={`/utilaje/${category.slug}/${item.slug}`}
            target="_blank"
            className="flex items-center gap-1.5 text-[13px] text-slate hover:text-carbon-black"
          >
            Vezi pe site <ExternalLink size={13} />
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <ImageManager equipmentId={id} images={item.images} />
        <SpecManager equipmentId={id} specifications={item.specifications} suggestions={suggestions} />

        <div className="rounded-cards border border-silver-lining bg-pure-white p-5">
          <EquipmentForm
            action={boundUpdate}
            categories={categories}
            brands={brands}
            defaultValues={item}
            submitLabel="Salvează modificările"
          />
        </div>
      </div>
    </div>
  );
}
