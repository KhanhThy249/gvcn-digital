"use client";

import { createContext, useContext, useMemo, useState } from "react";

import type { Role } from "@/lib/types";
import { navigationByRole } from "@/lib/navigation";
import { roles } from "@/lib/data";

interface RoleContextValue {
  role: Role;
  setRole: (role: Role) => void;
  user: (typeof roles)[Role];
  nav: (typeof navigationByRole)[Role];
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({
  defaultRole,
  children,
}: {
  defaultRole: Role;
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<Role>(defaultRole);
  const value = useMemo(
    () => ({ role, setRole, user: roles[role], nav: navigationByRole[role] }),
    [role],
  );
  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) {
    throw new Error("useRole phải được dùng bên trong RoleProvider");
  }
  return ctx;
}