"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Plus, Download } from "lucide-react";
import { panelTitles } from "@/lib/nav";

export function Topbar() {
  const pathname = usePathname();
  const key = pathname.replace(/^\//, "");
  const title = panelTitles[key] ?? "";

  // Right-side action buttons per panel
  let action: React.ReactNode = null;
  if (key === "gc/subcontractors") {
    action = (
      <Link href="#" className="btn btn-primary btn-sm">
        <Plus size={14} /> Add subcontractor
      </Link>
    );
  } else if (key === "gc/lien-waivers" || key === "accounting/liens") {
    action = (
      <button className="btn btn-sm">
        <Download size={14} /> Export
      </button>
    );
  }

  return (
    <div className="h-[52px] bg-bg-primary border-b border-border-subtle flex items-center px-5 gap-3">
      <div className="text-[15px] font-medium flex-1">{title}</div>
      <div>{action}</div>
    </div>
  );
}
