import { useEffect, useRef, useState } from "react";

const TIMER_SECONDS = 30;

export default function StepTimer({ onMatch, onNoMatch, onCancel }) {
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          onNoMatch(); // ✅ ONLY timeout triggers no match
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  function formatTime(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function handleCancel() {
    clearInterval(timerRef.current);
    onCancel();
  }

  const progress = 1 - timeLeft / TIMER_SECONDS;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="px-5 py-10 flex flex-col items-center gap-6">

      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="6" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#2563eb"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            strokeLinecap="round"
          />
        </svg>
        <span className="text-3xl font-black text-orange-500">
          {formatTime(timeLeft)}
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