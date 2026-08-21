import { cn } from "@/lib/utils";
import { dictionaries, type Locale } from "@/lib/i18n/dictionaries";
import type { equipmentStatusEnum } from "@/lib/db/schema";

export type EquipmentStatus = (typeof equipmentStatusEnum.enumValues)[number];

/** Etichete în română — folosite în admin (care rămâne exclusiv în română). */
export const STATUS_LABELS: Record<EquipmentStatus, string> = dictionaries.ro.status;

/**
 * Decizia de design #2 (confirmată): sistemul Peloton permite un singur
 * accent cromatic. În loc de culori semantice (verde/galben/roșu) pentru
 * cele 6 statusuri, folosim 3 tratamente neutre + roșul rezervat strict
 * pentru stările finale/negative (Vândut, Indisponibil).
 */
const STATUS_STYLE: Record<EquipmentStatus, string> = {
  DE_VANZARE: "bg-carbon-black text-pure-white",
  DE_INCHIRIAT: "bg-carbon-black text-pure-white",
  DE_VANZARE_SI_INCHIRIAT: "bg-carbon-black text-pure-white",
  INCHIRIAT: "bg-pure-white/90 text-carbon-black border border-carbon-black backdrop-blur-sm",
  VANDUT: "bg-peloton-red text-pure-white",
  INDISPONIBIL: "bg-peloton-red text-pure-white",
};

export function StatusBadge({
  status,
  locale = "ro",
  className,
}: {
  status: EquipmentStatus;
  locale?: Locale;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-tags px-2 py-1 text-[12px] font-semibold uppercase tracking-[0.3px]",
        STATUS_STYLE[status],
        className
      )}
    >
      {dictionaries[locale].status[status]}
    </span>
  );
}
