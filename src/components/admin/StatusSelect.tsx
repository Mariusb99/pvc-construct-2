"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function StatusSelect<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <select
      defaultValue={value}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value as T;
        startTransition(async () => {
          await onChange(next);
          router.refresh();
        });
      }}
      className="rounded-inputs border border-steel bg-pure-white px-2.5 py-1.5 text-[13px] text-carbon-black focus:border-peloton-red focus:outline-none disabled:opacity-50"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
