"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Input, Textarea, Select, Label, FieldError } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { STATUS_LABELS } from "@/components/ui/StatusBadge";
import type { FormActionState } from "@/lib/actions/equipment";
import type { Category, Brand, Equipment } from "@/lib/db/types";

const initialState: FormActionState = { status: "idle" };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" disabled={pending}>
      {pending ? "Se salvează..." : label}
    </Button>
  );
}

export function EquipmentForm({
  action,
  categories,
  brands,
  defaultValues,
  submitLabel = "Salvează",
}: {
  action: (state: FormActionState, formData: FormData) => Promise<FormActionState>;
  categories: Category[];
  brands: Brand[];
  defaultValues?: Partial<Equipment>;
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="model">Model</Label>
          <Input id="model" name="model" defaultValue={defaultValues?.model} required />
          <FieldError>{state.fieldErrors?.model}</FieldError>
        </div>
        <div>
          <Label htmlFor="slug">Slug URL</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={defaultValues?.slug}
            placeholder="ex. caterpillar-320"
            required
          />
          <FieldError>{state.fieldErrors?.slug}</FieldError>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="categoryId">Categorie</Label>
          <Select id="categoryId" name="categoryId" defaultValue={defaultValues?.categoryId ?? ""} required>
            <option value="" disabled>
              Alege o categorie
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          <FieldError>{state.fieldErrors?.categoryId}</FieldError>
        </div>
        <div>
          <Label htmlFor="brandId">Marcă</Label>
          <Select id="brandId" name="brandId" defaultValue={defaultValues?.brandId ?? ""}>
            <option value="">Fără marcă</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="year">An fabricație</Label>
          <Input id="year" name="year" type="number" defaultValue={defaultValues?.year ?? ""} />
          <FieldError>{state.fieldErrors?.year}</FieldError>
        </div>
        <div>
          <Label htmlFor="hours">Ore funcționare</Label>
          <Input id="hours" name="hours" type="number" defaultValue={defaultValues?.hours ?? ""} />
        </div>
        <div>
          <Label htmlFor="location">Locație</Label>
          <Input id="location" name="location" defaultValue={defaultValues?.location ?? ""} />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descriere</Label>
        <Textarea id="description" name="description" defaultValue={defaultValues?.description ?? ""} />
      </div>

      <div className="rounded-cards border border-silver-lining p-5">
        <h3 className="mb-4 text-[14px] font-semibold text-carbon-black">Preț & disponibilitate</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select id="status" name="status" defaultValue={defaultValues?.status ?? "DE_VANZARE"}>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              defaultChecked={defaultValues?.featured}
              className="h-4 w-4 accent-peloton-red"
            />
            <Label htmlFor="featured" className="mb-0">
              Utilaj recomandat (apare pe homepage)
            </Label>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <Label htmlFor="salePrice">Preț vânzare (€)</Label>
            <Input id="salePrice" name="salePrice" defaultValue={defaultValues?.salePrice ?? ""} />
          </div>
          <div>
            <Label htmlFor="rentalPriceDay">Preț / zi (€)</Label>
            <Input id="rentalPriceDay" name="rentalPriceDay" defaultValue={defaultValues?.rentalPriceDay ?? ""} />
          </div>
          <div>
            <Label htmlFor="rentalPriceWeek">Preț / săpt. (€)</Label>
            <Input id="rentalPriceWeek" name="rentalPriceWeek" defaultValue={defaultValues?.rentalPriceWeek ?? ""} />
          </div>
          <div>
            <Label htmlFor="rentalPriceMonth">Preț / lună (€)</Label>
            <Input id="rentalPriceMonth" name="rentalPriceMonth" defaultValue={defaultValues?.rentalPriceMonth ?? ""} />
          </div>
        </div>
      </div>

      <div className="rounded-cards border border-silver-lining p-5">
        <h3 className="mb-4 text-[14px] font-semibold text-carbon-black">SEO</h3>
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="metaTitle">Titlu (meta title)</Label>
            <Input id="metaTitle" name="metaTitle" defaultValue={defaultValues?.metaTitle ?? ""} />
          </div>
          <div>
            <Label htmlFor="metaDescription">Descriere (meta description)</Label>
            <Textarea id="metaDescription" name="metaDescription" defaultValue={defaultValues?.metaDescription ?? ""} />
          </div>
        </div>
      </div>

      {state.status === "error" && state.message && (
        <p className="text-[13px] text-peloton-red">{state.message}</p>
      )}

      <div>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
