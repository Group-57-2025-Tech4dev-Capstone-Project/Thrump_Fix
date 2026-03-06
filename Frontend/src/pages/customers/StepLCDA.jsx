import { useEffect, useReducer } from "react";
import api from "../../utils/api";

const initialState = {
  subregions: [],
  loading:    true,
  error:      null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_SUBREGIONS":
      return { ...state, subregions: action.payload, loading: false };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export default function StepLCDA({ lga, onSelect }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { subregions, loading, error } = state;

  useEffect(() => {
    if (!lga?.id) return;
    api.get(`/subregions/lga/${lga.id}`)
      .then((res) => dispatch({ type: "SET_SUBREGIONS", payload: res.data || [] }))
      .catch(() => dispatch({ type: "SET_ERROR", payload: "Failed to load sub-regions." }));
  }, [lga?.id]);

  return (
    <div className="px-5 py-5">
      <p className="text-sm text-gray-500 mb-4">
        Which sub-region (LCDA) within <strong>{lga?.name}</strong>?
      </p>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-600" />
        </div>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : subregions.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 mb-3">No sub-regions found — continuing with LGA only.</p>
          <button
            onClick={() => onSelect(null)}
            className="bg-blue-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition"
          >
            Continue
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
          {subregions.map((sub) => (
            <button
              key={sub.id}
              onClick={() => onSelect(sub)}
              className="text-xs font-semibold text-gray-700 border border-gray-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 px-2 py-3 rounded-xl transition text-center"
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
