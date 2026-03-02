//src/utils/api.js
import axios from "axios";


//const api = axios.create({
//  baseURL: "http://localhost:8081",
//});

const api = axios.create({
  //baseURL: "/api",
    baseURL: "https://thrump-fix-lbm8.onrender.com",
});

// Automatically attach JWT token to every request if it exists
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

//thrumpFixBackend
//    src
//        main
//            resources
//                static
//                    assets
//                        index-CKOX_vwp.css
//                        index-DN3PHzls.js
//                    aplumber.svg
//                    icon.svg
//                    <>index.html
//                    needAPlumber.svg
//                    vite.svg