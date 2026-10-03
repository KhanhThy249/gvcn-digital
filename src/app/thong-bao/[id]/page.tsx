import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarClock, CheckCircle2, GraduationCap, MailCheck, Users } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { notifications, evidences } from "@/lib/data";

export const metadata = {
  title: "Thông báo từ giáo viên chủ nhiệm",
  description: "Xem và xác nhận thông báo, thiệp điện tử từ giáo viên chủ nhiệm.",
};

export default async function PublicNotifyPage({ params }: PageProps<"/thong-bao/[id]">) {
  const { id } = await params;
  const n = notifications.find((x) => x.id === id);
  if (!n) notFound();

  const isCard = n.type === "thiep";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="truncate font-bold text-foreground">Trường THPT Trần Đăng Ninh</p>
            <p className="truncate text-xs text-muted-foreground">
              Hệ thống quản lý công tác chủ nhiệm
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <article className="overflow-hidden rounded-2xl border border-border bg-card">
          {/* Thiệp: có ảnh minh hoạ. Thông báo: không có. */}
          {isCard && (
            <div className="relative h-44 w-full bg-muted">
              <Image
                src="https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=900&q=70"
                alt="Thiệp cảm ơn phụ huynh"
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-cover"
              />
            </div>
          )}

          <div className="p-5 lg:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge tone={isCard ? "success" : "primary"}>
                {isCard ? "Thiệp điện tử" : "Thông báo"}
              </StatusBadge>
              <StatusBadge tone="info">
                <Users className="size-3.5" aria-hidden />
                Lớp {n.className}
              </StatusBadge>
            </div>

            <h1 className="mt-4 text-2xl leading-tight font-bold tracking-tight text-foreground lg:text-3xl">
              {n.title}
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Gửi lúc {n.createdAt} · Cô Nguyễn Thị Mai — Giáo viên chủ nhiệm lớp 10A1
            </p>

            <div className="mt-5 rounded-xl bg-muted/40 p-4 text-base leading-relaxed whitespace-pre-wrap text-foreground">
              {n.body}
            </div>

            {n.deadline && (
              <p className="mt-4 flex items-center gap-2 rounded-lg border border-warning/40 bg-warning-soft p-3 text-sm font-medium text-foreground">
                <CalendarClock className="size-4 shrink-0 text-warning" aria-hidden />
                Vui lòng xác nhận trước {n.deadline}
              </p>
            )}

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button size="lg" className="sm:flex-1">
                <MailCheck className="size-4" aria-hidden />
                Tôi đã đọc và xác nhận
              </Button>
              <Button size="lg" variant="outline" className="sm:flex-1">
                <CheckCircle2 className="size-4" aria-hidden />
                Tôi đã đọc
              </Button>
            </div>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Không cần đăng nhập. Chỉ cần bấm nút ở trên.
            </p>
          </div>
        </article>

        {/* Minh chứng liên quan */}
        <section aria-labelledby="rel-heading" className="mt-6">
          <h2 id="rel-heading" className="mb-3 text-lg font-semibold text-foreground">
            Minh chứng liên quan
          </h2>
          <ul className="space-y-2">
            {evidences
              .filter((e) => e.audience.includes("Phụ huynh") || e.category === "Thông báo")
              .slice(0, 3)
              .map((e) => (
                <li
                  key={e.id}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <p className="font-medium text-foreground">{e.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {e.date} · {e.evidenceCode}
                  </p>
                </li>
              ))}
          </ul>
        </section>
      </main>
    </div>
  );
}