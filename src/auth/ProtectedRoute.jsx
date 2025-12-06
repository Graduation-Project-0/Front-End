import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, isAuthReady } = useAuth();


    console.log("=== ProtectedRoute Debug ===");
  console.log("isAuthReady:", isAuthReady);
  console.log("User Data:", user);
  console.log("localStorage:", localStorage.getItem("user"));
  
  if (!isAuthReady) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
