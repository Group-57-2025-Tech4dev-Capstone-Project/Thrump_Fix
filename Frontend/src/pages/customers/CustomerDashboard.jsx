import { useState } from "react";
import { Card } from "../../Components/card/Card";
import Button from "../../Components/buttons/Buttons";
import DashboardLayout from "../../Layouts/DashboardLayout";
// import AssistantOverlay from "./AssistantOverlay";

// Mock jobs — replace with real API data later
// Set to [] to see the empty state
const MOCK_JOBS = [
  {
    id: "IT18928BY", lga: "Agege", state: "Lagos",
    issue: "leak", status: "accepted",
    plumber: { name: "Musa Abdullahi", initials: "MA" },
  },
  {
    id: "IT28039BY", lga: "Ikeja", state: "Lagos",
    issue: "broken pipe", status: "cancelled",
    plumber: { name: "Ahmed Oladipo", initials: "AO" },
  },
  {
    id: "IT38628BY", lga: "Surulere", state: "Lagos",
    issue: "clogged drain", status: "rejected",
    plumber: { name: "Bola Ibrahim", initials: "BI" },
  },
];

const STATUS_STYLES = {
  accepted: "bg-blue-50 text-blue-600",
  cancelled: "bg-red-50 text-red-500",
  rejected: "bg-orange-50 text-orange-500",
};

export default function ConsumerDashboard() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const firstName = user?.fullName?.split(" ")[0] || "User";

  const [jobs] = useState(MOCK_JOBS);
  const [showOverlay, setShowOverlay] = useState(false);

  const header = (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
      <div>
        <p className="text-lg text-gray-500 font-light">Welcome back,</p>
        <h1 className="text-2xl font-black text-gray-900">{firstName}</h1>
      </div>
      <Button size="lg" onClick={() => setShowOverlay(true)}>
        + New Repair Request
      </Button>
    </div>
  );

  return (
    <>
      <DashboardLayout header={header}>

        {/* ── EMPTY STATE ── */}
        {jobs.length === 0 && (
          <Card className="flex flex-col items-center justify-center text-center py-16 sm:py-24 min-h-[320px]">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-lg font-black uppercase tracking-widest text-gray-900 mb-2">
              All Systems Operational
            </h2>
            <p className="text-sm text-gray-400 font-medium">
              No active plumbing emergencies detected.
            </p>
          </Card>
        )}

        {/* ── JOBS LIST ── */}
        {jobs.length > 0 && (
          <div className="flex flex-col gap-4">
            {jobs.map((job) => (
              <Card key={job.id} hover className="flex flex-col gap-3">

                {/* ID + Location + Status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-gray-400 font-mono mb-1">ID: {job.id}</p>
                    <div className="flex items-center gap-1 text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
                        <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.003 3.5-4.697 3.5-8.328a8.25 8.25 0 00-16.5 0c0 3.63 1.556 6.326 3.5 8.328a19.579 19.579 0 002.682 2.282 16.975 16.975 0 001.145.742z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-bold uppercase tracking-wide">
                        {job.lga}, {job.state}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full flex-shrink-0 ${STATUS_STYLES[job.status]}`}>
                    {job.status}
                  </span>
                </div>

                {/* Issue */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Issue</p>
                  <p className="text-sm font-semibold text-gray-800">"{job.issue}"</p>
                </div>

                {/* Plumber + Phone */}
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Assigned Plumber</p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-black text-blue-700 flex-shrink-0">
                        {job.plumber.initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{job.plumber.name}</p>
                        <div className="flex items-center gap-1 text-green-600">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.491 4.491 0 01-3.497-1.307 4.491 4.491 0 01-1.307-3.497A4.49 4.49 0 012.25 12a4.49 4.49 0 011.549-3.397 4.491 4.491 0 011.307-3.497 4.491 4.491 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs font-semibold">Verified</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {(job.status === "cancelled" || job.status === "rejected") && (
                    <Button
                      size="sm"
                      prefix={
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                        </svg>
                      }
                    >
                      Phone Number
                    </Button>
                  )}
                </div>

              </Card>
            ))}
          </div>
        )}

      </DashboardLayout>

      {/* Overlay — rendered outside DashboardLayout so it covers the full screen */}
      {/* {showOverlay && (
        <AssistantOverlay onClose={() => setShowOverlay(false)} />
      )} */}
    </>
  );
}
