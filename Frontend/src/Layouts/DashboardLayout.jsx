import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import route from "../utils/routes"

export default function DashboardLayout({ children }) {
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

    // Save to localStorage (temporary demo storage)
    const updatedUser = { ...user, avatar: imageUrl };
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <nav className="bg-white border-b sticky top-0 z-50">

        <div className="max-w-7xl mx-auto px-6">

          <div className="flex items-center justify-between h-16">

            {/* LEFT */}
            <div className="flex items-center gap-3">

              <h2 className="text-xl font-bold text-blue-600">
                PlumbConnect
              </h2>

              <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full font-medium">
                ONLINE
              </span>

            </div>

            {/* RIGHT — USER CAPSULE */}
            <div className="flex items-center gap-3 bg-gray-100 px-3 py-1.5 rounded-full">

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              {/* Avatar Upload Trigger */}
              <div
                onClick={handleAvatarClick}
                className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition"
                title="Upload profile image"
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-bold text-gray-700">
                    {user?.fullName?.charAt(0) || "U"}
                  </span>
                )}
              </div>

              {/* Name + Verified */}
              <div className="flex items-center gap-2">

                <span className="font-medium text-sm">
                  {user?.fullName || "User"}
                </span>

                <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full">
                  Verified
                </span>

              </div>

            </div>

          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {children}
      </main>

    </div>
  );
}
