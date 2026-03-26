// src/pages/plumber/HistoryCard.jsx
import Verified from "../../assets/Verified.svg?react";
import Address from "../../assets/Address.svg?react";
import Phone from "../../assets/Phone.svg?react";

export default function HistoryCard({ job }) {
  const status = job.status?.toLowerCase() || "";

  const getStatusBadge = () => {
    if (status === "accepted") return { label: "ACCEPTED", className: "bg-green-50 text-green-600 border border-green-200" };
    if (status === "cancelled" || status === "canceled") return { label: "CANCELLED", className: "bg-orange-50 text-orange-500 border border-orange-200" };
    if (status === "rejected") return { label: "REJECTED", className: "bg-red-50 text-red-500 border border-red-200" };
    return { label: status.toUpperCase() || "UNKNOWN", className: "bg-gray-50 text-gray-500 border border-gray-200" };
  };

  const badge = getStatusBadge();

  const customerInitials = job.customerFullName
    ? job.customerFullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "CU";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 font-manrope">

      {/* CUSTOMER INFORMATION */}
      <div className="mb-6">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-3">CUSTOMER INFORMATION</p>
        
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700 flex-shrink-0">
              {customerInitials}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[15px] font-semibold text-gray-900 truncate">{job.customerFullName || "Customer"}</p>
                <div className="flex items-center gap-1 text-green-600 text-xs flex-shrink-0">
                  <Verified className="w-4 h-4" />
                  <span className="font-medium">Verified</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-gray-600 mt-0.5">
                <span><Address/></span>
                <span className="truncate">
                  {job.address || `${job.stateName || ""}, ${job.localGovernmentName || ""}`}
                </span>
              </div>
            </div>
          </div>

          {job.customerPhoneNumber && (
            <a
              href={`tel:${job.customerPhoneNumber}`}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 transition flex-shrink-0"
            >
              <Phone/> {job.customerPhoneNumber}
            </a>
          )}
        </div>
      </div>

      {/* JOB DESCRIPTION */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-3">JOB DESCRIPTION</p>
        
        <div className="flex justify-between gap-6">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 mb-1.5 leading-tight">
              {job.issueDetails || "No job title"}
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              {job.fullDescription || job.issueDetails || "The customer needs urgent plumbing assistance."}
            </p>
          </div>

          <span className={`text-xs font-semibold uppercase tracking-widest px-3.5 py-1 rounded-full self-start mt-0.5 ${badge.className}`}>
            {badge.label}
          </span>
        </div>
      </div>
    </div>
  );
}