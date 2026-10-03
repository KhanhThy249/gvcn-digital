"use client";

import { useState } from "react";
import { Download, FileBarChart, FileText, Printer, Sparkles } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRole } from "@/components/role-provider";
import { evidences, reportDefaults, tasks } from "@/lib/data";

const reportRows = [
  { label: "Thông báo phát ra", value: "4 thông báo", note: "3 đang gửi, 1 đã đóng" },
  { label: "Thiệp điện tử", value: "1 thiệp", note: "31/38 phụ huynh đã xác nhận" },
  { label: "Khảo sát tổ chức", value: "2 khảo sát", note: "58 lượt trả lời tổng cộng" },
  { label: "Nhiệm vụ giao", value: `${tasks.length} nhiệm vụ`, note: "1 nhiệm vụ đã quá hạn" },
  { label: "Học sinh tham gia đầy đủ", value: "31/38 học sinh", note: "81,6%" },
  { label: "Hoạt động sinh hoạt", value: "2 hoạt động", note: "2 buổi dưới cờ thiếu nhi" },
  { label: "Minh chứng đã lưu", value: `${evidences.length} hồ sơ`, note: "Kèm mã QR" },
];

export function ReportScreen() {
  const { role } = useRole();
  const isAdmin = role === "admin";
  const [scope, setScope] = useState(reportDefaults.scope);
  const [period, setPeriod] = useState(reportDefaults.period);

  const fileName = `Bao_cao_GVCN_10A1_${period.replace(/\s+/g, "_")}.pdf`;

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
          {isAdmin ? "Dữ liệu & Báo cáo toàn trường" : "Báo cáo công tác chủ nhiệm"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isAdmin
            ? "Tổng hợp số liệu toàn trường từ dữ liệu mà mọi hoạt động đã tạo ra."
            : "Chọn phạm vi, xem trước và xuất PDF. Dữ liệu được lấy tự động từ những gì bạn đã làm trên hệ thống."}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_1fr]">
        {/* Chọn phạm vi */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileBarChart className="size-5 text-primary" aria-hidden />
              1. Chọn phạm vi báo cáo
            </CardTitle>
            <CardDescription>Chọn xong báo cáo sẽ cập nhật ngay bên phải.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="rp-class" className="text-sm font-semibold">
                Lớp
              </Label>
              <select
                id="rp-class"
                defaultValue="10A1"
                className="min-h-11 w-full cursor-pointer rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground"
              >
                <option>10A1</option>
                <option>10A2</option>
                <option>11B3</option>
                <option>Toàn trường</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rp-scope" className="text-sm font-semibold">
                Loại báo cáo
              </Label>
              <select
                id="rp-scope"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="min-h-11 w-full cursor-pointer rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground"
              >
                <option>Hoạt động chủ nhiệm</option>
                <option>Kết quả học tập</option>
                <option>Chuyên đỗi tư vấn</option>
                <option>Báo cáo kết quả khảo sát</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rp-period" className="text-sm font-semibold">
                Kỳ báo cáo
              </Label>
              <select
                id="rp-period"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="min-h-11 w-full cursor-pointer rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground"
              >
                <option>Tháng 10/2026</option>
                <option>Quý I năm học 2026–2027</option>
                <option>Học kỳ II năm học 2026–2027</option>
                <option>Cả năm học 2026–2027</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rp-type" className="text-sm font-semibold">
                Loại hoạt động
              </Label>
              <select
                id="rp-type"
                defaultValue="Tất cả loại hoạt động"
                className="min-h-11 w-full cursor-pointer rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground"
              >
                <option>Tất cả loại hoạt động</option>
                <option>Thông báo</option>
                <option>Khảo sát</option>
                <option>Nhiệm vụ</option>
                <option>Sinh hoạt</option>
              </select>
            </div>

            <div className="rounded-lg bg-muted/60 p-3">
              <p className="text-xs font-medium text-muted-foreground">Tên file sẽ tải về</p>
              <p className="mt-1 font-mono text-xs break-all text-foreground">{fileName}</p>
            </div>

            <div className="flex flex-col gap-2">
              <Button size="lg">
                <Download className="size-4" aria-hidden />
                Xuất báo cáo PDF
              </Button>
              <Button variant="outline">
                <Printer className="size-4" aria-hidden />
                In trực tiếp
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Xem trước */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="size-5 text-primary" aria-hidden />
              2. Xem trước báo cáo
            </CardTitle>
            <CardDescription>
              Trang bìa, số liệu tổng hợp và danh mục minh chứng kèm theo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Trang bìa */}
            <div className="rounded-xl border-2 border-border p-6 text-center">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                Trường THPT Trần Đăng Ninh
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Số: ............</p>
              <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
                BÁO CÁO {scope.toUpperCase()}
              </h2>
              <p className="mt-2 text-base text-muted-foreground">{period}</p>
              <div className="mt-8 space-y-1 text-left text-sm">
                <p>
                  <span className="text-muted-foreground">Người lập báo cáo:</span> Nguyễn Thị Mai
                </p>
                <p>
                  <span className="text-muted-foreground">Chức vụ:</span> Giáo viên chủ nhiệm lớp 10A1
                </p>
              </div>
              <p className="mt-8 text-right text-sm">
                Thanh Hóa, ngày ... tháng ... năm 20...
              </p>
            </div>

            {/* Số liệu */}
            <div>
              <h3 className="text-base font-semibold text-foreground">I. Số liệu tổng hợp</h3>
              <ul className="mt-3 space-y-2">
                {reportRows.map((r) => (
                  <li
                    key={r.label}
                    className="flex flex-col gap-1 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-foreground">{r.label}</p>
                      <p className="text-sm text-muted-foreground">{r.note}</p>
                    </div>
                    <StatusBadge tone="info">{r.value}</StatusBadge>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI */}
            <div className="rounded-xl border border-primary/30 bg-primary-soft p-4">
              <p className="flex items-center gap-2 font-semibold text-foreground">
                <Sparkles className="size-4 text-primary" aria-hidden />
                Gợi ý nội dung báo cáo (AI hỗ trợ)
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                Trong tháng 10/2026, lớp 10A1 đã thực hiện {tasks.length} nhiệm vụ với tỉ lệ hoàn thành
                81,6%; tổ chức 2 khảo sát thu 58 lượt trả lời; gửi 4 thông báo và 1 thiệp điện tử với
                tỉ lệ xác nhận 71,8%. Có 1 nhiệm vụ quá hạn do học sinh chưa nộp bài. Đề xuất nhắc nhở
                cá nhân 16 học sinh chưa hoàn thành nhiệm vụ.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Bạn có thể sửa hoặc bỏ phần này trước khi xuất PDF.
              </p>
            </div>

            {/* Minh chứng kèm theo */}
            <div>
              <h3 className="text-base font-semibold text-foreground">
                II. Danh mục minh chứng kèm theo
              </h3>
              <ul className="mt-3 space-y-2">
                {evidences.map((e) => (
                  <li
                    key={e.id}
                    className="flex flex-col gap-1 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{e.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {e.date} · {e.audience}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-semibold text-muted-foreground">
                      {e.evidenceCode}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}