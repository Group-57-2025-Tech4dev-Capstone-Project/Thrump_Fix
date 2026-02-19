

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../../Components/AuthLayout";
import RoleToggle from "../../Components/RoleToggle";
import Input from "../../Components/Inputs";
import route from "../../utils/routes";


export default function Signup() {
  // Role toggle state
  const [role, setRole] = useState("customer");
  const [loading, setLoading] =useState(false)

  // Redirect hook
  const navigate = useNavigate();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
     shouldUnregister: true,
  });

  // Submit function
  const onSubmit = async (data) => {
     setLoading(true);
    try {
      // Add role into submitted data
      const payload = {
        ...data,
        role,
      };

      const res = await fetch(
        "https://jsonplaceholder.typicode.com/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to signup");
      }

      const result = await res.json();

      console.log("User created:", result);
      localStorage.setItem("user", JSON.stringify(payload));

      // Redirect after success
        if (payload.role === "plumber") {
            navigate(route.PlumberDashboard);
            } else {
            navigate(route.ConsumerDashboard);
        }



    } catch (error) {
      console.error("Signup error:", error);
  alert("Signup failed. Try again.");
    }finally {
    setLoading(false);
  }
  };

  return (
    <AuthLayout title="Join PlumbConnect">
      <RoleToggle role={role} setRole={setRole} />

      <form onSubmit={handleSubmit(onSubmit)}>

        <Input
          label="Full Name"
          placeholder="John Paul"
          {...register("fullName", {
            required: "Full name is required",
          })}
          error={errors.fullName?.message}
        />

        <Input
          label="Email"
          placeholder="john@gmail"
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
          label="Password"
          type="password"
          placeholder="*******"
          {...register("password", {
            required: "Password required",
            minLength: {
              value: 6,
              message: "Minimum 6 characters",
            },
            pattern: {
              value: /^(?=.*[A-Z])(?=.*\d).{6,}$/,
              message:
                "Must include 1 capital letter & 1 number",
            },
          })}
          error={errors.password?.message}
        />

        {/* Plumber only */}
        {role === "plumber" && (
          <Input
            label="Phone Number"
            placeholder="+234 806 4399 747"

            {...register("phoneNo", {
              required: "Phone Number required",
               pattern: {
                    value: /^(\+234|0)[789][01]\d{8}$/,
                    message: "Must be a valid phone number",
                },
            })}
            error={errors.phoneNo?.message}
          />
        )}

        <button disabled={loading}>
            {loading && <span className="btn-spinner" />}
            {loading ? "Creating..." : "Signup"}
        </button>

      </form>
    </AuthLayout>
  );
}
