import Image from "next/image";

import { CalendarClock, Download, Images, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import type { Evidence } from "@/lib/types";

const categoryTone: Record<Evidence["category"], "primary" | "info" | "success" | "warning" | "neutral"> = {
  "Thông báo": "primary",
  "Khảo sát": "info",
  "Nhiệm vụ": "success",
  "Họp": "warning",
  "Sinh hoạt": "neutral",
  "Hồ sơ học sinh": "neutral",
};

export interface EvidenceCardProps {
  evidence: Evidence;
  onOpen?: (evidence: Evidence) => void;
  compact?: boolean;
}

export function EvidenceCard({ evidence, onOpen, compact = false }: EvidenceCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden border-border transition-shadow duration-200 hover:shadow-md">
      {evidence.images.length > 0 && (
        <div className="relative h-40 w-full overflow-hidden bg-muted">
          <Image
            src={evidence.images[0]}
            alt={`Minh chứng hình ảnh: ${evidence.title}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
          {evidence.images.length > 1 && (
            <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-white">
              <Images className="size-3.5" aria-hidden />
              +{evidence.images.length - 1}
            </span>
          )}
        </div>
      )}

      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone={categoryTone[evidence.category]}>{evidence.category}</StatusBadge>
          <span className="font-mono text-xs font-semibold text-muted-foreground">
            {evidence.evidenceCode}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-base leading-snug font-semibold text-foreground">
            {evidence.title}
          </h3>
          {!compact && (
            <p className="text-sm leading-relaxed text-muted-foreground">{evidence.result}</p>
          )}
        </div>

        <dl className="grid gap-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarClock className="size-4 shrink-0" aria-hidden />
            <dt className="sr-only">Thời gian</dt>
            <dd>{evidence.date}</dd>
          </div>
          <div className="flex items-center gap-2">
            <Users className="size-4 shrink-0" aria-hidden />
            <dt className="sr-only">Số người tham gia</dt>
            <dd>
              {evidence.participants} người · {evidence.audience}
            </dd>
          </div>
        </dl>

        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onOpen?.(evidence)}
            aria-label={`Xem chi tiết minh chứng ${evidence.title}`}
          >
            Xem chi tiết
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            aria-label={`Tải minh chứng ${evidence.title} dạng PDF`}
          >
            <Download className="size-4" aria-hidden />
            Xuất PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}