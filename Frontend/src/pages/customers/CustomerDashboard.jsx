// import { useEffect, useReducer, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import DashboardLayout from "../../Layouts/DashboardLayout";
// import AssistantOverlay from "./AssistantOverlay";
// import api from "../../utils/api";
// import route from "../../utils/routes";

// // ── Status badge styles
// function getStatusStyle(status) {
//   const s = status?.toLowerCase();

//   if (s === "matched" || s === "accepted")
//     return { pill: "bg-green-50 text-green-600 border border-green-200", label: "ACCEPTED" };

//   if (s === "cancelled" || s === "canceled")
//     return { pill: "bg-orange-50 text-orange-500 border border-orange-200", label: "CANCELLED" };

//   if (s === "rejected")
//     return { pill: "bg-red-50 text-red-500 border border-red-200", label: "REJECTED" };

//   // LOGGED = still searching — hide from customer view
//   return null;
// }

// // ── Date formatter
// function formatDate(iso) {
//   if (!iso) return "";
//   const d = new Date(iso);
//   const dd = String(d.getDate()).padStart(2, "0");
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   const yyyy = d.getFullYear();
//   const hh = d.getHours();
//   const min = String(d.getMinutes()).padStart(2, "0");
//   return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
// }

// const initialState = {
//   user:         null,
//   jobs:         [],
//   loading:      true,
//   showOverlay:  false,
//   trialExpired: false,
// };

// function reducer(state, action) {
//   switch (action.type) {
//     case "SET_USER":          return { ...state, user: action.payload };
//     case "SET_JOBS":          return { ...state, jobs: action.payload };
//     case "SET_LOADING":       return { ...state, loading: action.payload };
//     case "SHOW_OVERLAY":      return { ...state, showOverlay: true };
//     case "HIDE_OVERLAY":      return { ...state, showOverlay: false };
//     case "SET_TRIAL_EXPIRED": return { ...state, trialExpired: action.payload };
//     default:                  return state;
//   }
// }

// export default function ConsumerDashboard() {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const { user, jobs, loading, showOverlay, trialExpired } = state;
//   const navigate = useNavigate();

//   // ── Load user from sessionStorage on mount
//   useEffect(() => {
//     const stored = sessionStorage.getItem("user");  // ← sessionStorage
//     if (!stored) { navigate(route.Login, { replace: true }); return; }

//     const parsed = JSON.parse(stored);

//     // ── Console: confirm location fields from login response
//     console.log("[USER] sessionStorage user:", parsed);
//     console.log(
//       `[LOCATION] State: ${parsed.state ?? "N/A"} | ` +
//       `LGA: ${parsed.localGovernanceArea ?? "N/A"} | ` +
//       `SubRegion: ${parsed.subRegion ?? "N/A"}`
//     );

//     if (parsed.role?.toUpperCase() === "PLUMBER") {
//       navigate(route.PlumberDashboard, { replace: true });
//       return;
//     }

//     dispatch({ type: "SET_USER", payload: parsed });
//   }, [navigate]);

//   // fullName is the correct field from AuthResponse (Swagger confirmed)
//   const firstName = user?.fullName?.split?.(" ")?.[0] || "User";

//   // ─────────────────────────────────────────────────────────────
//   // FETCH JOB HISTORY
//   // Trial expired = at least 1 MATCHED job. LOGGED does not count.
//   // ─────────────────────────────────────────────────────────────
//   const fetchJobs = useCallback(async () => {
//     try {
//       const res = await api.get("/jobs/history");
//       const data = res.data;
//       const list = Array.isArray(data) ? data : data?.content ?? data?.jobs ?? [];

//       // Hide LOGGED jobs from customer — they are still searching
//       const visible = list.filter((job) => job.status?.toLowerCase() !== "logged");
//       dispatch({ type: "SET_JOBS", payload: visible });

//       // Trial expired only when a plumber accepted at least one job
//       const matchedCount = list.filter(
//         (j) => j.status?.toLowerCase() === "matched"
//       ).length;
//       dispatch({ type: "SET_TRIAL_EXPIRED", payload: matchedCount >= 1 });

//     } catch (err) {
//       console.error("Failed to fetch jobs:", err);
//       dispatch({ type: "SET_JOBS", payload: [] });

//       if (err.response?.status === 401 || err.response?.status === 403) {
//         sessionStorage.removeItem("user");   // ← sessionStorage
//         sessionStorage.removeItem("token");
//         navigate(route.Login, { replace: true });
//         return "STOP";
//       }
//     } finally {
//       dispatch({ type: "SET_LOADING", payload: false });
//     }
//   }, [navigate]);

//   // ─────────────────────────────────────────────────────────────
//   // CANCEL JOB
//   // ─────────────────────────────────────────────────────────────
//   const cancelJob = async (jobId) => {
//     const confirmCancel = window.confirm(
//       "Are you sure you want to cancel this repair request?"
//     );
//     if (!confirmCancel) return;
//     try {
//       await api.patch(`/jobs/${jobId}/cancel`);
//       fetchJobs();
//     } catch (err) {
//       console.error("Failed to cancel job:", err);
//       alert(err.response?.data?.message || "Unable to cancel job. It may already be accepted.");
//     }
//   };

//   // ─────────────────────────────────────────────────────────────
//   // MOUNT + POLLING every 5 seconds
//   // ─────────────────────────────────────────────────────────────
//   useEffect(() => {
//     fetchJobs();
//     const interval = setInterval(async () => {
//       const result = await fetchJobs();
//       if (result === "STOP") clearInterval(interval);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [fetchJobs]);

//   // ─────────────────────────────────────────────────────────────
//   // HEADER
//   // ─────────────────────────────────────────────────────────────
//   const header = (
//     <div className="flex items-center justify-between mb-2">
//       <p className="text-xl text-gray-700">
//         Welcome back,{" "}
//         <span className="font-black text-gray-900">{firstName}</span>
//       </p>

//       <button
//         onClick={() => !trialExpired && dispatch({ type: "SHOW_OVERLAY" })}
//         disabled={trialExpired}
//         className={`flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-full transition shadow-md shadow-blue-200 whitespace-nowrap ${
//           trialExpired
//             ? "bg-gray-400 text-gray-200 cursor-not-allowed"
//             : "bg-blue-600 hover:bg-blue-700 text-white"
//         }`}
//       >
//         {trialExpired ? "Upgrade to Post More Jobs" : "+ New Repair Request"}
//       </button>
//     </div>
//   );

//   return (
//     <>
//       <DashboardLayout
//         header={header}
//         trialExpired={trialExpired}
//         onUpgrade={() => navigate(route.Payment, { state: { from: "dashboard" } })}
//       >

//         {loading && (
//           <div className="flex justify-center items-center min-h-[300px]">
//             <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600" />
//           </div>
//         )}

//         {!loading && jobs.length === 0 && (
//           <div className="bg-white rounded-3xl shadow-sm p-10 flex flex-col items-center justify-center text-center min-h-[320px]">
//             <h2 className="text-lg font-black uppercase tracking-widest text-gray-900 mb-2">
//               All Systems Operational
//             </h2>
//             <p className="text-sm text-gray-400 font-medium max-w-xs">
//               No active plumbing emergencies detected.
//             </p>
//           </div>
//         )}

//         {!loading && jobs.length > 0 && (
//           <div className="flex flex-col gap-3">
//             {jobs.map((job) => {
//               const style = getStatusStyle(job.status);
//               if (!style) return null;

//               const status = job.status?.toLowerCase();
//               const cancellable = status === "logged" || status === "matching" || status === "matched";

//               return (
//                 <div
//                   key={job.jobId}
//                   className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 flex flex-col gap-2"
//                 >
//                   <p className="text-xs text-gray-400 font-mono">ID: IT{job.jobId}</p>

//                   <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">Issue</p>

//                   <div className="flex items-start justify-between gap-3">
//                     <p className="text-sm font-semibold text-gray-800">"{job.issueDetails}"</p>
//                     <span className={`text-xs font-black uppercase tracking-widest flex-shrink-0 px-3 py-1 rounded-full ${style.pill}`}>
//                       {style.label}
//                     </span>
//                   </div>

//                   {job.subRegionId && (
//                     <p className="text-xs text-blue-600 font-semibold uppercase">
//                       SubRegion: {job.subRegionId}
//                     </p>
//                   )}

//                   {cancellable && (
//                     <button
//                       onClick={() => cancelJob(job.jobId)}
//                       className="mt-2 self-start text-xs font-bold text-red-600 hover:text-red-700"
//                     >
//                       Cancel Request
//                     </button>
//                   )}

//                   {job.createdAt && (
//                     <p className="text-xs text-gray-400 mt-1">{formatDate(job.createdAt)}</p>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}

//       </DashboardLayout>

//       {showOverlay && (
//         <AssistantOverlay
//           onClose={() => {
//             dispatch({ type: "HIDE_OVERLAY" });
//             fetchJobs();
//           }}
//         />
//       )}
//     </>
//   );
// }


import { useEffect, useReducer, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../Layouts/DashboardLayout";
import AssistantOverlay from "./AssistantOverlay";
import api from "../../utils/api";
import route from "../../utils/routes";

// ── Status badge styles
function getStatusStyle(status) {
  const s = status?.toLowerCase();

  if (s === "matched" || s === "accepted")
    return { pill: "bg-green-50 text-green-600 border border-green-200", label: "ACCEPTED" };

  if (s === "cancelled" || s === "canceled")
    return { pill: "bg-orange-50 text-orange-500 border border-orange-200", label: "CANCELLED" };

  if (s === "rejected")
    return { pill: "bg-red-50 text-red-500 border border-red-200", label: "REJECTED" };

  // LOGGED = still searching — hide from customer view
  return null;
}

// ── Date formatter
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

// ── Read user immediately from sessionStorage (not inside useEffect)
// This avoids the "User" flash on first render
function getUserFromSession() {
  try {
    const stored = sessionStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

const sessionUser = getUserFromSession();

const initialState = {
  user:         sessionUser,
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

  // ── Role guard on mount
  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (!stored) { navigate(route.Login, { replace: true }); return; }

    const parsed = JSON.parse(stored);

    console.log("[USER] sessionStorage user:", parsed);
    console.log(
      `[LOCATION] State: ${parsed.state ?? "N/A"} | ` +
      `LGA: ${parsed.localGovernanceArea ?? "N/A"} | ` +
      `SubRegion: ${parsed.subRegion ?? "N/A"}`
    );

    if (parsed.role?.toUpperCase() === "PLUMBER") {
      navigate(route.PlumberDashboard, { replace: true });
      return;
    }

    dispatch({ type: "SET_USER", payload: parsed });
  }, [navigate]);

  // firstName from user state (already populated from sessionStorage at init)
  const firstName = user?.fullName?.split?.(" ")?.[0] || "User";

  // ─────────────────────────────────────────────────────────────
  // FETCH JOB HISTORY
  // Trial expired = at least 1 MATCHED job. LOGGED does not count.
  // ─────────────────────────────────────────────────────────────
  const fetchJobs = useCallback(async () => {
    try {
      const res = await api.get("/jobs/history");
      const data = res.data;
      const list = Array.isArray(data) ? data : data?.content ?? data?.jobs ?? [];

      // Hide LOGGED jobs — customer only sees terminal states
      const visible = list.filter((job) => job.status?.toLowerCase() !== "logged");
      dispatch({ type: "SET_JOBS", payload: visible });

      // Trial expired only when a plumber accepted at least one job
      const matchedCount = list.filter(
        (j) => j.status?.toLowerCase() === "matched"
      ).length;
      dispatch({ type: "SET_TRIAL_EXPIRED", payload: matchedCount >= 1 });

    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      dispatch({ type: "SET_JOBS", payload: [] });

      if (err.response?.status === 401 || err.response?.status === 403) {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
        navigate(route.Login, { replace: true });
        return "STOP";
      }
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [navigate]);

  // ─────────────────────────────────────────────────────────────
  // CANCEL JOB
  // ─────────────────────────────────────────────────────────────
  const cancelJob = async (jobId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this repair request?"
    );
    if (!confirmCancel) return;
    try {
      await api.patch(`/jobs/${jobId}/cancel`);
      fetchJobs();
    } catch (err) {
      console.error("Failed to cancel job:", err);
      alert(err.response?.data?.message || "Unable to cancel job. It may already be accepted.");
    }
  };

  // ─────────────────────────────────────────────────────────────
  // MOUNT + POLLING every 5 seconds
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchJobs();
    const interval = setInterval(async () => {
      const result = await fetchJobs();
      if (result === "STOP") clearInterval(interval);
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchJobs]);

  // ─────────────────────────────────────────────────────────────
  // HEADER
  // ─────────────────────────────────────────────────────────────
  const header = (
    <div className="flex items-center justify-between mb-2">
      <p className="text-xl text-gray-700">
        Welcome back,{" "}
        <span className="font-black text-gray-900">{firstName}</span>
      </p>

      <button
        onClick={() => !trialExpired && dispatch({ type: "SHOW_OVERLAY" })}
        disabled={trialExpired}
        className={`flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-full transition shadow-md shadow-blue-200 whitespace-nowrap ${
          trialExpired
            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
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
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 flex flex-col gap-2"
                >
                  <p className="text-xs text-gray-400 font-mono">ID: IT{job.jobId}</p>

                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">Issue</p>

                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-gray-800">"{job.issueDetails}"</p>
                    <span className={`text-xs font-black uppercase tracking-widest flex-shrink-0 px-3 py-1 rounded-full ${style.pill}`}>
                      {style.label}
                    </span>
                  </div>

                  {job.subRegionId && (
                    <p className="text-xs text-blue-600 font-semibold uppercase">
                      SubRegion: {job.subRegionId}
                    </p>
                  )}

                  {cancellable && (
                    <button
                      onClick={() => cancelJob(job.jobId)}
                      className="mt-2 self-start text-xs font-bold text-red-600 hover:text-red-700"
                    >
                      Cancel Request
                    </button>
                  )}

                  {job.createdAt && (
                    <p className="text-xs text-gray-400 mt-1">{formatDate(job.createdAt)}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </DashboardLayout>

      {showOverlay && (
        <AssistantOverlay
          onClose={() => {
            dispatch({ type: "HIDE_OVERLAY" });
            fetchJobs();
          }}
        />
      )}
    </>
  );
}
