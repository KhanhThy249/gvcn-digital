import type { Role } from "@/lib/types";

const valid: Role[] = ["gvcn", "student", "parent", "admin"];

export async function resolveRole(
  searchParams: Promise<Record<string, string | string[] | undefined> | undefined>,
  fallback: Role = "gvcn",
): Promise<Role> {
  const params = await searchParams;
  const raw = params?.vai;
  const roleParam = Array.isArray(raw) ? raw[0] : raw;
  return valid.includes(roleParam as Role) ? (roleParam as Role) : fallback;
}