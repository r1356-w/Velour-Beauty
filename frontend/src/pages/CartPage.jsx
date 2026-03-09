// ============================================================
// pages/CartPage.jsx — صفحة سلة التسوق
// ============================================================
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { EmptyState } from "../components/ui";
import { cartAPI } from "../services/api";

const PROMOS = [
  { code: "VELOUR20",  type: "percent", value: 0.20, min: 50 },
  { code: "WELCOME10", type: "flat",    value: 10,   min: 0  },
];

export default function CartPage() {
  const { cart, updateQty, removeItem } = useCart();
  const { user }    = useAuth();
  const { toast }   = useToast();
  const navigate    = useNavigate();
  const [promo,      setPromo]      = useState("");
  const [promoMsg,   setPromoMsg]   = useState(null);
  const [discount,   setDiscount]   = useState(0);
  const [promoCode,  setPromoCode]  = useState("");

  const subtotal = cart.subtotal || 0;
  const shipping = subtotal > 75 ? 0 : 5.99;
  const tax      = (subtotal - discount) * 0.08;
  const total    = subtotal - discount + shipping + tax;

  const applyPromo = () => {
    const p = PROMOS.find((x) => x.code === promo.trim().toUpperCase());
    if (!p || subtotal < p.min) {
      setPromoMsg({ ok: false, text: "كود غير صالح أو لا ينطبق على هذا الطلب" });
      setDiscount(0); setPromoCode("");
      return;
    }
    const d = p.type === "percent" ? subtotal * p.value : p.value;
    setDiscount(d);
    setPromoCode(p.code);
    setPromoMsg({ ok: true, text: p.type === "percent" ? `خصم ${p.value * 100}% مطبّق ✓` : `خصم $${p.value} مطبّق ✓` });
  };

  const goCheckout = () => {
    if (!user) { toast.error("الرجاء تسجيل الدخول أولاً"); navigate("/auth"); return; }
    navigate("/checkout", { state: { discount, promoCode } });
  };

  if (!cart.items.length) {
    return (
      <EmptyState
        icon="🛒"
        title="Your cart is empty"
        description="Looks like you haven't added anything yet."
        action={<Link to="/shop" className="btn-velour">Start Shopping</Link>}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-serif text-4xl text-velour-900 mb-6">
        Shopping Cart ({cart.itemCount})
      </h1>

      <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
        {/* Items */}
        <div className="space-y-3">
          {cart.items.map((item) => (
            <div key={`${item.productId}-${item.shade}`} className="bg-white border border-velour-100 rounded-2xl p-4 flex gap-4 items-center flex-wrap">
              <img
                src={item.product?.image}
                alt={item.product?.name}
                className="w-20 h-20 rounded-xl object-cover bg-velour-50 shrink-0 cursor-pointer"
                onClick={() => navigate(`/product/${item.productId}`)}
                onError={(e) => { e.target.src = "https://via.placeholder.com/80/f3e8ff/7B3FA0?text=img"; }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-velour-500 font-semibold">{item.product?.brand}</p>
                <p
                  className="font-serif font-semibold text-velour-900 leading-snug cursor-pointer hover:text-velour-700 truncate"
                  onClick={() => navigate(`/product/${item.productId}`)}
                >{item.product?.name}</p>
                {item.shade && <p className="text-xs text-muted mt-0.5">Shade: {item.shade}</p>}
              </div>
              <div className="flex items-center gap-4 shrink-0 flex-wrap justify-end">
                {/* Qty */}
                <div className="flex items-center border border-velour-200 rounded-full overflow-hidden">
                  <button
                    onClick={() => item.qty > 1 ? updateQty(item.productId, item.qty - 1, item.shade) : removeItem(item.productId)}
                    className="w-9 h-9 text-velour-700 hover:bg-velour-50 transition"
                  >−</button>
                  <span className="w-8 text-center text-sm font-bold text-velour-900">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.productId, item.qty + 1, item.shade)}
                    className="w-9 h-9 text-velour-700 hover:bg-velour-50 transition"
                  >+</button>
                </div>
                <span className="font-bold text-velour-900 w-16 text-right">
                  ${((item.product?.price || 0) * item.qty).toFixed(2)}
                </span>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-muted hover:text-rose-500 transition text-xs font-medium"
                >✕</button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white border border-velour-100 rounded-2xl p-6">
          <h2 className="font-serif text-xl text-velour-900 mb-4">Order Summary</h2>

          {/* Promo Code */}
          <div className="flex gap-2 mb-2">
            <input
              className="input-field flex-1 py-2 text-sm"
              placeholder="Promo code (VELOUR20)"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyPromo()}
            />
            <button onClick={applyPromo} className="btn-outline py-2 px-4 text-sm whitespace-nowrap">Apply</button>
          </div>
          {promoMsg && (
            <p className={`text-xs mb-3 ${promoMsg.ok ? "text-green-600" : "text-rose-500"}`}>
              {promoMsg.text}
            </p>
          )}

          <hr className="border-velour-100 my-4" />

          {/* Rows */}
          {[
            ["Subtotal",  `$${subtotal.toFixed(2)}`],
            discount > 0 ? ["Discount", `-$${discount.toFixed(2)}`, "text-green-600"] : null,
            ["Shipping",  shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`],
            ["Tax (8%)",  `$${tax.toFixed(2)}`],
          ].filter(Boolean).map(([label, val, cls = ""]) => (
            <div key={label} className="flex justify-between text-sm py-1.5 text-velour-800">
              <span>{label}</span>
              <span className={`font-medium ${cls}`}>{val}</span>
            </div>
          ))}

          <div className="flex justify-between font-bold text-velour-900 border-t border-velour-100 pt-3 mt-1 text-base">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button onClick={goCheckout} className="btn-velour w-full mt-4">Proceed to Checkout →</button>
          <Link to="/shop" className="btn-ghost w-full mt-2 text-sm block text-center">← Continue Shopping</Link>

          <p className="text-xs text-center text-muted mt-3 bg-velour-50 rounded-xl p-3">
            {subtotal >= 75 ? "🎉 You qualify for free shipping!" : `💡 Spend $${(75 - subtotal).toFixed(2)} more for free shipping`}
          </p>
        </div>
      </div>
    </div>
  );
}
