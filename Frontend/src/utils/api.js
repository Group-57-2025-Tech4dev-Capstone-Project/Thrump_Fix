// Frontend/src/utils/api.js

import axios from "axios";

const api = axios.create({
  //baseURL: "/api",
    baseURL: "https://thrump-fix-lbm8.onrender.com/api",
});

//const api = axios.create({
//  baseURL: "http://localhost:8081/api",
//});

let isRefreshing = false;
let refreshSubscribers = [];

/*
  Notify all pending requests after token refresh
*/
function onRefreshed(newToken) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

/*
  Queue requests while refresh is happening
*/
function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback);
}

/*
  REQUEST INTERCEPTOR
  Automatically attach access token
*/
api.interceptors.request.use(
  (config) => {

    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

  },
  (error) => Promise.reject(error)
);


/*
  RESPONSE INTERCEPTOR
  Handles expired tokens
*/
api.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    /*
      Ignore refresh endpoint itself
    */
    if (originalRequest.url.includes("/auth/refresh-token")) {
      return Promise.reject(error);
    }

    /*
      Handle unauthorized errors
    */
    if (
      error.response &&
      error.response.status === 401
    ) {

      const refreshToken = sessionStorage.getItem("refreshToken");

      if (!refreshToken) {

        sessionStorage.clear();
        window.location.href = "/login";

        return Promise.reject(error);
      }

      /*
        If refresh already happening,
        queue the request
      */
      if (isRefreshing) {

        return new Promise((resolve) => {

          subscribeTokenRefresh((newToken) => {

            originalRequest.headers.Authorization =
              `Bearer ${newToken}`;

            resolve(api(originalRequest));

          });

        });

      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {

        /*
          Request new token
        */
        const response = await api.post("/auth/refresh-token", {
          refreshToken: refreshToken,
        });

        const newToken = response.data.token;

        /*
          Store new token
        */
        sessionStorage.setItem("token", newToken);

        /*
          Update default header
        */
        api.defaults.headers.Authorization = `Bearer ${newToken}`;

        /*
          Resolve queued requests
        */
        onRefreshed(newToken);

        /*
          Retry original request
        */
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);

      } catch (refreshError) {

        console.error("Token refresh failed:", refreshError);

        sessionStorage.clear();

        alert("Your session has expired. Please login again.");

        window.location.href = "/login";

        return Promise.reject(refreshError);

      } finally {

        isRefreshing = false;

      }
    }

    return Promise.reject(error);

  }
);


/*
  SILENT TOKEN REFRESH
  Refresh token before expiry
*/
export function startSilentRefresh() {

  const refreshToken = sessionStorage.getItem("refreshToken");

  if (!refreshToken) return;

  /*
    Refresh every 55 minutes
    (before 1h expiry)
  */
  setInterval(async () => {

    try {

      const response = await api.post("/auth/refresh-token", {
        refreshToken: refreshToken,
      });

      const newToken = response.data.token;

      sessionStorage.setItem("token", newToken);

      api.defaults.headers.Authorization = `Bearer ${newToken}`;

      console.log("Token silently refreshed");

    } catch (error) {

      console.error("Silent refresh failed");

      sessionStorage.clear();

      window.location.href = "/login";

    }

  }, 55 * 60 * 1000);

}

export default api;
















//// Frontend/src/utils/api.js
//
//import axios from "axios"; //MINE without silent refresh
//
//const api = axios.create({
//  baseURL: "http://localhost:8081/api",
//});
//
///*
//  REQUEST INTERCEPTOR
//  Adds access token automatically to every request
//*/
//
//api.interceptors.request.use(
//  (config) => {
//
//    const token = sessionStorage.getItem("token");
//
//    if (token) {
//      config.headers.Authorization = `Bearer ${token}`;
//    }
//
//    return config;
//
//  },
//  (error) => Promise.reject(error)
//);
//
//
///*
//  RESPONSE INTERCEPTOR
//  Handles token expiration and refresh
//*/
//
//api.interceptors.response.use(
//
//  (response) => response,
//
//  async (error) => {
//
//    const originalRequest = error.config;
//
//    /*
//      If token expired (401) and request has not been retried
//    */
//    if (
//      error.response &&
//      error.response.status === 401 &&
//      !originalRequest._retry
//    ) {
//
//      originalRequest._retry = true;
//
//      try {
//
//        const refreshToken = sessionStorage.getItem("refreshToken");
//
//        if (!refreshToken) {
//          throw new Error("No refresh token available");
//        }
//
//        /*
//          Call refresh endpoint
//        */
//        const refreshResponse = await axios.post(
//          "http://localhost:8081/api/auth/refresh-token",
//          {
//            refreshToken: refreshToken,
//          }
//        );
//
//        const newToken = refreshResponse.data.token;
//
//        /*
//          Store new access token
//        */
//        sessionStorage.setItem("token", newToken);
//
//        /*
//          Update authorization header
//        */
//        originalRequest.headers.Authorization = `Bearer ${newToken}`;
//
//        /*
//          Retry original request
//        */
//        return api(originalRequest);
//
//      } catch (refreshError) {
//
//        console.error("Token refresh failed:", refreshError);
//
//        /*
//          Clear session
//        */
//        sessionStorage.clear();
//
//        /*
//          Redirect to login
//        */
//        alert("Your session has expired. Please login again.");
//
//        window.location.href = "/login";
//
//        return Promise.reject(refreshError);
//      }
//    }
//
//    return Promise.reject(error);
//  }
//);
//// improve to Silent token refresh before expiry (no 401 ever occurs)
//export default api;










//Frontend/src/utils/api.js // ORIGINAL
//import axios from "axios";
//
//const api = axios.create({
//  baseURL: "https://thrump-fix-lbm8.onrender.com/api",
//});
//
//// ── Always attach JWT if present ─────────────────────────────
//api.interceptors.request.use((config) => {
//  const raw = localStorage.getItem("user");
//  if (raw) {
//    try {
//      const { token } = JSON.parse(raw);
//      if (token) {
//        config.headers.Authorization = `Bearer ${token}`;
//      }
//    } catch (e) {
//      console.error("[api.js] Failed to parse user from localStorage:", e);
//    }
//  }
//  return config;
//});
//
//export default api;
