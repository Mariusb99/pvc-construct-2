import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-buttons text-[16px] font-medium px-6 py-4 transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const variants = {
  primary: "bg-peloton-red text-pure-white hover:bg-[#c11826] border border-transparent",
  "ghost-dark":
    "bg-transparent text-pure-white border-[1.5px] border-pure-white/80 hover:bg-white/10",
  "ghost-light":
    "bg-transparent text-carbon-black border-[1.5px] border-carbon-black hover:bg-black/5",
  subtle:
    "bg-transparent text-carbon-black border-[1.5px] border-silver-lining hover:border-carbon-black",
} as const;

type Variant = keyof typeof variants;

interface CommonProps {
  variant?: Variant;
  size?: "md" | "sm";
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...props
}: ButtonAsButton | ButtonAsLink) {
  const sizeClass = size === "sm" ? "px-4 py-2.5 text-[14px]" : "";
  const classes = cn(base, variants[variant], sizeClass, className);

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
