"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Warehouse } from "lucide-react";
import * as Icons from "lucide-react";
import { navConfig, type Role } from "@/lib/nav";
import { UserMenu } from "./user-menu";

export function Sidebar({ role, userEmail }: { role: Role; userEmail: string }) {
  const pathname = usePathname();
  const [, , panelSeg = ""] = pathname.split("/");
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
      <UserMenu role={role} userEmail={userEmail} />
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
