import type { Metadata } from "next";

import { RoleScope } from "@/components/role-scope";
import { resolveRole } from "@/lib/resolve-role";
import { ClassScreen } from "@/components/screens/class-screen";

export const metadata: Metadata = {
  title: "Lớp học",
  description: "Danh sách học sinh, hồ sơ học sinh và đồng bộ từ LMS.",
};

export default async function Page({ searchParams }: PageProps<"/lop-hoc">) {
  const role = await resolveRole(searchParams);
  return (
    <RoleScope initialRole={role}>
      <ClassScreen />
    </RoleScope>
  );
}