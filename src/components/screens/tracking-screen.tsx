"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ClipboardCheck,
  Download,
  Filter,
  MailCheck,
  Search,
} from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRole } from "@/components/role-provider";
import { notifications, students, tasks } from "@/lib/data";
import { cn } from "@/lib/utils";

type Row = {
  id: string;
  name: string;
  mssv: string;
  notification: string;
  seen: boolean;
  confirmed: boolean;
  responded: boolean;
  taskStatus: string;
};

const seedRows: Row[] = students.slice(0, 24).map((s, i) => ({
  id: s.id,
  name: s.name,
  mssv: s.mssv,
  notification: "Thông báo khai giảng học kỳ II",
  seen: i % 4 !== 0,
  confirmed: i % 5 === 0 || i % 7 === 0,
  responded: i % 9 === 0,
  taskStatus:
    tasks[i % tasks.length]?.status ?? "pending",
}));

const filters = [
  { id: "all", label: "Tất cả" },
  { id: "not-seen", label: "Chưa xem" },
  { id: "not-confirmed", label: "Chưa xác nhận" },
  { id: "overdue", label: "Quá hạn" },
];

export function TrackingScreen() {
  const { role } = useRole();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    let out = seedRows;
    if (filter === "not-seen") out = out.filter((r) => !r.seen);
    if (filter === "not-confirmed") out = out.filter((r) => r.seen && !r.confirmed);
    if (filter === "overdue") out = out.filter((r) => r.taskStatus === "overdue");
    const q = query.trim().toLowerCase();
    if (q) out = out.filter((r) => r.name.toLowerCase().includes(q) || r.mssv.toLowerCase().includes(q));
    return out;
  }, [filter, query]);

  const total = seedRows.length;
  const seenCount = seedRows.filter((r) => r.seen).length;
  const confirmedCount = seedRows.filter((r) => r.confirmed).length;
  const notSeenCount = total - seenCount;
  const overdueCount = seedRows.filter((r) => r.taskStatus === "overdue").length;

  const isAdmin = role === "admin";

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
            Theo dõi tiến độ
          </h1>
          <p className="text-sm text-muted-foreground">
            {isAdmin
              ? "Theo dõi tiến độ thực hiện nhiệm vụ của học sinh toàn trường."
              : "Ai đã làm, ai chưa làm, ai quá hạn — bạn chỉ cần nhìn là biết."}
          </p>
        </div>
        <Button variant="outline">
          <Download className="size-4" aria-hidden />
          Xuất Excel
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Đã xem thông báo"
          value={seenCount}
          unit={`/${total}`}
          icon={CheckCircle2}
          tone="success"
          hint={`${Math.round((seenCount / total) * 100)}% đã xem`}
        />
        <StatCard
          label="Đã xác nhận"
          value={confirmedCount}
          unit={`/${total}`}
          icon={MailCheck}
          tone="primary"
          hint={`${Math.round((confirmedCount / total) * 100)}% đã xác nhận`}
        />
        <StatCard
          label="Chưa xem thông báo"
          value={notSeenCount}
          unit="học sinh"
          icon={Bell}
          tone="warning"
          hint="Cần nhắc nhở"
        />
        <StatCard
          label="Quá hạn nhiệm vụ"
          value={overdueCount}
          unit="học sinh"
          icon={AlertTriangle}
          tone="danger"
          hint="Vượt thời hạn"
        />
      </div>

      {/* Bộ lọc nhanh */}
      <Card>
        <CardContent className="p-4 lg:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 flex-1">
              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <Filter className="size-4" aria-hidden />
                Lọc nhanh
              </p>
              <div className="flex flex-wrap gap-2">
                {filters.map((f) => (
                  <Button
                    key={f.id}
                    type="button"
                    size="sm"
                    variant={filter === f.id ? "default" : "outline"}
                    onClick={() => setFilter(f.id)}
                    aria-pressed={filter === f.id}
                  >
                    {f.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-72">
              <Label htmlFor="track-search" className="mb-1 block text-sm font-medium">
                Tìm học sinh
              </Label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="track-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Nhập tên hoặc mã..."
                  className="min-h-11 pl-9"
                />
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
            Hiển thị {rows.length} học sinh
            {filter !== "all" ? ` · đang lọc: ${filters.find((f) => f.id === filter)?.label}` : ""}
          </p>
        </CardContent>
      </Card>

      {/* Mobile: cards */}
      <ul className="space-y-3 lg:hidden">
        {rows.map((r) => (
          <li key={r.id}>
            <Card>
              <CardContent className="p-4">
                <p className="font-semibold text-foreground">{r.name}</p>
                <p className="text-sm text-muted-foreground">{r.mssv}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.seen ? (
                    <StatusBadge tone="success">Đã xem</StatusBadge>
                  ) : (
                    <StatusBadge tone="warning">Chưa xem</StatusBadge>
                  )}
                  {r.confirmed ? (
                    <StatusBadge tone="primary">Đã xác nhận</StatusBadge>
                  ) : (
                    <StatusBadge tone="neutral">Chưa xác nhận</StatusBadge>
                  )}
                  {r.taskStatus === "overdue" && <StatusBadge tone="danger">Quá hạn</StatusBadge>}
                  {r.taskStatus === "done" && <StatusBadge tone="success">Đã nộp bài</StatusBadge>}
                </div>
                {(!r.seen || !r.confirmed) && (
                  <Button variant="outline" size="sm" className="mt-3 w-full">
                    <Bell className="size-4" aria-hidden />
                    Gửi nhắc nhở
                  </Button>
                )}
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      {/* Desktop: table */}
      <Card className="hidden overflow-hidden lg:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Bảng theo dõi tiến độ học sinh lớp 10A1</caption>
              <thead className="border-b border-border bg-muted/50">
                <tr className="text-left text-muted-foreground">
                  <th scope="col" className="px-4 py-3 font-medium">
                    Học sinh
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Xem thông báo
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Xác nhận
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Nhiệm vụ
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    <span className="sr-only">Thao tác</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0">
                    <th scope="row" className="px-4 py-3 text-left font-medium">
                      <span className="block">{r.name}</span>
                      <span className="block font-mono text-xs text-muted-foreground">
                        {r.mssv}
                      </span>
                    </th>
                    <td className="px-4 py-3">
                      {r.seen ? (
                        <StatusBadge tone="success">Đã xem</StatusBadge>
                      ) : (
                        <StatusBadge tone="warning">Chưa xem</StatusBadge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {r.confirmed ? (
                        <StatusBadge tone="primary">Đã xác nhận</StatusBadge>
                      ) : (
                        <StatusBadge tone="neutral">Chưa xác nhận</StatusBadge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {r.taskStatus === "overdue" ? (
                        <StatusBadge tone="danger">Quá hạn</StatusBadge>
                      ) : r.taskStatus === "done" ? (
                        <StatusBadge tone="success">Đã nộp</StatusBadge>
                      ) : (
                        <StatusBadge tone="info">Đang làm</StatusBadge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {!r.confirmed && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn("text-primary")}
                          aria-label={`Gửi nhắc nhở tới ${r.name}`}
                        >
                          Nhắc nhở
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-start gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <ClipboardCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
            <div>
              <p className="font-semibold text-foreground">Gửi nhắc nhở tập thể</p>
              <p className="text-sm text-muted-foreground">
                Gửi thông báo nhắc nhở tới {notSeenCount} học sinh chưa xem — chỉ một thao tác.
              </p>
            </div>
          </div>
          <Button className="w-full shrink-0 sm:w-auto">
            <Bell className="size-4" aria-hidden />
            Gửi nhắc nhở
          </Button>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Tổng số thông báo đang gửi: {notifications.filter((n) => n.status === "active").length} · Tổng
        số nhiệm vụ: {tasks.length}
      </p>
    </div>
  );
}