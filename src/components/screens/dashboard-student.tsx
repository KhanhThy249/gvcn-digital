"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bell,
  CalendarClock,
  ClipboardList,
  FolderArchive,
  IdCard,
  ListChecks,
  PartyPopper,
} from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { LinkButton } from "@/components/link-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRole } from "@/components/role-provider";
import { evidences, studentHomeItems } from "@/lib/data";
import type { StudentHomeItem } from "@/lib/types";

const typeMeta: Record<
  StudentHomeItem["type"],
  { label: string; icon: typeof Bell; tone: "primary" | "info" | "success" | "warning" }
> = {
  "thong-bao": { label: "Thông báo", icon: Bell, tone: "primary" },
  "khao-sat": { label: "Khảo sát", icon: ClipboardList, tone: "info" },
  "nhiem-vu": { label: "Nhiệm vụ", icon: ListChecks, tone: "success" },
  "xac-nhan": { label: "Xác nhận", icon: CalendarClock, tone: "warning" },
};

export function DashboardStudent() {
  const { user } = useRole();
  const todo = studentHomeItems.filter((i) => i.status === "todo");
  const done = studentHomeItems.filter((i) => i.status === "done");

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 lg:p-6">
        <p className="text-sm text-muted-foreground">Xin chào, hôm nay là thứ Sáu</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
          {user.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{user.org}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusBadge tone="warning" icon={<ListChecks className="size-3.5" aria-hidden />}>
            {todo.length} việc chưa làm
          </StatusBadge>
          <StatusBadge tone="success" icon={<PartyPopper className="size-3.5" aria-hidden />}>
            {done.length} việc đã hoàn thành
          </StatusBadge>
        </div>
      </section>

      <section aria-labelledby="todo-heading" className="space-y-3">
        <h2 id="todo-heading" className="text-xl font-bold tracking-tight text-foreground">
          Bạn cần làm gì hôm nay?
        </h2>
        <ul className="space-y-3">
          {todo.map((item) => {
            const meta = typeMeta[item.type];
            const Icon = meta.icon;
            return (
              <li key={item.id}>
                <Card>
                  <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div className="flex min-w-0 gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                        <p className="mt-1.5 font-semibold text-foreground">{item.title}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">{item.due}</p>
                      </div>
                    </div>
                    <LinkButton href="/nhiem-vu" className="w-full shrink-0 sm:w-auto">
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

      <section aria-labelledby="profile-heading">
        <Card className="border-primary/30 bg-primary-soft">
          <CardHeader>
            <CardTitle id="profile-heading" className="flex items-center gap-2 text-lg">
              <IdCard className="size-5 text-primary" aria-hidden />
              Cập nhật hồ sơ bằng ảnh chụp
            </CardTitle>
            <CardDescription className="text-foreground/70">
              Chụp giấy tờ hoặc giấy chứng nhận, hệ thống tự đọc thông tin. Bạn kiểm tra rồi gửi thầy
              cô duyệt. Không cần điền tay.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LinkButton href="/lop-hoc">
              <IdCard className="size-4" aria-hidden />
              Chụp ảnh cập nhật hồ sơ
            </LinkButton>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="done-heading" className="space-y-3">
        <h2 id="done-heading" className="text-xl font-bold tracking-tight text-foreground">
          Đã hoàn thành
        </h2>
        <ul className="space-y-2">
          {done.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <StatusBadge tone="success">{typeMeta[item.type].label}</StatusBadge>
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

      <section aria-labelledby="ev-heading" className="space-y-3">
        <h2 id="ev-heading" className="text-xl font-bold tracking-tight text-foreground">
          Minh chứng bạn đã tham gia
        </h2>
        <ul className="space-y-2">
          {evidences.slice(0, 3).map((e) => (
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