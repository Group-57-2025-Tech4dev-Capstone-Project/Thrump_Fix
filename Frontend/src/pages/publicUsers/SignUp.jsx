import { useReducer, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

import AuthLayout from "../../Components/authLayout/AuthLayout.jsx";
import RoleToggle from "../../Components/toggle/RoleToggle";
import Input from "../../Components/inputs/Inputs.jsx";
import FileUpload from "../../Components/fileUpload/FileUpload.jsx";
import route from "../../utils/routes";
import "./signup.css";
import ArrowdownSignup from "../../assets/ArrowdownSignup.svg?react"
import TermsOverlay from "../../Components/terms/TermsOverlay.jsx"
import PassShow from "../../assets/PassShow.svg?react"
import PassHide from "../../assets/PassHide.svg?react"

const BASE = "https://thrump-fix-lbm8.onrender.com/api";

const initialState = {
  role: "CUSTOMER",
  idFile: null,
  agreed: false,
  loading: false,
  submitError: "",
  states: [],
  lgas: [],
  subRegions: [],
  selectedStateId: "",
  selectedLgaId: "",
  locationLoading: false,
};

function signupReducer(state, action) {
  switch (action.type) {
    case "SET_ROLE":             return { ...state, role: action.payload };
    case "SET_FILE":             return { ...state, idFile: action.payload };
    case "TOGGLE_AGREED":        return { ...state, agreed: !state.agreed };
    case "SET_LOADING":          return { ...state, loading: action.payload };
    case "SET_ERROR":            return { ...state, submitError: action.payload };
    case "CLEAR_ERROR":          return { ...state, submitError: "" };
    case "SET_STATES":           return { ...state, states: action.payload };
    case "SET_LGAS":             return { ...state, lgas: action.payload, subRegions: [], selectedLgaId: "" };
    case "SET_SUBREGIONS":       return { ...state, subRegions: action.payload };
    case "SET_SELECTED_STATE":   return { ...state, selectedStateId: action.payload, lgas: [], subRegions: [], selectedLgaId: "" };
    case "SET_SELECTED_LGA":     return { ...state, selectedLgaId: action.payload, subRegions: [] };
    case "SET_LOCATION_LOADING": return { ...state, locationLoading: action.payload };
    default: return state;
  }
}

// TERMS OVERLAY
// 


// SIGNUP

export default function Signup() {
  const [state, dispatch] = useReducer(signupReducer, initialState);
  const [showTerms, setShowTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

    const location = useLocation();
  const defaultRoleFromNav = location.state?.defaultRole;

  // Set default role from navigation if provided
  useEffect(() => {
    if (defaultRoleFromNav && defaultRoleFromNav !== role) {
      dispatch({ type: "SET_ROLE", payload: defaultRoleFromNav });
    }
  }, [defaultRoleFromNav]);

  const {
    role, idFile, agreed, loading, submitError,
    states, lgas, subRegions,
    selectedStateId, selectedLgaId, locationLoading
  } = state;

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    shouldUnregister: false,
    mode: "onChange",
    defaultValues: { stateId: "" }
  });

  const isReady = isValid && agreed && !!idFile;

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get(`${BASE}/states`);
        dispatch({ type: "SET_STATES", payload: res.data });
      } catch (err) {
        console.error("Failed to fetch states:", err);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    if (!selectedStateId) return;
    const fetchLgas = async () => {
      dispatch({ type: "SET_LOCATION_LOADING", payload: true });
      try {
        const res = await axios.get(`${BASE}/lgas/state/${selectedStateId}`);
        dispatch({ type: "SET_LGAS", payload: res.data });
      } catch (err) {
        console.error("Failed to fetch LGAs:", err);
      } finally {
        dispatch({ type: "SET_LOCATION_LOADING", payload: false });
      }
    };
    fetchLgas();
  }, [selectedStateId]);

  useEffect(() => {
    if (!selectedLgaId) return;
    const fetchSubRegions = async () => {
      dispatch({ type: "SET_LOCATION_LOADING", payload: true });
      try {
        const res = await axios.get(`${BASE}/subregions/lga/${selectedLgaId}`);
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
      formData.append("image", idFile);
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("password", data.password);
      formData.append("role", role);
      formData.append("stateId", data.stateId);
      formData.append("localGovernanceAreaId", data.lgaId);
      formData.append("subRegionId", data.subRegionId);
      formData.append("acceptedPrivacyPolicy", true);

      const res = await axios.post(`${BASE}/auth/register/with-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const responseData = res.data;

      // ── Save to sessionStorage (consistent with Login.jsx and DashboardLayout)
      if (responseData.token) {
        sessionStorage.setItem("token", responseData.token);
      }
      sessionStorage.setItem("user", JSON.stringify(responseData)); // ← sessionStorage

      navigate(route.Pricing);
    } catch (error) {
      console.error("Signup error:", error);
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
    <>
      {showTerms && <TermsOverlay onClose={() => setShowTerms(false)} />}

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
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
            })}
            error={errors.email?.message}
          />

          <Input
            label="Phone Number"
            placeholder="0801-234-5678"
            {...register("phoneNumber", {
              required: "Phone number is required",
              pattern: { value: /^0[789][01]\d{8}$/, message: "Must be a valid Nigerian phone number" },
            })}
            error={errors.phoneNumber?.message}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Min 6 characters"
              {...register("password", {
                required: "Password required",
                minLength: { value: 6, message: "Minimum 6 characters" },
                pattern: { value: /^(?=.*[A-Z])(?=.*\d).{6,}$/, message: "Must include 1 capital letter & 1 number" },
              })}
              error={errors.password?.message}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-9 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <PassHide/> : <PassShow/>}
            </button>
          </div>

          <div className="input-field">
            <label>State</label>
            <div className="select-wrapper">
              <select
                {...register("stateId", { required: "State is required" })}
                onChange={(e) => {
                  register("stateId").onChange(e);
                  dispatch({ type: "SET_SELECTED_STATE", payload: e.target.value });
                }}
              >
                <option value="" disabled>State</option>
                {states
                  .slice()
                  .sort((a, b) => a.name === "Lagos" ? -1 : b.name === "Lagos" ? 1 : 0)
                  .map((s) => {
                    const isLagos = s.name === "Lagos";
                    return (
                      <option key={s.id} value={s.id} disabled={!isLagos} style={{ color: isLagos ? "inherit" : "#aaa" }}>
                        {isLagos ? s.name : `${s.name} (Coming Soon)`}
                      </option>
                    );
                  })}
              </select>
              <span className="select-arrow"><ArrowdownSignup /></span>
            </div>
            {errors.stateId && <p className="errorText">{errors.stateId.message}</p>}
          </div>

          <div className="input-field">
            <label>Local Government Area (LGA)</label>
            <div className="select-wrapper">
              <select
                {...register("lgaId", { required: "LGA is required" })}
                disabled={!selectedStateId || locationLoading}
                onChange={(e) => {
                  register("lgaId").onChange(e);
                  dispatch({ type: "SET_SELECTED_LGA", payload: e.target.value });
                }}
              >
                <option value="">
                  {!selectedStateId ? "Select a state first" : locationLoading ? "Loading..." : "Select LGA"}
                </option>
                {lgas.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
              <span className="select-arrow"><ArrowdownSignup /></span>
            </div>
            {errors.lgaId && <p className="errorText">{errors.lgaId.message}</p>}
          </div>

          <div className="input-field">
            <label>LCDA / Sub Region</label>
            <div className="select-wrapper">
              <select
                {...register("subRegionId", { required: "Sub Region is required" })}
                disabled={!selectedLgaId || locationLoading}
              >
                <option value="">
                  {!selectedLgaId ? "Select an LGA first" : locationLoading ? "Loading..." : "Select Sub Region"}
                </option>
                {subRegions.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              <span className="select-arrow"><ArrowdownSignup /></span>
            </div>
            {errors.subRegionId && <p className="errorText">{errors.subRegionId.message}</p>}
          </div>

          <FileUpload
            label="National ID"
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
              <button type="button" className="terms-link" onClick={() => setShowTerms(true)}>
                TERMS &amp; CONDITIONS
              </button>
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
            <span className="auth-link" onClick={() => navigate(route.Login)}>LOGIN</span>
          </p>

        </form>
      </AuthLayout>
    </>
  );
}
