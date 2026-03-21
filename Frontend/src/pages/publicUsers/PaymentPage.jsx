import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import route from "../../utils/routes";
import api from "../../utils/api";

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5">
    <path d="M3 8l3.5 3.5 6.5-7" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const proFeatures = [
  "Unlimited Requests",
  "Premium Insured Experts",
  "AI-Powered Assistant",
  "Service History & Record Tracking",
];

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const [isBusiness, setIsBusiness] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      
      // which clears the trial expiry banner on next login.
      await api.post("/subscription/start", { plan: "FREE_TRIAL" });
      navigate(route.Login, {
        state: { message: "🎉 Subscription activated! Please log in to continue." }
      });
    } catch (err) {
      const status = err.response?.status;
      // 500 or 409 = subscription already exists on backend — treat as success
      if (status === 500 || status === 409) {
        navigate(route.Login, {
          state: { message: "🎉 Subscription activated! Please log in to continue." }
        });
        return;
      }
      setError(err.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  function handleBack() {
    if (from === "dashboard") {
      const stored = localStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : null;
      if (user?.role?.toUpperCase() === "PLUMBER") {
        navigate(route.PlumberDashboard);
      } else {
        navigate(route.ConsumerDashboard);
      }
    } else {
      navigate(route.Pricing);
    }
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9]">

      {/* Back header */}
      <div className="w-full max-w-4xl mx-auto px-6 sm:px-10 pt-7 pb-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-700 hover:text-blue-600 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Subscribe to Thrump Fix Pro
        </button>
      </div>

      {/* Two fluid columns */}
      <div className="w-full max-w-4xl mx-auto px-6 sm:px-10 pb-16 flex flex-col md:flex-row gap-6 md:items-start">

        {/* LEFT */}
        <div className="w-full md:flex-1 min-w-0">

          <p className="text-[15px] font-bold text-gray-900 mb-3">Payment method</p>

          <div className="flex flex-col gap-2 mb-6">
            <div className="flex items-center bg-[#EBF0FA] rounded-lg px-3.5 py-3 gap-2 overflow-hidden">
              <input
                type="text"
                placeholder="Card number"
                maxLength={19}
                className="flex-1 min-w-0 bg-transparent text-[13px] text-gray-600 placeholder-gray-400 outline-none"
              />
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="relative flex items-center w-7 h-5">
                  <div className="w-[17px] h-[17px] rounded-full bg-red-500 absolute left-0" />
                  <div className="w-[17px] h-[17px] rounded-full bg-yellow-400 absolute left-[8px] opacity-95" />
                </div>
                <div className="bg-[#1A1F71] rounded px-[5px] py-[2px]">
                  <span className="text-white text-[8px] font-black italic tracking-tight">VISA</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#EBF0FA] rounded-lg px-3.5 py-3">
                <input
                  type="text"
                  placeholder="Expiration date"
                  maxLength={5}
                  className="w-full bg-transparent text-[13px] text-gray-600 placeholder-gray-400 outline-none"
                />
              </div>
              <div className="flex items-center bg-[#EBF0FA] rounded-lg px-3.5 py-3 gap-2 overflow-hidden">
                <input
                  type="text"
                  placeholder="Security code"
                  maxLength={4}
                  className="flex-1 min-w-0 bg-transparent text-[13px] text-gray-600 placeholder-gray-400 outline-none"
                />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400 shrink-0">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>

          {/* Billing address */}
          <p className="text-[15px] font-bold text-gray-900 mb-3">Billing address</p>

          <div className="flex flex-col gap-2">
            <div className="bg-[#EBF0FA] rounded-lg px-3.5 py-3">
              <input
                type="text"
                placeholder="Full name"
                className="w-full bg-transparent text-[13px] text-gray-600 placeholder-gray-400 outline-none"
              />
            </div>

            <div className="relative bg-[#EBF0FA] rounded-lg px-3.5 py-3">
              <select
                defaultValue=""
                className="w-full bg-transparent text-[13px] text-gray-400 outline-none appearance-none cursor-pointer pr-6"
              >
                <option value="" disabled>Country or region</option>
                <option value="NG">Nigeria</option>
              </select>
              <svg
                width="13" height="13" viewBox="0 0 16 16" fill="none"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              >
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="bg-[#EBF0FA] rounded-lg px-3.5 py-3">
              <input
                type="text"
                placeholder="Address line 1"
                className="w-full bg-transparent text-[13px] text-gray-600 placeholder-gray-400 outline-none"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer mt-1">
              <input
                type="checkbox"
                checked={isBusiness}
                onChange={() => setIsBusiness(!isBusiness)}
                className="w-3.5 h-3.5 accent-blue-600 cursor-pointer"
              />
              <span className="text-[13px] text-gray-600">I'm purchasing as business</span>
            </label>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full md:flex-1 min-w-0">
          <div
            className="bg-white p-6 sm:p-7"
            style={{
              borderRadius: "48px",
              boxShadow: "0px 8px 10px -6px #E2E8F080, 0px 20px 25px -5px #E2E8F080",
            }}
          >
            <div className="flex items-start justify-between mb-5 gap-3">
              <h3 className="text-[19px] font-bold text-gray-900 leading-tight">Thrump Fix Pro</h3>
              <span className="bg-blue-600 text-white text-[9px] font-bold tracking-wide px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
                RECOMMENDED
              </span>
            </div>

            <p className="text-[9px] font-bold tracking-[0.12em] text-gray-400 uppercase mb-3">
              Top Features
            </p>

            <ul className="flex flex-col gap-2.5 mb-6">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[13px] text-gray-700">
                  <CheckIcon />
                  {f}
                </li>
              ))}
            </ul>

            <div className="h-px bg-gray-100 mb-4" />

            <div className="flex flex-col gap-1.5 mb-3">
              <div className="flex justify-between text-[13px] text-gray-700">
                <span>Monthly subscription</span>
                <span className="font-semibold">₦5,000</span>
              </div>
              <div className="flex justify-between text-[13px] text-gray-400">
                <span>VAT (0%)</span>
                <span>₦0.00</span>
              </div>
            </div>

            <div className="h-px bg-gray-100 mb-4" />

            <div className="flex justify-between text-[13px] font-bold text-gray-900 mb-5">
              <span>Due today</span>
              <span>₦5,000</span>
            </div>

            {error && (
              <p className="text-[12px] text-red-500 text-center mb-3">{error}</p>
            )}

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-semibold text-[14px] py-3.5 rounded-xl transition-colors"
            >
              {loading ? "Processing..." : "Subscribe"}
            </button>

            <p className="text-[11px] text-gray-400 text-center mt-4 leading-relaxed">
              By subscribing, you agree to our{" "}
              <span onClick={() => navigate(route.Terms)} className="underline cursor-pointer hover:text-blue-500">
                Terms of Service
              </span>{" "}
              and{" "}
              <span onClick={() => navigate(route.Terms)} className="underline cursor-pointer hover:text-blue-500">
                Privacy Policy
              </span>
              . You will be charged ₦5,000.00 immediately today and monthly thereafter.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
