// ============================================================
// context/AuthContext.jsx — إدارة حالة المصادقة
// يوفر: user, login, logout, register, isAdmin
// ============================================================
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // استعادة الجلسة عند تحميل التطبيق
  useEffect(() => {
    const token = localStorage.getItem("velour_token");
    if (!token) { setLoading(false); return; }

    authAPI.getMe()
      .then(({ data }) => setUser(data.user))
      .catch(() => localStorage.removeItem("velour_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem("velour_token", data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await authAPI.register({ name, email, password });
    localStorage.setItem("velour_token", data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("velour_token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, loading,
      login, register, logout,
      isAdmin: user?.role === "admin",
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
