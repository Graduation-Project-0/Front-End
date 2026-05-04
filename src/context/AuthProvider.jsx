import { useState, useEffect } from "react";
import { AuthContext } from "./authContext";
import { logout as apiLogout } from "../services/auth";

// 2. بنعمل الـ Provider هنا
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) return null;

    try {
      const stored = JSON.parse(localStorage.getItem("user") || "null");
      if (stored?.token) return stored;
    } catch {
      // ignore
    }

    const token = localStorage.getItem("token");
    if (token) return { token };

    return null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    // تأكدي إنك بتخزني بنفس الأسماء اللي بتقرأي بيها
    localStorage.setItem("token", userData.token);
    localStorage.setItem("isLoggedIn", "true");
    try {
      localStorage.setItem("user", JSON.stringify(userData));
    } catch {
      // ignore
    }
  };

  const clearLocalSession = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch {
      // If backend logout fails (expired token / offline), we still end the local session.
    } finally {
      clearLocalSession();
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
