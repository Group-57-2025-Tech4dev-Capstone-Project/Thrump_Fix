

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";

// import AuthLayout from "../../Components/AuthLayout";
// import RoleToggle from "../../Components/RoleToggle";
// import Input from "../../Components/Inputs";
// import route from "../../utils/routes";


// export default function Signup() {
//   // Role toggle state
//   const [role, setRole] = useState("customer");
//   const [loading, setLoading] =useState(false)

//   // Redirect hook
//   const navigate = useNavigate();

//   // React Hook Form setup
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//      shouldUnregister: true,
//   });

//   // Submit function
//   const onSubmit = async (data) => {
//      setLoading(true);
//     try {
//       // Add role into submitted data
//       const payload = {
//         ...data,
//         role,
//       };

//       const res = await fetch(
//         "https://jsonplaceholder.typicode.com/users",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (!res.ok) {
//         throw new Error("Failed to signup");
//       }

//       const result = await res.json();

//       console.log("User created:", result);
//       localStorage.setItem("user", JSON.stringify(payload));

//       // Redirect after success
//         if (payload.role === "plumber") {
//             navigate(route.PlumberDashboard);
//             } else {
//             navigate(route.ConsumerDashboard);
//         }



//     } catch (error) {
//       console.error("Signup error:", error);
//   alert("Signup failed. Try again.");
//     }finally {
//     setLoading(false);
//   }
//   };

//   return (
//     <AuthLayout title="Join PlumbConnect">
//       <RoleToggle role={role} setRole={setRole} />

//       <form onSubmit={handleSubmit(onSubmit)}>

//         <Input
//           label="Full Name"
//           placeholder="John Paul"
//           {...register("fullName", {
//             required: "Full name is required",
//           })}
//           error={errors.fullName?.message}
//         />

//         <Input
//           label="Email"
//           placeholder="john@gmail"
//           {...register("email", {
//             required: "Email is required",
//             pattern: {
//               value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//               message: "Invalid email format",
//             },
//           })}
//           error={errors.email?.message}
//         />

//         <Input
//           label="Password"
//           type="password"
//           placeholder="*******"
//           {...register("password", {
//             required: "Password required",
//             minLength: {
//               value: 6,
//               message: "Minimum 6 characters",
//             },
//             pattern: {
//               value: /^(?=.*[A-Z])(?=.*\d).{6,}$/,
//               message:
//                 "Must include 1 capital letter & 1 number",
//             },
//           })}
//           error={errors.password?.message}
//         />

//         {/* Plumber only */}
//         {role === "plumber" && (
//           <Input
//             label="Phone Number"
//             placeholder="+234 806 4399 747"

//             {...register("phoneNo", {
//               required: "Phone Number required",
//                pattern: {
//                     value: /^(\+234|0)[789][01]\d{8}$/,
//                     message: "Must be a valid phone number",
//                 },
//             })}
//             error={errors.phoneNo?.message}
//           />
//         )}

//         <button disabled={loading}>
//             {loading && <span className="btn-spinner" />}
//             {loading ? "Creating..." : "Signup"}
//         </button>

//       </form>
//     </AuthLayout>
//   );
// }


import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../../Components/AuthLayout";
import RoleToggle from "../../Components/RoleToggle";
import Input from "../../Components/Inputs";
import FileUpload from "../../Components/FileUpload";
import route from "../../utils/routes";

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
    <AuthLayout>
      {/* Your existing working RoleToggle — untouched */}
      <RoleToggle role={role} setRole={setRole} />

      <form onSubmit={handleSubmit(onSubmit)}>

        {/* These are reusable components — styled with CSS inside them */}
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
          label="Full Name"
          placeholder="Must match your National ID name"
          {...register("fullName", { required: "Full name is required" })}
          error={errors.fullName?.message}
        />

        <Input
          label="Nigerian Phone Number"
          placeholder="08012345678"
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

        {/* State — not a reusable component so Tailwind is fine here */}
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-widest text-blue-900 mb-2">
            State
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-blue-50 text-blue-900 text-sm outline-none focus:border-blue-400 focus:bg-white cursor-pointer"
            {...register("state", { required: "State is required" })}
          >
            <option value="">Select State</option>
            {NIGERIAN_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.state && (
            <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>
          )}
        </div>

        {/* LGA */}
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-widest text-blue-900 mb-2">
            Local Government Area (LGA)
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-blue-50 text-blue-900 text-sm outline-none focus:border-blue-400 focus:bg-white cursor-pointer"
            {...register("lga", { required: "LGA is required" })}
          >
            <option value="">Select LGA</option>
            {LAGOS_LGAS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          {errors.lga && (
            <p className="text-red-500 text-xs mt-1">{errors.lga.message}</p>
          )}
        </div>

        {/* LCDA */}
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-widest text-blue-900 mb-2">
            LCDA Region
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-blue-50 text-blue-900 text-sm outline-none focus:border-blue-400 focus:bg-white cursor-pointer"
            {...register("lcda", { required: "LCDA is required" })}
          >
            <option value="">Select Region</option>
            {LCDA_REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          {errors.lcda && (
            <p className="text-red-500 text-xs mt-1">{errors.lcda.message}</p>
          )}
        </div>

        {/* File Upload — reusable component, CSS handles its styling */}
        <FileUpload
          label="National ID / LASRRA Photo"
          onChange={(e) => setIdFile(e.target.files[0])}
        />

        {/* Terms & Conditions */}
        <div className="flex items-center gap-2 mb-6">
          <input
            type="checkbox"
            id="terms"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 cursor-pointer"
          />
          <label htmlFor="terms" className="text-sm text-gray-500">
            I agree to the{" "}
            <span className="text-blue-500 font-bold cursor-pointer">
              TERMS & CONDITIONS
            </span>
          </label>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-300 hover:bg-blue-400 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold text-sm uppercase tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          {loading && <span className="btn-spinner" />}
          {loading ? "Creating..." : "Complete Setup"}
        </button>

        {/* Login link */}
        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate(route.Login)}
            className="text-blue-500 font-bold cursor-pointer"
          >
            LOGIN
          </span>
        </p>

      </form>
    </AuthLayout>
  );
}


