import { useEffect, useReducer, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../Layouts/DashboardLayout"
import AssistantOverlay from "./AssistantOverlay"
import api from "../../utils/api"
import route from "../../utils/routes"
import Address from "../../assets/Address.svg?react"
import Phone from "../../assets/Phone.svg?react"
import Verified from "../../assets/Verified.svg?react"

function getStatusStyle(status) {
  const s = status?.toLowerCase();
  if (s === "accepted")
    return { pill: "bg-green-50 text-green-600 border border-green-200", label: "ACCEPTED" };
  if (s === "matched")
    return { pill: "bg-blue-50 text-blue-600 border border-blue-200", label: "WAITING" };
  if (s === "cancelled" || s === "canceled")
    return { pill: "bg-orange-50 text-orange-500 border border-orange-200", label: "CANCELLED" };
  if (s === "rejected")
    return { pill: "bg-red-50 text-red-500 border border-red-200", label: "REJECTED" };
  return null;
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = d.getHours();
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
}

const initialState = {
  user:         null,
  jobs:         [],
  loading:      true,
  showOverlay:  false,
  trialExpired: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_USER":          return { ...state, user: action.payload };
    case "SET_JOBS":          return { ...state, jobs: action.payload };
    case "SET_LOADING":       return { ...state, loading: action.payload };
    case "SHOW_OVERLAY":      return { ...state, showOverlay: true };
    case "HIDE_OVERLAY":      return { ...state, showOverlay: false };
    case "SET_TRIAL_EXPIRED": return { ...state, trialExpired: action.payload };
    default:                  return state;
  }
}

export default function ConsumerDashboard() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user, jobs, loading, showOverlay, trialExpired } = state;
  const navigate = useNavigate();

  // ── Load user on mount + start free trial silently
  // useEffect(() => {
  //   const stored = sessionStorage.getItem("user");
  //   if (!stored) { navigate(route.Login, { replace: true }); return; }
  //   const parsed = JSON.parse(stored);
  //   if (parsed.role?.toUpperCase() === "PLUMBER") {
  //     navigate(route.PlumberDashboard, { replace: true });
  //     return;
  //   }
  //   dispatch({ type: "SET_USER", payload: parsed });
  //   // Start free trial silently — backend ignores if already exists
  //   api.post("/subscription/start", { plan: "FREE_TRIAL" }).catch(() => {});
  // }, [navigate]);

  useEffect(() => {
  const stored = sessionStorage.getItem("user");
  if (!stored) { navigate(route.Login, { replace: true }); return; }
  const parsed = JSON.parse(stored);
  if (parsed.role?.toUpperCase() === "PLUMBER") {
    navigate(route.PlumberDashboard, { replace: true });
    return;
  }
  dispatch({ type: "SET_USER", payload: parsed });
  // Start free trial once — backend ignores if subscription already exists
  // api.post("/subscription/start", { plan: "FREE_TRIAL" }).catch(() => {});
}, [navigate]);

  const firstName = user?.fullName?.split?.(" ")?.[0] || "User";
  const isNewUser = jobs.length === 0;

  const fetchSubscription = useCallback(async () => {
  try {
    const res = await api.get("/subscription/me");
    const sub = res.data;
    console.log("[CONSUMER SUBSCRIPTION]", sub);
    const isExpired = sub?.active === false;
    dispatch({ type: "SET_TRIAL_EXPIRED", payload: isExpired });
  } catch (err) {
    const status = err.response?.status;
    console.log("[CONSUMER SUBSCRIPTION ERROR]", status);
    if (status === 404) {
      // No subscription exists yet — create free trial ONCE
      try {
        await api.post("/subscription/start", { plan: "FREE_TRIAL" });
        console.log("[CONSUMER SUBSCRIPTION] Free trial started");
        dispatch({ type: "SET_TRIAL_EXPIRED", payload: false });
      } catch (startErr) {
        console.log("[CONSUMER SUBSCRIPTION] Start failed:", startErr.response?.status);
        dispatch({ type: "SET_TRIAL_EXPIRED", payload: false });
      }
    } else {
      // Any other error — don't expire trial
      dispatch({ type: "SET_TRIAL_EXPIRED", payload: false });
    }
  }
}, []);

  // ── Fetch job history 
  const fetchJobs = useCallback(async () => {
    try {
      const res = await api.get("/jobs/history");
      const data = res.data;
      const list = Array.isArray(data) ? data : data?.content ?? data?.jobs ?? [];

      const visible = list.filter((job) => job.status?.toLowerCase() !== "logged");
      dispatch({ type: "SET_JOBS", payload: visible });

      // We no longer set trialExpired here — subscription API is the source of truth

    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      dispatch({ type: "SET_JOBS", payload: [] });

      if (err.response?.status === 401 || err.response?.status === 403) {
        sessionStorage.removeItem("user");
        navigate(route.Login, { replace: true });
        return "STOP";
      }
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [navigate]);

  // ── Cancel job
  const cancelJob = async (jobId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this repair request?");
    if (!confirmCancel) return;
    try {
      await api.patch(`/jobs/${jobId}/cancel`);
      fetchJobs();
    } catch (err) {
      console.error("Failed to cancel job:", err);
      alert(err.response?.data?.message || "Unable to cancel job. It may already be accepted.");
    }
  };

  
  useEffect(() => {
    fetchJobs();
    fetchSubscription();

    const interval = setInterval(() => {
      fetchJobs();
      fetchSubscription();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchJobs, fetchSubscription]);

  const header = (
    <div className="flex items-center justify-between mb-2">
      <p className="text-xl text-gray-700">
        {isNewUser ? "Welcome," : "Welcome back,"}{" "}
        <span className="font-black text-gray-900">{firstName}</span>
      </p>
      {/* <button
        onClick={() => { if (!trialExpired) dispatch({ type: "SHOW_OVERLAY" }); }}
        disabled={trialExpired}
        className={`flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-full transition shadow-md shadow-blue-200 whitespace-nowrap ${
          trialExpired
            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {trialExpired ? "Upgrade to Post More Jobs" : "+ New Repair Request"}
      </button> */}

      <button
        onClick={() => {
          if (trialExpired) {
            navigate(route.Payment, { state: { from: "dashboard" } });
          } else {
            dispatch({ type: "SHOW_OVERLAY" });
          }
        }}
        className={`flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-full transition shadow-md shadow-blue-200 whitespace-nowrap ${
          trialExpired
            ? "bg-gray-400 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {trialExpired ? "Upgrade to Post More Jobs" : "+ New Repair Request"}
      </button>
    </div>
  );

  return (
    <>
      <DashboardLayout
        header={header}
        trialExpired={trialExpired}
        onUpgrade={() => navigate(route.Payment, { state: { from: "dashboard" } })}
      >
        {loading && (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600" />
          </div>
        )}

        {!loading && jobs.length === 0 && (
          <div className="bg-white rounded-3xl shadow-sm p-10 flex flex-col items-center justify-center text-center min-h-[320px]">
            <h2 className="text-lg font-black uppercase tracking-widest text-gray-900 mb-2">
              All Systems Operational
            </h2>
            <p className="text-sm text-gray-400 font-medium max-w-xs">
              No active plumbing emergencies detected.
            </p>
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <div className="flex flex-col gap-3">
            {jobs.map((job) => {
              const style = getStatusStyle(job.status);
              if (!style) return null;
              const status = job.status?.toLowerCase();
              const cancellable = status === "logged" || status === "matching" || status === "matched";

              return (
                <div 
                  key={job.jobId} 
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 px-2 py-5 flex flex-col gap-4"
                >
                  {/* ID */}
                  <p className="text-xs text-gray-400 font-mono">ID: IT{job.jobId}</p>

                  {/* Address / Location - directly under ID */}
                  <div className="flex items-center gap-1 text-xs text-blue-600 font-semibold uppercase">
                    <span><Address/></span>
                    {job.stateName} • {job.localGovernmentName}
                  </div>

                  {/* Issue Row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">ISSUE</p>
                      <p className="text-sm font-semibold text-gray-800">
                        "{job.issueDetails || 'No details provided'}"
                      </p>
                    </div>

                    {/* Status Pill with outline border */}
                    {style && (
                      <span 
                        className={`text-xs font-black uppercase tracking-widest flex-shrink-0 px-4 py-1.5 rounded-full self-start mt-1 border ${style.pill}`}
                      >
                        {style.label}
                      </span>
                    )}
                  </div>

                  {/* Accepted Plumber Section*/}
                  {job.status?.toLowerCase() === "accepted" && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-700 flex-shrink-0">
                          {job.plumberFullName 
                            ? job.plumberFullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) 
                            : "PL"}
                        </div>

                        <div>
                          <p className="text-sm font-bold text-gray-900 leading-tight">{job.plumberFullName}</p>
                          <div className="flex items-center gap-1 text-xs text-green-600 mt-0.5">
                            <span><Verified/></span>
                            <span className="font-medium">Verified</span>
                          </div>
                        </div>
                      </div>

                      {/* Call Button - clean green pill */}
                      <a 
                        href={`tel:${job.plumberPhoneNumber}`}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 transition flex-shrink-0"
                      >
                        <Phone/> {job.plumberPhoneNumber}
                      </a>
                    </div>
                  )}

                  {/* Cancel Button */}
                  {cancellable && (
                    <button 
                      onClick={() => cancelJob(job.jobId)} 
                      className="mt-1 self-start text-xs font-bold text-red-600 hover:text-red-700"
                    >
                      Cancel Request
                    </button>
                  )}

                  {/* Date */}
                  {job.createdAt && (
                    <p className="text-xs text-gray-400">
                      {formatDate(job.createdAt)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </DashboardLayout>

      {showOverlay && (
        <AssistantOverlay
          // blocked={trialExpired}
          blocked={false} 
          onClose={() => {
            dispatch({ type: "HIDE_OVERLAY" });
            fetchJobs();
          }}
        />
      )}
    </>
  );
}