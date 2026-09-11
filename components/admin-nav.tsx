"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  Building2,
  CalendarDays,
  Briefcase,
  Image as ImageIcon,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import { signOutAction } from "@/app/actions/auth";

const adminLinks = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Admissions", href: "/admin/admissions", icon: GraduationCap },
  { name: "Page Content", href: "/admin/content", icon: FileText },
  { name: "Media Library", href: "/admin/media", icon: ImageIcon },
  { name: "Campuses", href: "/admin/campuses", icon: Building2 },
  { name: "Intake Cycles", href: "/admin/cycles", icon: CalendarDays },
  { name: "Careers", href: "/admin/careers", icon: Briefcase },
  { name: "Site Settings", href: "/admin/settings", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 bg-space/60 p-6 flex flex-col justify-between shrink-0">
      <div>
        <div className="flex items-center gap-3 pb-6 border-b border-white/10">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-magenta/20 border border-magenta/40 text-magenta">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <span className="font-heading text-sm font-bold tracking-tight text-white block">
              Al-Ihsan Admin
            </span>
            <span className="text-[10px] text-gold uppercase tracking-wider block">
              Control Panel
            </span>
          </div>
        </div>

        <nav className="mt-6 flex flex-col gap-1.5">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  isActive
                    ? "bg-magenta text-white shadow-md shadow-magenta/20"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-white/10 mt-6">
        <form action={signOutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}