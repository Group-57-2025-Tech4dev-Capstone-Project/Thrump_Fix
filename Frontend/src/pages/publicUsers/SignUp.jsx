import { useReducer, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";

import AuthLayout from "../../Components/authLayout/AuthLayout.jsx";
import RoleToggle from "../../Components/toggle/RoleToggle";
import Input from "../../Components/inputs/Inputs.jsx";
import FileUpload from "../../Components/fileUpload/FileUpload.jsx";
import route from "../../utils/routes";
import api from "../../utils/api";
import "./signup.css";

const initialState = {
  role: "CUSTOMER",
  idFile: null,
  agreed: false,
  loading: false,
  submitError: "",

  // Location
  states: [],
  lgas: [],
  subRegions: [],
  selectedStateId: "",
  selectedLgaId: "",
  locationLoading: false,
};

function signupReducer(state, action) {
  switch (action.type) {
    case "SET_ROLE":
      return { ...state, role: action.payload };
    case "SET_FILE":
      return { ...state, idFile: action.payload };
    case "TOGGLE_AGREED":
      return { ...state, agreed: !state.agreed };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, submitError: action.payload };
    case "CLEAR_ERROR":
      return { ...state, submitError: "" };
    case "SET_STATES":
      return { ...state, states: action.payload };
    case "SET_LGAS":
      return { ...state, lgas: action.payload, subRegions: [], selectedLgaId: "" };
    case "SET_SUBREGIONS":
      return { ...state, subRegions: action.payload };
    case "SET_SELECTED_STATE":
      return { ...state, selectedStateId: action.payload, lgas: [], subRegions: [], selectedLgaId: "" };
    case "SET_SELECTED_LGA":
      return { ...state, selectedLgaId: action.payload, subRegions: [] };
    case "SET_LOCATION_LOADING":
      return { ...state, locationLoading: action.payload };
    default:
      return state;
  }
}

export default function Signup() {
  const [state, dispatch] = useReducer(signupReducer, initialState);
  const {
    role, idFile, agreed, loading, submitError,
    states, lgas, subRegions,
    selectedStateId, selectedLgaId, locationLoading,
  } = state;

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ shouldUnregister: true, mode: "onChange" });

  const isReady = isValid && agreed && !!idFile;

  // Fetch states on mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await api.get("/states");
        dispatch({ type: "SET_STATES", payload: res.data });
      } catch (err) {
        console.error("Failed to fetch states:", err);
      }
    };
    fetchStates();
  }, []);

  // Fetch LGAs when state is selected
  useEffect(() => {
    if (!selectedStateId) return;
    const fetchLgas = async () => {
      dispatch({ type: "SET_LOCATION_LOADING", payload: true });
      try {
        const res = await api.get(`/lgas/state/${selectedStateId}`);
        dispatch({ type: "SET_LGAS", payload: res.data });
      } catch (err) {
        console.error("Failed to fetch LGAs:", err);
      } finally {
        dispatch({ type: "SET_LOCATION_LOADING", payload: false });
      }
    };
    fetchLgas();
  }, [selectedStateId]);

  // Fetch SubRegions when LGA is selected
  useEffect(() => {
    if (!selectedLgaId) return;
    const fetchSubRegions = async () => {
      dispatch({ type: "SET_LOCATION_LOADING", payload: true });
      try {
        const res = await api.get(`/subregions/lga/${selectedLgaId}`);
        dispatch({ type: "SET_SUBREGIONS", payload: res.data });
      } catch (err) {
        console.error("Failed to fetch sub regions:", err);
      } finally {
        dispatch({ type: "SET_LOCATION_LOADING", payload: false });
      }
    };
    fetchSubRegions();
  }, [selectedLgaId]);

  const onSubmit = async (data) => {
    dispatch({ type: "CLEAR_ERROR" });

    if (!agreed) {
      dispatch({ type: "SET_ERROR", payload: "Please agree to the Terms & Conditions to continue." });
      return;
    }
    if (!idFile) {
      dispatch({ type: "SET_ERROR", payload: "Please upload your National ID / LASRRA photo." });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const formData = new FormData();
      formData.append("image", idFile);                          // ← file object
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phoneNumber", data.phoneNumber);          // ← phoneNumber not phoneNo
      formData.append("password", data.password);
      formData.append("role", role);                             // ← CUSTOMER or PLUMBER
      formData.append("stateId", data.stateId);                  // ← ID from dropdown
      formData.append("localGovernanceAreaId", data.lgaId);      // ← ID from dropdown
      formData.append("subRegionId", data.subRegionId);          // ← ID from dropdown
      formData.append("acceptedPrivacyPolicy", true);            // ← required by backend

      const res = await api.post("/auth/register/with-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Registered:", res.data);
      navigate(route.Pricing);

    } catch (error) {
      console.error("Signup error:", error);
      // Show the backend error message if available
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Signup failed. Please try again.";
      dispatch({ type: "SET_ERROR", payload: message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <AuthLayout title="Account Setup">
      <RoleToggle
        role={role}
        setRole={(r) => dispatch({ type: "SET_ROLE", payload: r })}
      />

      <form onSubmit={handleSubmit(onSubmit)}>

        <Input
          label="Full Name"
          placeholder="Exactly as on National ID"
          {...register("fullName", { required: "Full name is required" })}
          error={errors.fullName?.message}
        />

        <Input
          label="Email Address"
          placeholder="email@example.com"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email format",
            },
          })}
          error={errors.email?.message}
        />

        <Input
          label="Phone Number"
          placeholder="08012345678"
          {...register("phoneNumber", {             // ← updated to match API
            required: "Phone number is required",
            pattern: {
              value: /^(\+234|0)[789][01]\d{8}$/,
              message: "Must be a valid Nigerian phone number",
            },
          })}
          error={errors.phoneNumber?.message}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Min 6 characters"
          {...register("password", {
            required: "Password required",
            minLength: { value: 6, message: "Minimum 6 characters" },
            pattern: {
              value: /^(?=.*[A-Z])(?=.*\d).{6,}$/,
              message: "Must include 1 capital letter & 1 number",
            },
          })}
          error={errors.password?.message}
        />

        {/* State — dynamic from API, value is ID */}
        <div className="input-field">
          <label>State</label>
          <select
            {...register("stateId", { required: "State is required" })}
            onChange={(e) => {
              dispatch({ type: "SET_SELECTED_STATE", payload: e.target.value });
            }}
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          {errors.stateId && <p className="errorText">{errors.stateId.message}</p>}
        </div>

        {/* LGA — loads after state is picked */}
        <div className="input-field">
          <label>Local Government Area (LGA)</label>
          <select
            {...register("lgaId", { required: "LGA is required" })}
            disabled={!selectedStateId || locationLoading}
            onChange={(e) => {
              dispatch({ type: "SET_SELECTED_LGA", payload: e.target.value });
            }}
          >
            <option value="">
              {!selectedStateId
                ? "Select a state first"
                : locationLoading
                ? "Loading..."
                : "Select LGA"}
            </option>
            {lgas.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
          {errors.lgaId && <p className="errorText">{errors.lgaId.message}</p>}
        </div>

        {/* SubRegion — loads after LGA is picked */}
        <div className="input-field">
          <label>LCDA / Sub Region</label>
          <select
            {...register("subRegionId", { required: "Sub Region is required" })}
            disabled={!selectedLgaId || locationLoading}
          >
            <option value="">
              {!selectedLgaId
                ? "Select an LGA first"
                : locationLoading
                ? "Loading..."
                : "Select Sub Region"}
            </option>
            {subRegions.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          {errors.subRegionId && <p className="errorText">{errors.subRegionId.message}</p>}
        </div>

        <FileUpload
          label="National ID / LASRRA Photo"
          onFileChange={(file) => dispatch({ type: "SET_FILE", payload: file })}
        />

        <div className="terms-row">
          <input
            type="checkbox"
            id="terms"
            checked={agreed}
            onChange={() => dispatch({ type: "TOGGLE_AGREED" })}
          />
          <label htmlFor="terms">
            I agree to the{" "}
            <Link
              to={route.Terms}
              target="_blank"
              rel="noopener noreferrer"
              className="terms-link"
              onClick={(e) => e.stopPropagation()}
            >
              TERMS & CONDITIONS
            </Link>
          </label>
        </div>

        {submitError && <p className="submit-error">{submitError}</p>}

        <button
          type="submit"
          disabled={loading || !isReady}
          className={`auth-btn ${isReady ? "auth-btn--ready" : "auth-btn--dim"}`}
        >
          {loading && <span className="btn-spinner" />}
          {loading ? "Creating account..." : "Complete Setup"}
        </button>

        <p className="auth-footer">
          Already have an account?{" "}
          <span className="auth-link" onClick={() => navigate(route.Login)}>
            LOGIN
          </span>
        </p>

      </form>
    </AuthLayout>
  );
}
