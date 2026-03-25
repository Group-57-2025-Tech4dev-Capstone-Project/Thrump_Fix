import Warning from "../../assets/Warning.svg?react"

export default function LeadActivationModal({ job, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-white/40 backdrop-blur-md" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 z-10">
        <h2 className="text-[22px] font-extrabold text-gray-900 mb-2">Lead Activation</h2>
        <p className="text-sm text-gray-500 mb-5">
          By confirming, you agree to depart for the customer's location immediately.
        </p>
        <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-6">
          <Warning/>
          <p className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 mb-6">
            <span className="font-black">Warning:</span> Frequent cancellations after lead activation may result in temporary account suspension.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onCancel} disabled={loading} className="flex-1 text-sm font-semibold text-gray-600 hover:text-gray-900 py-3 rounded-xl border border-gray-200 transition disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 flex items-center justify-center gap-2 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 py-3 rounded-xl transition shadow-sm shadow-blue-200">
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Confirming...
              </>
            ) : "CONFIRM & DEPART NOW"}
          </button>
        </div>
      </div>
    </div>
  );
}