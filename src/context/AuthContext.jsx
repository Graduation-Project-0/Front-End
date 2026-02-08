import { createContext, useState, useEffect } from "react";

// 1. بنخلق الـ Context هنا
export const AuthContext = createContext(null); 

// 2. بنعمل الـ Provider في نفس الملف
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // نقرأ التوكن مباشرة
    const token = localStorage.getItem("token");
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";

    // لو التوكن موجود، نعتبر المستخدم مسجل دخول
    if (token && loggedIn) {
      return { token }; // أو ابني الـ object اللي محتاجاه
    }
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
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};