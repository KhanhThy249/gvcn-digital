import type { Metadata } from "next";

import { RoleScope } from "@/components/role-scope";
import { resolveRole } from "@/lib/resolve-role";
import { EvidenceScreen } from "@/components/screens/evidence-screen";

export const metadata: Metadata = {
  title: "Minh chứng",
  description: "Kho minh chứng công tác chủ nhiệm, có mã minh chứng và mã QR tra cứu.",
};

export default async function Page({ searchParams }: PageProps<"/minh-chung">) {
  const role = await resolveRole(searchParams);
  return (
    <RoleScope initialRole={role}>
      <EvidenceScreen />
    </RoleScope>
  );
}