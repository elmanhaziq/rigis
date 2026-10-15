/* eslint-disable @next/next/no-img-element -- static export: photos are pre-compressed WebP from Supabase Storage */
import { initials } from "@/lib/data/selectors";
import { cn } from "@/lib/utils";

/** Profile photograph, or a typographic monogram when no photo is available. */
export function ProfileAvatar({
  name,
  photoUrl,
  className,
  textClassName,
}: {
  name: string;
  photoUrl: string | null;
  className?: string;
  textClassName?: string;
}) {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={`Photograph of ${name}`}
        loading="lazy"
        decoding="async"
        className={cn("aspect-[4/5] w-full object-cover", className)}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={`${name} (no photograph)`}
      className={cn(
        "relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden bg-[#e4e9ef]",
        "bg-[image:repeating-linear-gradient(135deg,transparent_0_11px,rgba(16,36,58,0.035)_11px_12px)]",
        className,
      )}
    >
      <span
        className={cn(
          "font-heading text-[clamp(1.75rem,6vw,3rem)] font-extrabold tracking-[0.04em] text-navy-800/80",
          textClassName,
        )}
        aria-hidden="true"
      >
        {initials(name)}
      </span>
      <span className="absolute bottom-0 left-0 h-[3px] w-10 bg-brass" aria-hidden="true" />
    </div>
  );
}
