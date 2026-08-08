import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  console.log("🔥 ProtectedRoute is running");

  const token = localStorage.getItem("token");

  console.log("TOKEN =", token);

  if (!token) {
    console.log("❌ No token - redirecting to Login");
    return <Navigate to="/Login" replace />;
  }

  console.log("✅ Token found - allowing Home");

  return children;
}

export default ProtectedRoute;
