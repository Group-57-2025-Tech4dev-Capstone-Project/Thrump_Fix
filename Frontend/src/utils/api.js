import axios from "axios";

const api = axios.create({
  baseURL: "https://thrump-fix-lbm8.onrender.com/api",
});

// attach JWT
api.interceptors.request.use((config) => {
  const user = localStorage.getItem("user");
  if (user) {
    const { token } = JSON.parse(user);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
