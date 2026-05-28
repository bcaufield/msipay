"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Warehouse } from "lucide-react";
import * as Icons from "lucide-react";
import { navConfig, isRole, type Role } from "@/lib/nav";
import { RoleSwitcher } from "./role-switcher";

export function Sidebar() {
  const pathname = usePathname();
  const [, roleSeg, panelSeg = ""] = pathname.split("/");
  const role: Role = isRole(roleSeg) ? roleSeg : "gc";
  const panel = panelSeg;
  return (
    <aside className="w-[220px] flex-shrink-0 bg-bg-primary border-r border-border-subtle flex flex-col">
      <div className="px-4 pt-4 pb-3 border-b border-border-subtle">
        <div className="text-[15px] font-medium flex items-center gap-1.5">
          <Warehouse size={16} className="text-brand" />
          MSI Pay
        </div>
        <div className="text-[11px] text-fg-secondary mt-0.5">
          Miami Systems Inc.
        </div>
      </div>
      <RoleSwitcher />
      <nav className="flex-1 py-2 overflow-y-auto">
        <div className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-wider text-fg-tertiary">
          Navigation
        </div>
        {navConfig[role].map((item) => {
          const active = item.panel === panel;
          const Icon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[item.icon];
          return (
            <Link
              key={item.panel}
              href={`/${role}/${item.panel}`}
              className={`flex items-center gap-2 px-4 py-1.5 text-[13px] transition-colors ${
                active
                  ? "bg-bg-secondary text-fg-primary font-medium border-r-2 border-brand"
                  : "text-fg-secondary hover:bg-bg-secondary hover:text-fg-primary"
              }`}
            >
              {Icon ? <Icon size={15} /> : null}
              <span>{item.label}</span>
              {item.badge ? (
                <span className="ml-auto bg-danger text-white text-[10px] px-1.5 py-px rounded-full font-medium">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
