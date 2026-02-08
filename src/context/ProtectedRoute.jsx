import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  console.log("Auth Check:", { isAuthenticated, loading, user: localStorage.getItem("user") });

  // 1. حالة التحميل
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-[#1E7D04]">
        Loading...
      </div>
    );
  }

  // 2. لو مش مسجل دخول، حوله للوج إن
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. لو مسجل دخول:
  // لو باعتله children (زي الطريقة القديمة) هيعرضها
  // لو مش باعتله (زي طريقة الـ Nested Routes) هيعرض الـ Outlet
  return children ? children : <Outlet />;
}