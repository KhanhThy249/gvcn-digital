"use client";

import { useState } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import {
  CalendarClock,
  Download,
  FolderArchive,
  Images,
  Paperclip,
  Printer,
  QrCode,
  Users,
} from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EvidenceCard } from "@/components/evidence-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { evidences } from "@/lib/data";
import type { Evidence } from "@/lib/types";

export function EvidenceScreen() {
  const [selected, setSelected] = useState<Evidence | null>(null);
  const [query, setQuery] = useState("");

  const filtered = evidences.filter((e) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      e.title.toLowerCase().includes(q) ||
      e.evidenceCode.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q)
    );
  });

  if (selected) {
    return <EvidenceDetail evidence={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
            Minh chứng công tác
          </h1>
          <p className="text-sm text-muted-foreground">
            Mỗi hoạt động đã được lưu tự động thành hồ sơ: nội dung, thời gian, đối tượng, số người
            tham gia, kết quả, hình ảnh và dữ liệu khảo sát.
          </p>
        </div>
        <div className="w-full lg:w-80">
          <label htmlFor="ev-search" className="mb-1 block text-sm font-medium text-foreground">
            Tìm minh chứng
          </label>
          <input
            id="ev-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nhập tên hoặc mã minh chứng..."
            className="min-h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground"
          />
        </div>
      </header>

      <Card className="border-primary/30 bg-primary-soft">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <FolderArchive className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
            <div>
              <p className="font-semibold text-foreground">
                {evidences.length} hồ sơ minh chứng trong tháng 10/2026
              </p>
              <p className="text-sm text-foreground/70">
                Mỗi hồ sơ có mã riêng và mã QR để tra cứu nhanh khi nhà trường yêu cầu.
              </p>
            </div>
          </div>
          <Button className="w-full shrink-0 sm:w-auto">
            <Download className="size-4" aria-hidden />
            Xuất tất cả thành PDF
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="all">
        <TabsList className="flex-wrap">
          <TabsTrigger value="all" className="min-h-11">
            Tất cả ({evidences.length})
          </TabsTrigger>
          <TabsTrigger value="thong-bao" className="min-h-11">
            Thông báo
          </TabsTrigger>
          <TabsTrigger value="khao-sat" className="min-h-11">
            Khảo sát
          </TabsTrigger>
          <TabsTrigger value="nhiem-vu" className="min-h-11">
            Nhiệm vụ
          </TabsTrigger>
          <TabsTrigger value="sinh-hoat" className="min-h-11">
            Sinh hoạt
          </TabsTrigger>
        </TabsList>

        {[
          { v: "all", label: "all" },
          { v: "thong-bao", label: "Thông báo" },
          { v: "khao-sat", label: "Khảo sát" },
          { v: "nhiem-vu", label: "Nhiệm vụ" },
          { v: "sinh-hoat", label: "Sinh hoạt" },
        ].map(({ v, label }) => {
          const list = filtered.filter((e) =>
            v === "all" ? true : e.category.toLowerCase() === label.toLowerCase(),
          );
          return (
            <TabsContent key={v} value={v} className="mt-5">
              {list.length === 0 ? (
                <EmptyState
                  icon={FolderArchive}
                  title="Chưa có minh chứng nào"
                  description="Khi bạn gửi thông báo, tạo khảo sát hoặc giao nhiệm vụ, hệ thống tự động tạo minh chứng ở đây."
                />
              ) : (
                <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {list.map((e) => (
                    <li key={e.id}>
                      <EvidenceCard evidence={e} onOpen={setSelected} />
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

function EvidenceDetail({ evidence, onBack }: { evidence: Evidence; onBack: () => void }) {
  return (
    <div className="space-y-5">
      <Button variant="outline" onClick={onBack}>
        ← Quay lại danh sách
      </Button>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="primary">{evidence.category}</StatusBadge>
            <span className="font-mono text-sm font-semibold text-muted-foreground">
              {evidence.evidenceCode}
            </span>
          </div>
          <CardTitle className="mt-2 text-2xl">{evidence.title}</CardTitle>
          <CardDescription>
            Lớp {evidence.className} · Người tạo: {evidence.createdBy}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <dl className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border p-4">
              <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <CalendarClock className="size-4" aria-hidden />
                Thời gian
              </dt>
              <dd className="mt-1.5 text-base font-semibold text-foreground">{evidence.date}</dd>
            </div>
            <div className="rounded-lg border border-border p-4">
              <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Users className="size-4" aria-hidden />
                Đối tượng
              </dt>
              <dd className="mt-1.5 text-base font-semibold text-foreground">
                {evidence.audience}
              </dd>
            </div>
            <div className="rounded-lg border border-border p-4">
              <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Users className="size-4" aria-hidden />
                Số người tham gia
              </dt>
              <dd className="mt-1.5 text-base font-semibold text-foreground">
                {evidence.participants} người
              </dd>
            </div>
          </dl>

          <div>
            <h3 className="text-base font-semibold text-foreground">Kết quả</h3>
            <p className="mt-1.5 text-base leading-relaxed text-muted-foreground">
              {evidence.result}
            </p>
          </div>

          {evidence.images.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Images className="size-4" aria-hidden />
                Hình ảnh minh chứng ({evidence.images.length})
              </h3>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {evidence.images.map((img) => (
                  <li key={img} className="overflow-hidden rounded-lg border border-border">
                    <div className="relative aspect-video w-full bg-muted">
                      <Image
                        src={img}
                        alt={`Hình ảnh minh chứng: ${evidence.title}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted/40 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-white p-2">
                <QRCodeSVG
                  value={evidence.qrValue}
                  size={96}
                  level="M"
                  marginSize={0}
                  title={`Mã QR minh chứng ${evidence.evidenceCode}`}
                />
              </div>
              <div>
                <p className="flex items-center gap-2 font-semibold text-foreground">
                  <QrCode className="size-4" aria-hidden />
                  Mã QR tra cứu minh chứng
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Dán mã này lên báo cáo in, khi quét sẽ mở đúng hồ sơ này.
                </p>
                <p className="mt-2 text-xs break-all text-muted-foreground">{evidence.qrValue}</p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button>
                <Download className="size-4" aria-hidden />
                Xuất PDF
              </Button>
              <Button variant="outline">
                <Printer className="size-4" aria-hidden />
                In
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Paperclip className="size-4" aria-hidden />
            {evidence.attachments} tệp đính kèm (biên bản, danh sách ký)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}