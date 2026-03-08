// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://thrump-fix-lbm8.onrender.com/api",
// });

// // ── Always attach JWT if present ─────────────────────────────
// api.interceptors.request.use((config) => {
//   const raw = localStorage.getItem("user");
//   if (raw) {
//     try {
//       const { token } = JSON.parse(raw);
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     } catch (e) {
//       console.error("[api.js] Failed to parse user from localStorage:", e);
//     }
//   }
//   return config;
// });

// export default api;




import axios from "axios";

const api = axios.create({
  baseURL: "https://thrump-fix-lbm8.onrender.com/api",
});

// ── Attach JWT on every request ───────────────────────────────
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

// ── If token is expired/invalid
api.interceptors.response.use(
  (response) => response, 
  (error) => {
    const status = error.response?.status;
    const url    = error.config?.url || "";

    // redirect on 401/403
    const isAuthEndpoint = url.includes("/auth/login") || url.includes("/auth/register");

    if ((status === 401 || status === 403) && !isAuthEndpoint) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;