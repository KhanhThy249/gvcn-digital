"use client";

import { useState } from "react";
import { Bell, BellRing, CheckCircle2, Clock, Mail, ShieldCheck, UserCog } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { dashboardActivities, roles } from "@/lib/data";
import type { Role } from "@/lib/types";

export function AccountScreen() {
  const accounts: { role: Role; count: string; active: string }[] = [
    { role: "gvcn", count: "42", active: "42" },
    { role: "student", count: "1.582", active: "1.489" },
    { role: "parent", count: "1.410", active: "1.213" },
    { role: "admin", count: "9", active: "9" },
  ];

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
          Tài khoản & Phân quyền
        </h1>
        <p className="text-sm text-muted-foreground">
          Quản lý tài khoản và quyền truy cập của từng nhóm người dùng trong trường.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Giáo viên chủ nhiệm"
          value="42"
          unit="tài khoản"
          icon={UserCog}
          tone="primary"
        />
        <StatCard label="Học sinh" value="1.582" unit="tài khoản" icon={Mail} tone="info" />
        <StatCard label="Phụ huynh" value="1.410" unit="tài khoản" icon={Bell} tone="warning" />
        <StatCard
          label="Ban giám hiệu"
          value="9"
          unit="tài khoản"
          icon={ShieldCheck}
          tone="success"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Phân quyền theo vai trò</CardTitle>
          <CardDescription>Mỗi vai trò chỉ thấy đúng những chức năng cần dùng.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mobile cards */}
          <ul className="space-y-3 lg:hidden">
            {accounts.map((a) => (
              <li key={a.role} className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-foreground">{roles[a.role].label}</p>
                  <StatusBadge tone={a.active === a.count ? "success" : "warning"}>
                    {a.active}/{a.count} hoạt động
                  </StatusBadge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {roles[a.role].org || roles[a.role].label}
                </p>
              </li>
            ))}
          </ul>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full text-sm">
              <caption className="sr-only">Số tài khoản theo vai trò</caption>
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th scope="col" className="py-3 pr-4 font-medium">
                    Vai trò
                  </th>
                  <th scope="col" className="py-3 pr-4 font-medium">
                    Tổng tài khoản
                  </th>
                  <th scope="col" className="py-3 pr-4 font-medium">
                    Đang hoạt động
                  </th>
                  <th scope="col" className="py-3 font-medium">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((a) => (
                  <tr key={a.role} className="border-b border-border last:border-0">
                    <th scope="row" className="py-3 pr-4 text-left font-medium">
                      {roles[a.role].label}
                    </th>
                    <td className="py-3 pr-4 text-muted-foreground">{a.count}</td>
                    <td className="py-3 pr-4">
                      <StatusBadge tone={a.active === a.count ? "success" : "warning"}>
                        {a.active}
                      </StatusBadge>
                    </td>
                    <td className="py-3 text-right">
                      <Button variant="ghost" size="sm">
                        Quản lý
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AuditLog />
    </div>
  );
}

export function AuditLog() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShieldCheck className="size-5 text-primary" aria-hidden />
          Nhật ký hoạt động hệ thống
        </CardTitle>
        <CardDescription>Để đối chiếu khi cần. Chỉ Ban giám hiệu và quản trị viên xem được.</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="space-y-4">
          {dashboardActivities.map((a) => (
            <li key={a.id} className="flex gap-3">
              <span className="mt-1.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Clock className="size-3.5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-sm leading-relaxed text-foreground">{a.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {a.time} · Nguyễn Thị Mai
                </p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="size-4 text-success" aria-hidden />
          Không phát hiện hoạt động bất thường.
        </p>
      </CardContent>
    </Card>
  );
}

export function SettingsScreen() {
  const [sms, setSms] = useState(true);
  const [email, setEmail] = useState(false);
  const [autoEvidence, setAutoEvidence] = useState(true);
  const [autoClose, setAutoClose] = useState(true);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">Cài đặt</h1>
        <p className="text-sm text-muted-foreground">
          Tuỳ chỉnh cách hệ thống gửi thông báo và tự động tạo minh chứng.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cách nhận thông báo</CardTitle>
          <CardDescription>Chọn kênh bạn muốn nhận thông báo khi phụ huynh hoặc học sinh phản hồi.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ToggleRow
            id="set-sms"
            label="Tin nhắn SMS"
            hint="Gửi khi có phản hồi mới từ phụ huynh"
            checked={sms}
            onChange={setSms}
          />
          <ToggleRow
            id="set-email"
            label="Email"
            hint="Gửi bản tổng hợp cuối tuần"
            checked={email}
            onChange={setEmail}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tự động hóa</CardTitle>
          <CardDescription>Đây là điểm cốt lõi: mọi hoạt động đều tự trở thành minh chứng.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ToggleRow
            id="set-ev"
            label="Tự tạo minh chứng"
            hint="Mỗi thông báo, khảo sát, nhiệm vụ đều tự lưu thành hồ sơ có mã QR"
            checked={autoEvidence}
            onChange={setAutoEvidence}
          />
          <ToggleRow
            id="set-close"
            label="Tự đóng khảo sát đúng hạn"
            hint="Khảo sát tự khoá và gửi báo cáo khi tới giờ đóng"
            checked={autoClose}
            onChange={setAutoClose}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Thông báo nhắc nhở</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="flex items-center gap-2 text-muted-foreground">
            <BellRing className="size-4" aria-hidden />
            Nhắc trước hạn: 24 giờ
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <Clock className="size-4" aria-hidden />
            Giờ gửi nhắc: 07:30 sáng hôm sau
          </p>
        </CardContent>
      </Card>

      <Button size="lg">Lưu cài đặt</Button>
    </div>
  );
}

function ToggleRow({
  id,
  label,
  hint,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
      <div className="min-w-0">
        <Label htmlFor={id} className="text-base font-medium">
          {label}
        </Label>
        <p className="mt-0.5 text-sm text-muted-foreground">{hint}</p>
      </div>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 size-6 shrink-0 cursor-pointer accent-[var(--primary)]"
      />
    </div>
  );
}