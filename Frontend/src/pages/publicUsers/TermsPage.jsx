import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import route from "../../utils/routes";
import api from "../../utils/api";

export default function TermsPage() {
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        // Step 1 — get latest policy metadata (id, version, effectiveDate, documentName)
        const res = await api.get("/privacy-policy/latest");
        const { id, version, effectiveDate, documentName } = res.data;
        setMeta({ version, effectiveDate, documentName });

        // Step 2 — build PDF embed URL using the document endpoint
        const baseUrl = api.defaults.baseURL || "";
        const docUrl = `${baseUrl}/privacy-policy/document/${id}`;
        setPdfUrl(docUrl);
      } catch (err) {
        console.error("Failed to fetch policy:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(route.Signup);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 rounded-lg p-1.5">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12M10 4l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-bold text-blue-900 text-base">Thrump Fix</span>
          </div>
          <button
            onClick={handleBack}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
        </div>
      </div>

      {/* Page title */}
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-4 w-full">
        <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-1">Legal</p>
        <h1 className="text-2xl font-extrabold text-gray-900">Terms, Privacy & Cookie Policy</h1>
        {meta && (
          <p className="text-sm text-gray-400 mt-1">
            Version {meta.version} · Effective{" "}
            {new Date(meta.effectiveDate).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 max-w-4xl mx-auto px-4 pb-4 w-full">

        {/* Loading spinner */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm flex items-center justify-center h-[70vh]">
            <div className="flex flex-col items-center gap-3 text-gray-400">
              <svg className="animate-spin" width="28" height="28" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#e5e7eb" strokeWidth="3" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <p className="text-sm font-medium">Loading policy document...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <p className="text-gray-500 text-sm mb-2">
              Could not load the policy document at this time.
            </p>
            <p className="text-gray-400 text-xs">
              Please contact us at{" "}
              <span className="text-blue-600">thrumpfix@yahoo.com</span>
            </p>
          </div>
        )}

        {/* PDF in iframe — stays inside app, no download */}
        {!loading && !error && pdfUrl && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <iframe
              src={pdfUrl}
              title="Thrump Fix Policy Document"
              className="w-full"
              style={{ height: "75vh", border: "none" }}
            />
          </div>
        )}

      </div>

      {/* Bottom back button */}
      {!loading && (
        <div className="max-w-4xl mx-auto px-4 pb-10 w-full flex justify-center">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Done — Back to Signup
          </button>
        </div>
      )}

    </div>
  );
}
