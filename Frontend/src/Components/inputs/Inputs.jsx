import "./Inputs.css"
export default function Input({
  label,
  type = "text",
  placeholder,
  error,
  ...rest

}) {
  return (
    <div className="input-field">
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        {...rest}
        className={error ? "error" : ""}
      />
      {error && <p className="errorText">{error}</p>}
    </div>
  );
}


