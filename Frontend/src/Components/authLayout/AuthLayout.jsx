
import "./AuthLayout.css"
import Logo from "../../assets/Logo.svg?react"

export default function AuthLayout({title, children }) {
  return (
    <div className="auth-wrapper">

      {/* Logo at the top */}
      <div className="auth-logo flex gap-2 items-center ">
        <img src="./icon.svg" alt="Trump Fix" />
        <p className="text-[#2563eb]  font-bold">
          Thrump Fix</p>
      </div>

      {/* White card */}
      <div className="auth-card">
        <h2 className="auth-title">{title}</h2>
        {children}
      </div>

    </div>
  );
}
