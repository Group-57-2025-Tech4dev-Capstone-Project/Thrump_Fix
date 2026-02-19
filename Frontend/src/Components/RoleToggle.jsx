

export default function RoleToggle({ role, setRole }) {
  return (
    <div className="role-toggle">
      <button
        type="button"
        className={role === "customer" ? "active" : ""}
        onClick={() => setRole("customer")}
      >
        <span className="icon-customer"></span>
        Customer
      </button>

      <button
        type="button"
        className={role === "plumber" ? "active" : ""}
        onClick={() => setRole("plumber")}
      >
        {/* icon component */}
        <span className="icon-plumber"></span>
        Plumber
      </button>
    </div>
  );
} 