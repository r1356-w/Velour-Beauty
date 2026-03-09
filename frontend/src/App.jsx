// ============================================================
// App.jsx — جذر التطبيق مع التوجيه الكامل
// ============================================================
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Providers
import { AuthProvider }  from "./context/AuthContext";
import { CartProvider }  from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";

// Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Pages
import HomePage    from "./pages/HomePage";
import ShopPage    from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import CartPage    from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import { OrdersPage, OrderDetailPage } from "./pages/OrdersPage";
import { WishlistPage, AuthPage }      from "./pages/WishlistAuthPage";
import AdminPage   from "./pages/AdminPage";

// مسار محمي
const Protected = ({ children }) => {
  const token = localStorage.getItem("velour_token");
  return token ? children : <Navigate to="/auth" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/"              element={<HomePage />} />
                  <Route path="/shop"          element={<ShopPage />} />
                  <Route path="/product/:id"   element={<ProductPage />} />
                  <Route path="/auth"          element={<AuthPage />} />
                  <Route path="/cart"          element={<CartPage />} />
                  <Route path="/checkout"      element={<Protected><CheckoutPage /></Protected>} />
                  <Route path="/orders"        element={<Protected><OrdersPage /></Protected>} />
                  <Route path="/orders/:id"    element={<Protected><OrderDetailPage /></Protected>} />
                  <Route path="/wishlist"      element={<Protected><WishlistPage /></Protected>} />
                  <Route path="/admin"         element={<Protected><AdminPage /></Protected>} />
                  <Route path="*"              element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
