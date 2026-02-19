import "./FileUpload.css"
export default function FileUpload({ label, error, onChange }) {
  return (
    <div className="input-field">
      <label>{label}</label>

      <div
        className="file-upload-box"
        onClick={() => document.getElementById("fileInput").click()}
      >
        <span className="upload-icon">↑</span>
        <span>Tap to Upload Document</span>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={onChange}
        />
      </div>

      {error && <p className="errorText">{error}</p>}
    </div>
  );
}