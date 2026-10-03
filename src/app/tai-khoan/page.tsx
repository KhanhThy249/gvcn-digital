import type { Metadata } from "next";

import { RoleScope } from "@/components/role-scope";
import { resolveRole } from "@/lib/resolve-role";
import { AccountScreen } from "@/components/screens/account-screen";

export const metadata: Metadata = {
  title: "Tài khoản & Phân quyền",
  description: "Quản lý tài khoản, phân quyền và nhật ký hoạt động.",
};

export default async function Page({ searchParams }: PageProps<"/tai-khoan">) {
  const role = await resolveRole(searchParams, "admin");
  return (
    <RoleScope initialRole={role}>
      <AccountScreen />
    </RoleScope>
  );
}