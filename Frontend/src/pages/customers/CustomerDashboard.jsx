import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../Layouts/DashboardLayout";
import AssistantOverlay from "./AssistantOverlay";
import api from "../../utils/api";
import route from "../../utils/routes";

const STATUS_STYLES = {
  accepted:  "bg-green-100 text-green-800 border border-green-300",
  cancelled: "bg-orange-100 text-orange-800 border border-orange-300",
  rejected:  "bg-red-100 text-red-800 border border-red-300",
  open:      "bg-gray-100 text-gray-800 border border-gray-300",
  logged:    "bg-blue-100 text-blue-800 border border-blue-300",
  completed: "bg-purple-100 text-purple-800 border border-purple-300",
};

export default function ConsumerDashboard() {
  const navigate = useNavigate();
  const cached = localStorage.getItem("user");
  const cachedUser = cached ? JSON.parse(cached) : null;

  const [user, setUser]                 = useState(cachedUser);
  const [jobs, setJobs]                 = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [showOverlay, setShowOverlay]   = useState(false);
  const [loading, setLoading]           = useState(true);

  const firstName = user?.fullName?.split(" ")?.[0] || "User";

  // ── 1. Fetch real user profile 
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        console.error("Failed to fetch user:", err);
        if (cachedUser) setUser(cachedUser);
      }
    };
    fetchUser();
  }, []);

  // ── 2. Fetch subscription status ───────────────────────────
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await api.get("/subscription/me");
        setSubscription(res.data);
      } catch (err) {
        console.error("Failed to fetch subscription:", err);
      }
    };
    fetchSubscription();
  }, []);

  // ── 3. Fetch job history
  const fetchJobs = async () => {
    try {
      const res = await api.get("/jobs/history");
      const jobList = res.data || [];

      // For every accepted job, fetch the assigned plumber
      const enriched = await Promise.all(
        jobList.map(async (job) => {
          if (job.status?.toLowerCase() === "accepted" && job.plumberId) {
            try {
              const plumberRes = await api.get(`/plumbers/${job.plumberId}`);
              return {
                ...job,
                plumber: {
                  name:     plumberRes.data.fullName,
                  phone:    plumberRes.data.phoneNumber,
                  verified: plumberRes.data.verified,
                  initials: plumberRes.data.fullName?.slice(0, 2).toUpperCase(),
                },
              };
            } catch {
              return job;
            }
          }
          return job;
        })
      );

      setJobs(enriched);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  // ── Banner logic ─
  const trialExpired =
    subscription?.status === "EXPIRED" ||
    subscription?.status === "TRIAL_EXPIRED" ||
    user?.subscriptionStatus === "TRIAL_EXPIRED" ||
    user?.trialExpired === true;

  const shouldShowTrialBanner = trialExpired && !loading;

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const header = (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
      <div>
        <p className="text-base text-gray-500 font-light">Welcome back,</p>
        <h1 className="text-2xl font-black text-gray-900">{firstName}</h1>
      </div>
      <button
        onClick={() => setShowOverlay(true)}
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-3 rounded-2xl transition shadow-md shadow-blue-200 w-full sm:w-auto"
      >
        + New Repair Request
      </button>
    </div>
  );

  return (
    <>
      <DashboardLayout header={header}>

        {/* ── TRIAL BANNER ── */}
        {shouldShowTrialBanner && (
          <div className="bg-orange-500 text-white px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl mb-6 shadow-sm">
            <div className="font-medium text-base">
              Your free trial has expired. Upgrade to Pro to continue unlimited access.
            </div>
            <button
              onClick={() => navigate(route.Payment)}
              className="bg-white text-orange-600 font-bold px-5 py-2.5 rounded-xl hover:bg-gray-100 transition whitespace-nowrap flex items-center gap-2 min-w-[140px] justify-center"
            >
              UPGRADE NOW
            </button>
          </div>
        )}

        {/* ── LOADING ── */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px] text-gray-600">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600" />
            <span className="ml-3">Loading...</span>
          </div>

        /* ── EMPTY STATE ── */
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-8 sm:p-12 flex flex-col items-center justify-center text-center min-h-[280px] sm:min-h-[320px]">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-7 h-7 sm:w-8 sm:h-8">
                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-gray-900 mb-2">
              ALL SYSTEMS OPERATIONAL
            </h2>
            <p className="text-sm text-gray-500 font-medium max-w-xs">
              No active plumbing emergencies detected.
            </p>
          </div>

        /* ── JOB CARDS ── */
        ) : (
          <div className="flex flex-col gap-3">
            {jobs.map((job) => (
              <div
                key={job.jobId}
                className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex flex-col gap-3 border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <p className="text-xs text-gray-500 font-mono mb-0.5">
                      ID: IT{job.jobId}
                    </p>
                    {job.subRegionId && (
                      <div className="flex items-center gap-1.5 text-blue-600 mb-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.003 3.5-4.697 3.5-8.328a8.25 8.25 0 00-16.5 0c0 3.63 1.556 6.326 3.5 8.328a19.579 19.579 0 002.682 2.282 16.975 16.975 0 001.145.742z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-semibold uppercase tracking-wide">
                          {job.lga}, {job.state}
                        </span>
                      </div>
                    )}
                    {job.createdAt && (
                      <p className="text-xs text-gray-500">{formatDate(job.createdAt)}</p>
                    )}
                  </div>

                  <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border ${STATUS_STYLES[job.status?.toLowerCase()] || "bg-gray-100 text-gray-800"}`}>
                    {job.status?.toUpperCase() || "OPEN"}
                  </span>
                </div>

                {/* Issue */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">ISSUE</p>
                  <p className="text-base font-semibold text-gray-900">"{job.issueDetails}"</p>
                </div>

                {/* Assigned plumber  */}
                {job.status?.toLowerCase() === "accepted" && job.plumber && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-black text-blue-700 flex-shrink-0">
                        {job.plumber.initials || "??"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{job.plumber.name}</p>
                        {job.plumber.verified && (
                          <div className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-green-500">
                              <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.491 4.491 0 01-3.497-1.307 4.491 4.491 0 01-1.307-3.497A4.49 4.49 0 012.25 12a4.49 4.49 0 011.549-3.397 4.491 4.491 0 011.307-3.497 4.491 4.491 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                            </svg>
                            <p className="text-xs text-green-600 font-medium">Verified</p>
                          </div>
                        )}
                      </div>
                    </div>

                    
                      href={`tel:${job.plumber.phone || ""}`}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold text-sm px-4 py-2 rounded-xl transition flex items-center justify-center gap-2 shadow-sm shadow-green-200 min-w-[140px]"
                    <a>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                      </svg>
                      PHONE NUMBER
                    </a>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </DashboardLayout>

      {showOverlay && (
        <AssistantOverlay
          onClose={() => {
            setShowOverlay(false);
            fetchJobs();
          }}
        />
      )}
    </>
  );
}