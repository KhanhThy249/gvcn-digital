"use client";

import { RoleProvider } from "@/components/role-provider";
import { AppShell } from "@/components/app-shell";
import type { Role } from "@/lib/types";

const valid: Role[] = ["gvcn", "student", "parent", "admin"];

/**
 * Wraps a page with the role context and the app shell (sidebar + bottom nav).
 * `initialRole` lets a link open the page as a specific persona, e.g. /thong-bao?vai=parent
 */
export function RoleScope({
  initialRole = "gvcn",
  children,
}: {
  initialRole?: Role;
  children: React.ReactNode;
}) {
  const role = valid.includes(initialRole) ? initialRole : "gvcn";
  return (
    <RoleProvider defaultRole={role}>
      <AppShell>{children}</AppShell>
    </RoleProvider>
  );
}