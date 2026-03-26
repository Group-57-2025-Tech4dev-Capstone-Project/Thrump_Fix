import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import route from "../../utils/routes";
import DashboardLayout from "../../Layouts/DashboardLayout";
import AvailableJobCard from "./AvailableJobCard";
import HistoryCard from "./HistoryCard";
import EmptyJobsState from "./EmptyJobsState";
import LeadActivationModal from "./LeadActivationModal";

function getUserFromSession() {
  try {
    const stored = sessionStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

export default function PlumberDashboard() {
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [plumber, setPlumber] = useState(null);
  const [jobHistory, setJobHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [pendingJob, setPendingJob] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [claimingId, setClaimingId] = useState(null);

  const leadsRef = useRef([]);

  // Read user inside component — never at module level
  const user = getUserFromSession();
  const userId = user?.id || user?.userId;

  // Subscription blocking
  const usageCount = subscription?.usageCount ?? 0;
  const isExpired = subscription?.status === "EXPIRED";
  const isActive = subscription?.status === "ACTIVE";
  const isTrial = subscription?.plan === "FREE_TRIAL";

    // ── Subscription logic - Free trial allows ONLY 1 claim
  const trialExpired = subscription?.status === "EXPIRED" 
  // || 
  // (subscription?.plan === "FREE_TRIAL" && subscription?.usageCount >= 1);

  const blocked = trialExpired;

  // ── Role guard
  useEffect(() => {
    if (!user) {
      navigate(route.Login, { replace: true });
      return;
    }
    if (user.role?.toUpperCase() !== "PLUMBER") {
      navigate(route.ConsumerDashboard, { replace: true });
    }
  }, [user, navigate]);

  // ── Fetch plumber profile
  useEffect(() => {
    if (!userId) return;
    api.get(`/plumbers/${userId}`)
      .then((res) => {
        setPlumber(res.data);
        console.log(
          `[PLUMBER PROFILE] ✅ Loaded | ` +
          `State: ${res.data.state} | ` +
          `LGA: ${res.data.localGovernanceArea} | ` +
          `SubRegion: ${res.data.subRegion} | ` +
          `Verified: ${res.data.verified}`
        );
      })
      .catch((err) => console.error("[PLUMBER PROFILE] ❌ Failed:", err.message));
  }, [userId]);

  // ── Fetch available leads
  // const fetchLeads = useCallback(async () => {
  //   try {
  //     const res = await api.get("/jobs/available");
  //     const jobs = Array.isArray(res.data) ? res.data : [];

  //     setLeads(jobs);
  //     leadsRef.current = jobs;
  //     if (jobs.length > 0) {
  //       console.log(`[LEADS] ✅ ${jobs.length} job(s) available → ${jobs.map(j => `#${j.jobId}`).join(", ")}`);
  //     } else {
  //       console.log("[LEADS] ⏳ No jobs in your region yet");
  //     }
  //   } catch (err) {
  //     console.error("[LEADS ERROR] ❌", err.message);
  //   }
  // }, []);

  const fetchLeads = useCallback(async () => {
  try {
    console.log("[LEADS] 🔵 Calling /jobs/available ...");
    const res = await api.get("/jobs/available");
    
    const jobs = Array.isArray(res.data) ? res.data : [];
    
    console.log(`[LEADS] ✅ Received ${jobs.length} jobs from backend`);
    if (jobs.length > 0) {
      console.log("First job sample:", jobs[0]);
    }

    setLeads(jobs);
    leadsRef.current = jobs;

  } catch (err) {
    console.error("[LEADS ERROR] ❌ Failed to fetch available jobs:", err.response?.status, err.response?.data);
  }
}, []);

  // ── Fetch assigned jobs
  const fetchHistory = useCallback(async () => {
    try {
      const res = await api.get("/plumbers/assigned-Jobs");
      const history = Array.isArray(res.data) ? res.data : [];
      setJobHistory(history);
      if (history.length > 0) {
        console.log(`[HISTORY] ${history.length} assigned job(s): ${history.map(j => `#${j.jobId} [${j.status}]`).join(", ")}`);
      }
    } catch (err) {
      console.error("[HISTORY ERROR] ❌", err.message);
      setJobHistory([]);
    }
  }, []);


//   const fetchSubscription = useCallback(async () => {
//   try {
//     const res = await api.get("/subscription/me");
//     console.log("[PLUMBER SUBSCRIPTION]", res.data);
//     setSubscription(res.data);
//   } catch (err) {
//     console.log("[PLUMBER SUBSCRIPTION ERROR]", err.response?.status);
//     // ← Do NOT reset subscription here. Keep whatever we had before.
//     // Only set default if we've never loaded anything yet
//     setSubscription(prev => prev ?? { plan: "FREE_TRIAL", usageCount: 0, status: "ACTIVE" });
//   }
// }, []);

  const fetchSubscription = useCallback(async () => {
  try {
    const res = await api.get("/subscription/me");
    console.log("[PLUMBER SUBSCRIPTION]", res.data);
    setSubscription(res.data);
  } catch (err) {
    const status = err.response?.status;
    console.log("[PLUMBER SUBSCRIPTION ERROR]", status);
    if (status === 404) {
      // No subscription — start free trial once
      try {
        await api.post("/subscription/start", { plan: "FREE_TRIAL" });
        setSubscription({ plan: "FREE_TRIAL", usageCount: 0, status: "ACTIVE" });
      } catch {
        setSubscription(prev => prev ?? { plan: "FREE_TRIAL", usageCount: 0, status: "ACTIVE" });
      }
    } else {
      // Keep whatever we had — don't reset
      setSubscription(prev => prev ?? { plan: "FREE_TRIAL", usageCount: 0, status: "ACTIVE" });
    }
  }
}, []);

  // ── Mount + polling
  useEffect(() => {
    if (!user) return;

    console.log(`[PLUMBER DASHBOARD] ✅ Loaded — userId: ${userId}, name: ${user.fullName}`);

    // Just in case the backend didn't start the trial on registration, we attempt to start it here. If it fails (e.g. because it's already active), we ignore the error and proceed.

    // api.post("/subscription/start", { plan: "FREE_TRIAL" }).catch(() => {});

    Promise.all([fetchLeads(), fetchHistory(), fetchSubscription()])
      .then(() => {
        setLoading(false);
        console.log("[BOOTSTRAP] ✅ All data loaded successfully");
      })
      .catch(() => setLoading(false));

    const interval = setInterval(() => {
      fetchLeads();
      fetchHistory();
      fetchSubscription();        /* testing, can remove later*/
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchLeads, fetchHistory, fetchSubscription]);

  // ── Open confirmation modal — uses leadsRef
  const handleClaim = useCallback((jobId) => {
    const job = leadsRef.current.find(j => j.jobId === jobId);
    if (!job) return;
    console.log(`[CLAIM] 🔵 Opening modal for job #${jobId} | Customer: ${job.customerFullName} | Address: ${job.address}`);
    setClaimingId(jobId);
    setPendingJob(job);
  }, []);

  // ── Confirm claim — backend reads plumber from JWT token, no param needed
  const handleConfirmClaim = useCallback(async () => {
    if (!pendingJob) return;
    setModalLoading(true);

    console.log(`[CLAIM] 🔵 Sending: PATCH /jobs/${pendingJob.jobId}/accept`);
    console.log(`[CLAIM] Backend reads plumber identity from JWT token (userId: ${userId})`);

    try {
      await api.patch(`/jobs/${pendingJob.jobId}/accept`);

      console.log(`[CLAIM SUCCESS] ✅ Job #${pendingJob.jobId} accepted!`);
      console.log(`[CLAIM SUCCESS] Plumber: ${user?.fullName} (${userId}) → Customer: ${pendingJob.customerFullName}`);
      console.log(`[CLAIM SUCCESS] Address: ${pendingJob.address} | Issue: ${pendingJob.issueDetails}`);

      setLeads((prev) => {
        const updated = prev.filter((j) => j.jobId !== pendingJob.jobId);
        leadsRef.current = updated;
        return updated;
      });
      setPendingJob(null);

      await Promise.all([fetchLeads(), fetchHistory(), fetchSubscription()]);

    } catch (err) {
      console.error(`[CLAIM ERROR] ❌ Job #${pendingJob.jobId} failed`);
      console.error(`[CLAIM ERROR] Status: ${err.response?.status}`);
      console.error(`[CLAIM ERROR] Response: ${JSON.stringify(err.response?.data)}`);
      alert(err.response?.data?.message || "Could not claim job. Please try again.");
    } finally {
      setModalLoading(false);
      setClaimingId(null);
    }
  }, [pendingJob, userId, user, fetchLeads, fetchHistory, fetchSubscription]);

  // ── Cancel modal
  const handleCancelModal = useCallback(() => {
    console.log(`[CLAIM] Cancelled — job #${pendingJob?.jobId}`);
    setPendingJob(null);
    setClaimingId(null);
  }, [pendingJob]);

  // ── Manual refresh
  const handleRefresh = useCallback(async () => {
    console.log("[REFRESH] Manual refresh triggered");
    await fetchLeads();
  }, [fetchLeads]);

  // Region label
  const regionLabel = plumber
    ? `${plumber.localGovernanceArea || ""}, ${plumber.subRegion || ""}`.trim().replace(/^,\s*|,\s*$/g, "")
    : user?.localGovernanceArea
      ? `${user.localGovernanceArea}${user.subRegion ? `, ${user.subRegion}` : ""}`
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

      <DashboardLayout
        
        trialExpired={trialExpired}
        onUpgrade={() => navigate(route.Payment, { state: { from: "dashboard" } })}
        // statusLabel={subscription?.status === "ACTIVE" ? "Active Plan" : "Free Trial"}
        // statusColor={subscription?.status === "ACTIVE" ? "green" : "gray"}
      >
        {/* Header */}
        <div className="mb-6 mt-6">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Available Jobs
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Showing jobs for{" "}
            <span className="text-sm font-bold text-gray-800 mt-1">
              {regionLabel}
            </span>
          </p>
          {!loading && leads.length > 0 && (
            <p className="text-sm text-gray-500 mt-0.5 font-bold">
              {leads.length} Job{leads.length !== 1 ? "s" : ""} Available
            </p>
          )}
        </div>

        {/* AVAILABLE JOBS */}
        {/* <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <h2 className="text-xs font-extrabold uppercase tracking-[0.15em] text-gray-800">
                Marketplace Opportunities
              </h2>
            </div>

            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-600 hover:text-blue-600 border border-gray-200 hover:border-blue-300 bg-gray-50 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0113.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Refresh Live Feed
            </button>
          </div>

          <div className="px-5 sm:px-6 py-6">
            {loading ? (
              <div className="py-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-600" />
              </div>
            ) : leads.length === 0 ? (
              <EmptyJobsState />
            ) : (
              <div className="space-y-4 flex flex-col items-center">
                {leads.map((lead) => (
                  <AvailableJobCard
                    key={lead.jobId}
                    job={lead}
                    onRequestClaim={handleClaim}
                    blocked={blocked}
                    claiming={claimingId === lead.jobId}
                  />
                ))}
              </div>
            )}
          </div>
        </div> */}

        {leads.length === 0 ? (
          // ✅ EMPTY STATE (with box)
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <h2 className="text-xs font-extrabold uppercase tracking-[0.15em] text-gray-800">
                  Marketplace Opportunities
                </h2>
              </div>

              <button
                onClick={handleRefresh}
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-600 hover:text-blue-600 border border-gray-200 hover:border-blue-300 bg-gray-50 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0113.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Refresh Live Feed
              </button>
            </div>

            <div className="px-5 sm:px-6 py-6">
              <EmptyJobsState />
            </div>
          </div>
        ) : (
          // ✅ WHEN JOBS EXIST → NO BOX, JUST CARDS
          <div className="space-y-4 flex flex-col items-center">
            {leads.map((lead) => (
              <AvailableJobCard
                key={lead.jobId}
                job={lead}
                onRequestClaim={handleClaim}
                blocked={blocked}
                claiming={claimingId === lead.jobId}
              />
            ))}
          </div>
        )}

        {/* ASSIGNED JOBS HISTORY */}
        {jobHistory.length > 0 && (
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-gray-700 mb-4">
              Assigned Jobs
            </h2>
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
