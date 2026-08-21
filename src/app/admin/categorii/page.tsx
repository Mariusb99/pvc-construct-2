import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { getAllCategories } from "@/lib/queries/categories";
import { getSpecTemplatesByCategory } from "@/lib/queries/specTemplates";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  reorderCategoryAction,
  addSpecTemplateAction,
  deleteSpecTemplateAction,
} from "@/lib/actions/categories";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categoriesList = await getAllCategories();
  const templatesByCategory = await Promise.all(
    categoriesList.map((c) => getSpecTemplatesByCategory(c.id))
  );

  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 text-[26px] font-medium text-carbon-black">Categorii</h1>

      <form
        action={async (formData) => {
          "use server";
          await createCategoryAction(formData);
        }}
        className="mb-8 flex gap-3 rounded-cards border border-silver-lining bg-pure-white p-5"
      >
        <input
          name="name"
          placeholder="Nume categorie nouă (ex. Screwere)"
          required
          className="flex-1 rounded-inputs border border-steel px-3.5 py-2.5 text-[14px] focus:border-peloton-red focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-buttons bg-peloton-red px-5 py-2.5 text-[14px] font-medium text-pure-white hover:bg-[#c11826]"
        >
          Adaugă categorie
        </button>
      </form>

      <div className="flex flex-col gap-4">
        {categoriesList.map((cat, i) => (
          <div key={cat.id} className="rounded-cards border border-silver-lining bg-pure-white p-5">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-col gap-1">
                <form
                  action={async () => {
                    "use server";
                    await reorderCategoryAction(cat.id, "up");
                  }}
                >
                  <button
                    type="submit"
                    disabled={i === 0}
                    className="flex h-6 w-6 items-center justify-center rounded text-slate hover:text-carbon-black disabled:opacity-30"
                  >
                    <ArrowUp size={14} />
                  </button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await reorderCategoryAction(cat.id, "down");
                  }}
                >
                  <button
                    type="submit"
                    disabled={i === categoriesList.length - 1}
                    className="flex h-6 w-6 items-center justify-center rounded text-slate hover:text-carbon-black disabled:opacity-30"
                  >
                    <ArrowDown size={14} />
                  </button>
                </form>
              </div>

              <form
                action={async (formData) => {
                  "use server";
                  await updateCategoryAction(cat.id, formData);
                }}
                className="flex flex-1 flex-wrap items-center gap-3"
              >
                <input
                  name="name"
                  defaultValue={cat.name}
                  className="min-w-[180px] flex-1 rounded-inputs border border-steel px-3 py-2 text-[14px] focus:border-peloton-red focus:outline-none"
                />
                <input
                  name="description"
                  defaultValue={cat.description ?? ""}
                  placeholder="Descriere scurtă (opțional)"
                  className="min-w-[220px] flex-[2] rounded-inputs border border-steel px-3 py-2 text-[14px] focus:border-peloton-red focus:outline-none"
                />
                <label className="flex items-center gap-1.5 text-[13px] text-slate">
                  <input type="checkbox" name="active" defaultChecked={cat.active} className="h-4 w-4 accent-peloton-red" />
                  Activă
                </label>
                <button
                  type="submit"
                  className="rounded-inputs bg-carbon-black px-3.5 py-2 text-[13px] font-medium text-pure-white hover:bg-black"
                >
                  Salvează
                </button>
              </form>

              <ConfirmButton
                confirmMessage={`Ștergi categoria „${cat.name}”? Utilajele din această categorie nu vor putea fi șterse automat.`}
                action={async () => {
                  "use server";
                  await deleteCategoryAction(cat.id);
                }}
                className="text-slate hover:text-peloton-red"
              >
                <Trash2 size={16} />
              </ConfirmButton>
            </div>

            <details className="mt-4">
              <summary className="cursor-pointer text-[12px] font-medium uppercase tracking-[0.3px] text-steel">
                Șablon specificații ({templatesByCategory[i].length})
              </summary>
              <div className="mt-3 flex flex-col gap-2">
                {templatesByCategory[i].map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between rounded-inputs bg-mist-gray px-3 py-2 text-[13px]"
                  >
                    <span>
                      <span className="font-medium text-carbon-black">{t.specLabel}</span>
                      <span className="mx-2 text-slate">·</span>
                      <span className="text-slate">{t.specKey}</span>
                      {t.unit && <span className="ml-1 text-slate">({t.unit})</span>}
                    </span>
                    <form
                      action={async () => {
                        "use server";
                        await deleteSpecTemplateAction(t.id);
                      }}
                    >
                      <button type="submit" className="text-slate hover:text-peloton-red">
                        <Trash2 size={13} />
                      </button>
                    </form>
                  </div>
                ))}
                <form
                  action={async (formData) => {
                    "use server";
                    await addSpecTemplateAction(cat.id, formData);
                  }}
                  className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-[1fr_1fr_100px_auto]"
                >
                  <input
                    name="specLabel"
                    placeholder="Etichetă (ex. Greutate operațională)"
                    className="rounded-inputs border border-steel px-3 py-1.5 text-[13px] focus:border-peloton-red focus:outline-none"
                  />
                  <input
                    name="specKey"
                    placeholder="Cheie (ex. greutate)"
                    className="rounded-inputs border border-steel px-3 py-1.5 text-[13px] focus:border-peloton-red focus:outline-none"
                  />
                  <input
                    name="unit"
                    placeholder="UM"
                    className="rounded-inputs border border-steel px-3 py-1.5 text-[13px] focus:border-peloton-red focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-inputs border border-carbon-black px-3 py-1.5 text-[13px] font-medium text-carbon-black hover:bg-carbon-black hover:text-pure-white"
                  >
                    Adaugă
                  </button>
                </form>
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
