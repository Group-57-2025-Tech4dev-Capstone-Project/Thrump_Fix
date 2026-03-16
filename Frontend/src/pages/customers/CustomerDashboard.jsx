
//Frontend/src/pages/customers/customerDashboard.jsx
import { useEffect, useReducer, useCallback } from "react";
import DashboardLayout from "../../Layouts/DashboardLayout";
import AssistantOverlay from "./AssistantOverlay";
import api from "../../utils/api";

// ── Status badge styles
function getStatusStyle(status) {

  const s = status?.toLowerCase();

  if (s === "accepted")
    return {
      pill: "bg-green-50 text-green-600 border border-green-200",
      label: "ACCEPTED",
    };

  if (s === "cancelled")
    return {
      pill: "bg-orange-50 text-orange-500 border border-orange-200",
      label: "CANCELLED",
    };

  if (s === "rejected")
    return {
      pill: "bg-red-50 text-red-500 border border-red-200",
      label: "REJECTED",
    };

  return {
    pill: "bg-gray-50 text-gray-500 border border-gray-200",
    label: status || "UNKNOWN",
  };
}

// ── Session user cache
const cached = sessionStorage.getItem("user");
const cachedUser = cached ? JSON.parse(cached) : null;

const initialState = {
  user: cachedUser,
  jobs: [],
  loading: true,
  showOverlay: false,
};

function reducer(state, action) {

  switch (action.type) {

    case "SET_USER":
      return { ...state, user: action.payload };

    case "SET_JOBS":
      return { ...state, jobs: action.payload };

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SHOW_OVERLAY":
      return { ...state, showOverlay: true };

    case "HIDE_OVERLAY":
      return { ...state, showOverlay: false };

    default:
      return state;
  }
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

export default function ConsumerDashboard() {

  const [state, dispatch] = useReducer(reducer, initialState);
  const { user, jobs, loading, showOverlay } = state;

  const firstName = user?.fullName?.split(" ")[0] || "User";

  // ─────────────────────────────
  // FETCH JOB HISTORY
  // ─────────────────────────────
  const fetchJobs = useCallback(async () => {

    try {

      const res = await api.get("/jobs/history");

      const data = res.data;

      const list =
        Array.isArray(data)
          ? data
          : data?.content ?? data?.jobs ?? [];

      dispatch({ type: "SET_JOBS", payload: list });

    } catch (err) {

      console.error("Failed to fetch jobs:", err);

      dispatch({ type: "SET_JOBS", payload: [] });

      if (err.response?.status === 401 || err.response?.status === 403) {
        return "STOP";
      }

    } finally {

      dispatch({ type: "SET_LOADING", payload: false });

    }

  }, []);

  // ─────────────────────────────
  // ✅ CANCEL JOB FUNCTION
  // ─────────────────────────────
  const cancelJob = async (jobId) => {

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this repair request?"
    );

    if (!confirmCancel) return;

    try {

      await api.patch(`/jobs/${jobId}/cancel`);

      // refresh job list
      fetchJobs();

    } catch (err) {

      console.error("Failed to cancel job:", err);

      alert(
        err.response?.data?.message ||
        "Unable to cancel job. It may already be accepted."
      );
    }
  };

  // ─────────────────────────────
  // POLLING
  // ─────────────────────────────
  useEffect(() => {

    fetchJobs();

    const interval = setInterval(async () => {

      const result = await fetchJobs();

      if (result === "STOP") {
        clearInterval(interval);
      }

    }, 5000);

    return () => clearInterval(interval);

  }, [fetchJobs]);

  // ─────────────────────────────
  // HEADER
  // ─────────────────────────────
  const header = (
    <div className="flex items-center justify-between mb-2">

      <p className="text-xl text-gray-700">
        Welcome back,{" "}
        <span className="font-black text-gray-900">{firstName}</span>
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

              const style = getStatusStyle(job.status);
              const status = job.status?.toLowerCase();

              const cancellable =
                status === "logged" ||
                status === "matching" ||
                status === "matched";

              return (

                <div
                  key={job.jobId}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 flex flex-col gap-2"
                >

                  <p className="text-xs text-gray-400 font-mono">
                    ID: IT{job.jobId}
                  </p>

                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">
                    Issue
                  </p>

                  <div className="flex items-start justify-between gap-3">

                    <p className="text-sm font-semibold text-gray-800">
                      "{job.issueDetails}"
                    </p>

                    <span
                      className={`text-xs font-black uppercase tracking-widest flex-shrink-0 px-3 py-1 rounded-full ${style.pill}`}
                    >
                      {style.label}
                    </span>

                  </div>

                  {job.subRegionId && (
                    <p className="text-xs text-blue-600 font-semibold uppercase">
                      SubRegion: {job.subRegionId}
                    </p>
                  )}

                  {/* ✅ CANCEL BUTTON */}
                  {cancellable && (
                    <button
                      onClick={() => cancelJob(job.jobId)}
                      className="mt-2 self-start text-xs font-bold text-red-600 hover:text-red-700"
                    >
                      Cancel Request
                    </button>
                  )}

                  {job.createdAt && (
                    <p className="text-xs text-gray-400 mt-1">
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
          onClose={() => {
            dispatch({ type: "HIDE_OVERLAY" });
            fetchJobs();
          }}
        />
      )}
    </>
  );
  }

