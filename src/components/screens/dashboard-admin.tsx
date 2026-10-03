"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3,
  FolderArchive,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { LinkButton } from "@/components/link-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRole } from "@/components/role-provider";
import {
  classCompletionRows,
  evidences,
  monthlyParticipation,
  schoolOverviewStats,
} from "@/lib/data";

const pieData = [
  { name: "Thông báo", value: 1180 },
  { name: "Khảo sát", value: 742 },
  { name: "Nhiệm vụ", value: 806 },
  { name: "Sinh hoạt", value: 419 },
];

const pieColors = ["var(--chart-1)", "var(--chart-4)", "var(--chart-2)", "var(--chart-3)"];

const statIcons = [
  GraduationCap,
  Users,
  FolderArchive,
  TrendingUp,
  ShieldCheck,
  BarChart3,
] as const;
const statTones = ["primary", "info", "success", "warning", "info", "primary"] as const;

export function DashboardAdmin() {
  const { user } = useRole();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 lg:p-6">
        <p className="text-sm text-muted-foreground">Tổng quan toàn trường</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
          {user.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{user.org}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <LinkButton href="/bao-cao">Xuất báo cáo toàn trường</LinkButton>
          <LinkButton href="/minh-chung" variant="outline">
            Kho minh chứng
          </LinkButton>
        </div>
      </section>

      <section aria-labelledby="school-stats">
        <h2 id="school-stats" className="mb-3 text-xl font-bold tracking-tight text-foreground">
          Chỉ số toàn trường
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {schoolOverviewStats.map((s, i) => (
            <StatCard
              key={s.label}
              label={s.label}
              value={s.value}
              unit={s.unit}
              icon={statIcons[i]}
              tone={statTones[i]}
            />
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tỉ lệ tham gia theo tháng</CardTitle>
            <CardDescription>Phần trăm học sinh và phụ huynh sử dụng hệ thống (%).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyParticipation}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={13} />
                  <YAxis tickLine={false} axisLine={false} fontSize={13} domain={[0, 100]} unit="%" />
                  <Tooltip
                    formatter={(v) => [`${v}%`, "Tỉ lệ tham gia"]}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      fontSize: 14,
                    }}
                  />
                  <Bar dataKey="value" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cơ cấu minh chứng</CardTitle>
            <CardDescription>Số hồ sơ minh chứng theo loại hoạt động.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={pieColors[i]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, n) => [`${v} hồ sơ`, n]}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      fontSize: 14,
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 13 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tiến độ theo lớp</CardTitle>
          <CardDescription>Tỉ lệ hoàn thành nhiệm vụ trong tháng của từng lớp.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 lg:hidden">
            {classCompletionRows.map((row) => (
              <li key={row.className} className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{row.className}</p>
                    <p className="text-sm text-muted-foreground">{row.teacher}</p>
                  </div>
                  <StatusBadge
                    tone={row.done >= 90 ? "success" : row.done >= 80 ? "info" : "warning"}
                  >
                    {row.done}%
                  </StatusBadge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{row.evidences} hồ sơ minh chứng</p>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full text-sm">
              <caption className="sr-only">Tiến độ hoàn thành nhiệm vụ theo từng lớp</caption>
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th scope="col" className="py-3 pr-4 font-medium">
                    Lớp
                  </th>
                  <th scope="col" className="py-3 pr-4 font-medium">
                    Chủ nhiệm
                  </th>
                  <th scope="col" className="py-3 pr-4 font-medium">
                    Tiến độ
                  </th>
                  <th scope="col" className="py-3 pr-4 font-medium">
                    Minh chứng
                  </th>
                </tr>
              </thead>
              <tbody>
                {classCompletionRows.map((row) => (
                  <tr key={row.className} className="border-b border-border last:border-0">
                    <th scope="row" className="py-3 pr-4 text-left font-semibold">
                      {row.className}
                    </th>
                    <td className="py-3 pr-4 text-muted-foreground">{row.teacher}</td>
                    <td className="py-3 pr-4">
                      <StatusBadge
                        tone={row.done >= 90 ? "success" : row.done >= 80 ? "info" : "warning"}
                      >
                        {row.done}% hoàn thành
                      </StatusBadge>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{row.evidences} hồ sơ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Minh chứng mới nhất toàn trường</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {evidences.slice(0, 4).map((e) => (
              <li
                key={e.id}
                className="flex flex-col gap-1 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{e.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {e.className} · {e.date}
                  </p>
                </div>
                <span className="font-mono text-xs font-semibold text-muted-foreground">
                  {e.evidenceCode}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}