import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center border border-dashed border-input bg-card px-6 py-14 text-center",
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-purple-700">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h3 className="mt-5 font-heading text-lg font-semibold">{title}</h3>
      {description && <p className="mt-2 max-w-md text-[0.9375rem] text-muted-foreground">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", description, action }: { title?: string; description?: string; action?: React.ReactNode }) {
  return (
    <div role="alert" className="border border-destructive/30 bg-danger-bg px-6 py-8 text-center">
      <h3 className="font-heading text-lg font-semibold text-destructive">{title}</h3>
      {description && <p className="mt-2 text-[0.9375rem] text-foreground/80">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
