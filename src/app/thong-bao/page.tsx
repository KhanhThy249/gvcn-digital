import type { Metadata } from "next";

import { RoleScope } from "@/components/role-scope";
import { resolveRole } from "@/lib/resolve-role";
import { NotificationScreen } from "@/components/screens/notification-screen";

export const metadata: Metadata = {
  title: "Thông báo & Thiệp",
  description: "Gửi thông báo và thiệp điện tử tới học sinh, phụ huynh. Biết ai đã xem, ai chưa xem.",
};

export default async function Page({ searchParams }: PageProps<"/thong-bao">) {
  const role = await resolveRole(searchParams);
  return (
    <RoleScope initialRole={role}>
      <NotificationScreen />
    </RoleScope>
  );
}