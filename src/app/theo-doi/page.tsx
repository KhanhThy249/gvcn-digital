import type { Metadata } from "next";

import { RoleScope } from "@/components/role-scope";
import { resolveRole } from "@/lib/resolve-role";
import { TrackingScreen } from "@/components/screens/tracking-screen";

export const metadata: Metadata = {
  title: "Theo dõi tiến độ",
  description: "Theo dõi ai đã làm, chưa làm, đã xem, đã xác nhận, đúng hạn hoặc quá hạn.",
};

export default async function Page({ searchParams }: PageProps<"/theo-doi">) {
  const role = await resolveRole(searchParams, "gvcn");
  return (
    <RoleScope initialRole={role}>
      <TrackingScreen />
    </RoleScope>
  );
}