import { useEffect, useReducer } from "react";
import api from "../../utils/api";

const LAGOS_STATE_ID = 1; 

const initialState = {
  lgas:    [],
  loading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_LGAS": return { ...state, lgas: action.payload, loading: false };
    default:         return state;
  }
}

export default function StepLGA({ onSelect }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { lgas, loading } = state;

  useEffect(() => {
    api.get(`/lgas/state/${LAGOS_STATE_ID}`)
      .then((res) => dispatch({ type: "SET_LGAS", payload: res.data || [] }))
      .catch(() => dispatch({ type: "SET_LGAS", payload: [] }));
  }, []);

  return (
    <div className="px-5 py-5">
      <p className="text-sm text-gray-500 mb-4">
        Select your Local Government Area in <strong>Lagos</strong>.
      </p>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
          {lgas.map((lga) => (
            <button
              key={lga.id}
              onClick={() => onSelect({
                id:        lga.id,
                name:      lga.name,
                stateId:   LAGOS_STATE_ID,
                stateName: "Lagos",
              })}
              className="text-xs font-semibold text-gray-700 border border-gray-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 px-2 py-3 rounded-xl transition text-center"
            >
              {lga.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}



// import { useEffect, useReducer } from "react";
// import api from "../../utils/api";

// const initialState = {
//   lgas:        [],
//   subRegions:  [],
//   selectedLga: null,
//   loading:     true,
// };

// function reducer(state, action) {
//   switch (action.type) {
//     case "SET_LGAS":
//       return { ...state, lgas: action.payload, loading: false };
//     case "SELECT_LGA":
//       return { ...state, selectedLga: action.payload, subRegions: [], loading: true };
//     case "SET_SUBREGIONS":
//       return { ...state, subRegions: action.payload, loading: false };
//     case "BACK":
//       return { ...state, selectedLga: null, subRegions: [], loading: false };
//     default:
//       return state;
//   }
// }

// const LAGOS_STATE_ID = 1; // ← change this to your actual Lagos state ID from the API

// export default function StepLGA({ onSelect }) {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const { lgas, subRegions, selectedLga, loading } = state;

//   // Fetch Lagos LGAs directly on mount — no state picker needed
//   useEffect(() => {
//     api.get(`/lgas/state/${LAGOS_STATE_ID}`)
//       .then((res) => dispatch({ type: "SET_LGAS", payload: res.data || [] }))
//       .catch(() => dispatch({ type: "SET_LGAS", payload: [] }));
//   }, []);

//   // Fetch sub-regions when LGA is selected
//   function handleLgaSelect(lga) {
//     dispatch({ type: "SELECT_LGA", payload: lga });
//     api.get(`/subregions/lga/${lga.id}`)
//       .then((res) => dispatch({ type: "SET_SUBREGIONS", payload: res.data || [] }))
//       .catch(() => dispatch({ type: "SET_SUBREGIONS", payload: [] }));
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center py-8">
//         <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-600" />
//       </div>
//     );
//   }

//   // ── LGA picker ──
//   if (!selectedLga) {
//     return (
//       <div className="px-5 py-5">
//         <p className="text-sm text-gray-500 mb-4">
//           Select your Local Government Area in <strong>Lagos</strong>.
//         </p>
//         <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
//           {lgas.map((lga) => (
//             <button
//               key={lga.id}
//               onClick={() => handleLgaSelect(lga)}
//               className="text-xs font-semibold text-gray-700 border border-gray-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 px-2 py-3 rounded-xl transition text-center"
//             >
//               {lga.name}
//             </button>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // ── Sub-region / LCDA picker ──
//   return (
//     <div className="px-5 py-5">
//       <button
//         onClick={() => dispatch({ type: "BACK" })}
//         className="flex items-center gap-1 text-xs text-blue-600 font-semibold mb-3 hover:underline"
//       >
//         ← Back to LGAs
//       </button>
//       <p className="text-sm text-gray-500 mb-4">
//         Select your LCDA in <strong>{selectedLga.name}</strong>.
//       </p>
//       {subRegions.length === 0 ? (
//         <p className="text-sm text-red-500">No sub-regions found for this LGA.</p>
//       ) : (
//         <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
//           {subRegions.map((sub) => (
//             <button
//               key={sub.id}
//               onClick={() => onSelect({
//                 subRegionId:   sub.id,
//                 subRegionName: sub.name,
//                 lgaId:         selectedLga.id,
//                 lgaName:       selectedLga.name,
//                 stateId:       LAGOS_STATE_ID,
//                 stateName:     "Lagos",
//               })}
//               className="text-xs font-semibold text-gray-700 border border-gray-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 px-2 py-3 rounded-xl transition text-center"
//             >
//               {sub.name}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }