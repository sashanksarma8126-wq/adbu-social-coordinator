"use client";

import { usePathname } from "next/navigation";
import { Bell, ShieldCheck, Cpu, HardDrive } from "lucide-react";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "University Communications Dashboard",
    subtitle: "Overview of Assam Don Bosco University social coordination & upcoming activities",
  },
  "/calendar": {
    title: "Editorial & Event Calendar",
    subtitle: "Schedule and manage university posts, notices, and campaigns",
  },
  "/content": {
    title: "Content Studio & Drafts",
    subtitle: "Draft, organize, and review university social posts",
  },
  "/media": {
    title: "Media Asset Library",
    subtitle: "Manage local event photographs, posters, and campus graphics",
  },
  "/ai-coordinator": {
    title: "AI Social Media Coordinator",
    subtitle: "Local offline-capable AI assistant for captions, hashtags, and campaign ideas",
  },
  "/knowledge-base": {
    title: "ADBU University Knowledge Base",
    subtitle: "Campus facts, department guidelines, and university branding rules",
  },
  "/settings": {
    title: "System & Local Configuration",
    subtitle: "Manage local storage, environment variables, and coordination preferences",
  },
};

export default function Header() {
  const pathname = usePathname();
  const current = pageTitles[pathname] || {
    title: "ADBU Social Coordinator",
    subtitle: "Internal University Communications Department",
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-800 tracking-tight leading-none">
          {current.title}
        </h2>
        <p className="text-xs text-slate-500 mt-1">{current.subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Local zero-cost status tag */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-medium text-emerald-700">
          <HardDrive className="h-3.5 w-3.5 text-emerald-600" />
          <span>Local SQLite</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-medium text-blue-700">
          <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
          <span>₹0 Budget Mode</span>
        </div>

        <div className="h-5 w-px bg-slate-200 hidden sm:block" />

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold">
            ADBU
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-700 leading-tight">Comms Officer</p>
            <p className="text-[10px] text-slate-400">Tapesia & Azara Campuses</p>
          </div>
        </div>
      </div>
    </header>
  );
}
