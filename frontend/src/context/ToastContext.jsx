// ============================================================
// context/ToastContext.jsx — نظام الإشعارات
// الاستخدام: const { toast } = useToast();
//            toast.success("تمت الإضافة!");
// ============================================================
import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const toast = {
    success: (msg) => show(msg, "success"),
    error:   (msg) => show(msg, "error"),
    info:    (msg) => show(msg, "info"),
  };

  const icons  = { success: "✓", error: "✕", info: "ℹ" };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* حاوية الإشعارات */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span className="text-lg leading-none">{icons[t.type]}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
};
