import Image from "next/image";
import { Trash2 } from "lucide-react";
import { addEquipmentImageAction, deleteEquipmentImageAction } from "@/lib/actions/equipment";
import { AutoSubmitFileInput } from "@/components/admin/AutoSubmitFileInput";
import type { EquipmentImage } from "@/lib/db/types";

export function ImageManager({
  equipmentId,
  images,
}: {
  equipmentId: string;
  images: EquipmentImage[];
}) {
  return (
    <div className="rounded-cards border border-silver-lining p-5">
      <h3 className="mb-4 text-[14px] font-semibold text-carbon-black">Fotografii</h3>

      {images.length > 0 && (
        <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-square overflow-hidden rounded-images bg-mist-gray">
              <Image src={img.imageUrl} alt={img.altText ?? ""} fill sizes="150px" className="object-cover" />
              <form
                action={async () => {
                  "use server";
                  await deleteEquipmentImageAction(img.id, equipmentId);
                }}
                className="absolute right-1.5 top-1.5"
              >
                <button
                  type="submit"
                  aria-label="Șterge imaginea"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-carbon-black/70 text-pure-white opacity-0 transition-opacity group-hover:opacity-100"
                >
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
          await addEquipmentImageAction(equipmentId, formData);
        }}
        className="flex items-center gap-3"
      >
        <AutoSubmitFileInput name="file" label="Adaugă fotografie" />
      </form>
      <p className="mt-2 text-[12px] text-slate">JPG, PNG, WEBP sau AVIF — max. 8MB.</p>
    </div>
  );
}
