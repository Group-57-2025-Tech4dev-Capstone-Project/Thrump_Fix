import { useEffect, useState } from "react";
import PlumberClock from "../../assets/PlumberClock.svg?react"

export default function CountdownTimer({ createdAt }) {
  const WINDOW = 30;

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
    <div className="flex items-center gap-1 text-[#FF6B00] flex-shrink-0">
      <PlumberClock/>

{/* className={`w-4 h-4 ${color}`} */}
      <span className="text-xs font-black tabular-nums text-[#FF6B00]">{secs}</span>
    </div>

  //      <div className="flex items-center gap-1 flex-shrink-0">
  //   <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#FF6B00] text-white text-xs font-black">
  //     {secs}
  //   </div>
  // </div>

  );
}