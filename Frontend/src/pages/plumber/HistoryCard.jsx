// src/pages/plumber/HistoryCard.jsx
export default function HistoryCard({ job }) {
  const s = job.status?.toLowerCase() || "";

  const badge =
    s === "matched" || s === "accepted"
      ? { label: "ACCEPTED", cls: "bg-green-50 text-green-600 border-green-200" }
      : s === "cancelled" || s === "canceled"
      ? { label: "CANCELLED", cls: "bg-orange-50 text-orange-500 border-orange-200" }
      : s === "rejected"
      ? { label: "REJECTED", cls: "bg-red-50 text-red-500 border-red-200" }
      : { label: s.toUpperCase() || "UNKNOWN", cls: "bg-gray-50 text-gray-500 border-gray-200" };

  // Inline formatDate function
  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = d.getFullYear();
    const hh = d.getHours();
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${dd}-${mm}-${yy} ${hh}:${min}`;
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-gray-400 font-mono">Job #{job.jobId}</p>
        <span className={`text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${badge.cls}`}>
          {badge.label}
        </span>
      </div>
      <p className="text-sm font-semibold text-gray-800">"{job.issueDetails}"</p>
      {job.createdAt && <p className="text-[11px] text-gray-400">Posted: {formatDate(job.createdAt)}</p>}
      {job.finalStatusTime && <p className="text-[11px] text-gray-400">Completed: {formatDate(job.finalStatusTime)}</p>}
    </div>
  );
}
