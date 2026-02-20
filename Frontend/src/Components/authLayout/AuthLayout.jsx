
import "./AuthLayout.css"

export default function AuthLayout({title, children }) {
  return (
    <div className="auth-wrapper">

      {/* Logo at the top */}
      <div className="auth-logo">
        <img src="/logo.png" alt="PlumbConnect" />
      </div>

      {/* White card */}
      <div className="auth-card">
        <h2 className="auth-title">{title}</h2>
        {children}
      </div>

    </div>
  );
}
