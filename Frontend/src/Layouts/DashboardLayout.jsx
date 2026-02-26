import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import route from "../utils/routes";
import LogoIcon from "../Components/icons/Logo";

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

  const firstName = user?.fullName?.split(" ")[0] || "User";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── NAVBAR ── */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* LEFT*/}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">

              {/* <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                    <path d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                  </svg>
                </div>
                
                <span className="text-base font-extrabold text-blue-700 tracking-tight">
                  Thrump Fix
                </span>
              </div> */}

              <LogoIcon />


              {statusLabel && (
                <span className={`hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full border ${statusColor === "green"
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

              {/* User capsule */}
              <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-100 pl-1.5 pr-2 sm:pr-3 py-1 rounded-full">
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
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-400 transition flex-shrink-0 text-gray-500"
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

              {/* Logout*/}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 sm:gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-300 px-2.5 sm:px-3 py-1.5 rounded-full transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                {/* Label hidden on mobile */}
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
