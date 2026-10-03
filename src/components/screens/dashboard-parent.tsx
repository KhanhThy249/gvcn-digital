"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bell,
  CalendarClock,
  ClipboardList,
  FolderArchive,
  Heart,
  ListChecks,
  MailCheck,
} from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { LinkButton } from "@/components/link-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRole } from "@/components/role-provider";
import { evidences, parentHomeItems } from "@/lib/data";
import type { StudentHomeItem } from "@/lib/types";

const typeMeta: Record<
  StudentHomeItem["type"],
  {
    label: string;
    icon: typeof Bell;
    tone: "primary" | "info" | "success" | "warning" | "danger";
  }
> = {
  "thong-bao": { label: "Thông báo", icon: Bell, tone: "primary" },
  "khao-sat": { label: "Khảo sát", icon: ClipboardList, tone: "info" },
  "nhiem-vu": { label: "Nhiệm vụ", icon: ListChecks, tone: "success" },
  "xac-nhan": { label: "Xác nhận", icon: CalendarClock, tone: "warning" },
};

export function DashboardParent() {
  const { user } = useRole();
  const todo = parentHomeItems.filter((i) => i.status === "todo" || i.status === "late");

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 lg:p-6">
        <p className="text-sm text-muted-foreground">Xin chào quý phụ huynh</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
          {user.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{user.org}</p>
      </section>

      <Card className="border-primary/30 bg-primary-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="size-5 text-primary" aria-hidden />
            Quý phụ huynh cần làm {todo.length} việc
          </CardTitle>
          <CardDescription className="text-foreground/70">
            Mỗi việc đều ghi rõ thời hạn. Chỉ cần bấm nút bên dưới để xem và thực hiện.
          </CardDescription>
        </CardHeader>
      </Card>

      <section aria-labelledby="parent-todo" className="space-y-3">
        <h2 id="parent-todo" className="sr-only">
          Việc cần làm
        </h2>
        <ul className="space-y-3">
          {todo.map((item) => {
            const meta = typeMeta[item.type];
            const Icon = meta.icon;
            const isLate = item.status === "late";
            return (
              <li key={item.id}>
                <Card className={isLate ? "border-danger/40" : undefined}>
                  <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div className="flex min-w-0 gap-3">
                      <span
                        className={
                          isLate
                            ? "flex size-10 shrink-0 items-center justify-center rounded-lg bg-danger-soft text-danger"
                            : "flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary"
                        }
                      >
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge tone={isLate ? "danger" : meta.tone}>{meta.label}</StatusBadge>
                          {isLate && (
                            <StatusBadge
                              tone="danger"
                              icon={<CalendarClock className="size-3.5" aria-hidden />}
                            >
                              Đã quá hạn
                            </StatusBadge>
                          )}
                        </div>
                        <p className="mt-1.5 font-semibold text-foreground">{item.title}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">{item.due}</p>
                      </div>
                    </div>
                    <LinkButton href="/thong-bao" className="w-full shrink-0 sm:w-auto">
                      {item.actionLabel}
                      <ArrowRight className="size-4" aria-hidden />
                    </LinkButton>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="parent-done" className="space-y-3">
        <h2 id="parent-done" className="text-xl font-bold tracking-tight text-foreground">
          Đã xác nhận
        </h2>
        <ul className="space-y-2">
          {parentHomeItems
            .filter((i) => i.status === "done")
            .map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <StatusBadge tone="success" icon={<MailCheck className="size-3.5" aria-hidden />}>
                    Đã xác nhận
                  </StatusBadge>
                  <p className="mt-1.5 font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.due}</p>
                </div>
                <LinkButton href="/thong-bao" variant="outline" size="sm" className="shrink-0">
                  {item.actionLabel}
                </LinkButton>
              </li>
            ))}
        </ul>
      </section>

      <section aria-labelledby="parent-ev" className="space-y-3">
        <h2 id="parent-ev" className="text-xl font-bold tracking-tight text-foreground">
          Minh chứng hoạt động của học sinh
        </h2>
        <p className="text-sm text-muted-foreground">
          Hồ sơ minh chứng do hệ thống tự động tạo từ hoạt động thực tế, có mã QR để tra cứu.
        </p>
        <ul className="space-y-2">
          {evidences.slice(0, 4).map((e) => (
            <li key={e.id}>
              <Link
                href="/minh-chung"
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors duration-200 hover:bg-muted"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-success-soft text-success">
                  <FolderArchive className="size-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-foreground">{e.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {e.date} · {e.evidenceCode}
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}