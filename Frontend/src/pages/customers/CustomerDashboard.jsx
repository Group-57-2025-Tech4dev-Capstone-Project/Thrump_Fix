import { useEffect, useReducer, useCallback } from "react";
import DashboardLayout from "../../Layouts/DashboardLayout";
import AssistantOverlay from "./AssistantOverlay";
import api from "../../utils/api";

// ── Status badge styles

function getStatusStyle(status) {
  const s = status?.toLowerCase();
  if (s === "accepted")             return { pill: "bg-green-50 text-green-600 border border-green-200",    label: "ACCEPTED"  };
  if (s === "cancelled")            return { pill: "bg-orange-50 text-orange-500 border border-orange-200", label: "CANCELLED" };
  return                                    { pill: "bg-red-50 text-red-500 border border-red-200",          label: "REJECTED"  };
}

const cached     = localStorage.getItem("user");
const cachedUser = cached ? JSON.parse(cached) : null;

const initialState = {
  user:        cachedUser,
  jobs:        [],
  loading:     true,
  showOverlay: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_USER":    return { ...state, user: action.payload };
    case "SET_JOBS":    return { ...state, jobs: action.payload };
    case "SET_LOADING": return { ...state, loading: action.payload };
    case "SHOW_OVERLAY": return { ...state, showOverlay: true };
    case "HIDE_OVERLAY": return { ...state, showOverlay: false };
    default: return state;
  }
}

// Date
function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const dd   = String(d.getDate()).padStart(2, "0");
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh   = d.getHours();
  const min  = String(d.getMinutes()).padStart(2, "0");
  return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
}

export default function ConsumerDashboard() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user, jobs, loading, showOverlay } = state;

  const firstName = user?.fullName?.split(" ")[0] || "User";

  // ── Fetch user profile
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const res = await api.get("/users/me");
  //       dispatch({ type: "SET_USER", payload: res.data });
  //       localStorage.setItem("user", JSON.stringify({ ...cachedUser, ...res.data }));
  //     } catch (err) {
  //       console.error("Failed to fetch user profile:", err);
  //     }
  //   };
  //   fetchUser();
  // }, []);

  // // ── Fetch jobs 
  // const fetchJobs = useCallback(async () => {
  //   try {
  //     const res  = await api.get("/jobs/history");
  //     const data = res.data;
  //     const list = Array.isArray(data) ? data : data?.content ?? data?.jobs ?? [];

  //     // job details
  //     const enriched = await Promise.all(
  //       list.map(async (job) => {
  //         try {
  //           const detail = await api.get(`/jobs/${job.jobId}`);
  //           return { ...job, ...detail.data };
  //         } catch {
  //           return job; 
  //         }
  //       })
  //     );

  //     dispatch({ type: "SET_JOBS", payload: enriched });
  //   } catch (err) {
  //     console.error("Failed to fetch jobs:", err);
  //     dispatch({ type: "SET_JOBS", payload: [] });
  //   } finally {
  //     dispatch({ type: "SET_LOADING", payload: false });
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchJobs();
  //   const interval = setInterval(fetchJobs, 5000);
  //   return () => clearInterval(interval);
  // }, [fetchJobs]);


  const fetchJobs = useCallback(async (signal) => {
  try {
    const res  = await api.get("/jobs/history");
    const data = res.data;
    const list = Array.isArray(data) ? data : data?.content ?? data?.jobs ?? [];

    const enriched = await Promise.all(
      list.map(async (job) => {
        try {
          const detail = await api.get(`/jobs/${job.jobId}`);
          return { ...job, ...detail.data };
        } catch {
          return job;
        }
      })
    );

    dispatch({ type: "SET_JOBS", payload: enriched });
  } catch (err) {
    console.error("Failed to fetch jobs:", err);
    dispatch({ type: "SET_JOBS", payload: [] });

    // ✅ If 401 or 403, stop polling — token is bad/missing
    if (err.response?.status === 401 || err.response?.status === 403) {
      return "STOP";  // signal to clear interval
    }
  } finally {
    dispatch({ type: "SET_LOADING", payload: false });
  }
}, []);

useEffect(() => {
  fetchJobs();

  const interval = setInterval(async () => {
    const result = await fetchJobs();
    if (result === "STOP") {
      clearInterval(interval); // ✅ stop the spam
    }
  }, 5000);

  return () => clearInterval(interval);
}, [fetchJobs]);

  // ── Header 
  const header = (
    <div className="flex items-center justify-between mb-2">
      <p className="text-xl text-gray-700">
        Welcome back, <span className="font-black text-gray-900">{firstName}</span>
      </p>
      <button
        onClick={() => dispatch({ type: "SHOW_OVERLAY" })}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2.5 rounded-full transition shadow-md shadow-blue-200 whitespace-nowrap"
      >
        + New Repair Request
      </button>
    </div>
  );

  return (
    <>
      <DashboardLayout header={header}>

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600" />
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && jobs.length === 0 && (
          <div className="bg-white rounded-3xl shadow-sm p-10 flex flex-col items-center justify-center text-center min-h-[320px]">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-lg font-black uppercase tracking-widest text-gray-900 mb-2">
              All Systems Operational
            </h2>
            <p className="text-sm text-gray-400 font-medium max-w-xs">
              No active plumbing emergencies detected.
            </p>
          </div>
        )}

        {/* JOB LIST */}
        {!loading && jobs.length > 0 && (
          <div className="flex flex-col gap-3">
            {jobs.map((job) => {
              const statusKey = job.status?.toLowerCase();
              const style     = getStatusStyle(job.status);

              return (
                <div key={job.jobId} className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 flex flex-col gap-2">

                  {/* ID */}
                  <p className="text-xs text-gray-400 font-mono">ID: IT{job.jobId}</p>

                  {/* Address  */}
                  <div className="flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-blue-500 flex-shrink-0">
                      <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.003 3.5-4.697 3.5-8.328a8.25 8.25 0 00-16.5 0c0 3.63 1.556 6.326 3.5 8.328a19.579 19.579 0 002.682 2.282 16.975 16.975 0 001.145.742z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                      {[job.lgaName, job.stateName].filter(Boolean).join(", ") ||
                       job.address ||
                       job.subRegionId ||
                       "Location unavailable"}
                    </span>
                  </div>

                  {/* ROW 2 — Issue label */}
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">Issue</p>

                  {/* ROW 3 — Issue text + status badge on same row */}
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-gray-800">"{job.issueDetails}"</p>
                    <span className={`text-xs font-black uppercase tracking-widest flex-shrink-0 px-3 py-1 rounded-full ${style.pill}`}>
                      {style.label}
                    </span>
                  </div>

                  {/* PLUMBER ROW — only for accepted jobs */}
                  {statusKey === "accepted" && job.plumber && (
                    <div className="flex items-center justify-between gap-3 pt-2 mt-1 border-t border-gray-100">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                          Assigned Plumber
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-black text-blue-700 flex-shrink-0">
                            {job.plumber.initials}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{job.plumber.name}</p>
                            <div className="flex items-center gap-1 text-green-600 mt-0.5">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                                <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.491 4.491 0 01-3.497-1.307 4.491 4.491 0 01-1.307-3.497A4.49 4.49 0 012.25 12a4.49 4.49 0 011.549-3.397 4.491 4.491 0 011.307-3.497 4.491 4.491 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                              </svg>
                              <span className="text-xs font-semibold">Verified</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {job.plumber.phone && (
                        <a
                          href={`tel:${job.plumber.phone}`}
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4 py-2.5 rounded-full transition shadow-sm shadow-green-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                            <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                          </svg>
                          PHONE NUMBER
                        </a>
                      )}
                    </div>
                  )}

                  {/* DATE — always last, matches Figma "18-02-2026 9:30" */}
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
