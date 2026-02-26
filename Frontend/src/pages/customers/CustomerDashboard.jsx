import { useEffect, useState } from "react";
import DashboardLayout from "../../Layouts/DashboardLayout";
import AssistantOverlay from "./AssistantOverlay";
import api from "../../utils/api";

const STATUS_STYLES = {
  accepted:  "bg-green-100 text-green-800 border border-green-300",
  cancelled: "bg-orange-100 text-orange-800 border border-orange-300",
  rejected:  "bg-red-100 text-red-800 border border-red-300",
  open:      "bg-gray-100 text-gray-800 border border-gray-300",
};

export default function ConsumerDashboard() {
  const cached = localStorage.getItem("user");
  const cachedUser = cached ? JSON.parse(cached) : null;

  const [user, setUser] = useState(cachedUser);
  const [jobs, setJobs] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  const firstName = user?.fullName?.split(" ")?.[0] || "User";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        if (cachedUser) setUser(cachedUser);
      }
    };
    fetchUser();
  }, []);

  const fetchJobs = async () => {
    const userId = user?.id || cachedUser?.id || cachedUser?.userId;
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get(`/jobs?consumerId=${userId}`);
      setJobs(res.data || []);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchJobs();
      const interval = setInterval(fetchJobs, 5000);
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const trialExpired = user?.subscriptionStatus === "TRIAL_EXPIRED" || 
                       user?.trialExpired === true;

  const shouldShowTrialBanner = trialExpired && !loading && jobs.length > 0;

  const handleUpgradeSuccess = async () => {
    setUpgrading(false);
    try {
      const res = await api.get("/users/me");
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      console.error("Failed to refresh user after upgrade:", err);
    }
  };

  const handleUpgradeClick = () => {
    setUpgrading(true);
    setTimeout(() => {
      alert("Payment successful! (simulated)");
      handleUpgradeSuccess();
    }, 2000);
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const header = (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
      <div>
        <p className="text-base text-gray-500 font-light">Welcome back,</p>
        <h1 className="text-2xl font-black text-gray-900">{firstName}</h1>
      </div>
      <button
        onClick={() => setShowOverlay(true)}
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-3 rounded-2xl transition shadow-md shadow-blue-200 w-full sm:w-auto"
      >
        + New Repair Request
      </button>
    </div>
  );

  return (
    <>
      <DashboardLayout header={header}>

        {shouldShowTrialBanner && (
          <div className="bg-orange-500 text-white px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl mb-6 shadow-sm">
            <div className="font-medium text-base">
              Your free trial has expired. Upgrade to continue.
            </div>
            <button
              onClick={handleUpgradeClick}
              disabled={upgrading}
              className={`bg-white text-orange-600 font-bold px-5 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-2 min-w-[140px] justify-center ${
                upgrading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-100"
              }`}
            >
              {upgrading ? "UPGRADING..." : "UPGRADE NOW"}
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px] text-gray-600">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600"></div>
            <span className="ml-3">Loading...</span>
          </div>
        ) : jobs.length === 0 ? (
          // Smaller, more compact empty state – closer to your screenshot style
          <div className="bg-white rounded-3xl shadow-sm p-8 sm:p-12 flex flex-col items-center justify-center text-center min-h-[280px] sm:min-h-[320px]">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-7 h-7 sm:w-8 sm:h-8">
                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-gray-900 mb-2">
              ALL SYSTEMS OPERATIONAL
            </h2>
            <p className="text-sm text-gray-500 font-medium max-w-xs">
              No active plumbing emergencies detected.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {jobs.map((job) => (
              <div 
                key={job.id} 
                className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex flex-col gap-3 border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <p className="text-xs text-gray-500 font-mono mb-0.5">
                      ID: {job.id}
                    </p>
                    <div className="flex items-center gap-1.5 text-blue-600 mb-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.003 3.5-4.697 3.5-8.328a8.25 8.25 0 00-16.5 0c0 3.63 1.556 6.326 3.5 8.328a19.579 19.579 0 002.682 2.282 16.975 16.975 0 001.145.742z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-semibold uppercase tracking-wide">
                        {job.lga}, {job.state}
                      </span>
                    </div>
                    {job.createdAt && (
                      <p className="text-xs text-gray-500">
                        {formatDate(job.createdAt)}
                      </p>
                    )}
                  </div>

                  <span 
                    className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border ${STATUS_STYLES[job.status?.toLowerCase()] || "bg-gray-100 text-gray-800"}`}
                  >
                    {job.status?.toUpperCase() || "OPEN"}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">ISSUE</p>
                  <p className="text-base font-semibold text-gray-900">"{job.issue}"</p>
                </div>

                {job.status?.toLowerCase() === "accepted" && job.plumber && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-black text-blue-700 flex-shrink-0">
                        {job.plumber.initials || job.plumber?.name?.slice(0,2).toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {job.plumber.name}
                        </p>
                        {job.plumber.verified && (
                          <p className="text-xs text-green-600 font-medium">Verified</p>
                        )}
                      </div>
                    </div>

                    <a
                      href={`tel:${job.plumber.phone || ''}`}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold text-sm px-4 py-2 rounded-xl transition flex items-center justify-center gap-2 shadow-sm shadow-green-200 min-w-[140px]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M10.5 18.75a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" />
                        <path fillRule="evenodd" d="M2.25 6.75A.75.75 0 013 6h18a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75H3a.75.75 0 01-.75-.75V6.75zm1.5 1.125v7.5h15v-7.5h-15z" clipRule="evenodd" />
                      </svg>
                      Call Plumber
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </DashboardLayout>

      {showOverlay && (
        <AssistantOverlay
          onClose={() => {
            setShowOverlay(false);
            fetchJobs();
          }}
        />
      )}
    </>
  );
}