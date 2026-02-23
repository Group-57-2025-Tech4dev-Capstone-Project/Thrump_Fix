import { useState } from "react";
// import Button from "../../Components/buttons/Buttons";

export default function StepForm({ selectedLGA, onSubmit }) {
  const [issue, setIssue] = useState("");
  const [address, setAddress] = useState("");

  function handleSubmit() {
    if (!issue.trim() || !address.trim()) return;
    onSubmit({ issue, address });
  }

  return (
    <div className="px-5 py-5 flex flex-col gap-4">
      <p className="text-sm text-gray-600">
        Tell me about the plumbing issue and your exact address so I can match you correctly.
      </p>

      {/* Issue */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
          Issue Details
        </label>
        <textarea
          rows={3}
          placeholder="e.g. My kitchen sink is leaking..."
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-800 outline-none focus:border-blue-400 focus:bg-white transition resize-none"
        />
      </div>

      {/* Address */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
          Address in {selectedLGA}
        </label>
        <input
          type="text"
          placeholder="Street name and house number..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-800 outline-none focus:border-blue-400 focus:bg-white transition"
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!issue.trim() || !address.trim()}
        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition"
      >
        Post Job Now
      </button>
    </div>
  );
}
