import type { Metadata } from "next";

import { RoleScope } from "@/components/role-scope";
import { resolveRole } from "@/lib/resolve-role";
import { TaskScreen } from "@/components/screens/task-screen";

export const metadata: Metadata = {
  title: "Nhiệm vụ",
  description: "Giao và theo dõi nhiệm vụ cho học sinh, phụ huynh.",
};

export default async function Page({ searchParams }: PageProps<"/nhiem-vu">) {
  const role = await resolveRole(searchParams);
  return (
    <RoleScope initialRole={role}>
      <TaskScreen />
    </RoleScope>
  );
}