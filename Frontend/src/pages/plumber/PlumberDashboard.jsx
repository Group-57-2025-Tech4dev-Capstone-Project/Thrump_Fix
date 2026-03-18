
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import route from "../../utils/routes";
import DashboardLayout from "../../Layouts/DashboardLayout";
import AvailableJobCard from "./AvailableJobCard";
import HistoryCard from "./HistoryCard";
import EmptyJobsState from "./EmptyJobsState";
import LeadActivationModal from "./LeadActivationModal";

export default function PlumberDashboard() {
  const navigate = useNavigate();
  const pendingCallbackRef = useRef(null);

  // State management - simplified with useState
  const [scanning, setScanning] = useState(true);
  const [leads, setLeads] = useState([]);
  const [plumber, setPlumber] = useState(null);
  const [claimingId, setClaimingId] = useState(null);
  const [jobHistory, setJobHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [pendingJob, setPendingJob] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Get user from sessionStorage
  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id || user?.userId;

  // Subscription blocking logic
  const usageCount = subscription?.usageCount ?? 0;
  const trialExpired = subscription && subscription.plan === "FREE_TRIAL" && (usageCount >= 1 || !subscription.active);
  const blocked = trialExpired;

  // Role guard
  useEffect(() => {
    if (!user) navigate(route.Login, { replace: true });
    else if (user.role?.toUpperCase() !== "PLUMBER") navigate(route.ConsumerDashboard, { replace: true });
  }, [user, navigate]);

  // Fetch plumber profile (for region label + plumberId)
  useEffect(() => {
    if (!userId) return;
    const fetchPlumber = async () => {
      try {
        const res = await api.get(`/plumbers/${userId}`);
        setPlumber(res.data);
      } catch (err) {
        console.error("Failed to fetch plumber profile:", err);
      }
    };
    fetchPlumber();
  }, [userId]);

  // Fetch available leads
  const fetchLeads = useCallback(async () => {
    try {
      const res = await api.get("/jobs/available");
      const jobs = res.data || [];
      setLeads(jobs);
      setScanning(jobs.length === 0);
      console.log(`[JOBS] Fetched ${jobs.length} available jobs | Region: ${plumber?.subRegion || "N/A"} | Status: ${jobs.length > 0 ? "✅ Found" : "⏳ Waiting"}`);
    } catch (err) {
      console.error("[JOBS ERROR] Failed to fetch available jobs:", err.message);
      setScanning(true);
    }
  }, [plumber?.subRegion]);

  // Fetch assigned jobs
  const fetchHistory = useCallback(async () => {
    try {
      const res = await api.get("/plumbers/assigned-Jobs");
      const history = Array.isArray(res.data) ? res.data : [];
      setJobHistory(history);
      if (history.length > 0) console.log(`[JOBS] ${history.length} assigned job(s) found`);
    } catch (err) {
      console.error("[JOBS ERROR] Failed to fetch job history:", err.message);
      setJobHistory([]);
    }
  }, []);

  // Fetch subscription
  const fetchSubscription = useCallback(async () => {
    try {
      const res = await api.get("/subscription/me");
      setSubscription(res.data);
    } catch (err) {
      console.error("Failed to fetch subscription:", err);
      setSubscription({ plan: "FREE_TRIAL", usageCount: 0, active: true });
    }
  }, []);

  // Initial fetch + polling
  useEffect(() => {
    if (!user) return;

    console.log(`[PLUMBER] Dashboard loaded for user: ${userId}, Region: ${plumber?.subRegion || "N/A"}`);
    setLoading(true);
    Promise.all([fetchLeads(), fetchHistory(), fetchSubscription()])
      .then(() => {
        setLoading(false);
        console.log("[BOOTSTRAP] Initial data loaded successfully");
      })
      .catch(() => {
        setLoading(false);
        console.error("[BOOTSTRAP ERROR] Failed to load initial data");
      });

    // Poll every 5 seconds
    const interval = setInterval(() => {
      fetchLeads();
      fetchHistory();
    }, 5000);

    return () => {
      clearInterval(interval);
      console.log("[CLEANUP] Dashboard polling stopped");
    };
  }, [user, userId, plumber?.subRegion, fetchLeads, fetchHistory, fetchSubscription]);

  // Handle job claim
  const handleClaim = useCallback((jobId) => {
    if (!userId) return;
    setClaimingId(jobId);
    try {
      const job = leads.find(j => j.jobId === jobId);
      if (job) {
        setPendingJob(job);
      }
    } catch (err) {
      console.error("Failed to prepare claim:", err);
      setClaimingId(null);
    }
  }, [userId, leads]);

  const handleConfirmClaim = useCallback(async () => {
    if (!pendingJob) return;
    setModalLoading(true);
    console.log(`[CLAIM] Attempting to claim job: ${pendingJob.jobId}`);
    try {
      await api.patch(`/jobs/${pendingJob.jobId}/accept`);
      console.log(`[CLAIM SUCCESS] Job ${pendingJob.jobId} claimed successfully`);
      setLeads((prev) => prev.filter((j) => j.jobId !== pendingJob.jobId));
      setPendingJob(null);
      await Promise.all([fetchLeads(), fetchHistory(), fetchSubscription()]);
    } catch (err) {
      console.error(`[CLAIM ERROR] Failed to claim job ${pendingJob.jobId}:`, err.message);
      alert(err.response?.data?.message || "Could not claim job. Please try again.");
    } finally {
      setModalLoading(false);
      setClaimingId(null);
    }
  }, [pendingJob, fetchLeads, fetchHistory, fetchSubscription]);

  const handleCancelModal = useCallback(() => {
    setPendingJob(null);
    setClaimingId(null);
    pendingCallbackRef.current = null;
  }, []);

  // Refresh button handler
  const handleRefresh = useCallback(async () => {
    setScanning(true);
    await fetchLeads();
  }, [fetchLeads]);

  // Region label
  const regionLabel = plumber
    ? `${plumber.localGovernanceArea || ""}, ${plumber.subRegion || ""}`.trim().replace(/^,|,$/, "")
    : "Your Region";

  return (
    <>
      {pendingJob && (
        <LeadActivationModal
          job={pendingJob}
          onConfirm={handleConfirmClaim}
          onCancel={handleCancelModal}
          loading={modalLoading}
        />
      )}

      <DashboardLayout trialExpired={trialExpired} user={user} onUpgrade={() => navigate(route.Payment)}>
        <div className="mb-6">
          <h1 className="text-xl font-black text-gray-900">
            Showing jobs for{" "}
            <span className="text-blue-600">
              {regionLabel}
            </span>
          </h1>
        </div>

        {/* AVAILABLE JOBS SECTION */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <h2 className="text-xs font-extrabold uppercase tracking-[0.15em] text-gray-800">
                  Marketplace Opportunities
                </h2>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-600 hover:text-blue-600 border border-gray-200 hover:border-blue-300 bg-gray-50 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-3.5 h-3.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0113.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Refresh Live Feed
            </button>
          </div>

          <div className="px-5 sm:px-6 py-6">
            {loading ? (
              <div className="py-12 text-center">
                <p className="text-gray-500">Loading jobs...</p>
              </div>
            ) : leads.length === 0 ? (
              <EmptyJobsState />
            ) : (
              <div className="space-y-3">
                {leads.map((lead) => (
                  <AvailableJobCard
                    key={lead.jobId}
                    job={lead}
                    onRequestClaim={handleClaim}
                    blocked={blocked}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ASSIGNED JOBS SECTION */}
        {jobHistory.length > 0 && (
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-gray-700 mb-4">Assigned Jobs</h2>
            <div className="flex flex-col gap-3">
              {jobHistory.map((job) => (
                <HistoryCard key={job.jobId} job={job} />
              ))}
            </div>
          </div>
        )}
      </DashboardLayout>
    </>
  );
}