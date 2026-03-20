import { useReducer, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import AuthLayout from "../../Components/authLayout/AuthLayout.jsx";
import RoleToggle from "../../Components/toggle/RoleToggle";
import Input from "../../Components/inputs/Inputs.jsx";
import FileUpload from "../../Components/fileUpload/FileUpload.jsx";
import route from "../../utils/routes";
import "./signup.css";
import ArrowdownSignup from "../../assets/ArrowdownSignup.svg?react"

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

// ─────────────────────────────────────────────────────────────────────────────
// TERMS OVERLAY
// ─────────────────────────────────────────────────────────────────────────────
function TermsOverlay({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 rounded-lg p-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18" height="18">
                <path d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
              </svg>
            </div>
            <span className="font-bold text-blue-900 text-base">Thrump Fix</span>
          </div>
          <button onClick={onClose} className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-8 pb-4 w-full">
        <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-1">Legal</p>
        <h1 className="text-2xl font-extrabold text-gray-900">Terms, Privacy &amp; Cookie Policy</h1>
        <p className="text-sm text-gray-400 mt-1">Effective Date: February 2026 · Last Updated: February 2026</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-4 w-full">
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-10 space-y-10 text-sm text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide mb-6 pb-2 border-b border-gray-100">Thrump Fix — Terms of Service</h2>
            <div className="space-y-7">
              <section><h3 className="font-extrabold text-gray-900 mb-1">1. Introduction</h3><p>Welcome to Thrump Fix ("THRUMP FIX," "we," "our," or "us"). Thrump Fix is a web-based digital marketplace that connects individuals and businesses seeking plumbing services ("Users") with independent plumbing professionals ("Plumbers") within the Federal Republic of Nigeria.</p><p className="mt-2">By accessing or using the Thrump Fix website and related services (the "Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you must discontinue use immediately.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">2. Nature of the Platform</h3><ul className="list-disc pl-5 space-y-1"><li>Thrump Fix is a technology intermediary platform only.</li><li>We do not provide plumbing services.</li><li>Plumbers are independent contractors and not employees, agents, or partners of Thrump Fix.</li><li>We do not supervise, control, or direct the services provided by Plumbers.</li><li>All service agreements are solely between Users and Plumbers.</li><li>Thrump Fix disclaims liability for service performance, workmanship, or disputes between parties.</li></ul></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">3. Eligibility</h3><p>To use the Platform, you must be at least 20 years old, have legal capacity under Nigerian law, and provide accurate and complete registration information.</p><p className="mt-2">As part of account activation, all Users and Plumbers are required to upload a clear and recent profile photograph. Access to core Platform features may be restricted until this requirement is fulfilled.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">4. Account Registration &amp; Security</h3><p>You are responsible for maintaining the confidentiality of your login credentials, all activities under your account, and promptly notifying us of unauthorized access.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">5. User Obligations</h3><ul className="list-disc pl-5 space-y-1"><li>Provide accurate job descriptions.</li><li>Upload lawful and relevant media.</li><li>Use the Platform for legitimate service requests only.</li><li>Not harass, threaten, or abuse Plumbers.</li><li>Not bypass or attempt to bypass Platform payment systems.</li></ul></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">6. Plumber Obligations</h3><ul className="list-disc pl-5 space-y-1"><li>Provide truthful and accurate professional information.</li><li>Perform services with reasonable care and skill.</li><li>Comply with Nigerian laws and applicable safety standards.</li><li>Maintain required certifications and licenses where applicable.</li><li>Communicate pricing transparently.</li></ul></section>
              <section><h3 className="font-extrabold text-gray-900 mb-2">7. Plumber Verification &amp; Trust Framework</h3><p className="mb-3">Thrump Fix implements structured verification measures to promote safety and reduce fraud risk. However, verification does not guarantee service quality.</p><div className="space-y-4 pl-1"><div><h4 className="font-bold text-gray-800 mb-1">7.1 Identity Verification (KYC)</h4><p>Before accepting jobs, Plumbers may be required to provide government-issued identification, a verified phone number and email address, and selfie or live verification confirmation where applicable.</p></div><div><h4 className="font-bold text-gray-800 mb-1">7.2 Business &amp; Professional Verification</h4><p>Where applicable, Plumbers may be required to provide business registration documentation, trade certifications, technical qualifications, and tax identification information.</p></div><div><h4 className="font-bold text-gray-800 mb-1">7.3 Profile Transparency</h4><p>Verified profiles may display verification badges, years of experience, service categories, ratings and reviews, job completion statistics, and response time metrics.</p></div><div><h4 className="font-bold text-gray-800 mb-1">7.4 Ratings &amp; Reviews</h4><p>Only Users who complete jobs through the Platform may submit reviews. Fake or manipulated reviews, incentivized reviews, and harassment via reviews are prohibited.</p></div><div><h4 className="font-bold text-gray-800 mb-1">7.5 Ongoing Monitoring</h4><p>We may monitor for repeated complaints, suspicious activity patterns, payment circumvention attempts, and unusual cancellation behavior.</p></div><div><h4 className="font-bold text-gray-800 mb-1">7.6 Complaints &amp; Investigation</h4><p>Users may submit complaints concerning poor workmanship, fraud or misconduct, or safety concerns. Thrump Fix may temporarily suspend accounts, review communications and logs, and remove accounts where necessary.</p></div><div><h4 className="font-bold text-gray-800 mb-1">7.7 Limitation of Verification</h4><p>Verification reduces but does not eliminate risk. Thrump Fix does not insure or guarantee service performance.</p></div></div></section>
              <section><h3 className="font-extrabold text-gray-900 mb-2">8. Payments, Fees &amp; Subscriptions</h3><div className="space-y-4 pl-1"><div><h4 className="font-bold text-gray-800 mb-1">8.1 Platform Fees</h4><p>Thrump Fix may charge subscription fees (including free trials), commission per completed job, and transaction processing fees. All applicable fees will be disclosed before payment.</p></div><div><h4 className="font-bold text-gray-800 mb-1">8.2 Free Trial Policy</h4><p>Where offered, trial duration will be specified during signup. Paid subscription begins automatically unless cancelled before expiration.</p></div><div><h4 className="font-bold text-gray-800 mb-1">8.3 Payment Processing</h4><p>Payments are processed via secure third-party providers compliant with financial regulations. Thrump Fix does not store full debit or credit card details.</p></div><div><h4 className="font-bold text-gray-800 mb-1">8.4 Refund Policy</h4><p>Refunds may be granted in cases of service non-performance, fraud, or platform technical errors.</p></div></div></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">9. Dispute Resolution</h3><p>Thrump Fix may facilitate communication between parties but is not responsible for service dissatisfaction, property damage, personal injury, or financial losses resulting from services rendered.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">10. Acceptable Use Policy</h3><p>You must not engage in fraud or harassment, upload illegal content, attempt unauthorized access, reverse engineer platform systems, scrape data, or circumvent platform payment systems. Violations may result in immediate suspension.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">11. Intellectual Property</h3><p>All Platform software, branding, and content belong to Thrump Fix. Users retain ownership of uploaded content but grant Thrump Fix a limited license to use such content for service delivery and platform improvement.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">12. Limitation of Liability</h3><p>To the fullest extent permitted by Nigerian law, Thrump Fix shall not be liable for indirect or consequential damages, loss of profits, service-related damages or injuries, or acts or omissions of independent Plumbers. Total liability shall not exceed the amount paid to Thrump Fix in the preceding three (3) months.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">13. Indemnification</h3><p>Users and Plumbers agree to indemnify and hold Thrump Fix harmless from claims, damages, or expenses arising from misuse of the Platform, breach of these Terms, or service disputes.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">14. Account Suspension &amp; Termination</h3><p>We may suspend or terminate accounts for fraud or misrepresentation, security threats, policy violations, or legal compliance requirements. Termination may occur without prior notice where necessary.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">15. Governing Law &amp; Jurisdiction</h3><p>These Terms are governed by the laws of the Federal Republic of Nigeria. Disputes shall be subject to the exclusive jurisdiction of Nigerian courts.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">16. Amendments</h3><p>We may update these Terms periodically. Continued use of the Platform constitutes acceptance of revised Terms.</p></section>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide mb-6 pb-2 border-b border-gray-100">Thrump Fix — Privacy Policy</h2>
            <p className="mb-5 text-xs text-gray-400 font-medium">Compliant with Nigeria Data Protection Act 2023 · Effective Date: February 2026</p>
            <div className="space-y-7">
              <section><h3 className="font-extrabold text-gray-900 mb-1">1. Data Collected</h3><p>We may collect: name, email, phone number, location data (during active jobs), uploaded images/videos, payment transaction records, and device and usage data.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">2. Legal Basis for Processing</h3><p>We process personal data under contractual necessity, legal obligations, legitimate interests, and user consent where required.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">3. Location Data</h3><p>Location data is used for matching and active job tracking, disabled automatically upon job completion, and retained only as necessary.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">4. Data Sharing</h3><p>We do not sell personal data. Data may be shared with assigned Plumbers, payment processors, hosting providers, and law enforcement where legally required.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">5. Data Subject Rights (NDPA 2023)</h3><p>Users may request access, correction, deletion, withdrawal of consent, and data portability where applicable. Requests may be sent to our contact email below.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">6. Data Security</h3><p>We implement TLS encryption, encrypted storage, secure password hashing, Role-Based Access Control, monitoring and logging, and incident response procedures.</p></section>
              <section><h3 className="font-extrabold text-gray-900 mb-1">7. Children's Privacy</h3><p>The Platform is not intended for individuals under 20 years of age.</p></section>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">Cookie Policy</h2>
            <p>Thrump Fix uses cookies for secure session management, fraud prevention, and preference storage. Authentication cookies use Secure, HttpOnly, and SameSite attributes. Users may manage cookies via browser settings.</p>
          </div>

          <div>
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">Contact Information</h2>
            <p>Thrump Fix · Federal Republic of Nigeria<br />Email:{" "}<a href="mailto:thrumpfix@yahoo.com" className="text-blue-600 font-semibold hover:underline">thrumpfix@yahoo.com</a></p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-10 w-full flex justify-center mt-4">
        <button onClick={onClose} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Done — Back to Signup
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIGNUP
// ─────────────────────────────────────────────────────────────────────────────
export default function Signup() {
  const [state, dispatch] = useReducer(signupReducer, initialState);
  const [showTerms, setShowTerms] = useState(false);

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
              pattern: { value: /^0[789][01]\d{7}$/, message: "Must be a valid Nigerian phone number" },
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
              pattern: { value: /^(?=.*[A-Z])(?=.*\d).{6,}$/, message: "Must include 1 capital letter & 1 number" },
            })}
            error={errors.password?.message}
          />

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
