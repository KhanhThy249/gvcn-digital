import type { Metadata } from "next";

import { RoleScope } from "@/components/role-scope";
import { resolveRole } from "@/lib/resolve-role";
import { SurveyScreen } from "@/components/screens/survey-screen";

export const metadata: Metadata = {
  title: "Khảo sát",
  description: "Tạo khảo sát, chọn đối tượng, đặt thời gian và xem kết quả tổng hợp.",
};

export default async function Page({ searchParams }: PageProps<"/khao-sat">) {
  const role = await resolveRole(searchParams);
  return (
    <RoleScope initialRole={role}>
      <SurveyScreen />
    </RoleScope>
  );
}