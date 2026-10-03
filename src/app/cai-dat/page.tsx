import type { Metadata } from "next";

import { RoleScope } from "@/components/role-scope";
import { resolveRole } from "@/lib/resolve-role";
import { SettingsScreen } from "@/components/screens/account-screen";

export const metadata: Metadata = {
  title: "Cài đặt",
  description: "Tuỳ chỉnh thông báo và tự động tạo minh chứng.",
};

export default async function Page({ searchParams }: PageProps<"/cai-dat">) {
  const role = await resolveRole(searchParams);
  return (
    <RoleScope initialRole={role}>
      <SettingsScreen />
    </RoleScope>
  );
}