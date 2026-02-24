import { useEffect, useState } from "react";
import DashboardLayout from "../../Layouts/DashboardLayout";
import AssistantOverlay from "./AssistantOverlay";

const API_URL = "http://localhost:5000";

const STATUS_STYLES = {
  accepted: "text-green-600",
  cancelled: "text-orange-500",
  rejected: "text-red-500",
  open: "text-gray-500",
};

export default function ConsumerDashboard() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const firstName = user?.fullName?.split(" ")[0] || "User";

  const [jobs, setJobs] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await fetch(
        `${API_URL}/jobs?consumerId=${user?.id}`
      );

      if (!res.ok) throw new Error("Failed to fetch jobs");

      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    fetchJobs();
    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const header = (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
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

        {/* EMPTY STATE */}
        {!loading && jobs.length === 0 && (
          <div className="bg-white rounded-3xl shadow-sm p-10 sm:p-16 flex flex-col items-center justify-center text-center min-h-[320px] sm:min-h-[400px]">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-8 h-8 sm:w-10 sm:h-10">
                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-widest text-gray-900 mb-2">
              All Systems Operational
            </h2>
            <p className="text-sm text-gray-400 font-medium max-w-xs">
              No active plumbing emergencies detected.
            </p>
          </div>
        )}

        {/* JOB LIST*/}
        {!loading && jobs.length > 0 && (
          <div className="flex flex-col gap-4">
            {jobs.map((job) => {
              const formattedDate = job.createdAt
                ? new Date(job.createdAt).toLocaleDateString()
                : "";

              return (
                <div key={job.id} className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3">

                  {/* ID + DATE*/}
                  <div>
                    <p className="text-xs text-gray-400 font-mono mb-1">
                      ID: {job.id}
                    </p>

                    {/* 🆕 Date added here */}
                    {formattedDate && (
                      <p className="text-xs text-gray-400 mb-2">
                        Posted on {formattedDate}
                      </p>
                    )}

                    <div className="flex items-center gap-1 text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
                        <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.003 3.5-4.697 3.5-8.328a8.25 8.25 0 00-16.5 0c0 3.63 1.556 6.326 3.5 8.328a19.579 19.579 0 002.682 2.282 16.975 16.975 0 001.145.742z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-black uppercase tracking-widest">
                        {job.lga}, {job.state}
                      </span>
                    </div>
                  </div>

                  {/* ISSUE + STATUS */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Issue</p>
                      <p className="text-sm font-semibold text-gray-800">"{job.issue}"</p>
                    </div>
                    <span className={`text-xs font-black uppercase tracking-widest flex-shrink-0 mt-1 ${STATUS_STYLES[job.status]}`}>
                      {job.status}
                    </span>
                  </div>

                  {/* PLUMBER SECTION — ACCEPTED */}
                  {job.status === "accepted" && job.plumber && (
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                          Assigned Plumber
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-black text-blue-700 flex-shrink-0">
                            {job.plumber.initials}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">
                              {job.plumber.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
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
            setShowOverlay(false);
            fetchJobs();
          }}
        />
      )}
    </>
  );
}