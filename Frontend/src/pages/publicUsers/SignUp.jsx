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

  // ===============================
  // FETCH STATES
  // ===============================
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await api.get("/api/states");
        dispatch({ type: "SET_STATES", payload: res.data || [] });
      } catch (err) {
        console.error("Failed to fetch states:", err);
      }
    };
    fetchStates();
  }, []);

  // ===============================
  // FETCH LGAs
  // ===============================
  useEffect(() => {
    if (!selectedStateId) return;

    const fetchLgas = async () => {
      dispatch({ type: "SET_LOCATION_LOADING", payload: true });
      try {
        const res = await api.get(`/api/lgas/state/${selectedStateId}`);
        dispatch({ type: "SET_LGAS", payload: res.data || [] });
      } catch (err) {
        console.error("Failed to fetch LGAs:", err);
      } finally {
        dispatch({ type: "SET_LOCATION_LOADING", payload: false });
      }
    };

    fetchLgas();
  }, [selectedStateId]);

  // ===============================
  // FETCH SUBREGIONS
  // ===============================
  useEffect(() => {
    if (!selectedLgaId) return;

    const fetchSubRegions = async () => {
      dispatch({ type: "SET_LOCATION_LOADING", payload: true });
      try {
        const res = await api.get(`/api/subregions/lga/${selectedLgaId}`);
        dispatch({ type: "SET_SUBREGIONS", payload: res.data || [] });
      } catch (err) {
        console.error("Failed to fetch subregions:", err);
      } finally {
        dispatch({ type: "SET_LOCATION_LOADING", payload: false });
      }
    };

    fetchSubRegions();
  }, [selectedLgaId]);

  // ===============================
  // SUBMIT FORM
  // ===============================
  const onSubmit = async (data) => {
    dispatch({ type: "CLEAR_ERROR" });

    if (!agreed) {
      dispatch({ type: "SET_ERROR", payload: "You must accept the Terms & Conditions." });
      return;
    }

    if (!idFile) {
      dispatch({ type: "SET_ERROR", payload: "Please upload your ID document." });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const formData = new FormData();

      // Must match UserRegisterRequest exactly
      formData.append("image", idFile);
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("password", data.password);
      formData.append("role", role);
      formData.append("stateId", data.stateId);
      formData.append("localGovernanceAreaId", data.lgaId);
      formData.append("subRegionId", data.subRegionId);

      // ✅ SEND REAL CHECKBOX VALUE
      formData.append("acceptedPrivacyPolicy", String(agreed));

      const response = await api.post(
        "/api/auth/register/with-image",
        formData
      );

      console.log("Registration success:", response.data);

      navigate(route.Pricing);

    } catch (error) {
      console.error("Signup error:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Registration failed. Please try again.";

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
          {...register("fullName", { required: "Full name is required" })}
          error={errors.fullName?.message}
        />

        <Input
          label="Email Address"
          {...register("email", { required: "Email is required" })}
          error={errors.email?.message}
        />

        <Input
          label="Phone Number"
          {...register("phoneNumber", { required: "Phone number is required" })}
          error={errors.phoneNumber?.message}
        />

        <Input
          label="Password"
          type="password"
          {...register("password", { required: "Password required" })}
          error={errors.password?.message}
        />

        {/* STATE */}
        <div className="input-field">
          <label>State</label>
          <select
            {...register("stateId", { required: "State is required" })}
            onChange={(e) =>
              dispatch({ type: "SET_SELECTED_STATE", payload: e.target.value })
            }
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* LGA */}
        <div className="input-field">
          <label>LGA</label>
          <select
            {...register("lgaId", { required: "LGA is required" })}
            disabled={!selectedStateId || locationLoading}
            onChange={(e) =>
              dispatch({ type: "SET_SELECTED_LGA", payload: e.target.value })
            }
          >
            <option value="">Select LGA</option>
            {lgas.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>

        {/* SUB REGION */}
        <div className="input-field">
          <label>Sub Region</label>
          <select
            {...register("subRegionId", { required: "Sub Region is required" })}
            disabled={!selectedLgaId || locationLoading}
          >
            <option value="">Select Sub Region</option>
            {subRegions.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        <FileUpload
          label="National ID Photo"
          onFileChange={(file) =>
            dispatch({ type: "SET_FILE", payload: file })
          }
        />

        <div className="terms-row">
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => dispatch({ type: "TOGGLE_AGREED" })}
          />
          <label>
            I agree to the{" "}
            <Link to={route.Terms} target="_blank">
              Terms & Conditions
            </Link>
          </label>
        </div>

        {submitError && <p className="submit-error">{submitError}</p>}

        <button
          type="submit"
          disabled={loading || !isReady}
          className="auth-btn"
        >
          {loading ? "Creating account..." : "Complete Setup"}
        </button>

      </form>
    </AuthLayout>
  );
}