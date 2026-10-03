"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRole } from "@/components/role-provider";
import { roles } from "@/lib/data";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

const roleOrder: Role[] = ["gvcn", "student", "parent", "admin"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role, setRole, user, nav } = useRole();
  const [mobileOpen, setMobileOpen] = useState(false);

  const bottomItems = nav.slice(0, 5);
  const isActiveHref = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="no-print sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-sidebar lg:flex xl:w-72">
        <div className="flex items-center gap-3 border-b border-border px-5 py-5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-sidebar-foreground">GVCN Digital</p>
            <p className="truncate text-xs text-muted-foreground">THPT Trần Đăng Ninh</p>
          </div>
        </div>

        <nav aria-label="Điều hướng chính" className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {nav.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveHref(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-muted",
                    )}
                  >
                    <Icon className="size-5 shrink-0" aria-hidden />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-border p-3">
          <RoleSwitcher role={role} onChange={setRole} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="no-print sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 lg:px-6">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="size-5" aria-hidden />
              ) : (
                <Menu className="size-5" aria-hidden />
              )}
            </Button>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground lg:hidden">
                GVCN Digital
              </p>
              <p className="hidden truncate text-sm text-muted-foreground lg:block">{user.org}</p>
            </div>

            <div className="lg:hidden">
              <RoleSwitcher role={role} onChange={setRole} compact />
            </div>
          </div>

          {mobileOpen && (
            <nav aria-label="Điều hướng chính" className="border-t border-border bg-card lg:hidden">
              <ul className="max-h-[70vh] space-y-1 overflow-y-auto px-3 py-3">
                {nav.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveHref(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-foreground hover:bg-muted",
                        )}
                      >
                        <Icon className="size-5 shrink-0" aria-hidden />
                        <span className="min-w-0">
                          <span className="block truncate">{item.label}</span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
        </header>

        <main id="main-content" className="flex-1 px-4 pt-5 pb-24 lg:px-8 lg:pt-7 lg:pb-10">
          {children}
        </main>

        <nav
          aria-label="Điều hướng nhanh"
          className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card lg:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <ul className="grid grid-cols-5">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveHref(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex min-h-16 flex-col items-center justify-center gap-1 px-1 py-2 text-[0.7rem] font-medium",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    <Icon className="size-5" aria-hidden />
                    <span className="line-clamp-2 text-center leading-tight">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}

function RoleSwitcher({
  role,
  onChange,
  compact = false,
}: {
  role: Role;
  onChange: (role: Role) => void;
  compact?: boolean;
}) {
  const user = roles[role];
  const selectId = compact ? "role-switch-compact" : "role-switch";

  return (
    <div className={cn("w-full", compact && "w-auto")}>
      <Label htmlFor={selectId} className={cn("mb-1 block text-xs font-medium", compact && "sr-only")}>
        {compact ? "Xem với tư cách" : "Đang xem với tư cách"}
      </Label>
      <select
        id={selectId}
        value={role}
        onChange={(e) => onChange(e.target.value as Role)}
        className={cn(
          "min-h-11 w-full cursor-pointer rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted",
          compact && "max-w-[9.5rem]",
        )}
      >
        {roleOrder.map((r) => (
          <option key={r} value={r}>
            {roles[r].label}
          </option>
        ))}
      </select>
      {!compact && (
        <p className="mt-2 truncate text-xs text-muted-foreground">
          {user.name} · {user.org}
        </p>
      )}
    </div>
  );
}