import { useState } from "react";
import DashboardLayout from "../../Layouts/DashboardLayout";

export default function PlumberDashboard() {
  const [refreshing, setRefreshing] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const lga = user?.lga || "Your Area";
  const lcda = user?.lcda || "";

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }

  const header = (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">

      {/* Left — title + region */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse flex-shrink-0" />
          <h1 className="text-xs font-black uppercase tracking-widest text-gray-800">
            Marketplace Opportunities
          </h1>
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-blue-500 pl-4">
          Regional Feed: {lga}{lcda ? `, ${lcda}` : ""}
        </p>
      </div>

      {/* Right — refresh button */}
      <button
        onClick={handleRefresh}
        className="flex items-center justify-center gap-2 border border-gray-300 hover:border-blue-400 hover:text-blue-600 text-gray-500 text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-full transition self-start sm:self-auto"
      >
        Refresh Live Feed
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`w-4 h-4 flex-shrink-0 ${refreshing ? "animate-spin" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      </button>

    </div>
  );

  return (
    <DashboardLayout statusLabel="Active Online" statusColor="green" header={header}>

      {/* Scanning card */}
      <div className="bg-white rounded-3xl shadow-sm p-10 sm:p-16 flex flex-col items-center justify-center text-center min-h-[320px] sm:min-h-[400px]">

        {/* Clock icon in circle */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.2}
            stroke="#c8cdd6"
            className="w-10 h-10 sm:w-12 sm:h-12"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-widest text-gray-900 mb-3">
          Scanning...
        </h2>

        <p className="text-sm text-gray-400 font-medium max-w-sm leading-relaxed">
          Stay online to receive plumbing leads in your region. Your first
          verified job match is a free trial; subsequent access requires
          an active subscription.
        </p>

      </div>

    </DashboardLayout>
  );
}
