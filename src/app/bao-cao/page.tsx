import type { Metadata } from "next";

import { RoleScope } from "@/components/role-scope";
import { resolveRole } from "@/lib/resolve-role";
import { ReportScreen } from "@/components/screens/report-screen";

export const metadata: Metadata = {
  title: "Báo cáo",
  description: "Tổng hợp số liệu và xuất báo cáo công tác chủ nhiệm ra PDF.",
};

export default async function Page({ searchParams }: PageProps<"/bao-cao">) {
  const role = await resolveRole(searchParams);
  return (
    <RoleScope initialRole={role}>
      <ReportScreen />
    </RoleScope>
  );
}