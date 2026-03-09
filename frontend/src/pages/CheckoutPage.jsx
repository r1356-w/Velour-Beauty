// ============================================================
// pages/CheckoutPage.jsx — صفحة إتمام الشراء (3 خطوات)
// ============================================================
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { orderAPI } from "../services/api";
import { Spinner } from "../components/ui";

const STEPS = ["Shipping", "Payment", "Review"];
const PAY_METHODS = [
  { id: "card",   icon: "💳", label: "Credit / Debit Card",  sub: "Visa, Mastercard, Amex" },
  { id: "paypal", icon: "🅿️", label: "PayPal",               sub: "Fast & secure checkout" },
  { id: "apple",  icon: "🍎", label: "Apple Pay",             sub: "Touch ID or Face ID" },
];

export default function CheckoutPage() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { cart, clearCart } = useCart();
  const { user }   = useAuth();
  const { toast }  = useToast();

  const { discount = 0, promoCode = "" } = location.state || {};

  const [step,     setStep]     = useState(0);
  const [placing,  setPlacing]  = useState(false);
  const [payMethod,setPayMethod]= useState("card");

  const [addr, setAddr] = useState({ name: user?.name || "", street: "", city: "", state: "", zip: "", country: "United States" });

  const subtotal = cart.subtotal || 0;
  const shipping = subtotal > 75 ? 0 : 5.99;
  const tax      = (subtotal - discount) * 0.08;
  const total    = subtotal - discount + shipping + tax;

  const nextStep = () => {
    if (step === 0) {
      if (!addr.name || !addr.street || !addr.city || !addr.zip) { toast.error("الرجاء تعبئة الحقول المطلوبة"); return; }
    }
    setStep((v) => v + 1);
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const { data } = await orderAPI.checkout({
        shippingAddress: addr,
        paymentMethod:   payMethod,
        promoCode:       promoCode || undefined,
      });
      await clearCart();
      toast.success("تم تقديم طلبك! 💜");
      navigate(`/orders/${data.order.id}`);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-serif text-4xl text-velour-900 mb-6">Checkout</h1>

      {/* Stepper */}
      <div className="flex items-start mb-8">
        {STEPS.map((label, i) => (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1">
              <div className={`step-dot ${i < step ? "done" : i === step ? "active" : ""}`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-xs font-semibold ${i === step ? "text-velour-700" : "text-muted"}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`step-line ${i < step ? "done" : ""}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-8 items-start">
        {/* Step panels */}
        <div>
          {/* Step 0 — Shipping */}
          {step === 0 && (
            <div className="bg-white border border-velour-100 rounded-2xl p-6 animate-fade-in">
              <h2 className="font-serif text-xl text-velour-900 mb-5">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-velour-800 mb-1">Full Name *</label>
                  <input className="input-field" value={addr.name} onChange={(e) => setAddr({...addr,name:e.target.value})} placeholder="Sara Johnson" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-velour-800 mb-1">Street Address *</label>
                  <input className="input-field" value={addr.street} onChange={(e) => setAddr({...addr,street:e.target.value})} placeholder="123 Bloom Street" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-velour-800 mb-1">City *</label>
                  <input className="input-field" value={addr.city} onChange={(e) => setAddr({...addr,city:e.target.value})} placeholder="Los Angeles" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-velour-800 mb-1">State</label>
                  <input className="input-field" value={addr.state} onChange={(e) => setAddr({...addr,state:e.target.value})} placeholder="CA" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-velour-800 mb-1">ZIP Code *</label>
                  <input className="input-field" value={addr.zip} onChange={(e) => setAddr({...addr,zip:e.target.value})} placeholder="90001" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-velour-800 mb-1">Country</label>
                  <select className="input-field" value={addr.country} onChange={(e) => setAddr({...addr,country:e.target.value})}>
                    {["United States","Canada","United Kingdom","Australia"].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 1 — Payment */}
          {step === 1 && (
            <div className="bg-white border border-velour-100 rounded-2xl p-6 animate-fade-in">
              <h2 className="font-serif text-xl text-velour-900 mb-5">Payment Method</h2>
              <div className="space-y-3 mb-5">
                {PAY_METHODS.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setPayMethod(m.id)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition
                      ${payMethod === m.id ? "border-velour-700 bg-velour-50" : "border-velour-100 hover:border-velour-300"}`}
                  >
                    <input type="radio" readOnly checked={payMethod === m.id} className="accent-velour-700" />
                    <span className="text-2xl">{m.icon}</span>
                    <div>
                      <p className="font-semibold text-velour-900 text-sm">{m.label}</p>
                      <p className="text-xs text-muted">{m.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              {payMethod === "card" && (
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-velour-800 mb-1">Card Number</label>
                    <input className="input-field font-mono" placeholder="1234 5678 9012 3456" maxLength={19} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-velour-800 mb-1">Expiry</label>
                    <input className="input-field" placeholder="MM/YY" maxLength={5} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-velour-800 mb-1">CVV</label>
                    <input className="input-field" type="password" placeholder="•••" maxLength={4} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2 — Review */}
          {step === 2 && (
            <div className="bg-white border border-velour-100 rounded-2xl p-6 animate-fade-in">
              <h2 className="font-serif text-xl text-velour-900 mb-5">Order Review</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-velour-600 uppercase tracking-wider mb-1">Shipping To</p>
                  <p className="text-sm text-velour-800 leading-relaxed">
                    {addr.name}<br/>{addr.street}<br/>{addr.city}{addr.state ? `, ${addr.state}` : ""} {addr.zip}<br/>{addr.country}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-velour-600 uppercase tracking-wider mb-1">Payment</p>
                  <p className="text-sm text-velour-800">{PAY_METHODS.find((m) => m.id === payMethod)?.icon} {PAY_METHODS.find((m) => m.id === payMethod)?.label}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-velour-600 uppercase tracking-wider mb-2">Items</p>
                  <div className="space-y-2">
                    {cart.items.map((item) => (
                      <div key={item.productId} className="flex justify-between text-sm text-velour-800 py-1.5 border-b border-velour-50">
                        <span>{item.product?.name} {item.shade ? `(${item.shade})` : ""} ×{item.qty}</span>
                        <span className="font-semibold">${((item.product?.price || 0) * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-4">
            {step > 0 ? (
              <button onClick={() => setStep((v) => v - 1)} className="btn-ghost py-2.5 px-5 text-sm">← Back</button>
            ) : <div />}
            {step < 2 && (
              <button onClick={nextStep} className="btn-velour py-2.5 px-6">Continue →</button>
            )}
            {step === 2 && (
              <button onClick={placeOrder} disabled={placing} className="btn-velour py-2.5 px-6">
                {placing ? <Spinner size="sm" className="border-white border-t-transparent" /> : "Place Order 💜"}
              </button>
            )}
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="bg-white border border-velour-100 rounded-2xl p-5">
          <h3 className="font-serif text-lg text-velour-900 mb-4">Summary</h3>
          <div className="space-y-2 mb-4">
            {cart.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-2">
                <img src={item.product?.image} className="w-10 h-10 rounded-lg object-cover bg-velour-50" alt="" onError={(e) => {e.target.style.display="none";}} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-velour-900 truncate">{item.product?.name}</p>
                  <p className="text-xs text-muted">×{item.qty}</p>
                </div>
                <p className="text-xs font-bold">${((item.product?.price || 0) * item.qty).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <hr className="border-velour-100 mb-3" />
          {[
            ["Subtotal", `$${subtotal.toFixed(2)}`],
            discount > 0 ? ["Discount", `-$${discount.toFixed(2)}`, "text-green-600"] : null,
            ["Shipping", shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`],
            ["Tax", `$${tax.toFixed(2)}`],
          ].filter(Boolean).map(([label, val, cls=""]) => (
            <div key={label} className="flex justify-between text-xs text-velour-800 py-1">
              <span>{label}</span><span className={cls}>{val}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-velour-900 border-t border-velour-100 pt-2 mt-1">
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
