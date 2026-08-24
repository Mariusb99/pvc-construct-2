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
    <div className="flex items-center overflow-hidden rounded-tags border border-white/25 font-medium">
      {(["ro", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          disabled={isPending}
          onClick={() => switchTo(l)}
          className={cn(
            // Pe telefon: buton generos, ușor de apăsat cu degetul; pe
            // desktop rămâne compact, potrivit cu bara de navigare.
            "flex h-11 min-w-[52px] items-center justify-center px-3 text-[14px] uppercase tracking-[0.3px] transition-colors lg:h-8 lg:min-w-10 lg:px-2.5 lg:text-[12px]",
            l === locale ? "bg-pure-white text-carbon-black" : "text-pure-white/70 hover:text-pure-white"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
