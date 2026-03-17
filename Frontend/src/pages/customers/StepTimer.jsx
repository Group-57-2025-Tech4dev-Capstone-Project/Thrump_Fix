// import { useEffect, useRef, useState } from "react";
// import api from "../../utils/api";

// const TIMER_SECONDS = 60;      // 5 minutes
// const POLL_INTERVAL = 3000;     // 3 seconds

// export default function StepTimer({ jobId, onMatch, onNoMatch, onCancel }) {
//   const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
//   const timerRef = useRef(null);
//   const pollRef = useRef(null);
//   const [isExpired, setIsExpired] = useState(false);
//   const [cancelLoading, setCancelLoading] = useState(false);

//   // Auto-trigger onNoMatch when timer expires
//   useEffect(() => {
//     if (isExpired) {
//       console.log("[TIMER] Expired → calling onNoMatch (REJECTED)");
//       onNoMatch();
//     }
//   }, [isExpired, onNoMatch]);

//   useEffect(() => {
//     if (!jobId) {
//       console.warn("[TIMER] No jobId passed — cannot poll or cancel properly");
//     }

//     // Countdown
//     timerRef.current = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(timerRef.current);
//           clearInterval(pollRef.current);
//           setIsExpired(true);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     // Poll for match
//     pollRef.current = setInterval(async () => {
//       if (isExpired) return;
//       try {
//         const res = await api.get("/jobs/history");
//         const jobs = Array.isArray(res.data) ? res.data : [];
//         const matched = jobs.find(j => j.jobId === jobId && j.status?.toLowerCase() === "matched");

//         if (matched) {
//           console.log("[TIMER] Job matched — stopping timer");
//           clearInterval(timerRef.current);
//           clearInterval(pollRef.current);

//           // Try to get plumber details (fallback if /jobs/{id} fails)
//           let plumberInfo = { name: "Verified Plumber", phone: null, initials: "VP", verified: true };
//           try {
//             const detail = await api.get(`/jobs/${jobId}`);
//             const plumber = detail.data?.plumber || {};
//             plumberInfo = {
//               name: plumber.fullName || plumber.name || "Verified Plumber",
//               phone: plumber.phoneNumber || plumber.phone,
//               initials: (plumber.fullName || "P").split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase(),
//               verified: plumber.verified !== false,
//             };
//           } catch (e) {
//             console.warn("[TIMER] Could not fetch plumber details:", e.message);
//           }

//           onMatch(plumberInfo);
//         }
//       } catch (err) {
//         console.warn("[TIMER] Poll failed:", err.message);
//       }
//     }, POLL_INTERVAL);

//     return () => {
//       clearInterval(timerRef.current);
//       clearInterval(pollRef.current);
//     };
//   }, [jobId, onMatch, onNoMatch, isExpired]);

//   const handleCancel = async () => {
//     if (!jobId) {
//       alert("Cannot cancel — job ID missing");
//       onCancel();
//       return;
//     }

//     setCancelLoading(true);
//     try {
//       console.log("[CANCEL] Calling backend cancel for job", jobId);
//       await api.patch(`/jobs/${jobId}/cancel`);
//       console.log("[CANCEL] Backend success — job should now be CANCELLED");
//       onNoMatch(); // Force REJECTED/CANCELLED view on dashboard
//     } catch (err) {
//       console.error("[CANCEL] Failed:", err.response?.data || err.message);
//       alert("Cancel failed — try again or contact support");
//     } finally {
//       setCancelLoading(false);
//       onCancel(); // Always close overlay
//     }
//   };

//   const progress = 1 - timeLeft / TIMER_SECONDS;
//   const radius = 54;
//   const circumference = 2 * Math.PI * radius;

//   return (
//     <div className="px-5 py-10 flex flex-col items-center gap-6">
//       <div className="relative w-36 h-36 flex items-center justify-center">
//         <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
//           <circle cx="60" cy="60" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="6" />
//           <circle
//             cx="60" cy="60" r={radius}
//             fill="none" stroke="#2563eb" strokeWidth="6"
//             strokeDasharray={circumference}
//             strokeDashoffset={circumference * (1 - progress)}
//             strokeLinecap="round"
//           />
//         </svg>
//         <span className="text-3xl font-black text-orange-500">
//           {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
//         </span>
//       </div>

//       <h3 className="text-base font-black uppercase tracking-widest text-gray-900 text-center">
//         Finding Verified Plumber
//       </h3>

//       <button
//         onClick={handleCancel}
//         disabled={cancelLoading}
//         className={`text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-full transition w-full max-w-xs
//           ${cancelLoading 
//             ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
//             : "text-red-600 border border-red-300 hover:bg-red-50"}`}
//       >
//         {cancelLoading ? "Cancelling..." : "Cancel Request"}
//       </button>
//     </div>
//   );
// }





import { useEffect, useRef, useState } from "react";
import api from "../../utils/api";

const TIMER_SECONDS = 30; 

export default function StepTimer({ jobId, onMatch, onNoMatch, onCancel }) {
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const timerRef = useRef(null);
  const pollRef = useRef(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    // Countdown
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

    // Poll for MATCHED status
    pollRef.current = setInterval(async () => {
      try {
        const res = await api.get("/jobs/history");
        console.log("[STEP TIMER POLL] Checking jobs history for jobId", jobId);
        const matched = (res.data || []).find(
          (j) => j.jobId === jobId && j.status?.toUpperCase() === "MATCHED"
        );

        if (matched) {
          console.log("[STEP TIMER] Job matched!");
          clearInterval(timerRef.current);
          clearInterval(pollRef.current);
          onMatch();
        }
      } catch (err) {
        console.warn("[TIMER POLL] Failed", err.message);
      }
    }, 2000); 

    return () => {
      clearInterval(timerRef.current);
      clearInterval(pollRef.current);
    };
  }, [jobId, onMatch, onNoMatch]);

  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      await api.patch(`/jobs/${jobId}/cancel`);
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
        className="text-xs font-bold uppercase tracking-widest text-red-600 border border-red-300 px-6 py-2.5 rounded-full hover:bg-red-50 disabled:opacity-50"
      >
        {cancelLoading ? "Cancelling..." : "Cancel Request"}
      </button>
    </div>
  );
}





// import { useEffect, useRef, useState } from "react";
// import api from "../../utils/api";

// const TIMER_SECONDS = 60; // 1 minute for demo
// const POLL_INTERVAL = 3000; // 3 seconds

// export default function StepTimer({ jobId, onMatch, onNoMatch, onCancel }) {
//   const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
//   const timerRef = useRef(null);
//   const pollRef = useRef(null);
//   const expiredRef = useRef(false);
//   const matchedRef = useRef(false);
//   const [cancelLoading, setCancelLoading] = useState(false);

//   // Auto-trigger onNoMatch when timer expires
//   useEffect(() => {
//     if (timeLeft <= 0 && !matchedRef.current) {
//       expiredRef.current = true;
//       console.log("[TIMER] Expired → calling onNoMatch");
//       onNoMatch();
//     }
//   }, [timeLeft, onNoMatch]);

//   useEffect(() => {
//     if (!jobId) {
//       console.warn("[TIMER] No jobId passed — cannot poll or cancel properly");
//       return;
//     }

//     // Countdown
//     timerRef.current = setInterval(() => {
//       setTimeLeft(prev => {
//         if (prev <= 1) {
//           clearInterval(timerRef.current);
//           clearInterval(pollRef.current);
//           expiredRef.current = true;
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     // Poll for match
//     pollRef.current = setInterval(async () => {
//       if (expiredRef.current || matchedRef.current) return;

//       try {
//         const res = await api.get("/plumbers/assigned-Jobs");
//         const jobs = Array.isArray(res.data) ? res.data : [];
//         const matched = jobs.find(j => j.jobId === jobId && j.status?.toLowerCase() === "matched");

//         if (matched) {
//           matchedRef.current = true;
//           console.log("[TIMER] Job matched — stopping timer");
//           clearInterval(timerRef.current);
//           clearInterval(pollRef.current);

//           // Fetch plumber info
//           let plumberInfo = { name: "Verified Plumber", phone: null, initials: "VP", verified: true };
//           try {
//             if (matched.plumberId) {
//               const detail = await api.get(`/plumbers/${matched.plumberId}`);
//               const plumber = detail.data || {};
//               plumberInfo = {
//                 name: plumber.fullName || "Verified Plumber",
//                 phone: plumber.phoneNumber || plumber.phone,
//                 initials: (plumber.fullName || "P").split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase(),
//                 verified: plumber.verificationStatus !== "UNVERIFIED",
//               };
//             }
//           } catch (e) {
//             console.warn("[TIMER] Could not fetch plumber details:", e.message);
//           }

//           onMatch(plumberInfo);
//         }
//       } catch (err) {
//         console.warn("[TIMER] Poll failed:", err.message);
//       }
//     }, POLL_INTERVAL);

//     return () => {
//       clearInterval(timerRef.current);
//       clearInterval(pollRef.current);
//     };
//   }, [jobId, onMatch, onNoMatch]);

//   const handleCancel = async () => {
//     if (!jobId) {
//       alert("Cannot cancel — job ID missing");
//       onCancel();
//       return;
//     }

//     setCancelLoading(true);
//     try {
//       console.log("[CANCEL] Cancelling job", jobId);
//       await api.patch(`/jobs/${jobId}/cancel`);
//       console.log("[CANCEL] Cancelled successfully");
//       expiredRef.current = true;
//       onNoMatch();
//     } catch (err) {
//       console.error("[CANCEL] Failed:", err.response?.data || err.message);
//       alert("Cancel failed — try again or contact support");
//     } finally {
//       setCancelLoading(false);
//       onCancel();
//     }
//   };

//   const progress = 1 - timeLeft / TIMER_SECONDS;
//   const radius = 54;
//   const circumference = 2 * Math.PI * radius;

//   return (
//     <div className="px-5 py-10 flex flex-col items-center gap-6">
//       <div className="relative w-36 h-36 flex items-center justify-center">
//         <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
//           <circle cx="60" cy="60" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="6" />
//           <circle
//             cx="60"
//             cy="60"
//             r={radius}
//             fill="none"
//             stroke="#2563eb"
//             strokeWidth="6"
//             strokeDasharray={circumference}
//             strokeDashoffset={circumference * (1 - progress)}
//             strokeLinecap="round"
//           />
//         </svg>
//         <span className="text-3xl font-black text-orange-500">
//           {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
//         </span>
//       </div>

//       <h3 className="text-base font-black uppercase tracking-widest text-gray-900 text-center">
//         Finding Verified Plumber
//       </h3>

//       <button
//         onClick={handleCancel}
//         disabled={cancelLoading}
//         className={`text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-full transition w-full max-w-xs
//           ${cancelLoading 
//             ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
//             : "text-red-600 border border-red-300 hover:bg-red-50"}`}
//       >
//         {cancelLoading ? "Cancelling..." : "Cancel Request"}
//       </button>
//     </div>
//   );
// }