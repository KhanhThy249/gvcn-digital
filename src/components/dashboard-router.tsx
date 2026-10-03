"use client";

import { useRole } from "@/components/role-provider";
import { DashboardGVCN } from "@/components/screens/dashboard-gvcn";
import { DashboardStudent } from "@/components/screens/dashboard-student";
import { DashboardParent } from "@/components/screens/dashboard-parent";
import { DashboardAdmin } from "@/components/screens/dashboard-admin";

export function DashboardRouter() {
  const { role } = useRole();
  if (role === "student") return <DashboardStudent />;
  if (role === "parent") return <DashboardParent />;
  if (role === "admin") return <DashboardAdmin />;
  return <DashboardGVCN />;
}