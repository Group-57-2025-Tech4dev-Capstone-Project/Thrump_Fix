//Frontend/src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {

//   const user = localStorage.getItem("user");
  const user = sessionStorage.getItem("user");

  /*
    ✅ NEW: also check session token
  */
  const token = sessionStorage.getItem("token");

  if (!user || !token) {
//     return <Navigate to="/login" />;
    return <Navigate to="/login" replace />
  }
  return children;
}









// //Frontend/src/routes/ProtectedRoute.jsx
// import { Navigate } from "react-router-dom";
//
// export default function ProtectedRoute({children}){
//     const user = localStorage.getItem("user");
//     if (!user){
//
//
//         return<Navigate to="/login" />
//     }
//     return children
// }