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

//   // PaymentPage after success
//   const successMessage = location.state?.message;

//   const [loading, setLoading] = useState(false);
//   const [authError, setAuthError] = useState("");

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm();

//   const email = watch("email", "");
//   const password = watch("password", "");
//   const isFormFilled = email.trim() !== "" && password.trim() !== "";

//   async function onSubmit(data) {
//     setLoading(true);
//     setAuthError("");

//     try {
//       const res = await api.post("/auth/login", {
//         email: data.email,
//         password: data.password,
//       });

//       const user = res.data;
//       console.log("LOGIN RESPONSE:", JSON.stringify(res.data));
//       localStorage.setItem("user", JSON.stringify(user));

//       if (user.role === "PLUMBER") {
//         navigate(route.PlumberDashboard);
//       } else {
//         navigate(route.ConsumerDashboard);
//       }

//     } catch (error) {
//       const data = error.response?.data;
//       const status = error.response?.status;

//       // handle both object and string responses
//       const serverMessage = typeof data === "object" ? data?.message : data;

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
//       <form onSubmit={handleSubmit(onSubmit)}>

//         {/* Shows ONLY after coming from payment*/}
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
//           placeholder="email@example.com"
//           {...register("email", { required: "Email is required" })}
//           error={errors.email?.message}
//         />

//         <Input
//           label="Password"
//           type="password"
//           placeholder="••••••••"
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
    const res = await api.post("/auth/login", {
      email: data.email,
      password: data.password,
    });

    console.log("FULL RESPONSE:", res.data);

    // ✅ EXTRACT CORRECTLY
    const token = res.data.token;
    const user = res.data;

    if (!token) {
      console.error("❌ No token returned");
      setAuthError("Login failed: no token received");
      return;
    }

    // ✅ SAVE
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user", JSON.stringify(user));

    // sessionStorage.setItem("token", data.token);
    // sessionStorage.setItem("user", JSON.stringify(data.user));

    console.log("✅ Token saved:", token);
    console.log("✅ User saved:", user);

    // ✅ NAVIGATE
    if (user.role === "PLUMBER") {
      navigate(route.PlumberDashboard);
    } else {
      navigate(route.ConsumerDashboard);
    }
    console.log("Token from API:", res.data.token);
console.log("User from API:", res.data);

  } catch (error) {
    const data = error.response?.data;
    const status = error.response?.status;

    const serverMessage =
      typeof data === "object" ? data?.message : data;

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
