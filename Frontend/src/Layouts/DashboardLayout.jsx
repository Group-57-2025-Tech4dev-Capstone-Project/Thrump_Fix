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

              <span className="text-xs font-bold text-green-600 px-4 py-2.5 flex items-center gap-1 rounded-2xl" style={{ backgroundColor: "#ECFDF5" }}>
                <LayoutMark/>
                <span className="hidden sm:inline">Verified</span>
              </span>

              <button onClick={handleLogout} className="text-xs font-bold text-gray-700 px-4 py-2.5 bg-white rounded-2xl transition" style={{ boxShadow: "0px 1px 2px -1px #0000001A, 0px 1px 3px 0px #0000001A" }}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {header && <div className="px-6 lg:px-12 mx-auto w-full max-w-7xl">{header}</div>}

      <main className="flex-1 px-6 lg:px-12 mx-auto w-full max-w-7xl">{children}</main>
    </div>
  );
}
