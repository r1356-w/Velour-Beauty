// ============================================================
// context/CartContext.jsx — إدارة سلة التسوق
// يتزامن مع API عند تسجيل الدخول
// ============================================================
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { cartAPI } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart,    setCart]    = useState({ items: [], subtotal: 0, itemCount: 0 });
  const [loading, setLoading] = useState(false);

  // جلب السلة عند تسجيل الدخول
  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [], subtotal: 0, itemCount: 0 }); return; }
    setLoading(true);
    try {
      const { data } = await cartAPI.get();
      setCart(data.cart);
    } catch { /* تجاهل الأخطاء الصامتة */ }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = useCallback(async (productId, qty = 1, shade = null) => {
    const { data } = await cartAPI.add(productId, qty, shade);
    setCart(data.cart);
  }, []);

  const updateQty = useCallback(async (productId, qty, shade) => {
    const { data } = await cartAPI.update(productId, qty, shade);
    setCart(data.cart);
  }, []);

  const removeItem = useCallback(async (productId) => {
    const { data } = await cartAPI.remove(productId);
    setCart(data.cart);
  }, []);

  const clearCart = useCallback(async () => {
    await cartAPI.clear();
    setCart({ items: [], subtotal: 0, itemCount: 0 });
  }, []);

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQty, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};
