"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FolderArchive,
  FileBarChart,
  Sparkles,
  Users,
} from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { StatCard } from "@/components/stat-card";
import { EvidenceCard } from "@/components/evidence-card";
import { LinkButton } from "@/components/link-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRole } from "@/components/role-provider";
import { dashboardActivities, evidences, notifications, surveys, tasks } from "@/lib/data";
import { cn } from "@/lib/utils";

export function DashboardGVCN() {
  const { user } = useRole();

  const pendingConfirm = notifications.reduce((sum, n) => sum + n.stats.pending, 0);
  const overdueTasks = tasks.filter((t) => t.status === "overdue");
  const openSurveys = surveys.filter((s) => s.status === "open");
  const recentEvidences = evidences.slice(0, 3);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 lg:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Xin chào, hôm nay là thứ Sáu</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
              {user.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{user.org}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <LinkButton href="/minh-chung" variant="outline">
              <FolderArchive className="size-4" aria-hidden />
              Xem minh chứng
            </LinkButton>
            <LinkButton href="/thong-bao?tao=1">
              <Bell className="size-4" aria-hidden />
              Tạo thông báo
            </LinkButton>
          </div>
        </div>
      </section>

      <section aria-labelledby="today-heading" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="today-heading" className="text-xl font-bold tracking-tight text-foreground">
            Công việc hôm nay
          </h2>
          <span className="text-sm text-muted-foreground">Cập nhật lúc 08:20 hôm nay</span>
        </div>

        {overdueTasks.length > 0 && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-xl border border-danger/30 bg-danger-soft p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden />
              <div>
                <p className="font-semibold text-foreground">
                  Có {overdueTasks.length} nhiệm vụ đã quá hạn
                </p>
                <p className="text-sm text-muted-foreground">
                  {overdueTasks[0].title} — hạn {overdueTasks[0].dueDate}
                </p>
              </div>
            </div>
            <LinkButton href="/theo-doi" variant="destructive" size="sm" className="shrink-0">
              Xử lý ngay
              <ArrowRight className="size-4" aria-hidden />
            </LinkButton>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Chờ phụ huynh phản hồi"
            value={pendingConfirm}
            unit="người"
            icon={Clock}
            tone="warning"
            hint="Cần nhắc nhở trước hạn"
          />
          <StatCard
            label="Khảo sát đang mở"
            value={openSurveys.length}
            unit="khảo sát"
            icon={ClipboardCheck}
            tone="info"
            hint={`${openSurveys.reduce((s, x) => s + x.responses, 0)} lượt đã trả lời`}
          />
          <StatCard
            label="Học sinh lớp 10A1"
            value={38}
            unit="học sinh"
            icon={Users}
            tone="primary"
            hint="Đã đồng bộ từ LMS 07:12"
          />
          <StatCard
            label="Minh chứng tháng này"
            value={evidences.length}
            unit="hồ sơ"
            icon={FolderArchive}
            tone="success"
            hint="Tự động lưu từ hoạt động"
            trend="up"
          />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="size-5 text-primary" aria-hidden />
              Việc cần bạn xử lý
            </CardTitle>
            <CardDescription>
              Các việc này được hệ thống sắp xếp theo mức độ cần làm trước.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.slice(0, 3).map((n) => {
              const rate = Math.round((n.stats.confirmed / n.stats.total) * 100);
              return (
                <div
                  key={n.id}
                  className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge tone={n.type === "thong-bao" ? "primary" : "success"}>
                        {n.type === "thong-bao" ? "Thông báo" : "Thiệp điện tử"}
                      </StatusBadge>
                      <span className="text-xs text-muted-foreground">{n.audience}</span>
                    </div>
                    <p className="mt-1.5 font-semibold text-foreground">{n.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Đã xem {n.stats.viewed}/{n.stats.total} · Đã xác nhận {n.stats.confirmed}/
                      {n.stats.total} · Còn {n.stats.pending} chưa phản hồi
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <div className="w-24">
                      <div
                        className="h-2 w-full overflow-hidden rounded-full bg-muted"
                        role="progressbar"
                        aria-valuenow={rate}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Tỉ lệ đã xác nhận: ${rate}%`}
                      >
                        <div
                          className="h-full rounded-full bg-primary transition-[width] duration-300"
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                      <p className="mt-1 text-center text-xs font-medium text-muted-foreground">
                        {rate}% đã xác nhận
                      </p>
                    </div>
                    <LinkButton href="/thong-bao" size="sm" variant="outline">
                      Theo dõi
                    </LinkButton>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Hoạt động gần đây</CardTitle>
            <CardDescription>Mọi thao tác đều được ghi lại.</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {dashboardActivities.map((a) => (
                <li key={a.id} className="flex gap-3">
                  <span
                    className={cn(
                      "mt-1.5 size-2.5 shrink-0 rounded-full",
                      a.tone === "success" && "bg-success",
                      a.tone === "warning" && "bg-warning",
                      a.tone === "danger" && "bg-danger",
                      a.tone === "info" && "bg-info",
                      a.tone === "primary" && "bg-primary",
                    )}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <p className="text-sm leading-relaxed text-foreground">{a.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {a.time}
                      {a.evidenceCode ? (
                        <>
                          {" · "}
                          <span className="font-mono font-semibold">{a.evidenceCode}</span>
                        </>
                      ) : null}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      <section aria-labelledby="evidence-heading" className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 id="evidence-heading" className="text-xl font-bold tracking-tight text-foreground">
            Minh chứng được tự động tạo
          </h2>
          <LinkButton href="/minh-chung" variant="ghost" size="sm">
            Xem tất cả
            <ArrowRight className="size-4" aria-hidden />
          </LinkButton>
        </div>
        <p className="text-sm text-muted-foreground">
          Mỗi hoạt động bạn thực hiện đều được lưu thành hồ sơ minh chứng kèm mã và mã QR, sẵn sàng
          xuất PDF cho nhà trường.
        </p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recentEvidences.map((e) => (
            <EvidenceCard key={e.id} evidence={e} compact />
          ))}
        </div>
      </section>

      <section aria-labelledby="quick-heading">
        <h2 id="quick-heading" className="mb-3 text-xl font-bold tracking-tight text-foreground">
          Thao tác nhanh
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickLink href="/thong-bao?tao=1" label="Gửi thông báo" icon={Bell} />
          <QuickLink href="/khao-sat?tao=1" label="Tạo khảo sát" icon={ClipboardCheck} />
          <QuickLink href="/nhiem-vu?tao=1" label="Giao nhiệm vụ" icon={CheckCircle2} />
          <QuickLink href="/bao-cao" label="Xuất báo cáo" icon={FileBarChart} />
        </div>
      </section>
    </div>
  );
}

function QuickLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: typeof Bell;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-14 items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted"
    >
      <Icon className="size-5 shrink-0 text-primary" aria-hidden />
      <span className="text-left">{label}</span>
    </Link>
  );
}