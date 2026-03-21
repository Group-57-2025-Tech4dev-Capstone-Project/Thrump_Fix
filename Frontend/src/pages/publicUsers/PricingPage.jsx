import { useNavigate } from "react-router-dom";
import { Card } from "../../Components/card/Card";

import Button from "../../Components/buttons/Buttons";
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

const starterFeatures = [
  "1 Professional Match",
  "Verified Experts",
  "Live Broadcast Tracking",
];

const proFeatures = [
  "Unlimited Requests",
  "Premium Insured Experts",
  "AI-Powered Assistant",
  "Service History & Record Tracking",
];

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center px-4 py-12">

      {/* Logo */}
      <div className="self-start mb-8">
        <div className="flex items-center gap-2 border-2 border-blue-600 rounded-xl px-4 py-2 bg-white w-fit">
          <div className="bg-blue-600 rounded-md p-1">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 10h12M10 4l6 6-6 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-blue-900 font-semibold text-base">Thrump Fix</span>
        </div>
      </div>

      {/* Subtitle */}
      <p className="text-gray-500 text-sm text-center mb-12 max-w-md">
        You pay for safe access and booking. Repair payments go straight to your plumber.
      </p>

      {/* Pricing Cards */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl">

        {/* Starter Card — goes directly to Login */}
        <Card variant="outline" className="flex-1 flex flex-col p-7">
          <p className="text-xs font-semibold tracking-widest text-gray-400 mb-2">STARTER</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Free Trial</h2>
          <p className="text-sm text-gray-400 mb-6">Try our network risk-free.</p>

          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-5xl font-extrabold text-gray-900">₦0</span>
            <span className="text-xs font-semibold tracking-wider text-gray-400 self-end mb-1">
              / FIRST REQUEST
            </span>
          </div>

          <ul className="flex flex-col gap-3 mb-8 flex-1">
            {starterFeatures.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-gray-600">
                <CheckIcon />
                {f}
              </li>
            ))}
          </ul>

          <Button
            variant="outline-2"
            size="lg"
            onClick={() => navigate(route.Login)}   
            className="w-full justify-center tracking-widest text-xs font-bold rounded-[32px] h-[48px] border border-blue-600"
          >
            GET STARTED
          </Button>
        </Card>

        {/* Pro Card — goes to Payment */}
        <Card className="flex-1 flex flex-col p-7 border-2 border-blue-600 shadow-xl shadow-blue-100">
          <div className="flex items-start justify-between mb-1">
            <h2 className="text-xl font-bold text-gray-900">Thrump Fix Pro</h2>
            <span className="bg-blue-600 text-white text-[10px] font-bold tracking-wider px-3 py-1 rounded-full">
              RECOMMENDED
            </span>
          </div>
          <p className="text-sm text-gray-400 mb-4">Unlimited access for SMEs &amp; Homes.</p>

          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-5xl font-extrabold text-blue-600">₦5,000</span>
            <span className="text-xs font-semibold tracking-wider text-gray-400 self-end mb-1">
              / MONTH
            </span>
          </div>

          <ul className="flex flex-col gap-3 mb-8 flex-1">
            {proFeatures.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-gray-600">
                <CheckIcon />
                {f}
              </li>
            ))}
          </ul>

          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate(route.Payment)}
            className="w-full justify-center tracking-widest text-xs font-bold rounded-[32px] h-[56px] shadow-[0px_8px_30px_0px_#2563EB4D] bg-blue-600 hover:bg-blue-700"
          >
            GO UNLIMITED
          </Button>
        </Card>

      </div>
    </div>
  );
}
