
import { useReducer } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../../Components/authLayout/AuthLayout.jsx";
import RoleToggle from "../../Components/toggle/RoleToggle";
import Input from "../../Components/inputs/Inputs.jsx";
import FileUpload from "../../Components/fileUpload/FileUpload.jsx";
import route from "../../utils/routes";
import "./signup.css";

const STATES = [
  { value: "Lagos", label: "Lagos", active: true },
  { value: "Abuja", label: "Abuja (Coming Soon)", active: false },
  { value: "Kano", label: "Kano (Coming Soon)", active: false },
  { value: "Port Harcourt", label: "Port Harcourt (Coming Soon)", active: false },
];

const LAGOS_LGAS = [
  "Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa",
  "Badagry", "Epe", "Eti-Osa", "Ibeju-Lekki", "Ifako-Ijaiye",
  "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland",
  "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere",
];

const LCDA_REGIONS = [
  "Agboyi-Ketu", "Ayobo-Ipaja", "Bariga", "Coker-Aguda", "Ejigbo",
  "Ikosi-Ejirin", "Ikosi-Isheri", "Imota", "Isolo", "Itire-Ikate",
  "Lagos Island East", "Lekki", "Ojodu", "Ojokoro", "Onigbongbo",
  "Oriade", "Orile-Agege",
];

// ── Reducer ──────────────────────────────────────
const initialState = {
  role: "customer",
  idFile: null,
  agreed: false,
  loading: false,
  submitError: "",
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
    default:
      return state;
  }
}

export default function Signup() {
  const [state, dispatch] = useReducer(signupReducer, initialState);
  const { role, idFile, agreed, loading, submitError } = state;


  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ shouldUnregister: true });

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
      const payload = { ...data, role, idFile: idFile?.name };

      const res = await fetch("https://jsonplaceholder.typicode.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to signup");

      const result = await res.json();
      console.log("User created:", result);
      localStorage.setItem("user", JSON.stringify(payload));

      if (payload.role === "plumber") {
        navigate(route.PlumberDashboard);
      } else {
        navigate(route.ConsumerDashboard);
      }
    } catch (error) {
      console.error("Signup error:", error);
      dispatch({ type: "SET_ERROR", payload: "Signup failed. Please try again." });
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
          placeholder="0806-816-0826..."
          {...register("phoneNo", {
            required: "Phone number is required",
            pattern: {
              value: /^(\+234|0)[789][01]\d{8}$/,
              message: "Must be a valid Nigerian phone number",
            },
          })}
          error={errors.phoneNo?.message}
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

        {/* State — Lagos active, others disabled */}
        <div className="input-field">
          <label>State</label>
          <select
            defaultValue="Lagos"
            {...register("state", { required: "State is required" })}
          >
            {STATES.map((s) => (
              <option
                key={s.value}
                value={s.value}
                disabled={!s.active}
                className={!s.active ? "state-coming-soon" : ""}
              >
                {s.label}
              </option>
            ))}
          </select>
          {errors.state && <p className="errorText">{errors.state.message}</p>}
        </div>

        {/* LGA */}
        <div className="input-field">
          <label>Local Government Area (LGA)</label>
          <select {...register("lga", { required: "LGA is required" })}>
            <option value="">Select LGA</option>
            {LAGOS_LGAS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          {errors.lga && <p className="errorText">{errors.lga.message}</p>}
        </div>

        {/* LCDA */}
        <div className="input-field">
          <label>LCDA Region</label>
          <select {...register("lcda", { required: "LCDA is required" })}>
            <option value="">Select Region</option>
            {LCDA_REGIONS.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
          {errors.lcda && <p className="errorText">{errors.lcda.message}</p>}
        </div>

        {/* File Upload */}
        <FileUpload
          label="National ID / LASRRA Photo"
          onFileChange={(file) => dispatch({ type: "SET_FILE", payload: file })}
        />

        {/* Terms */}
        <div className="terms-row">
          <input
            type="checkbox"
            id="terms"
            checked={agreed}
            onChange={() => dispatch({ type: "TOGGLE_AGREED" })}
          />
          <label htmlFor="terms">
            I agree to the{" "}
            <span className="terms-link">TERMS & CONDITIONS</span>
          </label>
        </div>

        {submitError && (
          <p className="submit-error">{submitError}</p>
        )}

        <button type="submit" disabled={loading} className="auth-btn">
          {loading && <span className="btn-spinner" />}
          {loading ? "Creating..." : "Complete Setup"}
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
