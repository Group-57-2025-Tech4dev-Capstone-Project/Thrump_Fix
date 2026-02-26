import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import route from "../utils/routes";
import Logo from "../assets/Logo.svg?react";
import api from "../utils/api";

export default function DashboardLayout({
  children,
  statusLabel,
  statusColor,
  header,
}) {
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [uploading, setUploading] = useState(false);

  async function handleLogout() {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      // proceed with logout even if API call fails
    } finally {
      localStorage.removeItem("user");
      navigate(route.Login);
    }
  }

  function handleAvatarClick() {
    fileInputRef.current.click();
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview instantly while upload happens in background
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

      // Save preview URL to localStorage
      const updatedUser = { ...user, avatar: previewUrl };
      localStorage.setItem("user", JSON.stringify(updatedUser));

    } catch (err) {
      console.error("Failed to upload profile photo:", err);
      // Preview still shows even if upload fails
    } finally {
      setUploading(false);
    }
  }

  const firstName = user?.fullName?.split(" ")[0] || "User";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── NAVBAR ── */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* LEFT */}
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

            {/* RIGHT */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

              <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-100 pl-1.5 pr-2 sm:pr-3 py-1 rounded-full">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {/* Avatar — shows spinner ring*/}
                <div
                  onClick={handleAvatarClick}
                  title="Upload profile image"
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden cursor-pointer transition flex-shrink-0 text-gray-500 ${
                    uploading
                      ? "ring-2 ring-blue-400 ring-offset-1 animate-pulse"
                      : "hover:ring-2 hover:ring-blue-400"
                  }`}
                >
                  {avatar ? (
                    <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>

                <span className="hidden sm:block text-sm font-semibold text-gray-800">
                  {firstName}
                </span>

                <span className="text-xs font-bold text-green-600 bg-green-100 px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">
                  ✓ <span className="hidden sm:inline">Verified</span>
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 sm:gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-300 px-2.5 sm:px-3 py-1.5 rounded-full transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>

            </div>
          </div>
        </div>
      </nav>

      {/* ── PAGE HEADER ── */}
      {header && (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pt-5 sm:pt-7 lg:pt-8">
          {header}
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-6">
        {children}
      </main>

    </div>
  );
}
