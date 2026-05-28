"use client";

import { useRouter, usePathname } from "next/navigation";
import { navConfig, isRole, type Role, roleLabels } from "@/lib/nav";

export function RoleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [, roleSeg] = pathname.split("/");
  const role: Role = isRole(roleSeg) ? roleSeg : "gc";
  return (
    <div className="px-3 py-2.5 border-b border-border-subtle">
      <div className="text-[10px] uppercase tracking-wider text-fg-tertiary mb-1">
        Viewing as
      </div>
      <select
        value={role}
        onChange={(e) => {
          const newRole = e.target.value as Role;
          const firstPanel = navConfig[newRole][0].panel;
          router.push(`/${newRole}/${firstPanel}`);
        }}
        className="w-full text-xs px-2 py-1.5 rounded-md border border-border bg-bg-secondary text-fg-primary cursor-pointer"
      >
        {(Object.keys(roleLabels) as Role[]).map((r) => (
          <option key={r} value={r}>{roleLabels[r]}</option>
        ))}
      </select>
    </div>
  );
}
