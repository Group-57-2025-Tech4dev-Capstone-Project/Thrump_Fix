import axios from "axios";

const BASE_URL = "https://thrump-fix-lbm8.onrender.com/api";

const api = axios.create({ baseURL: BASE_URL });

// ── Attach JWT on every request ───────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("[api.js] No token in sessionStorage for:", config.url);
  }

  return config;
}, (error) => Promise.reject(error));


// ── Response interceptor ─────────────────────────────────────────────────
const _loggedOnce = new Set();
let _refreshing = false;
let _refreshQueue = [];

function processQueue(newToken, error) {
  _refreshQueue.forEach(({ resolve, reject }) => {
    if (newToken) resolve(newToken);
    else reject(error);
  });
  _refreshQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    const method = error.config?.method?.toUpperCase() || "";
    const originalReq = error.config;

    const isAuthEndpoint =
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/refresh-token");

    // 403
    if (status === 403) {
      const key = `${method}:${url}:403`;
      if (!_loggedOnce.has(key)) {
        _loggedOnce.add(key);
        console.warn(`[api.js] ${method} ${url} → 403`, error.response?.data);
      }
      return Promise.reject(error);
    }

    // Non-401
    if (status !== 401) {
      console.error(`[api.js] ${method} ${url} → ${status}`, error.response?.data);
      return Promise.reject(error);
    }

    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (originalReq._retried) {
      console.warn("[api.js] Refresh failed — logging out");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (_refreshing) {
      return new Promise((resolve, reject) => {
        _refreshQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalReq.headers.Authorization = `Bearer ${newToken}`;
        return api(originalReq);
      });
    }

    originalReq._retried = true;
    _refreshing = true;

    try {
      const raw = sessionStorage.getItem("user");
      const stored = raw ? JSON.parse(raw) : null;
      const refreshToken = stored?.refreshToken;

      if (!refreshToken) throw new Error("No refresh token");

      console.log("[api.js] Refreshing token...");

      const res = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken });

      const newToken = res.data?.token;
      const newRefresh = res.data?.refreshToken;

      if (!newToken) throw new Error("No token returned");

      // ✅ Update sessionStorage
      const updatedUser = {
        ...stored,
        refreshToken: newRefresh || refreshToken,
      };

      sessionStorage.setItem("token", newToken);
      sessionStorage.setItem("user", JSON.stringify(updatedUser));

      processQueue(newToken, null);

      originalReq.headers.Authorization = `Bearer ${newToken}`;
      return api(originalReq);

    } catch (err) {
      processQueue(null, err);

      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");

      window.location.href = "/login";
      return Promise.reject(err);
    } finally {
      _refreshing = false;
    }
  }
);

export default api;



// import axios from "axios";

// const BASE_URL = "https://thrump-fix-lbm8.onrender.com/api";

// const api = axios.create({ baseURL: BASE_URL });

// // ── Attach JWT on every request ───────────────────────────────────────────
// api.interceptors.request.use((config) => {
//   const token = sessionStorage.getItem("token");

// if (token) {
//   config.headers.Authorization = `Bearer ${token}`;
// } else {
//   console.warn("[api.js] No token in sessionStorage");
// }

//   if (raw) {
//     try {
//       const userData = JSON.parse(raw);

//       // Flexible token lookup — try common key names
//       const token =
//         userData.token ||
//         userData.accessToken ||
//         userData.jwt ||
//         userData.authToken ||
//         (userData.user && userData.user.token);

//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//         // Optional: log once per session that token was attached
//         if (!window.__tokenAttachedLogged) {
//           console.log("[api.js] Attached Bearer token to request:", config.url);
//           window.__tokenAttachedLogged = true;
//         }
//       } else {
//         console.warn("[api.js] No token found in localStorage.user for:", config.url);
//       }
//     } catch (e) {
//       console.error("[api.js] Failed to parse user from localStorage:", e);
//     }
//   } else {
//     console.warn("[api.js] No 'user' in localStorage for request:", config.url);
//   }

//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

// // ── Response interceptor ─────────────────────────────────────────────────
// const _loggedOnce = new Set();
// let _refreshing = false;
// let _refreshQueue = [];

// function processQueue(newToken, error) {
//   _refreshQueue.forEach(({ resolve, reject }) => {
//     if (newToken) resolve(newToken);
//     else reject(error);
//   });
//   _refreshQueue = [];
// }

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const status = error.response?.status;
//     const url = error.config?.url || "";
//     const method = error.config?.method?.toUpperCase() || "";
//     const originalReq = error.config;

//     const isAuthEndpoint =
//       url.includes("/auth/login") ||
//       url.includes("/auth/register") ||
//       url.includes("/auth/refresh-token");

//     // 403: log once per URL/method combo
//     if (status === 403) {
//       const key = `${method}:${url}:403`;
//       if (!_loggedOnce.has(key)) {
//         _loggedOnce.add(key);
//         console.warn(`[api.js] ${method} ${url} → 403`, error.response?.data);
//       }
//       return Promise.reject(error);
//     }

//     // 401 handling
//     if (status !== 401) {
//       console.error(`[api.js] ${method} ${url} → ${status}`, error.response?.data);
//       return Promise.reject(error);
//     }

//     if (isAuthEndpoint) {
//       return Promise.reject(error);
//     }

//     if (originalReq._retried) {
//       console.warn("[api.js] Refresh failed — logging out");
//       localStorage.removeItem("user");
//       window.location.href = "/login";
//       return Promise.reject(error);
//     }

//     if (_refreshing) {
//       return new Promise((resolve, reject) => {
//         _refreshQueue.push({ resolve, reject });
//       }).then((newToken) => {
//         originalReq.headers.Authorization = `Bearer ${newToken}`;
//         return api(originalReq);
//       }).catch((err) => Promise.reject(err));
//     }

//     originalReq._retried = true;
//     _refreshing = true;

//     try {
//       const raw = localStorage.getItem("user");
//       const stored = raw ? JSON.parse(raw) : null;
//       const refreshToken = stored?.refreshToken;

//       if (!refreshToken) {
//         throw new Error("No refresh token available");
//       }

//       console.log("[api.js] Attempting token refresh...");
//       const res = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken });
//       const newToken = res.data?.token;
//       const newRefresh = res.data?.refreshToken;

//       if (!newToken) throw new Error("No token in refresh response");

//       const updated = { ...stored, token: newToken, refreshToken: newRefresh || refreshToken };
//       localStorage.setItem("user", JSON.stringify(updated));

//       processQueue(newToken, null);
//       originalReq.headers.Authorization = `Bearer ${newToken}`;
//       console.log("[api.js] Token refreshed successfully");
//       return api(originalReq);

//     } catch (refreshErr) {
//       processQueue(null, refreshErr);
//       console.error("[api.js] Refresh failed:", refreshErr.message);
//       localStorage.removeItem("user");
//       window.location.href = "/login";
//       return Promise.reject(refreshErr);
//     } finally {
//       _refreshing = false;
//     }
//   }
// );

// export default api;