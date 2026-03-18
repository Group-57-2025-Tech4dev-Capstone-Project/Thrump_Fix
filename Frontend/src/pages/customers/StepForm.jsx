// import { useReducer } from "react";
// import api from "../../utils/api";

// const initialState = {
//   issue:   "",
//   address: "",
//   loading: false,
//   error:   "",
// };

// function reducer(state, action) {
//   switch (action.type) {
//     case "SET_FIELD":
//       return { ...state, [action.field]: action.value };
//     case "SUBMIT_START":
//       return { ...state, loading: true, error: "" };
//     case "SUBMIT_ERROR":
//       return { ...state, loading: false, error: action.payload };
//     default:
//       return state;
//   }
// }

// export default function StepForm({ selectedLGA, selectedLCDA, onSubmit }) {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const { issue, address, loading, error } = state;

//   async function handleSubmit() {
//     if (!issue.trim() || !address.trim()) return;
//     dispatch({ type: "SUBMIT_START" });

//     try {
//       await api.post("/jobs", {
//         issueDetails:      issue,
//         address:           address,
//         localGovernanceId: selectedLGA?.id       || null,
//         subregionId:       selectedLCDA?.id      || null,
//         stateId:           selectedLGA?.stateId  || null,
//       });
//       onSubmit();
//     } catch (err) {
//       dispatch({
//         type: "SUBMIT_ERROR",
//         payload:
//           err.response?.data?.message ||
//           err.response?.data ||
//           "Failed to post job. Please try again.",
//       });
//     }
//   }

//   return (
//     <div className="px-5 py-5 flex flex-col gap-4">
//       <p className="text-sm text-gray-600">
//         Tell me about the plumbing issue and your exact address so I can match you with a plumber.
//       </p>

//       {error && (
//         <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
//           {error}
//         </p>
//       )}

//       {/* Issue */}
//       <div className="flex flex-col gap-1.5">
//         <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
//           Issue Details
//         </label>
//         <textarea
//           rows={3}
//           placeholder="e.g. My kitchen sink is leaking..."
//           value={issue}
//           onChange={(e) => dispatch({ type: "SET_FIELD", field: "issue", value: e.target.value })}
//           className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-800 outline-none focus:border-blue-400 focus:bg-white transition resize-none"
//         />
//       </div>

//       {/* Address */}
//       <div className="flex flex-col gap-1.5">
//         <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
//           Address in {selectedLGA?.name || "your area"}
//         </label>
//         <input
//           type="text"
//           placeholder="Street name and house number..."
//           value={address}
//           onChange={(e) => dispatch({ type: "SET_FIELD", field: "address", value: e.target.value })}
//           className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-800 outline-none focus:border-blue-400 focus:bg-white transition"
//         />
//       </div>

//       <button
//         type="button"
//         onClick={handleSubmit}
//         disabled={!issue.trim() || !address.trim() || loading}
//         className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition flex items-center justify-center gap-2"
//       >
//         {loading && <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />}
//         {loading ? "Posting..." : "Post Job Now"}
//       </button>
//     </div>
//   );
// }


import { useReducer } from "react";
import api from "../../utils/api";

const initialState = {
  issue:   "",
  address: "",
  loading: false,
  error:   "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":    return { ...state, [action.field]: action.value };
    case "SUBMIT_START": return { ...state, loading: true, error: "" };
    case "SUBMIT_ERROR": return { ...state, loading: false, error: action.payload };
    default:             return state;
  }
}

export default function StepForm({ selectedLGA, selectedLCDA, onSubmit }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { issue, address, loading, error } = state;

  async function handleSubmit() {
    if (!issue.trim() || !address.trim()) return;
    dispatch({ type: "SUBMIT_START" });

    try {
      const res = await api.post("/jobs", {
        issueDetails:      issue,
        address:           address,
        localGovernanceId: selectedLGA?.id      || null,
        subregionId:       selectedLCDA?.id     || null,  // ✅ Backend expects lowercase subregionId
        stateId:           selectedLGA?.stateId || null,
      });

      // Save address metadata locally for dashboard display
      const jobId = res.data?.jobId;
      if (jobId) {
        const existing = JSON.parse(localStorage.getItem("jobMeta") || "{}");
        existing[jobId] = {
          address:   address,
          lgaName:   selectedLGA?.name     || "",
          stateName: selectedLGA?.stateName || "",
        };
        localStorage.setItem("jobMeta", JSON.stringify(existing));
      }

      onSubmit(jobId || null);
    } catch (err) {
      dispatch({
        type:    "SUBMIT_ERROR",
        payload: err.response?.data?.message ||
                 (typeof err.response?.data === "string" ? err.response.data : null) ||
                 "Failed to post job. Please try again.",
      });
    }
  }

  return (
    <div className="px-5 py-5 flex flex-col gap-4">
      <p className="text-sm text-gray-600">
        Tell me about the plumbing issue and your exact address so I can match you with a plumber.
      </p>

      {error && (
        <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
          Issue Details
        </label>
        <textarea
          rows={3}
          placeholder="e.g. My kitchen sink is leaking..."
          value={issue}
          onChange={(e) => dispatch({ type: "SET_FIELD", field: "issue", value: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-800 outline-none focus:border-blue-400 focus:bg-white transition resize-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
          Address in {selectedLGA?.name || "your area"}
        </label>
        <input
          type="text"
          placeholder="Street name and house number..."
          value={address}
          onChange={(e) => dispatch({ type: "SET_FIELD", field: "address", value: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-800 outline-none focus:border-blue-400 focus:bg-white transition"
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!issue.trim() || !address.trim() || loading}
        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition flex items-center justify-center gap-2"
      >
        {loading && <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />}
        {loading ? "Posting..." : "Post Job Now"}
      </button>
    </div>
  );
}
