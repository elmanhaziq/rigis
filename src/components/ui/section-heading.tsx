import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  as?: "h1" | "h2";
  align?: "left" | "split";
  action?: React.ReactNode;
  className?: string;
  inverted?: boolean;
  id?: string;
}

/**
 * Editorial section heading: brass rule + eyebrow, large heading, optional
 * description. "split" places the description beside the heading on wide screens.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Tag = "h2",
  align = "left",
  action,
  className,
  inverted = false,
  id,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        align === "split" && "grid gap-6 lg:grid-cols-12 lg:items-end",
        className,
      )}
    >
      <div className={cn(align === "split" && "lg:col-span-7")}>
        {eyebrow && (
          <p className={cn("eyebrow flex items-center gap-3", inverted && "text-white/70")}>
            <span className="rule-brass" aria-hidden="true" />
            {eyebrow}
          </p>
        )}
        <Tag
          id={id}
          className={cn(
            "mt-4 font-heading font-bold",
            Tag === "h1"
              ? "text-[2.25rem] leading-[1.1] sm:text-5xl lg:text-[3.5rem]"
              : "text-[1.875rem] leading-[1.15] sm:text-[2.5rem]",
            inverted && "text-white",
          )}
        >
          {title}
        </Tag>
      </div>
      {(description || action) && (
        <div
          className={cn(
            align === "split" ? "lg:col-span-5 lg:pb-1" : "mt-5 max-w-2xl",
            "flex flex-col gap-5",
          )}
        >
          {description && (
            <p
              className={cn(
                "text-[1.0625rem] leading-relaxed text-muted-foreground",
                inverted && "text-white/75",
              )}
            >
              {description}
            </p>
          )}
          {action}
        </div>
      )}
    </div>
  );
}
