"use client";

import { useTransition } from "react";
import { usePathname } from "next/navigation";
import { setLocaleAction } from "@/lib/i18n/actions";
import type { Locale } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

export function LanguageToggle({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale) return;
    startTransition(() => {
      setLocaleAction(next, pathname);
    });
  }

  return (
    <div className="flex items-center overflow-hidden rounded-tags border border-white/25 text-[12px] font-medium">
      {(["ro", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          disabled={isPending}
          onClick={() => switchTo(l)}
          className={cn(
            "px-2 py-1 uppercase transition-colors",
            l === locale ? "bg-pure-white text-carbon-black" : "text-pure-white/70 hover:text-pure-white"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
