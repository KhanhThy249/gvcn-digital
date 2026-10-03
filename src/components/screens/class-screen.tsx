"use client";

import { useMemo, useState } from "react";
import {
  Camera,
  CheckCircle2,
  CloudDownload,
  IdCard,
  MoreHorizontal,
  Phone,
  Search,
  UserRound,
} from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRole } from "@/components/role-provider";
import { classes, students } from "@/lib/data";
import { cn } from "@/lib/utils";

export function ClassScreen() {
  const { role } = useRole();
  const [query, setQuery] = useState("");
  const [classId, setClassId] = useState("10a1");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.mssv.toLowerCase().includes(q) ||
        s.parentName.toLowerCase().includes(q),
    );
  }, [query]);

  const isStudent = role === "student";
  const isAdmin = role === "admin";

  if (isStudent) {
    return <StudentOwnProfile />;
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
          {isAdmin ? "Quản lý lớp học" : "Lớp học của tôi"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isAdmin
            ? "Xem danh sách lớp và hồ sơ học sinh toàn trường."
            : "Danh sách học sinh và hồ sơ chi tiết của từng em. Có thể đồng bộ từ LMS."}
        </p>
      </header>

      {/* Đồng bộ LMS */}
      <Card className="border-primary/30 bg-primary-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CloudDownload className="size-5 text-primary" aria-hidden />
            Đồng bộ danh sách từ LMS
          </CardTitle>
          <CardDescription className="text-foreground/70">
            Hệ thống tự lấy danh sách học sinh và hồ sơ từ hệ thống quản lý học tập của trường, giúp
            thầy cô không phải nhập tay.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-foreground/70">
            Lần đồng bộ gần nhất: <strong className="text-foreground">08/10/2026, 07:12</strong> · 38 hồ
            sơ · 38 ảnh
          </p>
          <Button type="button">
            <CloudDownload className="size-4" aria-hidden />
            Đồng bộ ngay
          </Button>
        </CardContent>
      </Card>

      {/* Chọn lớp */}
      <section aria-labelledby="class-heading" className="space-y-3">
        <h2 id="class-heading" className="text-lg font-semibold text-foreground">
          Chọn lớp để xem danh sách
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setClassId(c.id)}
              aria-pressed={classId === c.id}
              className={cn(
                "rounded-xl border p-4 text-left transition-colors duration-200",
                classId === c.id
                  ? "border-primary bg-primary-soft"
                  : "border-border bg-card hover:bg-muted",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-foreground">{c.name}</p>
                <StatusBadge tone="info">{c.studentCount} học sinh</StatusBadge>
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {c.grade} · {c.room}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                GVCN: {c.homeroomTeacher}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Đồng bộ lúc {c.syncedAt}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Danh sách học sinh */}
      <section aria-labelledby="list-heading" className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="list-heading" className="text-lg font-semibold text-foreground">
              Danh sách học sinh lớp 10A1
            </h2>
            <p className="text-sm text-muted-foreground">
              Tìm theo tên, mã học sinh hoặc tên phụ huynh. Kết quả: {filtered.length} học sinh.
            </p>
          </div>
          <div className="w-full sm:w-80">
            <Label htmlFor="student-search" className="mb-1 block text-sm font-medium">
              Tìm kiếm học sinh
            </Label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id="student-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nhập tên, mã học sinh..."
                className="min-h-11 pl-9"
              />
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Search}
            title="Không tìm thấy học sinh nào"
            description="Thử xoá bớt từ khoá hoặc kiểm tra lại chính tả. Danh sách đầy đủ vẫn còn nguyên trong hệ thống."
            actionLabel="Xoá từ khoá"
            onAction={() => setQuery("")}
          />
        ) : (
          <>
            {/* Mobile: cards */}
            <ul className="space-y-3 lg:hidden">
              {filtered.map((s) => (
                <li key={s.id}>
                  <Card>
                    <CardContent className="flex items-start gap-3 p-4">
                      <StudentAvatar name={s.name} initials={s.avatar} />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground">{s.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {s.mssv} · {s.gender}
                        </p>
                        <div className="mt-2">
                          <StatusBadge tone={s.status === "Đang học" ? "success" : "warning"}>
                            {s.status}
                          </StatusBadge>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon-sm" aria-label={`Xem hồ sơ ${s.name}`}>
                        <MoreHorizontal className="size-4" aria-hidden />
                      </Button>
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
                    <caption className="sr-only">
                      Danh sách {filtered.length} học sinh lớp 10A1
                    </caption>
                    <thead className="border-b border-border bg-muted/50">
                      <tr className="text-left text-muted-foreground">
                        <th scope="col" className="px-4 py-3 font-medium">
                          Học sinh
                        </th>
                        <th scope="col" className="px-4 py-3 font-medium">
                          Mã học sinh
                        </th>
                        <th scope="col" className="px-4 py-3 font-medium">
                          Giới tính
                        </th>
                        <th scope="col" className="px-4 py-3 font-medium">
                          Phụ huynh
                        </th>
                        <th scope="col" className="px-4 py-3 font-medium">
                          Trạng thái
                        </th>
                        <th scope="col" className="px-4 py-3 font-medium">
                          <span className="sr-only">Thao tác</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((s) => (
                        <tr key={s.id} className="border-b border-border last:border-0">
                          <th scope="row" className="px-4 py-3 text-left font-medium">
                            <span className="flex items-center gap-3">
                              <StudentAvatar name={s.name} initials={s.avatar} size="sm" />
                              {s.name}
                            </span>
                          </th>
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                            {s.mssv}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{s.gender}</td>
                          <td className="px-4 py-3">
                            <span className="block text-foreground">{s.parentName}</span>
                            <span className="block text-xs text-muted-foreground">
                              {s.parentPhone}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge tone={s.status === "Đang học" ? "success" : "warning"}>
                              {s.status}
                            </StatusBadge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button variant="ghost" size="icon-sm" aria-label={`Xem hồ sơ ${s.name}`}>
                              <MoreHorizontal className="size-4" aria-hidden />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </section>
    </div>
  );
}

function StudentAvatar({
  name,
  initials,
  size = "md",
}: {
  name: string;
  initials: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-primary-soft font-semibold text-primary",
        size === "sm" ? "size-8 text-xs" : "size-10 text-sm",
      )}
    >
      <span className="sr-only">{name}</span>
      {initials}
    </span>
  );
}

function StudentOwnProfile() {
  const me = students[0];
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
          Hồ sơ của tôi
        </h1>
        <p className="text-sm text-muted-foreground">
          Kiểm tra thông tin đã được trường lưu. Nếu có sai, bạn có thể chụp ảnh giấy tờ để cập nhật.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <IdCard className="size-5 text-primary" aria-hidden />
            Thông tin học sinh
          </CardTitle>
          <CardDescription>
            Nguồn: đồng bộ từ LMS ngày 08/10/2026, 07:12
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {[
            { label: "Họ và tên", value: me.name },
            { label: "Mã học sinh", value: me.mssv },
            { label: "Ngày sinh", value: me.birthDate },
            { label: "Giới tính", value: me.gender },
            { label: "Số điện thoại", value: me.phone },
            { label: "Địa chỉ", value: me.address },
            { label: "Phụ huynh", value: me.parentName },
            { label: "SĐT phụ huynh", value: me.parentPhone },
          ].map((f) => (
            <div key={f.label} className="rounded-lg border border-border p-3">
              <p className="text-xs font-medium text-muted-foreground">{f.label}</p>
              <p className="mt-1 text-sm font-medium text-foreground">{f.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-primary/30 bg-primary-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Camera className="size-5 text-primary" aria-hidden />
            Thông tin này còn sai?
          </CardTitle>
          <CardDescription className="text-foreground/70">
            Bấm nút bên dưới, chụp ảnh giấy tờ hoặc giấy chứng nhận. Hệ thống tự đọc thông tin, bạn kiểm
            tra lại rồi gửi thầy cô duyệt. Không cần điền tay.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button>
              <Camera className="size-4" aria-hidden />
              Chụp ảnh cập nhật hồ sơ
            </Button>
            <Button variant="outline">
              <UserRound className="size-4" aria-hidden />
              Xem trạng thái hồ sơ
            </Button>
          </div>
          <p className="mt-3 flex items-center gap-2 text-sm text-foreground/70">
            <CheckCircle2 className="size-4 text-success" aria-hidden />
            Hồ sơ hiện tại đã đủ 8/8 thông tin bắt buộc.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Liên hệ khi cần</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="flex items-center gap-2 text-muted-foreground">
            <Phone className="size-4" aria-hidden />
            Cô Nguyễn Thị Mai — GVCN lớp 10A1: 09 1234 5678
          </p>
          <p className="text-muted-foreground">Giờ tiếp cô: 08:00 – 11:30 sáng, 14:00 – 16:30 chiều.</p>
        </CardContent>
      </Card>
    </div>
  );
}