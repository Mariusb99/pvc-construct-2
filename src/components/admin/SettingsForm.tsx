"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { Input, Textarea, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { updateSettingsAction, type SettingsFormState } from "@/lib/actions/settings";
import type { Settings } from "@/lib/db/types";

const initialState: SettingsFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" disabled={pending}>
      {pending ? "Se salvează..." : "Salvează setările"}
    </Button>
  );
}

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, formAction] = useActionState(updateSettingsAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-8">
      {state.status !== "idle" && (
        <div
          className={
            state.status === "success"
              ? "rounded-tags border border-carbon-black/10 bg-carbon-black px-4 py-3 text-[13px] text-pure-white"
              : "rounded-tags border border-peloton-red/30 bg-peloton-red/5 px-4 py-3 text-[13px] text-peloton-red"
          }
        >
          {state.message}
        </div>
      )}

      <section>
        <h2 className="mb-4 text-[15px] font-medium text-carbon-black">Date firmă</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="companyName">Denumire</Label>
            <Input id="companyName" name="companyName" defaultValue={settings.companyName ?? ""} required />
          </div>
          <div>
            <Label htmlFor="cui">CUI</Label>
            <Input id="cui" name="cui" defaultValue={settings.cui ?? ""} />
          </div>
          <div>
            <Label htmlFor="regCom">Nr. Reg. Com.</Label>
            <Input id="regCom" name="regCom" defaultValue={settings.regCom ?? ""} />
          </div>
          <div>
            <Label htmlFor="euid">EUID</Label>
            <Input id="euid" name="euid" defaultValue={settings.euid ?? ""} />
          </div>
          <div>
            <Label htmlFor="foundedAt">Data înființării</Label>
            <Input id="foundedAt" name="foundedAt" type="date" defaultValue={settings.foundedAt ?? ""} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-[15px] font-medium text-carbon-black">Adresă și contact</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="county">Județ</Label>
            <Input id="county" name="county" defaultValue={settings.county ?? ""} />
          </div>
          <div>
            <Label htmlFor="city">Localitate</Label>
            <Input id="city" name="city" defaultValue={settings.city ?? ""} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="address">Adresă</Label>
            <Input id="address" name="address" defaultValue={settings.address ?? ""} />
          </div>
          <div>
            <Label htmlFor="postalCode">Cod poștal</Label>
            <Input id="postalCode" name="postalCode" defaultValue={settings.postalCode ?? ""} />
          </div>
          <div>
            <Label htmlFor="phone">Telefon</Label>
            <Input id="phone" name="phone" type="tel" defaultValue={settings.phone ?? ""} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={settings.email ?? ""} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-[15px] font-medium text-carbon-black">Homepage</h2>
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="heroHeadline">Titlu principal (hero)</Label>
            <Input id="heroHeadline" name="heroHeadline" defaultValue={settings.heroHeadline ?? ""} />
          </div>
          <div>
            <Label htmlFor="heroSubheadline">Subtitlu hero</Label>
            <Textarea id="heroSubheadline" name="heroSubheadline" defaultValue={settings.heroSubheadline ?? ""} />
          </div>
          <div>
            <Label htmlFor="heroImage">Imagine hero</Label>
            {settings.heroImageUrl && (
              <div className="mb-2 h-32 w-full max-w-sm overflow-hidden rounded-images">
                <Image
                  src={settings.heroImageUrl}
                  alt="Imagine hero curentă"
                  width={400}
                  height={128}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <input
              id="heroImage"
              name="heroImage"
              type="file"
              accept="image/*"
              className="block w-full min-w-0 max-w-full text-[13px] text-slate"
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-[15px] font-medium text-carbon-black">Logo</h2>
        <div className="flex min-w-0 flex-wrap items-center gap-4">
          {settings.logoUrl ? (
            <Image
              src={settings.logoUrl}
              alt="Logo curent"
              width={56}
              height={56}
              className="h-14 w-14 rounded-tags border border-silver-lining object-contain p-1"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-tags border border-dashed border-silver-lining text-[11px] text-fog">
              Fără logo
            </div>
          )}
          <input id="logo" name="logo" type="file" accept="image/*" className="w-full min-w-0 max-w-full text-[13px] text-slate" />
        </div>
      </section>

      <div>
        <SubmitButton />
      </div>
    </form>
  );
}
