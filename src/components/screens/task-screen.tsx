"use client";

import { useMemo, useState } from "react";
import { Camera, CheckCircle2, ListChecks, Plus, Send } from "lucide-react";

import { StatusBadge, TaskStatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRole } from "@/components/role-provider";
import { tasks } from "@/lib/data";
import { cn } from "@/lib/utils";

const statusLabel: Record<string, string> = {
  all: "Tất cả",
  pending: "Chưa làm",
  doing: "Đang làm",
  done: "Đã xong",
  overdue: "Quá hạn",
};

export function TaskScreen() {
  const { role } = useRole();
  const isTeacher = role === "gvcn" || role === "admin";
  const [formOpen, setFormOpen] = useState(false);

  if (!isTeacher) {
    return <TaskStudentView />;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
            Nhiệm vụ
          </h1>
          <p className="text-sm text-muted-foreground">
            Giao nhiệm vụ cho học sinh và phụ huynh. Hệ thống tự tạo minh chứng cho mỗi nhiệm vụ.
          </p>
        </div>
        <Button onClick={() => setFormOpen((v) => !v)}>
          <Plus className="size-4" aria-hidden />
          Giao nhiệm vụ mới
        </Button>
      </header>

      {formOpen && <TaskCreateForm onDone={() => setFormOpen(false)} />}

      <TaskTabs items={tasks} />
    </div>
  );
}

export function TaskTabs({ items }: { items: typeof tasks }) {
  const counts = useMemo(
    () => ({
      all: items.length,
      pending: items.filter((t) => t.status === "pending").length,
      doing: items.filter((t) => t.status === "doing").length,
      done: items.filter((t) => t.status === "done").length,
      overdue: items.filter((t) => t.status === "overdue").length,
    }),
    [items],
  );

  const tabs = ["all", "pending", "doing", "done", "overdue"];

  return (
    <Tabs defaultValue="all">
      <TabsList className="flex-wrap">
        {tabs.map((t) => (
          <TabsTrigger key={t} value={t} className="min-h-11">
            {statusLabel[t]} ({counts[t as keyof typeof counts]})
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((t) => {
        const filtered =
          t === "all" ? items : items.filter((x) => x.status === t);
        return (
          <TabsContent key={t} value={t} className="mt-4">
            {filtered.length === 0 ? (
              <EmptyState
                icon={ListChecks}
                title={`Không có nhiệm vụ ${statusLabel[t].toLowerCase()}`}
                description="Khi có nhiệm vụ ở trạng thái này, chúng sẽ hiển thị ở đây."
              />
            ) : (
              <ul className="space-y-3">
                {filtered.map((task) => (
                  <li key={task.id}>
                    <Card>
                      <CardContent className="p-4 lg:p-5">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <TaskStatusBadge status={task.status} />
                              <StatusBadge
                                tone={
                                  task.priority === "Cao"
                                    ? "danger"
                                    : task.priority === "Bình thường"
                                      ? "info"
                                      : "neutral"
                                }
                              >
                                Ưu tiên {task.priority.toLowerCase()}
                              </StatusBadge>
                              <span className="text-xs text-muted-foreground">
                                Giao cho {task.assigneeType}
                              </span>
                            </div>
                            <h2 className="mt-2 text-lg font-semibold text-foreground">
                              {task.title}
                            </h2>
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                              {task.description}
                            </p>
                            <p className="mt-2 text-xs text-muted-foreground">
                              Hạn {task.dueDate} · Giao lúc {task.createdAt}
                              {task.evidenceId ? (
                                <>
                                  {" · Minh chứng "}
                                  <span className="font-mono font-semibold">{task.evidenceId}</span>
                                </>
                              ) : null}
                            </p>
                          </div>

                          <div className="shrink-0 lg:w-44">
                            <p className="text-xs font-medium text-muted-foreground">
                              Đã hoàn thành {task.completedCount}/{task.totalCount}
                            </p>
                            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-[width] duration-300",
                                  task.status === "overdue" ? "bg-danger" : "bg-success",
                                )}
                                style={{
                                  width: `${Math.round((task.completedCount / task.totalCount) * 100)}%`,
                                }}
                                role="progressbar"
                                aria-valuenow={Math.round(
                                  (task.completedCount / task.totalCount) * 100,
                                )}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label={`Tiến độ: ${task.completedCount}/${task.totalCount}`}
                              />
                            </div>
                            <Button variant="outline" size="sm" className="mt-3 w-full">
                              Xem danh sách
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

function TaskCreateForm({ onDone }: { onDone: () => void }) {
  const [title, setTitle] = useState("");

  return (
    <Card className="border-primary/40">
      <CardContent className="space-y-4 p-5">
        <div className="space-y-1.5">
          <Label htmlFor="task-title" className="text-sm font-semibold">
            Tên nhiệm vụ <span className="text-danger">*</span>
          </Label>
          <Input
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: Nộp bài tập chính học tuần 3"
            className="min-h-11"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="task-audience" className="text-sm font-semibold">
              Giao cho
            </Label>
            <select
              id="task-audience"
              className="min-h-11 w-full cursor-pointer rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground"
              defaultValue="Học sinh"
            >
              <option>Học sinh</option>
              <option>Phụ huynh</option>
              <option>Cả hai</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="task-due" className="text-sm font-semibold">
              Hạn hoàn thành <span className="text-danger">*</span>
            </Label>
            <Input id="task-due" type="datetime-local" className="min-h-11" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="task-desc" className="text-sm font-semibold">
            Mô tả chi tiết
          </Label>
          <textarea
            id="task-desc"
            rows={4}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-base leading-relaxed text-foreground"
            placeholder="Nêu rõ cần làm gì, nộp bằng cách nào..."
          />
        </div>
        <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onDone}>
            Huỷ
          </Button>
          <Button disabled={title.trim().length < 3} onClick={onDone}>
            <Send className="size-4" aria-hidden />
            Giao nhiệm vụ
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TaskStudentView() {
  const myTasks = tasks.slice(0, 4);
  return (
    <div className="space-y-5">
      <ul className="space-y-3">
        {myTasks.map((t) => (
          <li key={t.id}>
            <Card className={t.status === "overdue" ? "border-danger/40" : undefined}>
              <CardContent className="p-4 lg:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <TaskStatusBadge status={t.status} />
                  <StatusBadge tone="info">Giao cho {t.assigneeType}</StatusBadge>
                </div>
                <h2 className="mt-2 text-lg font-semibold text-foreground">{t.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {t.description}
                </p>
                <p className="mt-2 text-sm font-medium text-foreground">Hạn: {t.dueDate}</p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  {t.status !== "done" ? (
                    <>
                      <Button>
                        <Camera className="size-4" aria-hidden />
                        Nộp bài
                      </Button>
                      <Button variant="outline">Xem yêu cầu</Button>
                    </>
                  ) : (
                    <StatusBadge tone="success" icon={<CheckCircle2 className="size-3.5" aria-hidden />}>
                      Đã hoàn thành — cảm ơn bạn
                    </StatusBadge>
                  )}
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}