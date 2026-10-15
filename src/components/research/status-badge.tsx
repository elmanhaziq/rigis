import { CheckCircle2, CircleDashed, Clock3, FileEdit, Archive, XCircle, PlayCircle } from "lucide-react";
import type { ApprovalStatus, ProjectStatus } from "@/types/domain";
import { cn } from "@/lib/utils";

const projectStatus: Record<ProjectStatus, { label: string; icon: typeof Clock3; className: string }> = {
  proposed: { label: "Proposed", icon: CircleDashed, className: "border-slate-brand text-muted-foreground" },
  ongoing: { label: "Ongoing", icon: PlayCircle, className: "border-purple-400 text-purple-700" },
  completed: { label: "Completed", icon: CheckCircle2, className: "border-success/40 text-success" },
};

/** Project lifecycle badge. Icon + text so status never relies on colour alone. */
export function ProjectStatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  const s = projectStatus[status];
  const Icon = s.icon;
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-sm border bg-card px-2 text-xs font-semibold",
        s.className,
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {s.label}
    </span>
  );
}

const approvalStatus: Record<ApprovalStatus, { label: string; icon: typeof Clock3; className: string }> = {
  draft: { label: "Draft", icon: FileEdit, className: "border-input text-muted-foreground bg-card" },
  pending: { label: "Pending review", icon: Clock3, className: "border-warning/40 text-warning bg-warning-bg" },
  approved: { label: "Approved", icon: CheckCircle2, className: "border-success/40 text-success bg-success-bg" },
  rejected: { label: "Changes requested", icon: XCircle, className: "border-destructive/40 text-destructive bg-danger-bg" },
  archived: { label: "Archived", icon: Archive, className: "border-input text-muted-foreground bg-muted" },
};

/** Content approval badge used throughout the portal. */
export function ApprovalStatusBadge({ status, className }: { status: ApprovalStatus; className?: string }) {
  const s = approvalStatus[status];
  const Icon = s.icon;
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-sm border px-2 text-xs font-semibold whitespace-nowrap",
        s.className,
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {s.label}
    </span>
  );
}
