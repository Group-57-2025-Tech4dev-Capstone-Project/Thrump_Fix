import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../../Components/authLayout/AuthLayout.jsx";
import RoleToggle from "../../Components/toggle/RoleToggle";
import Input from "../../Components/inputs/Inputs.jsx";
import FileUpload from "../../Components/fileUpload/FileUpload.jsx";
import route from "../../utils/routes";
import "./signup.css";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa",
  "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo",
  "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", "Kaduna",
  "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
  "Sokoto", "Taraba", "Yobe", "Zamfara",
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

export default function Signup() {
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [idFile, setIdFile] = useState(null);
  const [agreed, setAgreed] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ shouldUnregister: true });

  const onSubmit = async (data) => {
    if (!agreed) {
      alert("Please agree to the Terms & Conditions");
      return;
    }

    setLoading(true);
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
      alert("Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Account Setup">
      <RoleToggle role={role} setRole={setRole} />

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
          placeholder="080-081-082-090..."
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
          placeholder="Min 8 characters"
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

        {/* State */}
        <div className="input-field">
          <label>State</label>
          <select {...register("state", { required: "State is required" })}>
            <option value="">Select State</option>
            {NIGERIAN_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
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
            {LCDA_REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          {errors.lcda && <p className="errorText">{errors.lcda.message}</p>}
        </div>

        {/* File Upload */}
        <FileUpload
          label="National ID / LASRRA Photo"
          onChange={(e) => setIdFile(e.target.files[0])}
        />

        {/* Terms & Conditions */}
        <div className="terms-row">
          <input
            type="checkbox"
            id="terms"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <label htmlFor="terms">
            I agree to the{" "}
            <span className="terms-link">TERMS & CONDITIONS</span>
          </label>
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading} className="auth-btn">
          {loading && <span className="btn-spinner" />}
          {loading ? "Creating..." : "Complete Setup"}
        </button>

        {/* Login link */}
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
