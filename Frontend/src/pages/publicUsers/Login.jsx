import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../../Components/authLayout/AuthLayout";
import Input from "../../Components/inputs/Inputs";
import route from "../../utils/routes";
import api from "../../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    setLoading(true);
    setAuthError("");

    try {
      const res = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      const user = res.data;
      localStorage.setItem("user", JSON.stringify(user));

      
      if (user.role === "PLUMBER") {
        navigate(route.PlumberDashboard);
      } else {
        navigate(route.ConsumerDashboard);
      }

    } catch (error) {
      console.error("Login error:", error);
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Invalid email or password. Please try again.";
      setAuthError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout className="authLogin" title="Login">
      <form onSubmit={handleSubmit(onSubmit)}>

        {authError && (
          <p className="auth-error">{authError}</p>
        )}

        <Input
          label="Email Address"
          placeholder="email@example.com"
          {...register("email", { required: "Email is required" })}
          error={errors.email?.message}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          {...register("password", { required: "Password is required" })}
          error={errors.password?.message}
        />

        <button type="submit" disabled={loading} className="auth-btn auth-btn--ready">
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
