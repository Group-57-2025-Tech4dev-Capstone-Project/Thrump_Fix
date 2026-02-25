
import "./AuthLayout.css"
import Logo from "../../assets/Logo.svg?react"

export default function AuthLayout({title, children }) {
  return (
    <div className="auth-wrapper">

      {/* Logo at the top */}
      <div className="auth-logo">
        <Logo className="auth-logo-icon" />
        <span className="auth-logo-text">Thrump Fix</span>
      </div>

      {/* White card */}
      <div className="auth-card">
        <h2 className="auth-title">{title}</h2>
        {children}
      </div>

    </div>
  );
}
