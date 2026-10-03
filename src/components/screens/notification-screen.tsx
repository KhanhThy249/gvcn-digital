"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Bell,
  Copy,
  Eye,
  MailCheck,
  MessageSquareHeart,
  Send,
  Users,
} from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRole } from "@/components/role-provider";
import { notifications } from "@/lib/data";
import type { Notification } from "@/lib/types";
import { cn } from "@/lib/utils";

export function NotificationScreen() {
  const { role } = useRole();
  const [wizardOpen, setWizardOpen] = useState(false);
  const isTeacher = role === "gvcn" || role === "admin";

  if (!isTeacher) {
    return <NotificationInbox />;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
            Thông báo & Thiệp điện tử
          </h1>
          <p className="text-sm text-muted-foreground">
            Gửi thông báo hoặc thiệp điện tử tới học sinh và phụ huynh. Hệ thống biết ai đã xem, ai chưa
            xem, ai đã xác nhận.
          </p>
        </div>
        <Button onClick={() => setWizardOpen(true)}>
          <Send className="size-4" aria-hidden />
          Tạo thông báo mới
        </Button>
      </header>

      {wizardOpen && <NotificationWizard onClose={() => setWizardOpen(false)} />}

      <NotificationList items={notifications} />
    </div>
  );
}

/* ============================================================
   LIST (GVCN view)
   ============================================================ */
function NotificationList({ items }: { items: Notification[] }) {
  const tabs = [
    { value: "all", label: `Tất cả (${items.length})` },
    { value: "active", label: "Đang gửi" },
    { value: "closed", label: "Đã đóng" },
    { value: "pending", label: "Chờ phản hồi" },
  ];

  return (
    <Tabs defaultValue="all">
      <TabsList className="flex-wrap">
        {tabs.map((t) => (
          <TabsTrigger key={t.value} value={t.value} className="min-h-11">
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((t) => {
        const filtered = items.filter((n) => {
          if (t.value === "all") return true;
          if (t.value === "active") return n.status === "active";
          if (t.value === "closed") return n.status === "closed";
          return n.stats.pending > 0;
        });
        return (
          <TabsContent key={t.value} value={t.value} className="mt-4">
            {filtered.length === 0 ? (
              <EmptyState
                icon={Bell}
                title="Chưa có thông báo nào trong mục này"
                description="Khi bạn gửi thông báo, thông tin sẽ xuất hiện ở đây kèm trạng thái đã xem, đã xác nhận của từng người."
              />
            ) : (
              <ul className="space-y-3">
                {filtered.map((n) => (
                  <li key={n.id}>
                    <NotificationRow notification={n} />
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

function NotificationRow({ notification: n }: { notification: Notification }) {
  const viewRate = Math.round((n.stats.viewed / n.stats.total) * 100);
  const confirmRate = Math.round((n.stats.confirmed / n.stats.total) * 100);
  const isCard = n.type === "thiep";

  return (
    <Card>
      <CardContent className="p-4 lg:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge tone={isCard ? "success" : "primary"}>
                {isCard ? (
                  <>
                    <MessageSquareHeart className="size-3.5" aria-hidden />
                    Thiệp điện tử
                  </>
                ) : (
                  <>
                    <Bell className="size-3.5" aria-hidden />
                    Thông báo
                  </>
                )}
              </StatusBadge>
              <StatusBadge tone={n.status === "active" ? "success" : "neutral"}>
                {n.status === "active" ? "Đang gửi" : "Đã đóng"}
              </StatusBadge>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="size-3.5" aria-hidden />
                {n.audience} · Lớp {n.className}
              </span>
            </div>

            <h2 className="mt-2 text-lg font-semibold text-foreground">{n.title}</h2>
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {n.body}
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              Gửi lúc {n.createdAt}
              {n.deadline ? ` · Hạn phản hồi ${n.deadline}` : ""}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Eye className="size-4" aria-hidden />
              Xem trước
            </Button>
            <Button variant="outline" size="sm">
              <Copy className="size-4" aria-hidden />
              Sao chép link
            </Button>
          </div>
        </div>

        {/* Thống kê trạng thái — luôn kèm chữ, không chỉ màu */}
        <dl className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-medium text-muted-foreground">Đã xem</dt>
            <dd className="mt-1 flex flex-wrap items-center gap-2">
              <StatusBadge tone="success">{n.stats.viewed}/{n.stats.total}</StatusBadge>
              <span className="text-xs text-muted-foreground">{viewRate}%</span>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted-foreground">Đã xác nhận</dt>
            <dd className="mt-1 flex flex-wrap items-center gap-2">
              <StatusBadge tone="primary">{n.stats.confirmed}/{n.stats.total}</StatusBadge>
              <span className="text-xs text-muted-foreground">{confirmRate}%</span>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted-foreground">Chưa phản hồi</dt>
            <dd className="mt-1 flex flex-wrap items-center gap-2">
              <StatusBadge
                tone={n.stats.pending === 0 ? "success" : "warning"}
                icon={n.stats.pending > 0 ? <AlertTriangle className="size-3.5" aria-hidden /> : undefined}
              >
                {n.stats.pending} người
              </StatusBadge>
            </dd>
          </div>
        </dl>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${confirmRate}%` }}
            role="progressbar"
            aria-valuenow={confirmRate}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Tỉ lệ đã xác nhận: ${confirmRate}%`}
          />
        </div>
      </CardContent>
    </Card>
  );
}

/* ============================================================
   WIZARD 3 bước
   ============================================================ */
const steps = [
  { n: 1, label: "Chọn đối tượng" },
  { n: 2, label: "Soạn nội dung" },
  { n: 3, label: "Kiểm tra và gửi" },
];

function NotificationWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [audience, setAudience] = useState<Notification["audience"]>("Cả hai");
  const [kind, setKind] = useState<"thong-bao" | "thiep">("thong-bao");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const canNext = step === 1 || (step === 2 && title.trim().length > 3 && body.trim().length > 10);

  return (
    <Card className="border-primary/40">
      <CardHeader>
        <CardTitle className="text-lg">Tạo thông báo mới</CardTitle>
        <CardDescription>Làm theo từng bước. Thông tin được lưu nháp khi bạn chuyển bước.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Stepper */}
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
          {steps.map((s) => (
            <li key={s.n} className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                  step > s.n && "bg-success text-white",
                  step === s.n && "bg-primary text-primary-foreground",
                  step < s.n && "bg-muted text-muted-foreground",
                )}
                aria-current={step === s.n ? "step" : undefined}
              >
                {step > s.n ? "✓" : s.n}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  step === s.n ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {s.label}
              </span>
              {s.n < steps.length && (
                <span className="mx-1 hidden h-px w-6 bg-border sm:block" aria-hidden />
              )}
            </li>
          ))}
        </ol>

        {/* Bước 1 */}
        {step === 1 && (
          <div className="space-y-5">
            <fieldset className="space-y-2">
              <legend className="mb-2 text-sm font-semibold text-foreground">
                Loại nội dung gửi đi
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <ChoiceCard
                  active={kind === "thong-bao"}
                  onClick={() => setKind("thong-bao")}
                  icon={Bell}
                  title="Thông báo"
                  hint="Dùng cho thông tin chính thức, nhắc nhở nhiệm vụ."
                />
                <ChoiceCard
                  active={kind === "thiep"}
                  onClick={() => setKind("thiep")}
                  icon={MessageSquareHeart}
                  title="Thiệp điện tử"
                  hint="Thiệp cảm ơn, thiệp mời — có mẫu đẹp như thiệp cưới online."
                />
              </div>
            </fieldset>

            <fieldset className="space-y-2">
              <legend className="mb-2 text-sm font-semibold text-foreground">
                Gửi cho đối tượng nào?
              </legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {(["Học sinh", "Phụ huynh", "Cả hai"] as const).map((a) => (
                  <label
                    key={a}
                    className={cn(
                      "flex min-h-12 cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors duration-200",
                      audience === a
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-border bg-card hover:bg-muted",
                    )}
                  >
                    <input
                      type="radio"
                      name="audience"
                      value={a}
                      checked={audience === a}
                      onChange={() => setAudience(a)}
                      className="size-4 accent-[var(--primary)]"
                    />
                    {a}
                  </label>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Lớp 10A1 có 38 học sinh và 38 phụ huynh.
              </p>
            </fieldset>
          </div>
        )}

        {/* Bước 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="nb-title" className="text-sm font-semibold">
                Tiêu đề <span className="text-danger">*</span>
              </Label>
              <Input
                id="nb-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Thông báo lịch nghỉ lễ Quốc khánh"
                className="min-h-11"
                aria-describedby="nb-title-help"
              />
              <p id="nb-title-help" className="text-sm text-muted-foreground">
                Nên viết ngắn gọn, dễ hiểu. Ví dụ: “Nghỉ lễ 02/9”.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="nb-body" className="text-sm font-semibold">
                Nội dung <span className="text-danger">*</span>
              </Label>
              <textarea
                id="nb-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                placeholder="Viết nội dung thông báo bằng ngôn ngữ đời thường, tránh từ kỹ thuật…"
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-base leading-relaxed text-foreground transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                aria-describedby="nb-body-help"
              />
              <p id="nb-body-help" className="text-sm text-muted-foreground">
                Nên viết rõ: việc gì, khi nào, học sinh/phụ huynh cần làm gì.
              </p>
            </div>
          </div>
        )}

        {/* Bước 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <p className="text-xs font-semibold text-muted-foreground">Xem trước nội dung</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {kind === "thiep" ? "Thiệp điện tử" : "Thông báo"} · {audience} · Lớp 10A1
              </p>
              <h3 className="mt-1 text-lg font-bold text-foreground">
                {title || "(Chưa nhập tiêu đề)"}
              </h3>
              <p className="mt-1.5 text-sm whitespace-pre-wrap text-muted-foreground">
                {body || "(Chưa nhập nội dung)"}
              </p>
            </div>

            <div className="flex gap-3 rounded-xl border border-warning/40 bg-warning-soft p-4">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden />
              <div>
                <p className="font-semibold text-foreground">Sau khi gửi sẽ không sửa được</p>
                <p className="text-sm text-muted-foreground">
                  Thông báo sẽ tới 76 người (38 học sinh + 38 phụ huynh). Hệ thống sẽ gửi lại đường link
                  và ghi nhận trạng thái từng người. Bạn vẫn có thể đóng thông báo bất cứ lúc nào.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Điều hướng */}
        <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Huỷ
          </Button>
          <div className="flex gap-2">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
                Quay lại
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
                Tiếp tục
              </Button>
            ) : (
              <Button onClick={onClose}>
                <Send className="size-4" aria-hidden />
                Gửi tới 76 người
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ChoiceCard({
  active,
  onClick,
  icon: Icon,
  title,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Bell;
  title: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex min-h-24 cursor-pointer flex-col items-start gap-1.5 rounded-lg border p-4 text-left transition-colors duration-200",
        active ? "border-primary bg-primary-soft" : "border-border bg-card hover:bg-muted",
      )}
    >
      <span className={cn("flex size-9 items-center justify-center rounded-lg", active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
        <Icon className="size-5" aria-hidden />
      </span>
      <span className={cn("text-sm font-semibold", active ? "text-primary" : "text-foreground")}>
        {title}
      </span>
      <span className="text-xs leading-relaxed text-muted-foreground">{hint}</span>
    </button>
  );
}

/* ============================================================
   INBOX (HS / PHHS view)
   ============================================================ */
function NotificationInbox() {
  const { user } = useRole();
  const [active, setActive] = useState<Notification | null>(null);

  if (active) {
    return (
      <div className="space-y-5">
        <Button variant="outline" onClick={() => setActive(null)}>
          ← Quay lại danh sách
        </Button>

        <Card>
          <CardContent className="p-5 lg:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge tone={active.type === "thiep" ? "success" : "primary"}>
                {active.type === "thiep" ? "Thiệp điện tử" : "Thông báo"}
              </StatusBadge>
              <span className="text-sm text-muted-foreground">{active.createdAt}</span>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
              {active.title}
            </h1>
            <p className="mt-3 text-base leading-relaxed whitespace-pre-wrap text-muted-foreground">
              {active.body}
            </p>
            <p className="mt-4 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
              Người gửi: Cô Nguyễn Thị Mai — Giáo viên chủ nhiệm lớp 10A1
            </p>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button size="lg">
                <MailCheck className="size-4" aria-hidden />
                Tôi đã đọc và xác nhận
              </Button>
              <Button size="lg" variant="outline">
                Cần hỗ trợ thêm
              </Button>
            </div>
            {active.deadline && (
              <p className="mt-3 text-sm font-medium text-warning">
                Vui lòng xác nhận trước {active.deadline}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const list = notifications.filter((n) =>
    user.short === "HS" ? n.audience === "Học sinh" || n.audience === "Cả hai" : true,
  );

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
          Thông báo & Thiệp
        </h1>
        <p className="text-sm text-muted-foreground">
          Các thông báo cô gửi cho bạn. Bấm vào thông báo để đọc và xác nhận.
        </p>
      </header>

      <ul className="space-y-3">
        {list.map((n) => (
          <li key={n.id}>
            <button
              type="button"
              onClick={() => setActive(n)}
              className="w-full rounded-xl border border-border bg-card p-4 text-left transition-colors duration-200 hover:bg-muted lg:p-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge tone={n.type === "thiep" ? "success" : "primary"}>
                  {n.type === "thiep" ? "Thiệp điện tử" : "Thông báo"}
                </StatusBadge>
                <span className="text-xs text-muted-foreground">{n.createdAt}</span>
                {n.deadline && <StatusBadge tone="warning">Cần xác nhận</StatusBadge>}
              </div>
              <p className="mt-2 text-base font-semibold text-foreground">{n.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{n.body}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}