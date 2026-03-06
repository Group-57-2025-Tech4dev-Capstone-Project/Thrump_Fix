import { useEffect, useRef, useState } from "react";
import api from "../../utils/api";

const TIMER_SECONDS = 30;
const POLL_INTERVAL = 3000; // check every 3 seconds

export default function StepTimer({ onMatch, onNoMatch, onCancel }) {
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const timerRef  = useRef(null);
  const pollRef   = useRef(null);

  useEffect(() => {
    // ── Countdown ──────────────────────────────────────────
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          clearInterval(pollRef.current);
          onNoMatch();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // ── Poll backend for accepted job ───────────────────────
    pollRef.current = setInterval(async () => {
      try {
        const res = await api.get("/jobs/history");
        const jobs = res.data || [];
        const acceptedJob = jobs.find(
          (j) => j.status?.toLowerCase() === "accepted"
        );
        if (acceptedJob) {
          clearInterval(timerRef.current);
          clearInterval(pollRef.current);
          // Fetch plumber details if available
          if (acceptedJob.plumberId) {
            try {
              const plumberRes = await api.get(`/plumbers/${acceptedJob.plumberId}`);
              onMatch({
                name:     plumberRes.data.fullName,
                phone:    plumberRes.data.phoneNumber,
                verified: plumberRes.data.verified,
              });
            } catch {
              onMatch(null);
            }
          } else {
            onMatch(null);
          }
        }
      } catch {
        // silently ignore poll errors
      }
    }, POLL_INTERVAL);

    return () => {
      clearInterval(timerRef.current);
      clearInterval(pollRef.current);
    };
  }, []);

  function handleCancel() {
    clearInterval(timerRef.current);
    clearInterval(pollRef.current);
    onCancel();
  }

  const progress      = 1 - timeLeft / TIMER_SECONDS;
  const radius        = 54;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="px-5 py-10 flex flex-col items-center gap-6">

      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="6" />
          <circle
            cx="60" cy="60" r={radius}
            fill="none" stroke="#2563eb" strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            strokeLinecap="round"
          />
        </svg>
        <span className="text-3xl font-black text-orange-500">
          {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
          {String(timeLeft % 60).padStart(2, "0")}
        </span>
      </div>

      <h3 className="text-base font-black uppercase tracking-widest text-gray-900 text-center">
        Finding Verified Plumber
      </h3>

      <button
        onClick={handleCancel}
        className="text-xs font-bold uppercase tracking-widest text-gray-400 border border-gray-200 px-6 py-2.5 rounded-full hover:text-red-500 hover:border-red-300 transition"
      >
        Cancel Request
      </button>
    </div>
  );
}
