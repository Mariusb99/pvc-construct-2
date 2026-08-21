"use client";

import { Upload } from "lucide-react";

export function AutoSubmitFileInput({ name, label }: { name: string; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-inputs border border-dashed border-steel px-4 py-2.5 text-[13px] text-slate hover:border-carbon-black hover:text-carbon-black">
      <Upload size={15} />
      {label}
      <input
        type="file"
        name={name}
        accept="image/png,image/jpeg,image/webp,image/avif"
        className="hidden"
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
      />
    </label>
  );
}
