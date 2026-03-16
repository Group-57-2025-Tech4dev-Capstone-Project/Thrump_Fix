import { useEffect, useReducer } from "react";
import api from "../../utils/api";

const initialState = {
  states:        [],
  lgas:          [],
  selectedState: null,
  loadingStates: true,
  loadingLgas:   false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_STATES":
      return { ...state, states: action.payload, loadingStates: false };
    case "SELECT_STATE":
      return { ...state, selectedState: action.payload, lgas: [], loadingLgas: true };
    case "SET_LGAS":
      return { ...state, lgas: action.payload, loadingLgas: false };
    case "BACK":
      return { ...state, selectedState: null, lgas: [] };
    default:
      return state;
  }
}

export default function StepLGA({ onSelect }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { states, lgas, selectedState, loadingStates, loadingLgas } = state;

  // Fetch all states on mount
  useEffect(() => {
    api.get("/states")
      .then((res) => dispatch({ type: "SET_STATES", payload: res.data || [] }))
      .catch(() => dispatch({ type: "SET_STATES", payload: [] }));
  }, []);

  // Fetch LGAs when a state is selected
  function handleStateSelect(s) {
    dispatch({ type: "SELECT_STATE", payload: s });
    api.get(`/lgas/state/${s.id}`)
      .then((res) => dispatch({ type: "SET_LGAS", payload: res.data || [] }))
      .catch(() => dispatch({ type: "SET_LGAS", payload: [] }));
  }

  // ── State picker ──
  if (!selectedState) {
    return (
      <div className="px-5 py-5">
        <p className="text-sm text-gray-500 mb-4">
          Select your state to find available plumbers.
        </p>
        {loadingStates ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
            {states.map((s) => (
              <button
                key={s.id}
                onClick={() => handleStateSelect(s)}
                className="text-xs font-semibold text-gray-700 border border-gray-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 px-2 py-3 rounded-xl transition text-center"
              >
                {s.name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── LGA picker ──
  return (
    <div className="px-5 py-5">
      <button
        onClick={() => dispatch({ type: "BACK" })}
        className="flex items-center gap-1 text-xs text-blue-600 font-semibold mb-3 hover:underline"
      >
        ← Back to states
      </button>
      <p className="text-sm text-gray-500 mb-4">
        Select your Local Government Area in <strong>{selectedState.name}</strong>.
      </p>
      {loadingLgas ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-600" />
        </div>
      ) : lgas.length === 0 ? (
        <p className="text-sm text-red-500">No LGAs found for this state.</p>
      ) : (
        <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
          {lgas.map((lga) => (
            <button
              key={lga.id}
              onClick={() => onSelect({ ...lga, stateName: selectedState.name, stateId: selectedState.id })}
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
