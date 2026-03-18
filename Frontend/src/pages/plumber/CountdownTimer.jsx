import { useEffect, useState } from "react";

export default function CountdownTimer({ createdAt }) {
  const WINDOW = 5 * 60; // 5 minutes

  function calcRemaining() {
    if (!createdAt) return WINDOW;
    const elapsed = Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000);
    return Math.max(0, WINDOW - elapsed);
  }

  const [seconds, setSeconds] = useState(calcRemaining());

  useEffect(() => {
    const id = setInterval(() => setSeconds(calcRemaining), 1000);
    return () => clearInterval(id);
  }, [createdAt]);

  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  const pct = seconds / WINDOW;
  const color = pct > 0.5 ? "text-green-500" : pct > 0.2 ? "text-orange-500" : "text-red-500";

  return (
    <div className={`flex items-center gap-1 flex-shrink-0 ${color}`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
      </svg>
      <span className="text-xs font-black tabular-nums">{mins}:{secs}</span>
    </div>
  );
}