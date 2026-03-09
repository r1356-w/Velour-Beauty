// ============================================================
// components/layout/Footer.jsx — تذييل الصفحة
// ============================================================
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-velour-950 text-white/70 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo.png" alt="Velour Beauty" className="h-8 w-auto" />
              <span className="font-serif text-2xl font-semibold text-white">Velour</span>
            </div>
            <p className="text-sm leading-relaxed text-white/50 max-w-xs">
              Luxury beauty essentials crafted with intention. Cruelty-free formulas that celebrate every complexion.
            </p>
            <div className="flex gap-3 mt-4 text-xl">
              <span className="cursor-pointer hover:text-accent transition">📸</span>
              <span className="cursor-pointer hover:text-accent transition">🐦</span>
              <span className="cursor-pointer hover:text-accent transition">▶️</span>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-serif text-white text-base mb-3">Shop</h4>
            {[
              ["Loose Powder", "/shop?category=loose-powder"],
              ["Eyeshadow",    "/shop?category=eyeshadow"],
              ["Lipstick",     "/shop?category=lipstick"],
              ["Foundation",   "/shop?category=foundation"],
              ["Mascara",      "/shop?category=mascara"],
              ["Skincare",     "/shop?category=skincare"],
            ].map(([label, to]) => (
              <Link key={label} to={to} className="block text-sm text-white/50 hover:text-white mb-1.5 transition">
                {label}
              </Link>
            ))}
          </div>

          {/* Account */}
          <div>
            <h4 className="font-serif text-white text-base mb-3">Account</h4>
            {[
              ["My Orders",  "/orders"],
              ["Wishlist",   "/wishlist"],
              ["Sign In",    "/auth"],
            ].map(([label, to]) => (
              <Link key={label} to={to} className="block text-sm text-white/50 hover:text-white mb-1.5 transition">
                {label}
              </Link>
            ))}
          </div>

          {/* Help */}
          <div>
            <h4 className="font-serif text-white text-base mb-3">Help</h4>
            {["Track Order", "Shipping Info", "Returns & Refunds", "Contact Us", "FAQs"].map((label) => (
              <p key={label} className="text-sm text-white/50 hover:text-white mb-1.5 cursor-pointer transition">{label}</p>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-wrap justify-between items-center gap-3 text-xs text-white/30">
          <p>© 2025 Velour Beauty. All rights reserved.</p>
          <div className="flex gap-4">
            {["Privacy Policy", "Terms of Service", "Cookies"].map((t) => (
              <span key={t} className="hover:text-white cursor-pointer transition">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
