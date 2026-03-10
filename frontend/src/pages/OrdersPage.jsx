// ============================================================
// pages/OrdersPage.jsx — Orders List
// ============================================================
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { orderAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { PageLoader, EmptyState } from "../components/ui";

const STATUS_STYLE = {
  placed:    "bg-blue-100 text-blue-700",
  confirmed: "bg-velour-100 text-velour-700",
  packed:    "bg-amber-100 text-amber-700",
  shipped:   "bg-orange-100 text-orange-700",
  out:       "bg-pink-100 text-pink-700",
  delivered: "bg-green-100 text-green-700",
};

export function OrdersPage() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    orderAPI.getAll()
      .then(({ data }) => setOrders([...data.orders].reverse()))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-serif text-4xl text-velour-900 mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <EmptyState icon="📦" title="No orders yet" description="Once you place an order, it will appear here."
          action={<Link to="/shop" className="btn-velour">Shop Now</Link>} />
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div
              key={o.id}
              onClick={() => navigate(`/orders/${o.id}`)}
              className="bg-white border border-velour-100 rounded-2xl p-5 cursor-pointer hover:shadow-velour transition"
            >
              <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                <div>
                  <p className="font-bold text-velour-900 text-sm">#{o.id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-muted">{new Date(o.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge text-xs ${STATUS_STYLE[o.status] || "bg-velour-100 text-velour-700"}`}>
                    {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                  </span>
                  <span className="font-bold text-velour-900">${o.total.toFixed(2)}</span>
                </div>
              </div>
              <p className="text-sm text-muted">
                {o.items.length} item{o.items.length !== 1 ? "s" : ""}: {o.items.slice(0, 2).map((i) => i.name).join(", ")}
                {o.items.length > 2 ? ` +${o.items.length - 2} more` : ""}
              </p>
              <p className="text-xs text-velour-600 font-semibold mt-2">View details & tracking →</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// pages/OrderDetailPage.jsx — Single order details and tracking
// ============================================================
export function OrderDetailPage() {
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);

  // Extract ID from URL
  const id = window.location.pathname.split("/").pop();

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    orderAPI.getById(id)
      .then(({ data }) => setOrder(data.order))
      .catch(() => navigate("/orders"))
      .finally(() => setLoading(false));
  }, [id, user]);

  if (loading) return <PageLoader />;
  if (!order)  return null;

  const TIMELINE = [
    { status: "placed",    label: "Order Placed",      icon: "📋" },
    { status: "confirmed", label: "Order Confirmed",   icon: "✓"  },
    { status: "packed",    label: "Packed & Ready",    icon: "📦" },
    { status: "shipped",   label: "Shipped",           icon: "🚚" },
    { status: "out",       label: "Out for Delivery",  icon: "🏃" },
    { status: "delivered", label: "Delivered",         icon: "🎉" },
  ];

  const currentIdx = TIMELINE.findIndex((t) => t.status === order.status);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <button onClick={() => navigate("/orders")} className="btn-ghost py-2 px-4 text-sm mb-6">
        ← All Orders
      </button>

      <div className="flex justify-between items-start flex-wrap gap-3 mb-6">
        <div>
          <h1 className="font-serif text-3xl text-velour-900">Order Tracking</h1>
          <p className="text-muted text-sm mt-1">#{order.id.slice(-8).toUpperCase()}</p>
        </div>
        <div className="text-right text-sm">
          <p className="text-muted text-xs">Placed on</p>
          <p className="font-semibold text-velour-900">{new Date(order.createdAt).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</p>
        </div>
      </div>

      {/* Tracking */}
      <div className="bg-white border border-velour-100 rounded-2xl p-6 mb-4">
        <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
          <h2 className="font-serif text-lg text-velour-900">Shipment Status</h2>
          <div className="text-right">
            <p className="text-xs text-muted">Tracking #</p>
            <p className="font-mono font-bold text-sm text-velour-700">{order.trackingNumber}</p>
          </div>
        </div>
        <div className="timeline">
          {TIMELINE.map((t, i) => {
            const tlItem = order.timeline?.find((x) => x.status === t.status);
            const done    = i <= currentIdx;
            const current = i === currentIdx;
            return (
              <div key={t.status} className="tl-item">
                <div className={`tl-dot ${done ? (current ? "current" : "done") : ""}`}>
                  {done ? "✓" : t.icon}
                </div>
                <div className="ml-2">
                  <p className={`text-sm font-semibold ${done ? "text-velour-900" : "text-muted"}`}>{t.label}</p>
                  {tlItem?.date ? (
                    <p className="text-xs text-muted">
                      {new Date(tlItem.date).toLocaleDateString("en-US",{month:"short",day:"numeric"})} · {new Date(tlItem.date).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}
                    </p>
                  ) : <p className="text-xs text-velour-200">Pending</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Items */}
      <div className="bg-white border border-velour-100 rounded-2xl p-6 mb-4">
        <h2 className="font-serif text-lg text-velour-900 mb-4">Items Ordered</h2>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-velour-50">
              <div className="w-11 h-11 bg-velour-50 rounded-xl flex items-center justify-center text-xl shrink-0">💄</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-velour-900">{item.name}</p>
                {item.shade && <p className="text-xs text-muted">Shade: {item.shade}</p>}
                <p className="text-xs text-muted">Qty: {item.qty}</p>
              </div>
              <p className="font-bold text-velour-900">${(item.price * item.qty).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between text-velour-800"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-${order.discount.toFixed(2)}</span></div>}
          <div className="flex justify-between text-velour-800"><span>Shipping</span><span>{order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}</span></div>
          <div className="flex justify-between text-velour-800"><span>Tax</span><span>${order.tax.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-velour-900 border-t border-velour-100 pt-2 text-base"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white border border-velour-100 rounded-2xl p-6">
        <h2 className="font-serif text-lg text-velour-900 mb-3">Shipping Address</h2>
        <p className="text-sm text-velour-800 leading-loose">
          {order.shippingAddress.name}<br/>
          {order.shippingAddress.street}<br/>
          {order.shippingAddress.city}{order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ""} {order.shippingAddress.zip}<br/>
          {order.shippingAddress.country}
        </p>
      </div>
    </div>
  );
}
