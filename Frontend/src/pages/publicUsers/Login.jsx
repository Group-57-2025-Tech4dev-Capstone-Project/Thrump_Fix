import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../../Components/authLayout/AuthLayout";
import Input from "../../Components/inputs/Inputs";
import route from "../../utils/routes";

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
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser) {
        throw new Error("No account found. Please signup first.");
      }

      const isValid =
        data.email === storedUser.email &&
        data.password === storedUser.password;

      if (!isValid) {
        throw new Error("Invalid email or password");
      }

      if (storedUser.role === "plumber") {
        navigate(route.PlumberDashboard);
      } else {
        navigate(route.ConsumerDashboard);
      }
    } catch (error) {
      setAuthError(error.message);
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

        <button type="submit" disabled={loading} className="auth-btn">
          {loading && <span className="btn-spinner" />}
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="auth-footer">
          Need a PlumbConnect account?{" "}
          <span className="auth-link" onClick={() => navigate(route.Signup)}>
            REGISTER
          </span>
        </p>

      </form>
    </AuthLayout>
  );
}
