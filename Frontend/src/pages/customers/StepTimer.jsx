import { useEffect, useRef, useState } from "react";
import api from "../../utils/api";

const TIMER_SECONDS = 30;

export default function StepTimer({ jobId, onMatch, onNoMatch, onCancel }) {
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [expired, setExpired] = useState(false);   // ← separate flag, not set inside setState
  const timerRef = useRef(null);
  const pollRef = useRef(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  // ── Trigger onNoMatch OUTSIDE of setState — fixes React warning
  useEffect(() => {
    if (expired) {
      console.log("[TIMER EXPIRED] No plumber accepted — showing no match screen");
      onNoMatch();
    }
  }, [expired, onNoMatch]);

  useEffect(() => {
    if (!jobId) return;

    // ── Countdown timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          clearInterval(pollRef.current);
          setExpired(true); // ← safe: just sets state, onNoMatch called in useEffect above
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // ── Poll for MATCHED status every 2 seconds
    pollRef.current = setInterval(async () => {
      try {
        const res = await api.get("/jobs/history");
        console.log("[STEP TIMER POLL] Checking jobs history for jobId", jobId);
        const jobs = Array.isArray(res.data) ? res.data : [];
        const matched = jobs.find(
          (j) => j.jobId === jobId && j.status?.toUpperCase() === "MATCHED"
        );

        if (matched) {
          console.log("[STEP TIMER] ✅ Job matched! Stopping timer.");
          clearInterval(timerRef.current);
          clearInterval(pollRef.current);
          onMatch();
        }
      } catch (err) {
        console.warn("[TIMER POLL] Failed:", err.message);
      }
    }, 2000);

    return () => {
      clearInterval(timerRef.current);
      clearInterval(pollRef.current);
    };
  }, [jobId, onMatch, onNoMatch]);

  const handleCancel = async () => {
    setCancelLoading(true);
    clearInterval(timerRef.current);
    clearInterval(pollRef.current);
    try {
      await api.patch(`/jobs/${jobId}/cancel`);
      console.log("[CANCEL] Job cancelled successfully");
      onNoMatch();
    } catch (err) {
      console.error("[CANCEL]", err.response?.data || err.message);
    } finally {
      setCancelLoading(false);
      onCancel();
    }
  };

  const progress = 1 - timeLeft / TIMER_SECONDS;
  const circumference = 2 * Math.PI * 54;

  return (
    <div className="px-5 py-10 flex flex-col items-center gap-6">
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="6" />
          <circle
            cx="60" cy="60" r="54"
            fill="none" stroke="#2563eb" strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            strokeLinecap="round"
          />
        </svg>
        <span className="text-3xl font-black text-orange-500">
          {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
        </span>
      </div>

      <h3 className="text-base font-black uppercase tracking-widest text-gray-900 text-center">
        Finding Verified Plumber
      </h3>

      <button
        onClick={handleCancel}
        disabled={cancelLoading}
        className="text-xs font-bold uppercase tracking-widest text-red-600 border border-red-300 px-6 py-2.5 rounded-full hover:bg-red-50 disabled:opacity-50 w-full max-w-xs"
      >
        {cancelLoading ? "Cancelling..." : "Cancel Request"}
      </button>
    </div>
  );
}
