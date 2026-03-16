import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ─── Inline DashboardLayout ───────────────────────────────────────────────
function DashboardLayout({ children, statusLabel, statusColor, header }) {
  const navigate = useNavigate();
  const fileInputRef = useRef();
//   const storedUser = localStorage.getItem("user");
  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const [avatar, setAvatar] = useState(user?.avatar || null);

  function handleLogout() {
//     localStorage.removeItem("user");
   sessionStorage.clear();
    navigate("/login");
  }
  function handleAvatarClick() { fileInputRef.current.click(); }
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setAvatar(imageUrl);
//     localStorage.setItem("user", JSON.stringify({ ...user, avatar: imageUrl }));
    sessionStorage.setItem("user", JSON.stringify({ ...user, avatar: imageUrl }));
  }

  const firstName = user?.fullName?.split(" ")[0] || "Musa";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                    <path d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                  </svg>
                </div>
                <span className="text-base font-extrabold text-blue-700 tracking-tight">PlumbConnect</span>
              </div>
              {statusLabel && (
                <span className={`hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full border ${statusColor === "green" ? "border-green-300 text-green-600 bg-green-50" : "border-gray-300 text-gray-500"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusColor === "green" ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                  {statusLabel}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-100 pl-1.5 pr-2 sm:pr-3 py-1 rounded-full">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                <div onClick={handleAvatarClick} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-400 transition flex-shrink-0 text-gray-500">
                  {avatar ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" /> : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="hidden sm:block text-sm font-semibold text-gray-800">{firstName}</span>
                <span className="text-xs font-bold text-green-600 bg-green-100 px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">✓ <span className="hidden sm:inline">Verified</span></span>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-1 sm:gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-300 px-2.5 sm:px-3 py-1.5 rounded-full transition">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      {header && (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pt-5 sm:pt-7 lg:pt-8">{header}</div>
      )}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-6">
        {children}
      </main>
    </div>
  );
}

// ─── Urgency Badge ────────────────────────────────────────────────────────
function UrgencyBadge({ text }) {
  const isUrgent = text?.toLowerCase().includes("urgent");
  if (!isUrgent) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
      Urgent
    </span>
  );
}

// ─── Countdown Timer ──────────────────────────────────────────────────────
function CountdownTimer({ initialSeconds }) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useState(() => {
    const interval = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const isLow = seconds < 60;

  return (
    <span className={`flex items-center gap-1 text-xs font-bold tabular-nums ${isLow ? "text-red-500" : "text-orange-500"}`}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {mins}:{String(secs).padStart(2, "0")}
    </span>
  );
}

// ─── Category Icon ────────────────────────────────────────────────────────
function CategoryIcon({ description }) {
  const text = description?.toLowerCase() || "";
  if (text.includes("heat") || text.includes("boiler") || text.includes("hot water")) {
    return (
      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-orange-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
        </svg>
      </div>
    );
  }
  if (text.includes("leak") || text.includes("pipe") || text.includes("drain") || text.includes("sink") || text.includes("block")) {
    return (
      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-blue-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-gray-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    </div>
  );
}

// ─── Single Job Card ──────────────────────────────────────────────────────
function JobCard({ job, onClaim }) {
  const [claimed, setClaimed] = useState(false);

  function handleClaim() {
    setClaimed(true);
    onClaim?.(job.id);
  }

  return (
    <div className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden
      ${claimed
        ? "border-green-200 opacity-60"
        : "border-gray-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50"
      }`}
    >
      <div className={`h-0.5 w-full ${claimed ? "bg-green-400" : "bg-gradient-to-r from-blue-500 via-blue-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity"}`} />

      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <CategoryIcon description={job.description} />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-blue-700 truncate">{job.customerName}</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-500 flex-shrink-0">
                  <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.307 4.491 4.491 0 01-1.307-3.497A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
                <UrgencyBadge text={job.description} />
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-gray-400 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span className="text-xs text-gray-400 font-medium">{job.location}</span>
              </div>
            </div>
          </div>
          <CountdownTimer initialSeconds={job.timerSeconds} />
        </div>

        {/* Description */}
        <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4 border border-gray-100">
          <p className="text-sm text-gray-600 leading-relaxed">{job.description}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {job.tags?.map((tag) => (
              <span key={tag} className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          {claimed ? (
            <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-4 py-2 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Claimed
            </span>
          ) : (
            <button
              onClick={handleClaim}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 px-4 py-2 rounded-xl transition-all shadow-sm shadow-blue-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              Claim Job
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sample Jobs Data ─────────────────────────────────────────────────────
const SAMPLE_JOBS = [
  {
    id: 1,
    customerName: "Adebayo Okon",
    location: "Ikeja LCDA",
    timerSeconds: 59,
    description: "Urgent: Kitchen sink completely blocked and water backing up into the dishwasher. Need someone to come today if possible. The drainage is very slow and there's a bad smell coming from the pipes.",
    tags: ["Drainage", "Blockage"],
  },
  {
    id: 2,
    customerName: "Oluwaseun Akinlade",
    location: "Ikeja LCDA",
    timerSeconds: 119,
    description: "Hot water heater making loud banging noises and leaking from the bottom. Water temperature is also inconsistent. Not sure if it needs repair or replacement.",
    tags: ["Water Heater", "Leak"],
  },
  {
    id: 3,
    customerName: "Funmi Adeyemi",
    location: "Surulere LCDA",
    timerSeconds: 210,
    description: "Bathroom pipe burst overnight, there's water on the floor. I've shut off the main valve. Need an emergency fix as soon as possible.",
    tags: ["Emergency", "Burst Pipe"],
  },
];

// ─── Available Jobs Page ──────────────────────────────────────────────────
export default function AvailableJobs() {
  const [jobs] = useState(SAMPLE_JOBS);
  const [filter, setFilter] = useState("all");

  const areas = [...new Set(jobs.map((j) => j.location))];
  const filtered = filter === "all" ? jobs : jobs.filter((j) => j.location === filter);

  return (
    <DashboardLayout statusLabel="Active Online" statusColor="green">

      {/* Page Title */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">Available Jobs</h1>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">
            Showing jobs for{" "}
            <span className="font-bold text-gray-600">Ikeja &amp; Surulere LCDAs</span>
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Online
        </span>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
            filter === "all"
              ? "bg-blue-600 text-white border-blue-600 shadow-sm"
              : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600"
          }`}
        >
          All Areas
        </button>
        {areas.map((area) => (
          <button
            key={area}
            onClick={() => setFilter(area)}
            className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
              filter === area
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            {area}
          </button>
        ))}
      </div>

      {/* Job count */}
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          {filtered.length} job{filtered.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {/* Job cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No jobs in this area right now.</div>
        ) : (
          filtered.map((job) => <JobCard key={job.id} job={job} />)
        )}
      </div>

    </DashboardLayout>
  );
}