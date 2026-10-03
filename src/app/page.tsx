import type { Metadata } from "next";

import { RoleScope } from "@/components/role-scope";
import { DashboardRouter } from "@/components/dashboard-router";
import { resolveRole } from "@/lib/resolve-role";

export const metadata: Metadata = {
  title: "Tổng quan",
  description: "Công việc hôm nay, tin nhắn cần xử lý và tiến độ công tác chủ nhiệm.",
};

export default async function Page({ searchParams }: PageProps<"/">) {
  const role = await resolveRole(searchParams);
  return (
    <RoleScope initialRole={role}>
      <DashboardRouter />
    </RoleScope>
  );
}