import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import route from "../utils/routes";

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

  function handleLogout() {
    localStorage.removeItem("user");
    navigate(route.Login);
  }

  function handleAvatarClick() {
    fileInputRef.current.click();
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setAvatar(imageUrl);
    const updatedUser = { ...user, avatar: imageUrl };
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── NAVBAR ── */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* LEFT*/}
            <div className="flex items-center gap-3">

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                    <path d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                  </svg>
                </div>
                <span className="text-base font-extrabold text-blue-700 tracking-tight">
                  PlumbConnect
                </span>
              </div>

              {/* Status badge*/}
              {statusLabel && (
                <span className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full border ${
                  statusColor === "green"
                    ? "border-green-300 text-green-600 bg-green-50"
                    : "border-gray-300 text-gray-500"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusColor === "green" ? "bg-green-500" : "bg-gray-400"}`} />
                  {statusLabel}
                </span>
              )}
            </div>

            {/* RIGHT*/}
            <div className="flex items-center gap-3">

              <div className="flex items-center gap-2 bg-gray-100 pl-1.5 pr-3 py-1 rounded-full">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <div
                  onClick={handleAvatarClick}
                  title="Upload profile image"
                  className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-400 transition flex-shrink-0 text-gray-500"
                >
                  {avatar ? (
                    <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>

                <span className="text-sm font-semibold text-gray-800">
                  {user?.fullName?.split(" ")[0] || "User"}
                </span>

                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                  ✓ Verified
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 transition"
              >
                Log Out
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* ── PAGE HEADER ── */}
      {header && (
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          {header}
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {children}
      </main>

    </div>
  );
}
