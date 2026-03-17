export default function LeadActivationModal({ job, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 z-10">
        <h2 className="text-2xl font-black text-gray-900 mb-1">Lead Activation</h2>
        <p className="text-sm text-gray-500 mb-5">
          By confirming, you agree to depart for the customer's location immediately.
        </p>
        <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5">
            <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-orange-700 leading-relaxed">
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