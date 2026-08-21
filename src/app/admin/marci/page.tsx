import Image from "next/image";
import { Trash2 } from "lucide-react";
import { getAllBrands } from "@/lib/queries/brands";
import { createBrandAction, updateBrandAction, deleteBrandAction } from "@/lib/actions/brands";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
  const brandsList = await getAllBrands();

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-[26px] font-medium text-carbon-black">Mărci</h1>

      <form
        action={createBrandAction}
        className="mb-8 flex flex-wrap items-center gap-3 rounded-cards border border-silver-lining bg-pure-white p-5"
      >
        <input
          name="name"
          placeholder="Nume marcă nouă (ex. Liebherr)"
          required
          className="flex-1 rounded-inputs border border-steel px-3.5 py-2.5 text-[14px] focus:border-peloton-red focus:outline-none"
        />
        <input type="file" name="logo" accept="image/*" className="text-[13px]" />
        <button
          type="submit"
          className="rounded-buttons bg-peloton-red px-5 py-2.5 text-[14px] font-medium text-pure-white hover:bg-[#c11826]"
        >
          Adaugă marcă
        </button>
      </form>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {brandsList.map((brand) => (
          <div key={brand.id} className="rounded-cards border border-silver-lining bg-pure-white p-4">
            <div className="flex items-center gap-3">
              {brand.logoUrl ? (
                <Image
                  src={brand.logoUrl}
                  alt={brand.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-tags object-contain"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-tags bg-mist-gray text-[12px] text-steel">
                  {brand.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <form
                action={updateBrandAction.bind(null, brand.id)}
                className="flex flex-1 items-center gap-2"
              >
                <input
                  name="name"
                  defaultValue={brand.name}
                  className="flex-1 rounded-inputs border border-steel px-3 py-1.5 text-[13px] focus:border-peloton-red focus:outline-none"
                />
                <label className="flex items-center gap-1 text-[12px] text-slate">
                  <input type="checkbox" name="active" defaultChecked={brand.active} className="h-3.5 w-3.5 accent-peloton-red" />
                  Activă
                </label>
                <input type="file" name="logo" accept="image/*" className="hidden" id={`logo-${brand.id}`} />
                <label
                  htmlFor={`logo-${brand.id}`}
                  className="cursor-pointer text-[12px] text-slate underline hover:text-carbon-black"
                >
                  Logo
                </label>
                <button
                  type="submit"
                  className="rounded-inputs bg-carbon-black px-3 py-1.5 text-[12px] font-medium text-pure-white hover:bg-black"
                >
                  Salvează
                </button>
              </form>
              <ConfirmButton
                confirmMessage={`Ștergi marca „${brand.name}”?`}
                action={deleteBrandAction.bind(null, brand.id)}
                className="text-slate hover:text-peloton-red"
              >
                <Trash2 size={15} />
              </ConfirmButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
