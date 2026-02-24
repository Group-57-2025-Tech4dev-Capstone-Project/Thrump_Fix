import { useRef, useState } from "react";
import "./FileUpload.css";

export default function FileUpload({ label, onFileChange }) {
  const inputRef = useRef();
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  function handleClick() {
    inputRef.current.click();
  }

  function handleChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large. Maximum size is 5MB.");
      return;
    }

    setError("");
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
    if (onFileChange) onFileChange(file);
  }

  return (
    <div className="file-upload">
      {label && <label>{label}</label>}

      {/* Hidden file input — always present */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: "none" }}
      />

      {/* Empty state — click to upload */}
      {!preview && (
        <div className="file-upload-box" onClick={handleClick}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="28" height="28">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <span>Tap to Upload Document</span>
        </div>
      )}

      {/* Preview — click image to change */}
      {preview && (
        <div className="file-upload-preview">
          <img
            src={preview}
            alt="ID preview"
            className="file-upload-img"
            onClick={handleClick}
            title="Click to change"
          />
          <p className="file-upload-filename">{fileName}</p>
          <p className="file-upload-hint">Tap image to change</p>
        </div>
      )}

      {error && <p className="file-upload-error">{error}</p>}
    </div>
  );
}
