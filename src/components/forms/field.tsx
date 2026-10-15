import { cn } from "@/lib/utils";

/**
 * Form field wrapper: visible label, optional hint, and an error message
 * linked to the control via aria-describedby.
 */
export function Field({
  id,
  label,
  hint,
  error,
  required,
  children,
  className,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: (props: { id: string; "aria-describedby"?: string; "aria-invalid"?: boolean }) => React.ReactNode;
  className?: string;
}) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-sm font-medium text-navy-900">
        {label}
        {required ? (
          <span className="text-destructive" aria-hidden="true"> *</span>
        ) : (
          <span className="font-normal text-muted-foreground"> (optional)</span>
        )}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="-mt-1 text-[0.8125rem] text-muted-foreground">
          {hint}
        </p>
      )}
      {children({ id, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined })}
      {error && (
        <p id={`${id}-error`} className="text-[0.8125rem] font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
