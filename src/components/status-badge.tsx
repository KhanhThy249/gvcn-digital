import { Check, CircleDashed, CircleX, Clock, Eye, HelpCircle } from "lucide-react";

import type { StatusTone } from "@/lib/types";

const toneClasses: Record<StatusTone, string> = {
  success: "bg-success-soft text-success border-success/25",
  warning: "bg-warning-soft text-warning border-warning/30",
  danger: "bg-danger-soft text-danger border-danger/25",
  info: "bg-info-soft text-info border-info/25",
  primary: "bg-primary-soft text-primary border-primary/25",
  neutral: "bg-muted text-muted-foreground border-border",
};

export interface StatusBadgeProps {
  tone: StatusTone;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function StatusBadge({
  tone,
  children,
  icon,
  className = "",
}: StatusBadgeProps) {
  return (
    <span className={`status-pill border ${toneClasses[tone]} ${className}`}>
      {icon}
      {children}
    </span>
  );
}

const seenIcon = <Eye className="size-3.5 shrink-0" aria-hidden />;
const doneIcon = <Check className="size-3.5 shrink-0" aria-hidden />;
const doingIcon = <CircleDashed className="size-3.5 shrink-0" aria-hidden />;
const pendingIcon = <Clock className="size-3.5 shrink-0" aria-hidden />;
const lateIcon = <CircleX className="size-3.5 shrink-0" aria-hidden />;
const draftIcon = <HelpCircle className="size-3.5 shrink-0" aria-hidden />;

export function SeenBadge({ children }: { children: React.ReactNode }) {
  return (
    <StatusBadge tone="success" icon={seenIcon}>
      {children}
    </StatusBadge>
  );
}

export function ConfirmedBadge({ children }: { children: React.ReactNode }) {
  return (
    <StatusBadge tone="primary" icon={doneIcon}>
      {children}
    </StatusBadge>
  );
}

export function TaskStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "done":
      return (
        <StatusBadge tone="success" icon={doneIcon}>
          Đã hoàn thành
        </StatusBadge>
      );
    case "doing":
      return (
        <StatusBadge tone="info" icon={doingIcon}>
          Đang thực hiện
        </StatusBadge>
      );
    case "overdue":
      return (
        <StatusBadge tone="danger" icon={lateIcon}>
          Quá hạn
        </StatusBadge>
      );
    case "closed":
      return (
        <StatusBadge tone="neutral" icon={pendingIcon}>
          Đã đóng
        </StatusBadge>
      );
    case "draft":
      return (
        <StatusBadge tone="neutral" icon={draftIcon}>
          Bản nháp
        </StatusBadge>
      );
    case "open":
      return (
        <StatusBadge tone="success" icon={doneIcon}>
          Đang mở
        </StatusBadge>
      );
    default:
      return (
        <StatusBadge tone="warning" icon={pendingIcon}>
          Chưa làm
        </StatusBadge>
      );
  }
}