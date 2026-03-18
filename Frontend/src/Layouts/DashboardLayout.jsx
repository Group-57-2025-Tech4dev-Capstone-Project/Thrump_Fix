import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import route from "../utils/routes";
import Logo from "../assets/Logo.svg?react";
import api from "../utils/api";
import LayoutMark from "../assets/LayoutMark.svg?react"
import User from "../assets/User.svg?react"

export default function DashboardLayout({
  children,
  statusLabel,
  statusColor,
  header,
  trialExpired,
  onUpgrade,
}) {
  const navigate = useNavigate();
  const fileInputRef = useRef();

  // ✅ CHANGED: localStorage → sessionStorage
  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [uploading, setUploading] = useState(false);

  async function handleLogout() {
    try {
      const token = sessionStorage.getItem("token");
      const user = JSON.parse(sessionStorage.getItem("user") || "{}");
      console.log("[LOGOUT] Initiating logout for user:", user.email || user.fullName);
      console.log("[LOGOUT] Token exists:", !!token);
      console.log("[LOGOUT] Sending POST /auth/logout...");
      await api.post("/auth/logout");
      console.log("[LOGOUT] ✅ Logout successful");
    } catch (err) {
      console.error("[LOGOUT] ❌ Error:", err.response?.status, err.response?.data || err.message);
      // proceed with logout anyway even if API fails
      console.log("[LOGOUT] Proceeding with client-side logout despite API error");
    } finally {
      // ✅ CLEAR session storage properly
      console.log("[LOGOUT] Clearing sessionStorage...");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      console.log("[LOGOUT] ✅ SessionStorage cleared - redirecting to login");
      navigate(route.Login);
    }
  }

  function handleAvatarClick() {
    fileInputRef.current.click();
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setAvatar(previewUrl);

    const userId = user?.id || user?.userId;
    if (!userId) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      await api.post(`/users/users/${userId}/profile-photo`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ UPDATE sessionStorage
      const updatedUser = { ...user, avatar: previewUrl };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));

    } catch (err) {
      console.error("Failed to upload profile photo:", err);
    } finally {
      setUploading(false);
    }
  }

  const firstName = user?.fullName?.split?.(" ")?.[0] || user?.firstName || user?.name?.split?.(" ")?.[0] || "User";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {trialExpired && (
        <div className="bg-orange-500 px-4 py-2.5 flex items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4 flex-shrink-0">
              <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-white text-xs font-black">Your free trial has expired</p>
              <p className="text-orange-100 text-[11px]">Upgrade to Pro to continue unlimited access</p>
            </div>
          </div>
          <button
            onClick={onUpgrade}
            className="bg-white text-orange-500 font-black text-xs px-4 py-2 rounded-full whitespace-nowrap hover:bg-orange-50 transition flex-shrink-0"
          >
            UPGRADE NOW
          </button>
        </div>
      )}

      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 w-full">
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between h-[97px]">

            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="flex items-center gap-2 flex-shrink-0">
                <Logo />
                <span className="text-base font-extrabold text-blue-700 tracking-tight">
                  Thrump Fix
                </span>
              </div>

              {statusLabel && (
                <span className={`hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full border ${
                  statusColor === "green"
                    ? "border-green-300 text-green-600 bg-green-50"
                    : "border-gray-300 text-gray-500"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusColor === "green" ? "bg-green-500" : "bg-gray-400"}`} />
                  {statusLabel}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              <div
                onClick={handleAvatarClick}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden cursor-pointer ${
                  uploading ? "ring-2 ring-blue-400 animate-pulse" : "hover:ring-2 hover:ring-blue-400"
                }`}
              >
                {avatar ? (
                  <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <User/>
                )}
              </div>

              <span className="hidden sm:block text-sm font-semibold text-gray-800">
                {firstName}
              </span>

              <span className="text-xs font-bold text-white px-3 py-1.5 flex items-center gap-1 bg-green-600 rounded-lg hover:bg-green-700 transition">
                <LayoutMark/>
                <span className="hidden sm:inline">Verified</span>
              </span>

              <button onClick={handleLogout} className="text-xs font-bold text-gray-700 px-3 py-1.5 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {header && <div>{header}</div>}

      <main>{children}</main>
    </div>
  );
}


// import { useNavigate } from "react-router-dom";
// import { useRef, useState } from "react";
// import route from "../utils/routes";
// import Logo from "../assets/Logo.svg?react";
// import api from "../utils/api";
// import LayoutMark from "../assets/LayoutMark.svg?react"

// export default function DashboardLayout({
//   children,
//   statusLabel,
//   statusColor,
//   header,
//   trialExpired,
//   onUpgrade,
// }) {
//   const navigate = useNavigate();
//   const fileInputRef = useRef();

//   const storedUser = localStorage.getItem("user");
//   const user = storedUser ? JSON.parse(storedUser) : null;
//   const [avatar, setAvatar] = useState(user?.avatar || null);
//   const [uploading, setUploading] = useState(false);

//   async function handleLogout() {
//     try {
//       await api.post("/auth/logout");
//     } catch (err) {
//       // proceed with logout
//     } finally {
//       localStorage.removeItem("user");
//       navigate(route.Login);
//     }
//   }

//   function handleAvatarClick() {
//     fileInputRef.current.click();
//   }

//   async function handleFileChange(e) {
//     const file = e.target.files[0];
//     if (!file) return;

//     const previewUrl = URL.createObjectURL(file);
//     setAvatar(previewUrl);

//     const userId = user?.id || user?.userId;
//     if (!userId) return;

//     setUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append("image", file);

//       await api.post(`/users/users/${userId}/profile-photo`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       const updatedUser = { ...user, avatar: previewUrl };
//       localStorage.setItem("user", JSON.stringify(updatedUser));

//     } catch (err) {
//       console.error("Failed to upload profile photo:", err);
//     } finally {
//       setUploading(false);
//     }
//   }

//   const firstName = user?.fullName?.split(" ")[0] || "User";

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">

//       {/* ── ORANGE TRIAL BANNER — above everything ── */}
//       {trialExpired && (
//         <div className="bg-orange-500 px-4 py-2.5 flex items-center justify-between gap-4 w-full">
//           <div className="flex items-center gap-2">
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4 flex-shrink-0">
//               <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
//             </svg>
//             <div>
//               <p className="text-white text-xs font-black">Your free trial has expired</p>
//               <p className="text-orange-100 text-[11px]">Upgrade to Pro to continue unlimited access</p>
//             </div>
//           </div>
//           <button
//             onClick={onUpgrade}
//             className="bg-white text-orange-500 font-black text-xs px-4 py-2 rounded-full whitespace-nowrap hover:bg-orange-50 transition flex-shrink-0"
//           >
//             UPGRADE NOW
//           </button>
//         </div>
//       )}

//       {/* ── NAVBAR ── */}
//       <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 w-full">
//         <div className="w-full px-6 lg:px-12">
//           <div className="flex items-center justify-between h-[97px]">

//             {/* LEFT */}
//             <div className="flex items-center gap-2 sm:gap-3 min-w-0">
//               <div className="flex items-center gap-2 flex-shrink-0">
//                 <Logo />
//                 <span className="text-base font-extrabold text-blue-700 tracking-tight">
//                   Thrump Fix
//                 </span>
//               </div>

//               {statusLabel && (
//                 <span className={`hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full border ${
//                   statusColor === "green"
//                     ? "border-green-300 text-green-600 bg-green-50"
//                     : "border-gray-300 text-gray-500"
//                 }`}>
//                   <span className={`w-1.5 h-1.5 rounded-full ${statusColor === "green" ? "bg-green-500" : "bg-gray-400"}`} />
//                   {statusLabel}
//                 </span>
//               )}
//             </div>

//             {/* RIGHT */}
//             <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   onChange={handleFileChange}
//                   accept="image/*"
//                   className="hidden"
//                 />

//                 <div
//                   onClick={handleAvatarClick}
//                   title="Upload profile image"
//                   className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden cursor-pointer transition flex-shrink-0 text-gray-500 ${
//                     uploading
//                       ? "ring-2 ring-blue-400 ring-offset-1 animate-pulse"
//                       : "hover:ring-2 hover:ring-blue-400"
//                   }`}
//                 >
//                   {avatar ? (
//                     <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
//                   ) : (
//                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
//                       <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
//                     </svg>
//                   )}
//                 </div>

//                 <span className="hidden sm:block text-sm font-semibold text-gray-800">
//                   {firstName}
//                 </span>

//                 <span className="text-xs font-bold text-green-600 px-1.5 sm:px-3 py-2 rounded-full whitespace-nowrap flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
//                   <LayoutMark/>
//                   <span className="hidden sm:inline">Verified</span>
//                 </span>

//               <button
//                 onClick={handleLogout}
//                 className="flex items-center gap-1 sm:gap-1.5 text-sm font-semibold text-gray-500 hover:text-red-500 hover:border-red-300 px-2.5 sm:px-3 py-2 rounded-full transition shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
//                 </svg>
//                 <span className="hidden sm:inline">Logout</span>
//               </button>

//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* ── PAGE HEADER ── */}
//       {header && (
//         <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pt-5 sm:pt-7 lg:pt-8">
//           {header}
//         </div>
//       )}

//       {/* ── MAIN CONTENT ── */}
//       <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-6">
//         {children}
//       </main>

//     </div>
//   );
// }
