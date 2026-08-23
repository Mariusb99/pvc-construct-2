import Link from "next/link";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  buildHref,
  prevLabel = "← Anterior",
  nextLabel = "Următor →",
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
  prevLabel?: string;
  nextLabel?: string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Paginare">
      <Link
        href={buildHref(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={cn(
          "flex h-11 items-center rounded-inputs border border-silver-lining px-4 text-[13px] text-carbon-black hover:border-carbon-black sm:h-9 sm:px-3",
          page === 1 && "pointer-events-none opacity-40"
        )}
      >
        {prevLabel}
      </Link>

      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-2">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-slate">…</span>}
          <Link
            href={buildHref(p)}
            className={cn(
              "flex h-11 min-w-11 items-center justify-center rounded-inputs px-3 text-[13px] sm:h-9 sm:min-w-9",
              p === page
                ? "bg-carbon-black text-pure-white"
                : "border border-silver-lining text-carbon-black hover:border-carbon-black"
            )}
          >
            {p}
          </Link>
        </span>
      ))}

      <Link
        href={buildHref(Math.min(totalPages, page + 1))}
        aria-disabled={page === totalPages}
        className={cn(
          "flex h-11 items-center rounded-inputs border border-silver-lining px-4 text-[13px] text-carbon-black hover:border-carbon-black sm:h-9 sm:px-3",
          page === totalPages && "pointer-events-none opacity-40"
        )}
      >
        {nextLabel}
      </Link>
    </nav>
  );
}
