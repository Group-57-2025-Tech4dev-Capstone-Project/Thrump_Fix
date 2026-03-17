//Frontend/src/pages/plumber/PlumberDashboard
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LogoIcon from "../../Components/icons/Logo";
import api from "../../utils/api";
import route from "../../utils/routes";

// ─── Inline DashboardLayout ────────────────────────────────────────────────
function DashboardLayout({ children, statusLabel, statusColor, header }) {
  const navigate = useNavigate();
  const fileInputRef = useRef();

//   const storedUser = localStorage.getItem("user");
  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const [avatar, setAvatar] = useState(user?.avatar || null);

  async function handleLogout() {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      // still clear locally even if request fails
    } finally {
//       localStorage.removeItem("user");
      sessionStorage.clear();
      navigate(route.Login);
    }
  }

  function handleAvatarClick() {
    fileInputRef.current.click();
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setAvatar(imageUrl);
    const updatedUser = { ...user, avatar: imageUrl };
//     localStorage.setItem("user", JSON.stringify(updatedUser));
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
  }

  const firstName = user?.fullName?.split(" ")[0] || "User";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* LEFT */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <LogoIcon />
              {statusLabel && (
                <span className={`hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full border ${
                  statusColor === "green"
                    ? "border-green-300 text-green-600 bg-green-50"
                    : "border-gray-300 text-gray-500"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusColor === "green" ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                  {statusLabel}
                </span>
              )}
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-100 pl-1.5 pr-2 sm:pr-3 py-1 rounded-full">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                <div
                  onClick={handleAvatarClick}
                  title="Upload profile image"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-400 transition flex-shrink-0 text-gray-500"
                >
                  {avatar ? (
                    <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="hidden sm:block text-sm font-semibold text-gray-800">{firstName}</span>
                <span className="text-xs font-bold text-green-600 bg-green-100 px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">
                  ✓ <span className="hidden sm:inline">Verified</span>
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 sm:gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-300 px-2.5 sm:px-3 py-1.5 rounded-full transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* PAGE HEADER */}
      {header && (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pt-5 sm:pt-7 lg:pt-8">
          {header}
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-6">
        {children}
      </main>
    </div>
  );
}

// ─── Scanning Animation Component ─────────────────────────────────────────
function ScanningRadar() {
  return (
    <div className="relative flex items-center justify-center w-24 h-24 mx-auto">
      <span className="absolute w-24 h-24 rounded-full border-2 border-blue-200 animate-ping opacity-30" />
      <span className="absolute w-16 h-16 rounded-full border-2 border-blue-300 animate-ping opacity-40" style={{ animationDelay: "0.3s" }} />
      <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shadow-inner relative overflow-hidden">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "conic-gradient(from 0deg, transparent 70%, rgba(59,130,246,0.15) 100%)",
            animation: "spin 2s linear infinite",
          }}
        />
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400 relative z-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>
  );
}

// ─── Marketplace Feed Panel ────────────────────────────────────────────────
function MarketplaceFeed({ leads, scanning, onClaim, claimingId }) {
  if (scanning || leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-24 gap-6">
        <ScanningRadar />
        <div className="text-center space-y-2">
          <p className="text-lg font-extrabold tracking-widest text-gray-800 uppercase">
            Scanning<span className="animate-pulse">...</span>
          </p>
          <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
            Stay online to receive plumbing leads in your region. Your first verified job match is a free trial; subsequent access requires an active subscription.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {leads.map((lead) => (
        <div key={lead.jobId} className="bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between gap-4 hover:shadow-md hover:border-blue-200 transition-all">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wide text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                Plumbing
              </span>
              <span className="text-xs text-gray-400">
                {lead.createdAt ? new Date(lead.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-800 truncate">{lead.issueDetails}</p>
            <p className="text-xs text-gray-500 mt-0.5">{lead.address}</p>
          </div>
          <button
            onClick={() => onClaim(lead.jobId)}
            disabled={claimingId === lead.jobId}
            className="flex-shrink-0 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 px-3 py-1.5 rounded-lg transition"
          >
            {claimingId === lead.jobId ? "Claiming..." : "Claim"}
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Main Plumber Dashboard ────────────────────────────────────────────────
export default function PlumberDashboard() {
  const [scanning, setScanning]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [leads, setLeads]           = useState([]);
  const [plumber, setPlumber]       = useState(null);
  const [claimingId, setClaimingId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

//   const storedUser  = localStorage.getItem("user");
  const storedUser  = sessionStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const userId      = currentUser?.id || currentUser?.userId;

  // ── 1. Fetch plumber profile (for region label + plumberId) ──
  useEffect(() => {
    if (!userId) return;
    const fetchPlumber = async () => {
      try {
        const res = await api.get(`/plumbers/${userId}`);
        setPlumber(res.data);
      } catch (err) {
        console.error("Failed to fetch plumber profile:", err);
      }
    };
    fetchPlumber();
  }, [userId]);

  // ── 2. Fetch available jobs ──────────────────────────────────
  const fetchLeads = async () => {
    try {
      const res = await api.get("/jobs/available");
      const jobs = res.data || [];
      setLeads(jobs);
      setScanning(jobs.length === 0); // show radar only if no jobs
    } catch (err) {
      console.error("Failed to fetch available jobs:", err);
      setScanning(true);
    }
  };

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, []);

  // ── 3. Claim (accept) a job ──────────────────────────────────
//   async function handleClaim(jobId) {
//     if (!userId) return;
//     setClaimingId(jobId);
//     try {
//       await api.patch(`/jobs/${jobId}/accept?plumberId=${userId}`);
//       // remove claimed job from the list immediately
//       setLeads((prev) => prev.filter((j) => j.jobId !== jobId));
//     } catch (err) {
//       console.error("Failed to claim job:", err);
//       alert(err.response?.data?.message || "Could not claim job. Please try again.");
//     } finally {
//       setClaimingId(null);
//     }
//   }

  async function handleClaim(jobId) {
    if (!userId) return;
    setClaimingId(jobId);
    try {
      await api.patch(`/jobs/${jobId}/accept`);
      // remove claimed job from the list immediately
      setLeads((prev) => prev.filter((j) => j.jobId !== jobId));
    } catch (err) {
      console.error("Failed to claim job:", err);
      alert(err.response?.data?.message || "Could not claim job. Please try again.");
    } finally {
      setClaimingId(null);
    }
  }

  // ── 4. Refresh button ────────────────────────────────────────
  async function handleRefresh() {
    setRefreshing(true);
    await fetchLeads();
    setRefreshing(false);
  }

  const regionLabel = plumber
    ? `${plumber.localGovernanceArea || ""}, ${plumber.subRegion || ""}`.trim().replace(/^,|,$/, "")
    : "Your Region";

  return (
    <DashboardLayout statusLabel="Active Online" statusColor="green">

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Section header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <h2 className="text-xs font-extrabold uppercase tracking-[0.15em] text-gray-800">
                Marketplace Opportunities
              </h2>
            </div>
            <p className="text-[11px] uppercase tracking-widest text-gray-400 font-medium pl-4">
              Regional Feed: {regionLabel}
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-600 hover:text-blue-600 border border-gray-200 hover:border-blue-300 bg-gray-50 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all disabled:opacity-60"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Refresh Live Feed
          </button>
        </div>

        {/* Feed content */}
        <div className="px-5 sm:px-6">
          <MarketplaceFeed
            leads={leads}
            scanning={scanning}
            onClaim={handleClaim}
            claimingId={claimingId}
          />
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </DashboardLayout>
  );
}