// ============================================================
// components/ui/index.jsx — مكونات UI المشتركة
// StarRating | Spinner | PageLoader | Skeleton | Modal
// Badge | PriceDisplay | EmptyState | TagBadge
// ============================================================
import React from "react";

/* ── نجوم التقييم ──────────────────────────── */
export const StarRating = ({ rating = 0, max = 5, size = "md", interactive = false, onChange }) => {
  const sizes = { sm: "text-sm", md: "text-base", lg: "text-xl" };
  return (
    <div className={`flex items-center gap-0.5 ${sizes[size]}`}>
      {Array.from({ length: max }).map((_, i) => (
        <button
          key={i} type="button"
          onClick={() => interactive && onChange?.(i + 1)}
          className={interactive ? "cursor-pointer hover:scale-110 transition" : "cursor-default"}
        >
          <span className={i < rating ? "star" : "star-empty"}>★</span>
        </button>
      ))}
    </div>
  );
};

/* ── Spinner دوار ──────────────────────────── */
export const Spinner = ({ size = "md", className = "" }) => {
  const sizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-10 h-10" };
  return (
    <div className={`${sizes[size]} border-2 border-velour-200 border-t-velour-700 rounded-full animate-spin ${className}`} />
  );
};

/* ── شاشة التحميل الكاملة ─────────────────── */
export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <Spinner size="lg" className="mx-auto mb-4" />
      <p className="text-muted text-sm">جاري التحميل…</p>
    </div>
  </div>
);

/* ── Skeleton للبطاقات ─────────────────────── */
export const ProductSkeleton = () => (
  <div className="bg-white rounded-2xl border border-velour-100 overflow-hidden">
    <div className="skeleton h-56 w-full" />
    <div className="p-4 space-y-3">
      <div className="skeleton h-3 w-1/3" />
      <div className="skeleton h-5 w-2/3" />
      <div className="skeleton h-3 w-1/4" />
      <div className="skeleton h-10 w-full mt-2" />
    </div>
  </div>
);

/* ── نافذة منبثقة ──────────────────────────── */
export const Modal = ({ isOpen, onClose, title, children, maxW = "max-w-md" }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-3xl shadow-velour-lg w-full ${maxW} max-h-[90vh] overflow-y-auto animate-fade-up`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-velour-100">
            <h2 className="font-serif text-xl text-velour-900">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-velour-50 text-muted hover:text-velour-700 transition"
            >✕</button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

/* ── شارة الوسوم ───────────────────────────── */
export const TagBadge = ({ tag }) => {
  const map = {
    bestseller:    { label: "✨ Bestseller",    cls: "bg-velour-700 text-white" },
    new:           { label: "✦ New",            cls: "bg-pink-500 text-white" },
    vegan:         { label: "🌿 Vegan",         cls: "bg-green-100 text-green-700" },
    "cruelty-free":{ label: "🐰 Cruelty-Free", cls: "bg-blue-100 text-blue-700" },
  };
  const info = map[tag];
  if (!info) return null;
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${info.cls}`}>
      {info.label}
    </span>
  );
};

/* ── عرض السعر ─────────────────────────────── */
export const PriceDisplay = ({ price, originalPrice, size = "md" }) => {
  const textSizes = { sm: "text-sm", md: "text-base", lg: "text-xl" };
  const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`font-bold text-velour-900 ${textSizes[size]}`}>${price.toFixed(2)}</span>
      {originalPrice && (
        <>
          <span className="text-muted line-through text-sm">${originalPrice.toFixed(2)}</span>
          <span className="badge badge-rose">−{discount}%</span>
        </>
      )}
    </div>
  );
};

/* ── حالة فارغة ────────────────────────────── */
export const EmptyState = ({ icon = "🌸", title, description, action }) => (
  <div className="text-center py-20 px-4">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="font-serif text-2xl text-velour-900 mb-2">{title}</h3>
    {description && <p className="text-muted mb-6">{description}</p>}
    {action}
  </div>
);
