
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


// import React from "react";

// const Input = React.forwardRef(
//   ({ label, error, ...props }, ref) => {
//     return (
//       <div>
//         <label>{label}</label>
//         <input ref={ref} {...props} />
//         {error && <p>{error}</p>}
//       </div>
//     );
//   }
// );

// export default Input;
