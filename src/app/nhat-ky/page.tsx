import type { Metadata } from "next";

import { RoleScope } from "@/components/role-scope";
import { resolveRole } from "@/lib/resolve-role";
import { AuditLog } from "@/components/screens/account-screen";

export const metadata: Metadata = {
  title: "Nhật ký hoạt động",
  description: "Lịch sử thao tác trên hệ thống để đối chiếu khi cần.",
};

export default async function Page({ searchParams }: PageProps<"/nhat-ky">) {
  const role = await resolveRole(searchParams, "admin");
  return (
    <RoleScope initialRole={role}>
      <div className="space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
            Nhật ký hoạt động
          </h1>
          <p className="text-sm text-muted-foreground">
            Mọi thao tác gửi thông báo, tạo khảo sát, giao nhiệm vụ và xuất báo cáo đều được ghi lại.
          </p>
        </header>
        <AuditLog />
      </div>
    </RoleScope>
  );
}