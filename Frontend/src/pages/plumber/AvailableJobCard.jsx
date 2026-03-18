import { useState } from "react";
import CountdownTimer from "./CountdownTimer";

export default function AvailableJobCard({ job, onRequestClaim, blocked }) {
  const [claimed, setClaimed] = useState(false);

  const initials = (job.customerFullName || "C").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className={`bg-white border rounded-2xl p-4 sm:p-5 transition-all ${
      claimed ? "opacity-50 pointer-events-none" : "border-gray-200 hover:border-blue-200 hover:shadow-md"
    }`}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-black text-gray-600 flex-shrink-0">
            {initials}
          </div>
          <p className="text-sm font-black text-gray-900 truncate">{job.customerFullName || "Customer"}</p>
        </div>
        <CountdownTimer createdAt={job.createdAt} />
      </div>

      <div className="flex items-center gap-1.5 mb-2.5">
        <span className="text-blue-500">📍</span>
        <span className="text-xs text-gray-500 font-medium">
          {job.address || (job.subRegionId ? `Subregion ${job.subRegionId}` : "Location unavailable")}
        </span>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-3">
        {job.issueDetails}
      </p>

      <div className="flex justify-end">
        <button
          onClick={() => { if (!claimed && !blocked) onRequestClaim(job, () => setClaimed(true)); }}
          disabled={claimed || blocked}
          className={`px-6 py-2.5 rounded-xl text-sm font-black transition ${
            claimed || blocked
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200"
          }`}
        >
          {claimed ? "✓ Claimed" : blocked ? "Upgrade to Claim" : "Claim Job"}
        </button>
      </div>
    </div>
  );
}