import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../../Components/AuthLayout";
import Input from "../../Components/Inputs";
import route from "../../utils/routes";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  async function onSubmit(data){
    console.log("Form data:", data)
    setLoading(true)
    setAuthError("");

    try {
      // Get stored user from Signup
      const storedUser = JSON.parse(
        localStorage.getItem("user")
      )
      console.log("Stored user:", storedUser);

      // If no user found
      if (!storedUser) {
        throw new Error(
          "No account found. Please signup first."
        )
      }

      // Check credentials
      const isValid =
        data.email === storedUser.email &&
        data.password === storedUser.password;
        console.log("Is valid login:", isValid);

      if (!isValid) {
        throw new Error("Invalid email or password");
      }

        console.log(
        "Redirecting as:",
        storedUser.role
        );

      if (storedUser.role === "plumber") {
        navigate(route.PlumberDashboard);
      } else {
        navigate(route.ConsumerDashboard);
      }

    } catch (error) {
      setAuthError(error.message);
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back">

      <form onSubmit={handleSubmit(onSubmit)}>
        {authError && (
            <p className="auth-error">
                {authError}
            </p>
        )}

        <Input
          label="Email"
          placeholder="john@gmail.com"
          {...register("email", {
            required: "Email is required",
          })}
          error={errors.email?.message}
        />

        <Input
          label="Password"
          type="password"
          placeholder="********"
          {...register("password", {
            required: "Password is required",
          })}
          error={errors.password?.message}
        />

        <button type="submit" disabled={loading}>
          {loading && (
            <span className="btn-spinner" />
          )}
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>
    </AuthLayout>
  );
}
