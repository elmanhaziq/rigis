import Link from "next/link";
import { cn } from "@/lib/utils";
import { palette } from "@/config/palette";

/** RIGIS monogram: three linked nodes inside a square, the group's network motif. */
export function LogoMark({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  const bg = inverted ? palette.white : palette.navy900;
  const fg = inverted ? palette.navy900 : palette.white;
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={cn("size-9 shrink-0", className)}>
      <rect width="40" height="40" rx="4" fill={bg} />
      <path d="M11 28 L20 12 L29 28 Z" fill="none" stroke={fg} strokeWidth="1.5" strokeOpacity="0.55" />
      <circle cx="20" cy="12" r="3.2" fill={palette.gold} />
      <circle cx="11" cy="28" r="3.2" fill={fg} />
      <circle cx="29" cy="28" r="3.2" fill={fg} />
    </svg>
  );
}

export function Logo({ inverted = false, className }: { inverted?: boolean; className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-3 rounded-sm", className)}
      aria-label="RIGIS — Research Initiative Group Intelligent System, home"
    >
      <LogoMark inverted={inverted} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading text-[1.125rem] font-extrabold tracking-[0.08em]",
            inverted ? "text-white" : "text-navy-900",
          )}
        >
          RIGIS
        </span>
        <span
          className={cn(
            "mt-1 hidden text-[0.6875rem] font-medium tracking-wide sm:block",
            inverted ? "text-white/70" : "text-muted-foreground",
          )}
        >
          Research Initiative Group Intelligent System
        </span>
      </span>
    </Link>
  );
}
