import { useState } from "react";
import { useNavigate } from "react-router-dom";
import route from "../../utils/routes";

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
    <path
      d="M3 8l3.5 3.5 6.5-7"
      stroke="#2563eb"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
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
  const [isBusiness, setIsBusiness] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: wire up payment API when available
    setTimeout(() => {
      setLoading(false);
      navigate(route.Login);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Back header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <button
          onClick={() => navigate(route.Pricing)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Subscribe to Thrump Fix Pro
        </button>
      </div>

      {/* Main layout */}
      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">

        {/* LEFT — Payment form */}
        <div className="flex-1">

          <h2 className="text-base font-bold text-gray-900 mb-4">Payment method</h2>

          <div className="space-y-3 mb-8">
            {/* Card number */}
            <div className="flex items-center border border-gray-200 rounded-lg px-4 py-3 bg-white">
              <input
                type="text"
                placeholder="Card number"
                className="flex-1 text-sm text-gray-500 outline-none placeholder-gray-400"
                maxLength={19}
              />
              <div className="flex items-center gap-1.5 ml-2">
                {/* Mastercard icon */}
                <div className="flex">
                  <div className="w-5 h-5 rounded-full bg-red-500 opacity-90" />
                  <div className="w-5 h-5 rounded-full bg-orange-400 opacity-90 -ml-2" />
                </div>
                {/* Visa icon */}
                <div className="bg-blue-700 rounded px-1 py-0.5">
                  <span className="text-white text-[10px] font-extrabold italic">VISA</span>
                </div>
              </div>
            </div>

            {/* Expiration + Security */}
            <div className="flex gap-3">
              <div className="flex-1 border border-gray-200 rounded-lg px-4 py-3">
                <input
                  type="text"
                  placeholder="Expiration date"
                  className="w-full text-sm text-gray-500 outline-none placeholder-gray-400"
                  maxLength={5}
                />
              </div>
              <div className="flex-1 border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between">
                <input
                  type="text"
                  placeholder="Security code"
                  className="flex-1 text-sm text-gray-500 outline-none placeholder-gray-400"
                  maxLength={4}
                />
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-400 shrink-0">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Billing address */}
          <h2 className="text-base font-bold text-gray-900 mb-4">Billing address</h2>

          <div className="space-y-3">
            {/* Full name */}
            <div className="border border-gray-200 rounded-lg px-4 py-3">
              <input
                type="text"
                placeholder="Full name"
                className="w-full text-sm text-gray-500 outline-none placeholder-gray-400"
              />
            </div>

            {/* Country */}
            <div className="border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between">
              <select className="flex-1 text-sm text-gray-500 outline-none bg-transparent appearance-none">
                <option value="">Country or region</option>
                <option value="NG">Nigeria</option>
              </select>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400 shrink-0 pointer-events-none">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Address */}
            <div className="border border-gray-200 rounded-lg px-4 py-3">
              <input
                type="text"
                placeholder="Address line 1"
                className="w-full text-sm text-gray-500 outline-none placeholder-gray-400"
              />
            </div>

            {/* Business checkbox */}
            <label className="flex items-center gap-2 cursor-pointer mt-1">
              <input
                type="checkbox"
                checked={isBusiness}
                onChange={() => setIsBusiness(!isBusiness)}
                className="w-4 h-4 rounded border-gray-300 accent-blue-600"
              />
              <span className="text-sm text-gray-600">I'm purchasing as business</span>
            </label>
          </div>
        </div>

        {/* RIGHT — Order summary */}
        <div className="w-full md:w-72">
          <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">

            {/* Plan header */}
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Thrump Fix Pro</h3>
              <span className="bg-blue-600 text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full">
                RECOMMENDED
              </span>
            </div>

            {/* Features */}
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">
              Top Features
            </p>
            <ul className="space-y-2 mb-6">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckIcon />
                  {f}
                </li>
              ))}
            </ul>

            {/* Divider */}
            <div className="border-t border-gray-100 my-4" />

            {/* Pricing breakdown */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Monthly subscription</span>
                <span className="font-semibold">₦5,000</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>VAT (0%)</span>
                <span>₦0.00</span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 my-4" />

            {/* Due today */}
            <div className="flex justify-between text-sm font-bold text-gray-900 mb-6">
              <span>Due today</span>
              <span>₦5,000</span>
            </div>

            {/* Subscribe button */}
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
            >
              {loading ? "Processing..." : "Subscribe"}
            </button>

            {/* Fine print */}
            <p className="text-[11px] text-gray-400 text-center mt-4 leading-relaxed">
              By subscribing, you agree to our{" "}
              <span className="underline cursor-pointer">Terms of Service</span>{" "}
              and{" "}
              <span className="underline cursor-pointer">Privacy Policy</span>
              . You will be charged ₦5,000.00 immediately today and monthly thereafter.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
