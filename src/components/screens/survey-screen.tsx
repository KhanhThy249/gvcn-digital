"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  EyeOff,
  Plus,
  Send,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { StatusBadge, TaskStatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRole } from "@/components/role-provider";
import { surveyResultScale, surveyResultSubject, surveys } from "@/lib/data";
import { cn } from "@/lib/utils";

export function SurveyScreen() {
  const { role } = useRole();
  const isTeacher = role === "gvcn" || role === "admin";
  const [tab, setTab] = useState(isTeacher ? "list" : "take");

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
          {isTeacher ? "Khảo sát học sinh" : "Khảo sát"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isTeacher
            ? "Tạo khảo sát, chọn đối tượng, đặt thời gian mở/đóng. Hệ thống tự tổng hợp kết quả và tạo biểu đồ."
            : "Chọn khảo sát bên dưới để bắt đầu. Thời gian khoảng 5 phút."}
        </p>
      </header>

      {isTeacher ? (
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="list" className="min-h-11">
              Danh sách khảo sát
            </TabsTrigger>
            <TabsTrigger value="create" className="min-h-11">
              Tạo khảo sát
            </TabsTrigger>
            <TabsTrigger value="result" className="min-h-11">
              Kết quả tổng hợp
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-5">
            <ul className="space-y-3">
              {surveys.map((s) => (
                <li key={s.id}>
                  <Card>
                    <CardContent className="p-4 lg:p-5">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <TaskStatusBadge status={s.status} />
                            <span className="text-xs text-muted-foreground">
                              {s.audience}
                            </span>
                            {s.anonymous && (
                              <StatusBadge tone="info" icon={<EyeOff className="size-3.5" aria-hidden />}>
                                Ẩn danh
                              </StatusBadge>
                            )}
                          </div>
                          <h2 className="mt-2 text-lg font-semibold text-foreground">{s.title}</h2>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            {s.description}
                          </p>
                          <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CalendarClock className="size-3.5" aria-hidden />
                            Mở {s.openAt} · Đóng {s.closeAt} · {s.questions.length} câu hỏi
                          </p>
                        </div>
                        <div className="shrink-0">
                          <p className="text-xs font-medium text-muted-foreground">Đã trả lời</p>
                          <p className="mt-1 text-2xl font-bold text-foreground">
                            {s.responses}
                            <span className="text-base font-normal text-muted-foreground">
                              /{s.totalTarget}
                            </span>
                          </p>
                          <div className="mt-2 h-2 w-32 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-success"
                              style={{
                                width: `${Math.round((s.responses / s.totalTarget) * 100)}%`,
                              }}
                              role="progressbar"
                              aria-valuenow={Math.round((s.responses / s.totalTarget) * 100)}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-label={`Tỉ lệ trả lời: ${Math.round((s.responses / s.totalTarget) * 100)}%`}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="create" className="mt-5">
            <SurveyWizard />
          </TabsContent>

          <TabsContent value="result" className="mt-5">
            <SurveyResults />
          </TabsContent>
        </Tabs>
      ) : (
        <SurveyTaker />
      )}
    </div>
  );
}

/* ============================================================
   WIZARD
   ============================================================ */
const surveySteps = [
  { n: 1, label: "Nội dung" },
  { n: 2, label: "Đối tượng & thời gian" },
  { n: 3, label: "Kiểm tra & gửi" },
];

function SurveyWizard() {
  const [step, setStep] = useState(1);
  const [anonymous, setAnonymous] = useState(true);
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tạo khảo sát mới</CardTitle>
        <CardDescription>3 bước đơn giản. Không cần biết kỹ thuật.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
          {surveySteps.map((s) => (
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
              {s.n < surveySteps.length && (
                <span className="mx-1 hidden h-px w-6 bg-border sm:block" aria-hidden />
              )}
            </li>
          ))}
        </ol>

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="sv-title" className="text-sm font-semibold">
                Tên khảo sát <span className="text-danger">*</span>
              </Label>
              <Input
                id="sv-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Khảo sát sở thích và học tập"
                className="min-h-11"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sv-q1" className="text-sm font-semibold">
                Câu hỏi đầu tiên <span className="text-danger">*</span>
              </Label>
              <Input
                id="sv-q1"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ví dụ: Em thích học môn nào nhất?"
                className="min-h-11"
              />
            </div>

            <div className="rounded-xl border border-info/30 bg-info-soft p-4">
              <p className="flex items-center gap-2 font-semibold text-foreground">
                <EyeOff className="size-4" aria-hidden />
                Khảo sát ẩn danh
              </p>
              <label className="mt-2 flex min-h-12 cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="size-5 accent-[var(--primary)]"
                />
                <span className="text-sm text-foreground">
                  Cho phép học sinh trả lời mà không ghi tên
                </span>
              </label>
              <p className="mt-2 text-sm text-muted-foreground">
                Hệ thống vẫn biết học sinh nào đã hoàn thành để báo cáo tiến độ, nhưng kết quả trả lời
                sẽ không ghi tên. Điều này giúp học sinh nói thật hơn.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="sv-audience" className="text-sm font-semibold">
                Ai được khảo sát?
              </Label>
              <select
                id="sv-audience"
                className="min-h-11 w-full cursor-pointer rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground"
                defaultValue="Học sinh lớp 10A1"
              >
                <option>Học sinh lớp 10A1</option>
                <option>Phụ huynh lớp 10A1</option>
                <option>Học sinh + Phụ huynh</option>
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="sv-open" className="text-sm font-semibold">
                  Mở lúc
                </Label>
                <Input id="sv-open" type="date" defaultValue="2026-10-10" className="min-h-11" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sv-close" className="text-sm font-semibold">
                  Đóng lúc
                </Label>
                <Input id="sv-close" type="date" defaultValue="2026-10-17" className="min-h-11" />
              </div>
            </div>
            <p className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
              <CalendarClock className="mt-0.5 size-4 shrink-0" aria-hidden />
              Đến giờ đóng, hệ thống tự động khoá khảo sát và gửi báo cáo tới bạn.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <p className="text-xs font-semibold text-muted-foreground">Xem trước</p>
              <h3 className="mt-1.5 text-lg font-bold text-foreground">
                {title || "(Chưa nhập tên khảo sát)"}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Câu 1: {question || "(Chưa nhập câu hỏi)"}
              </p>
              <div className="mt-3">
                <StatusBadge tone="info">
                  {anonymous ? "Ẩn danh" : "Có ghi tên"}
                </StatusBadge>
              </div>
            </div>
            <div className="rounded-xl border border-warning/40 bg-warning-soft p-4">
              <p className="font-semibold text-foreground">
                Hệ thống sẽ tạo đường link gửi tới 38 học sinh lớp 10A1
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Bạn có thể gửi qua Zalo, thông báo giấy hoặc dán trên nhóm lớp. Hệ thống theo dõi ai
                đã làm, ai chưa làm.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:justify-between">
          <Button variant="outline">Lưu nháp</Button>
          <div className="flex gap-2">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
                Quay lại
              </Button>
            )}
            {step < 3 ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
                disabled={step === 1 && (title.trim().length < 3 || question.trim().length < 3)}
              >
                Tiếp tục
              </Button>
            ) : (
              <Button>
                <Send className="size-4" aria-hidden />
                Tạo và gửi
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ============================================================
   RESULTS
   ============================================================ */
const barColors = ["var(--chart-1)", "var(--chart-4)", "var(--chart-2)", "var(--chart-3)", "var(--chart-5)", "var(--chart-1)"];

function ResultBarChart({
  title,
  question,
  data,
}: {
  title: string;
  question: string;
  data: typeof surveyResultSubject;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{question}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 16, right: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} fontSize={13} />
              <YAxis type="category" dataKey="label" width={90} tickLine={false} axisLine={false} fontSize={13} />
              <Tooltip
                formatter={(v) => [`${v} lượt`, "Số phiếu"]}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  fontSize: 14,
                }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {data.map((_, i) => (
                  <Cell key={i} fill={barColors[i % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Dữ liệu dạng bảng — không chỉ dựa vào biểu đồ */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">{question}</caption>
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th scope="col" className="py-2 pr-4 font-medium">
                  Lựa chọn
                </th>
                <th scope="col" className="py-2 pr-4 font-medium">
                  Số phiếu
                </th>
                <th scope="col" className="py-2 font-medium">
                  Tỉ lệ
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.label} className="border-b border-border last:border-0">
                  <th scope="row" className="py-2 pr-4 text-left font-medium">
                    {row.label}
                  </th>
                  <td className="py-2 pr-4 text-muted-foreground">{row.value}</td>
                  <td className="py-2">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2 w-16 overflow-hidden rounded-full bg-muted">
                        <span
                          className="block h-full rounded-full bg-primary"
                          style={{ width: `${row.percentage}%` }}
                        />
                      </span>
                      <span className="font-medium">{row.percentage}%</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function SurveyResults() {
  return (
    <div className="space-y-5">
      <Card className="border-primary/30 bg-primary-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="size-5 text-primary" aria-hidden />
            Tóm tắt bằng AI
          </CardTitle>
          <CardDescription className="text-foreground/70">
            Hệ thống đọc 31 phiếu trả lời và tự rút ra điểm chính, giúp thầy cô nắm nhanh.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm leading-relaxed text-foreground">
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
              68% học sinh đánh giá bài giảng dễ hiểu (23/31 phiếu).
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
              Toán là môn được yêu thích nhất (29%), Ngữ Văn và Anh theo sau.
            </li>
            <li className="flex gap-2">
              <AlertTriangleIcon />
              3 học sinh cho đánh giá “khó hiểu”, tập trung ở phần bài tập về đạo hàm.
            </li>
            <li className="flex gap-2">
              <TrendingUp className="mt-0.5 size-4 shrink-0 text-info" aria-hidden />
              Gợi ý: nên tăng thời lượng thực hành và tổ chức nhóm hỗ trợ cho 3 em này.
            </li>
          </ul>
        </CardContent>
      </Card>

      <ResultBarChart
        title="Câu 1 · Em thích học môn nào nhất?"
        question="31 lượt trả lời · Đồ thị thanh ngang"
        data={surveyResultSubject}
      />
      <ResultBarChart
        title="Câu 2 · Em thấy bài giảng dễ hiểu không?"
        question="31 lượt trả lời · Thang 5 mức"
        data={surveyResultScale}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ý kiến tự do của học sinh</CardTitle>
          <CardDescription>
            Hệ thống tự phân loại ý kiến theo chủ đề, không cần đọc từng câu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {[
              { topic: "Thời lượng thực hành", count: 9, tone: "info" as const },
              { topic: "Cách giảng bài", count: 7, tone: "success" as const },
              { topic: "Cơ sở vật chất", count: 5, tone: "warning" as const },
              { topic: "Lịch học", count: 3, tone: "neutral" as const },
            ].map((t) => (
              <li
                key={t.topic}
                className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
              >
                <StatusBadge tone={t.tone}>{t.topic}</StatusBadge>
                <span className="text-sm font-medium text-muted-foreground">{t.count} ý kiến</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function AlertTriangleIcon() {
  return (
    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-warning-soft text-xs font-bold text-warning">
      !
    </span>
  );
}

/* ============================================================
   TAKER (HS / PHHS)
   ============================================================ */
function SurveyTaker() {
  const open = surveys.filter((s) => s.status === "open");
  const [current, setCurrent] = useState<number | null>(null);

  if (current !== null) {
    const s = open[current];
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{s.title}</CardTitle>
          <CardDescription>{s.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Đã trả lời 0/{s.questions.length} câu
            </p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-0 rounded-full bg-primary" />
            </div>
          </div>

          {s.questions.map((q, qi) => (
            <fieldset key={q.id} className="space-y-2">
              <legend className="text-base font-semibold text-foreground">
                Câu {qi + 1}: {q.question}
              </legend>
              {q.type === "text" ? (
                <textarea
                  rows={4}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-base text-foreground"
                  placeholder="Viết câu trả lời của bạn..."
                  aria-label={`Trả lời câu ${qi + 1}`}
                />
              ) : (
                <div className="space-y-2">
                  {(q.options ?? []).map((opt) => (
                    <label
                      key={opt}
                      className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-border px-4 py-3 text-base transition-colors duration-200 hover:bg-muted"
                    >
                      <input
                        type={q.type === "multiple" ? "checkbox" : "radio"}
                        name={q.id}
                        className="size-5 accent-[var(--primary)]"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
            </fieldset>
          ))}

          <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setCurrent(null)}>
              Quay lại
            </Button>
            <Button>
              <CheckCircle2 className="size-4" aria-hidden />
              Gửi câu trả lời
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (open.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Hiện chưa có khảo sát nào đang mở"
        description="Khi cô giáo tạo khảo sát, bạn sẽ thấy nó ở đây kèm thời hạn cụ thể."
      />
    );
  }

  return (
    <ul className="space-y-3">
      {open.map((s, i) => (
        <li key={s.id}>
          <Card>
            <CardContent className="p-4 lg:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge tone="success">Đang mở</StatusBadge>
                {s.anonymous && (
                  <StatusBadge tone="info">Ẩn danh — không ghi tên bạn</StatusBadge>
                )}
              </div>
              <h2 className="mt-2 text-lg font-semibold text-foreground">{s.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Hạn trả lời: {s.closeAt} · {s.questions.length} câu hỏi
              </p>
              <Button className="mt-4 w-full sm:w-auto" onClick={() => setCurrent(i)}>
                <Plus className="size-4" aria-hidden />
                Bắt đầu khảo sát
              </Button>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}