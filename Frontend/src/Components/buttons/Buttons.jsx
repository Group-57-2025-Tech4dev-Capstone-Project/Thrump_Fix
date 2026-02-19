import "./Button.css";
import clsx from "clsx";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  prefix,
  suffix,
  ...props
}) {
  return (
    <button
      className={clsx(
        "btn",
        `btn-${variant}`,
        `btn-${size}`
      )}
      {...props}
    >
      {prefix && <span className="btn-icon">{prefix}</span>}

      <span>{children}</span>

      {suffix && <span className="btn-icon">{suffix}</span>}
    </button>
  );
}
