import { Suspense } from "react";
import CampaignStudio from "./CampaignStudio";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AICoordinatorPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-xs">Loading ADBU AI Campaign Coordinator...</p>
        </div>
      }
    >
      <CampaignStudio />
    </Suspense>
  );
}
