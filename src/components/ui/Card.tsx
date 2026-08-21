import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-cards border border-silver-lining bg-pure-white",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-2",
        align === "center" && "items-center text-center"
      )}
    >
      {eyebrow && (
        <span className="text-[12px] font-semibold uppercase tracking-[0.3px] text-slate">
          {eyebrow}
        </span>
      )}
      <h2 className="text-[26px] font-medium tracking-[-0.104px] text-carbon-black">
        {title}
      </h2>
      {description && (
        <p className="max-w-[560px] text-[14px] text-slate">{description}</p>
      )}
    </div>
  );
}
