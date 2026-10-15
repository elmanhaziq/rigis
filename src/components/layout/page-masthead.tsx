import { cn } from "@/lib/utils";

export interface MastheadFact {
  value: string | number;
  label: string;
}

/**
 * Editorial page masthead: section name, serif headline, standfirst and an
 * optional row of facts computed from published records (never invented).
 * One composition for every inner page so pages differ by content, not by
 * decoration.
 */
export function PageMasthead({
  section,
  title,
  dek,
  facts,
  children,
  tone = "light",
  className,
}: {
  section: string;
  title: React.ReactNode;
  dek?: React.ReactNode;
  facts?: MastheadFact[];
  children?: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <header className={cn(dark ? "bg-navy-900 text-white" : "border-b border-border", className)}>
      <div className="container-page pt-14 pb-12 sm:pt-20 sm:pb-16 lg:pt-24">
        <p className={cn("eyebrow", dark && "text-purple-200")}>{section}</p>
        <h1
          className={cn(
            "mt-5 max-w-[18ch] font-heading text-[2.625rem] leading-[1.02] font-normal sm:text-[3.75rem] lg:text-[4.5rem]",
            dark && "text-white",
          )}
        >
          {title}
        </h1>
        {dek && <p className={cn("dek mt-6 max-w-[44ch]", dark && "text-white/80")}>{dek}</p>}
        {facts && facts.length > 0 && (
          <dl
            className={cn(
              "mt-10 grid max-w-3xl grid-cols-2 gap-y-6 border-t pt-6 sm:flex sm:gap-x-12",
              dark ? "border-white/15" : "border-border",
            )}
          >
            {facts.map((f) => (
              <div key={f.label} className="flex flex-col-reverse">
                <dt className={cn("mt-1 text-[0.8125rem]", dark ? "text-white/65" : "text-muted-foreground")}>{f.label}</dt>
                <dd className={cn("font-heading text-[2rem] leading-none tabular-nums", dark ? "text-white" : "text-navy-900")}>
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
        {children}
      </div>
    </header>
  );
}
