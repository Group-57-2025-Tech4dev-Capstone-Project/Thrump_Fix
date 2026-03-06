import axios from "axios";

const api = axios.create({
  baseURL: "https://thrump-fix-lbm8.onrender.com/api",
});

// ── Always attach JWT if present ─────────────────────────────
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("user");
  if (raw) {
    try {
      const { token } = JSON.parse(raw);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error("[api.js] Failed to parse user from localStorage:", e);
    }
  }
  return config;
});

export default api;
