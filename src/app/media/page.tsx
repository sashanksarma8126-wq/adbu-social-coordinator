import { Image as ImageIcon, Upload, HardDrive, FolderOpen } from "lucide-react";

export default function MediaLibraryPage() {
  const folders = [
    { name: "Convocation 2026", count: "12 files", size: "38 MB" },
    { name: "Campus Photography", count: "45 files", size: "142 MB" },
    { name: "Department Posters & Flyers", count: "18 files", size: "26 MB" },
    { name: "Official Logos & Badges", count: "8 files", size: "5 MB" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Media Asset Library</h2>
          <p className="text-xs text-slate-500 mt-1">
            Zero-cloud, local disk storage for campus photography, flyers, and promotional graphics
          </p>
        </div>
        <button
          disabled
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 border border-slate-200 rounded-lg text-xs font-semibold cursor-not-allowed"
          title="Will be enabled in subsequent milestones"
        >
          <Upload className="w-4 h-4" />
          Upload Media (Upcoming)
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {folders.map((folder, idx) => (
          <div
            key={idx}
            className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg">
                <FolderOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-slate-800 truncate">{folder.name}</h3>
                <p className="text-[11px] text-slate-400">{folder.count}</p>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-2 flex justify-between">
              <span>Local storage</span>
              <span className="font-mono text-slate-600 font-semibold">{folder.size}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-12 text-center">
        <div className="inline-flex p-3 rounded-full bg-slate-100 text-slate-500 mb-3">
          <HardDrive className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-700">Local Asset Storage Ready</h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
          Media will be stored directly on local machine storage, ensuring ₹0 cloud hosting fees
          and complete university data privacy.
        </p>
      </div>
    </div>
  );
}
