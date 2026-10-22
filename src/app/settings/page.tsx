import { Settings as SettingsIcon, Database, Server, Shield, HardDrive, Bell } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">System & Local Configuration</h2>
        <p className="text-xs text-slate-500 mt-1">
          Zero-cost local application configuration, storage preferences, and environment settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Local Environment Details */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 font-semibold text-sm text-slate-800">
            <Server className="w-4 h-4 text-blue-600" />
            Runtime Environment
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Framework</span>
              <span className="font-semibold text-slate-700">Next.js 14 (App Router)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Language</span>
              <span className="font-semibold text-slate-700">TypeScript</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Host Target</span>
              <span className="font-mono text-blue-600 font-medium">http://localhost:3000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Status</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active Localhost
              </span>
            </div>
          </div>
        </div>

        {/* Database Configuration */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 font-semibold text-sm text-slate-800">
            <Database className="w-4 h-4 text-indigo-600" />
            Database Settings
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Database Engine</span>
              <span className="font-semibold text-slate-700">SQLite (Zero Cloud Cost)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Database Location</span>
              <span className="font-mono text-slate-600 font-medium">./prisma/dev.db</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">ORM / Client</span>
              <span className="font-semibold text-slate-700">Prisma 5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Recurring Cloud Fee</span>
              <span className="font-semibold text-emerald-600">₹0 / month</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
