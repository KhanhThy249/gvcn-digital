import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  hint?: string;
  trend?: "up" | "down" | "flat";
  tone?: "primary" | "success" | "warning" | "danger" | "info";
}

const toneClasses = {
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
};

const trendIcons = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: Minus,
};

export function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  hint,
  trend,
  tone = "primary",
}: StatCardProps) {
  const TrendIcon = trend ? trendIcons[trend] : null;
  const trendColor =
    trend === "up" ? "text-success" : trend === "down" ? "text-danger" : "text-muted-foreground";

  return (
    <Card className="h-full">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0 space-y-1">
          <p className="text-sm leading-relaxed text-muted-foreground">{label}</p>
          <p className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </p>
          {hint && (
            <p className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
              {TrendIcon && <TrendIcon className="size-3.5" aria-hidden />}
              {hint}
            </p>
          )}
        </div>
        <span className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${toneClasses[tone]}`}>
          <Icon className="size-5" aria-hidden />
        </span>
      </CardContent>
    </Card>
  );
}