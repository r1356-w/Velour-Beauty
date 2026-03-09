// ============================================================
// components/layout/Navbar.jsx — شريط التنقل العلوي
// ============================================================
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [search, setSearch]   = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-velour-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 shrink-0">
          <img src="/logo.png" alt="Velour Beauty" className="h-8 w-auto" />
          <span className="font-serif text-xl font-semibold gradient-text">Velour</span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md relative hidden sm:block">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن منتج..."
            className="w-full input-field pl-9 py-2 text-sm rounded-full"
          />
        </form>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-5 ml-auto mr-2">
          <Link to="/shop" className="text-sm font-medium text-velour-800 hover:text-velour-700 transition">Shop</Link>
          <Link to="/shop?tag=bestseller" className="text-sm font-medium text-velour-800 hover:text-velour-700 transition">Bestsellers</Link>
          <Link to="/shop?tag=new" className="text-sm font-medium text-velour-800 hover:text-velour-700 transition">New In</Link>
        </div>

        {/* Cart */}
        <Link to="/cart" className="relative p-2 rounded-full hover:bg-velour-50 transition text-velour-800 text-xl">
          🛒
          {cart.itemCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-velour-700 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cart.itemCount > 9 ? "9+" : cart.itemCount}
            </span>
          )}
        </Link>

        {/* Wishlist */}
        {user && (
          <Link to="/wishlist" className="p-2 rounded-full hover:bg-velour-50 transition text-velour-800 text-xl hidden sm:block">
            ♡
          </Link>
        )}

        {/* Auth */}
        {!user ? (
          <Link to="/auth" className="btn-velour py-2 px-4 text-sm">Sign In</Link>
        ) : (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 hover:bg-velour-50 rounded-full px-3 py-1.5 transition"
            >
              <div className="w-8 h-8 rounded-full bg-velour-700 text-white text-sm font-bold flex items-center justify-center uppercase">
                {user.name[0]}
              </div>
              <span className="text-sm font-medium text-velour-800 hidden sm:block">
                {user.name.split(" ")[0]}
              </span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-12 w-52 bg-white border border-velour-100 rounded-2xl shadow-velour-lg py-2 animate-fade-in">
                <div className="px-4 py-2 border-b border-velour-100 mb-1">
                  <p className="text-xs font-semibold text-velour-700">{user.name}</p>
                  <p className="text-xs text-muted truncate">{user.email}</p>
                </div>
                <DropItem to="/orders"   icon="📦" label="My Orders"   close={() => setMenuOpen(false)} />
                <DropItem to="/wishlist" icon="♡"  label="Wishlist"    close={() => setMenuOpen(false)} />
                {isAdmin && (
                  <DropItem to="/admin" icon="⚙️" label="Admin Panel" close={() => setMenuOpen(false)} />
                )}
                <hr className="border-velour-100 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 rounded-xl mx-1 transition"
                >
                  ↩ Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

const DropItem = ({ to, icon, label, close }) => (
  <Link
    to={to}
    onClick={close}
    className="flex items-center gap-2 px-4 py-2 text-sm text-velour-800 hover:bg-velour-50 rounded-xl mx-1 transition"
  >
    <span>{icon}</span>{label}
  </Link>
);
