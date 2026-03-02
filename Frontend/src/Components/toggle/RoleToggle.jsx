import "./RoleToggle.css";

export default function RoleToggle({ role, setRole }) {
  return (
    <div className={`role-toggle ${role === "PLUMBER" ? "plumber-active" : ""}`}>
      <button
        type="button"
        className={role === "CUSTOMER" ? "active" : ""}
        onClick={() => setRole("CUSTOMER")}
      >
        <span className="icon-customer"></span>
        Customer
      </button>

      <button
        type="button"
        className={role === "PLUMBER" ? "active" : ""}
        onClick={() => setRole("PLUMBER")}
      >
        <span className="icon-plumber"></span>
        Plumber
      </button>
    </div>
  );
}
