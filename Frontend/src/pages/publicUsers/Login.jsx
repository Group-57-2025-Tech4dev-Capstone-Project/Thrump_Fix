// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate, useLocation } from "react-router-dom";

// import AuthLayout from "../../Components/authLayout/AuthLayout";
// import Input from "../../Components/inputs/Inputs";
// import route from "../../utils/routes";
// import api from "../../utils/api";

// export default function Login() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const successMessage = location.state?.message;

//   const [loading, setLoading] = useState(false);
//   const [authError, setAuthError] = useState("");

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm();

//   const email    = watch("email", "");
//   const password = watch("password", "");
//   const isFormFilled = email.trim() !== "" && password.trim() !== "";

//   async function onSubmit(data) {
//     setLoading(true);
//     setAuthError("");

//     try {
//       // ── Step 1: Login
//       const res = await api.post("/auth/login", {
//         email: data.email,
//         password: data.password,
//       });

//       const token = res.data.token;
//       const loginUser = res.data;

//       if (!token) {
//         setAuthError("Login failed: no token received");
//         return;
//       }

//       // ── Step 2: Save token immediately so the next call is authenticated
//       sessionStorage.setItem("token", token);

//       // ── Step 3: Fetch full profile to get state, localGovernanceArea, subRegion as strings
//       // The login response only returns userId, fullName, email, role, verificationStatus.
//       // GET /users/me returns the complete profile including location fields.
//       // let fullUser = loginUser;
//       // try {
//       //   const profileRes = await api.get("/users/me");
//       //   // Merge: keep token + refreshToken from login, add location fields from profile
//       //   fullUser = { ...loginUser, ...profileRes.data };
//       //   console.log("[LOGIN] Full profile fetched:", profileRes.data);
//       //   console.log(
//       //     `[LOCATION] State: ${profileRes.data.state ?? "N/A"} | ` +
//       //     `LGA: ${profileRes.data.localGovernanceArea ?? "N/A"} | ` +
//       //     `SubRegion: ${profileRes.data.subRegion ?? "N/A"}`
//       //   );
//       // } catch (profileErr) {
//       //   console.warn("[LOGIN] Could not fetch full profile, using login response only:", profileErr.message);
//       // }

//       let fullUser = loginUser;
// try {
//   const profileRes = await api.get("/users/me");
//   console.log("[PROFILE RAW]", JSON.stringify(profileRes.data));
//   fullUser = { ...loginUser, ...profileRes.data };
//   console.log("[MERGED USER]", JSON.stringify(fullUser));
// } catch (profileErr) {
//   console.error("[PROFILE ERROR] status:", profileErr.response?.status);
//   console.error("[PROFILE ERROR] data:", JSON.stringify(profileErr.response?.data));
//   console.error("[PROFILE ERROR] message:", profileErr.message);
// }

//       // ── Step 4: Save complete user object
//       sessionStorage.setItem("user", JSON.stringify(fullUser));

//       // ── Step 5: Navigate by role
//       if (fullUser.role === "PLUMBER") {
//         navigate(route.PlumberDashboard);
//       } else {
//         navigate(route.ConsumerDashboard);
//       }

//     } catch (error) {
//       const errData = error.response?.data;
//       const status  = error.response?.status;

//       const serverMessage = typeof errData === "object" ? errData?.message : errData;

//       let message;
//       if (serverMessage) {
//         message = serverMessage;
//       } else if (status === 401 || status === 403) {
//         message = "Incorrect email or password. Please try again.";
//       } else if (status === 404) {
//         message = "No account found with this email address.";
//       } else if (!error.response) {
//         message = "Cannot connect to server. Please check your connection.";
//       } else {
//         message = "Something went wrong. Please try again.";
//       }

//       setAuthError(message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <AuthLayout className="authLogin" title="Login">
//       <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">

//         {successMessage && (
//           <div className="bg-green-50 border border-green-200 text-green-700 text-[12px] font-medium px-4 py-3 rounded-xl mb-4 text-center">
//             {successMessage}
//           </div>
//         )}

//         {authError && (
//           <p className="auth-error">{authError}</p>
//         )}

//         <Input
//           label="Email Address"
//           placeholder="Email"
//           autoComplete="new-password"
//           {...register("email", { required: "Email is required" })}
//           error={errors.email?.message}
//         />

//         <Input
//           label="Password"
//           type="password"
//           placeholder="Password"
//           autoComplete="new-password"
//           {...register("password", { required: "Password is required" })}
//           error={errors.password?.message}
//         />

//         <button
//           type="submit"
//           disabled={!isFormFilled || loading}
//           className={`auth-btn ${isFormFilled ? "auth-btn--ready" : "auth-btn--dim"}`}
//         >
//           {loading && <span className="btn-spinner" />}
//           {loading ? "Signing in..." : "Sign In"}
//         </button>

//         <p className="auth-footer">
//           Need a Thrump Fix account?{" "}
//           <span className="auth-link" onClick={() => navigate(route.Signup)}>
//             REGISTER
//           </span>
//         </p>

//       </form>
//     </AuthLayout>
//   );
// }


import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";

import AuthLayout from "../../Components/authLayout/AuthLayout";
import Input from "../../Components/inputs/Inputs";
import route from "../../utils/routes";
import api from "../../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const successMessage = location.state?.message;

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const email    = watch("email", "");
  const password = watch("password", "");
  const isFormFilled = email.trim() !== "" && password.trim() !== "";

  async function onSubmit(data) {
    setLoading(true);
    setAuthError("");

    try {
      // ── STEP 1: Login
      console.log("🔵 [LOGIN] Step 1 - Calling /auth/login...");
      const res = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      const token = res.data.token;
      const loginUser = res.data;

      console.log("🟢 [LOGIN] Step 1 complete - Login response fields:", Object.keys(loginUser));
      console.log("🟢 [LOGIN] Login response:", JSON.stringify(loginUser));

      if (!token) {
        setAuthError("Login failed: no token received");
        return;
      }

      // ── STEP 2: Save token so /users/me can authenticate
      sessionStorage.setItem("token", token);
      console.log("🟢 [LOGIN] Step 2 - Token saved to sessionStorage:", token.substring(0, 30) + "...");

      // ── STEP 3: Call /users/me to get state, LGA, subRegion
      console.log("🔵 [LOGIN] Step 3 - Calling /users/me to get full profile...");
      let fullUser = loginUser;
      try {
        const profileRes = await api.get("/users/me");
        console.log("🟢 [LOGIN] /users/me SUCCESS - fields:", Object.keys(profileRes.data));
        console.log("🟢 [LOGIN] /users/me full response:", JSON.stringify(profileRes.data));
        console.log("🟢 [LOGIN] state:", profileRes.data.state);
        console.log("🟢 [LOGIN] localGovernanceArea:", profileRes.data.localGovernanceArea);
        console.log("🟢 [LOGIN] subRegion:", profileRes.data.subRegion);

        // Merge login response + full profile
        fullUser = { ...loginUser, ...profileRes.data };
        console.log("🟢 [LOGIN] Step 3 - Merged user fields:", Object.keys(fullUser));
        console.log("🟢 [LOGIN] Merged user:", JSON.stringify(fullUser));
      } catch (profileErr) {
        console.error("🔴 [LOGIN] /users/me FAILED");
        console.error("🔴 [LOGIN] Error status:", profileErr.response?.status);
        console.error("🔴 [LOGIN] Error data:", JSON.stringify(profileErr.response?.data));
        console.error("🔴 [LOGIN] Error message:", profileErr.message);
      }

      // ── STEP 4: Save full user
      sessionStorage.setItem("user", JSON.stringify(fullUser));
      console.log("🟢 [LOGIN] Step 4 - Final user saved to sessionStorage");
      console.log("🟢 [LOGIN] Final user state field:", fullUser.state ?? "MISSING");
      console.log("🟢 [LOGIN] Final user LGA field:", fullUser.localGovernanceArea ?? "MISSING");
      console.log("🟢 [LOGIN] Final user subRegion field:", fullUser.subRegion ?? "MISSING");

      // ── STEP 5: Navigate
      if (fullUser.role === "PLUMBER") {
        navigate(route.PlumberDashboard);
      } else {
        navigate(route.ConsumerDashboard);
      }

    } catch (error) {
      console.error("🔴 [LOGIN] Login FAILED:", error.response?.status, JSON.stringify(error.response?.data));
      const errData = error.response?.data;
      const status  = error.response?.status;
      const serverMessage = typeof errData === "object" ? errData?.message : errData;

      let message;
      if (serverMessage) {
        message = serverMessage;
      } else if (status === 401 || status === 403) {
        message = "Incorrect email or password. Please try again.";
      } else if (status === 404) {
        message = "No account found with this email address.";
      } else if (!error.response) {
        message = "Cannot connect to server. Please check your connection.";
      } else {
        message = "Something went wrong. Please try again.";
      }

      setAuthError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout className="authLogin" title="Login">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-[12px] font-medium px-4 py-3 rounded-xl mb-4 text-center">
            {successMessage}
          </div>
        )}

        {authError && (
          <p className="auth-error">{authError}</p>
        )}

        <Input
          label="Email Address"
          placeholder="Email"
          autoComplete="new-password"
          {...register("email", { required: "Email is required" })}
          error={errors.email?.message}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          {...register("password", { required: "Password is required" })}
          error={errors.password?.message}
        />

        <button
          type="submit"
          disabled={!isFormFilled || loading}
          className={`auth-btn ${isFormFilled ? "auth-btn--ready" : "auth-btn--dim"}`}
        >
          {loading && <span className="btn-spinner" />}
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="auth-footer">
          Need a Thrump Fix account?{" "}
          <span className="auth-link" onClick={() => navigate(route.Signup)}>
            REGISTER
          </span>
        </p>

      </form>
    </AuthLayout>
  );
}
