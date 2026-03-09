// ============================================================
// pages/ProductPage.jsx — صفحة تفاصيل المنتج
// ============================================================
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { productAPI, reviewAPI, wishlistAPI } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { StarRating, TagBadge, PriceDisplay, PageLoader, Modal, Spinner } from "../components/ui";

export default function ProductPage() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const { user }    = useAuth();
  const { addToCart } = useCart();
  const { toast }   = useToast();

  const [product,  setProduct]  = useState(null);
  const [reviews,  setReviews]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [mainImg,  setMainImg]  = useState("");
  const [shade,    setShade]    = useState(null);
  const [qty,      setQty]      = useState(1);
  const [wished,   setWished]   = useState(false);
  const [tab,      setTab]      = useState("desc");
  const [adding,   setAdding]   = useState(false);

  // Review modal state
  const [reviewModal, setReviewModal] = useState(false);
  const [rvRating,    setRvRating]    = useState(5);
  const [rvTitle,     setRvTitle]     = useState("");
  const [rvBody,      setRvBody]      = useState("");
  const [submitting,  setSubmitting]  = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      productAPI.getById(id),
      reviewAPI.getByProduct(id),
      user ? wishlistAPI.get() : Promise.resolve(null),
    ]).then(([prod, rv, wish]) => {
      const p = prod.data.product;
      setProduct(p);
      setMainImg(p.images?.[0] || p.image);
      setShade(p.shades?.[0] || null);
      setReviews(rv.data.reviews);
      if (wish) setWished(wish.data.wishlist.some((x) => x.id === id));
    }).catch(() => navigate("/shop"))
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleAddToCart = async () => {
    if (!user) { toast.error("الرجاء تسجيل الدخول"); navigate("/auth"); return; }
    setAdding(true);
    try {
      await addToCart(product.id, qty, shade);
      toast.success(`${product.name} أُضيف للسلة 🛒`);
    } catch (e) { toast.error(e.message); }
    finally { setAdding(false); }
  };

  const handleWish = async () => {
    if (!user) { toast.error("الرجاء تسجيل الدخول"); navigate("/auth"); return; }
    await wishlistAPI.toggle(product.id);
    setWished((v) => !v);
    toast.info(wished ? "أُزيل من المفضلة" : "أُضيف للمفضلة 💜");
  };

  const submitReview = async () => {
    if (!rvBody.trim()) { toast.error("الرجاء كتابة مراجعة"); return; }
    setSubmitting(true);
    try {
      await reviewAPI.create({ productId: id, rating: rvRating, title: rvTitle, body: rvBody });
      const { data } = await reviewAPI.getByProduct(id);
      setReviews(data.reviews);
      setReviewModal(false);
      setRvRating(5); setRvTitle(""); setRvBody("");
      toast.success("شكراً! تمت إضافة مراجعتك ✓");
    } catch (e) { toast.error(e.message); }
    finally { setSubmitting(false); }
  };

  if (loading) return <PageLoader />;
  if (!product) return null;

  const avgRating   = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const discount    = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link to="/" className="hover:text-velour-700">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-velour-700">Shop</Link>
        <span>/</span>
        <span className="text-velour-900">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-10 mb-14">
        {/* ── Images ── */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-velour-50">
            <img src={mainImg} alt={product.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = `https://via.placeholder.com/600/f3e8ff/7B3FA0?text=${encodeURIComponent(product.name)}`; }} />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-3">
              {product.images.map((img, i) => (
                <img key={i} src={img} alt=""
                  onClick={() => setMainImg(img)}
                  className={`w-16 h-16 object-cover rounded-xl cursor-pointer border-2 transition ${mainImg === img ? "border-velour-700" : "border-transparent hover:border-velour-300"}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div>
          <p className="text-xs font-semibold text-velour-600 uppercase tracking-wider mb-1">{product.brand}</p>
          <h1 className="font-serif text-4xl font-light text-velour-900 leading-tight mb-4">{product.name}</h1>

          {/* Rating */}
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={Math.round(avgRating)} size="md" />
              <span className="text-sm text-muted">{avgRating.toFixed(1)} · {reviews.length} reviews</span>
            </div>
          )}

          {/* Price */}
          <div className="mb-4">
            <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="lg" />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {product.tags?.map((t) => <TagBadge key={t} tag={t} />)}
          </div>

          {/* Shades */}
          {product.shades?.length > 1 && (
            <div className="mb-5">
              <p className="text-sm font-semibold text-velour-900 mb-2">
                Shade: <span className="font-normal text-velour-600">{shade}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.shades.map((s) => (
                  <button key={s}
                    onClick={() => setShade(s)}
                    className={`px-4 py-1.5 rounded-full border text-sm transition ${shade === s ? "bg-velour-700 text-white border-velour-700" : "border-velour-200 text-velour-800 hover:border-velour-700"}`}
                  >{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Stock warning */}
          {product.stock > 0 && product.stock < 20 && (
            <p className="text-amber-600 text-sm mb-3">⚡ Only {product.stock} left in stock</p>
          )}

          {/* Qty + Add + Wish */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <div className="flex items-center border border-velour-200 rounded-full overflow-hidden">
              <button onClick={() => setQty((v) => Math.max(1, v - 1))} className="w-10 h-10 text-velour-700 hover:bg-velour-50 transition text-lg">−</button>
              <span className="w-10 text-center font-bold text-velour-900">{qty}</span>
              <button onClick={() => setQty((v) => Math.min(10, v + 1))} className="w-10 h-10 text-velour-700 hover:bg-velour-50 transition text-lg">+</button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className="btn-velour flex-1 min-w-40"
            >
              {adding ? <Spinner size="sm" className="border-white border-t-transparent" /> : "Add to Cart 🛒"}
            </button>
            <button
              onClick={handleWish}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl transition
                ${wished ? "border-rose-400 text-rose-500" : "border-velour-200 text-muted hover:border-rose-400 hover:text-rose-500"}`}
            >
              {wished ? "♥" : "♡"}
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-velour-100 mb-4 flex gap-1 overflow-x-auto">
            {[["desc","Description"],["formula","Formula"],["shipping","Shipping"]].map(([key, label]) => (
              <button key={key}
                onClick={() => setTab(key)}
                className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition whitespace-nowrap -mb-px ${tab === key ? "border-velour-700 text-velour-700" : "border-transparent text-muted hover:text-velour-800"}`}
              >{label}</button>
            ))}
          </div>

          {tab === "desc" && <p className="text-sm text-velour-800 leading-relaxed">{product.description}</p>}
          {tab === "formula" && (
            <div>
              <p className="text-xs font-bold text-velour-900 mb-2">Full Ingredient List</p>
              <p className="text-xs font-mono bg-velour-50 rounded-xl p-4 leading-loose text-velour-700">{product.formula}</p>
            </div>
          )}
          {tab === "shipping" && (
            <ul className="text-sm text-velour-800 space-y-2">
              {["Free standard shipping on orders over $75","Standard (5–7 days): $5.99","Express (2–3 days): $12.99","Overnight (1 day): $24.99","Free returns within 30 days"].map((t) => (
                <li key={t} className="flex items-center gap-2"><span className="text-velour-600">✓</span>{t}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ══ Reviews ══════════════════════════════════════════ */}
      <div>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="font-serif text-3xl text-velour-900">Customer Reviews ({reviews.length})</h2>
          {user && <button onClick={() => setReviewModal(true)} className="btn-velour py-2.5 px-5 text-sm">Write a Review ✍️</button>}
        </div>

        {/* Rating summary */}
        {reviews.length > 0 && (
          <div className="bg-white border border-velour-100 rounded-2xl p-6 flex gap-8 items-center flex-wrap mb-6">
            <div className="text-center">
              <p className="font-serif text-5xl text-velour-900">{avgRating.toFixed(1)}</p>
              <StarRating rating={Math.round(avgRating)} size="md" />
              <p className="text-xs text-muted mt-1">{reviews.length} reviews</p>
            </div>
            <div className="flex-1 min-w-44">
              {[5,4,3,2,1].map((n) => {
                const cnt = reviews.filter((r) => r.rating === n).length;
                const pct = reviews.length ? (cnt / reviews.length) * 100 : 0;
                return (
                  <div key={n} className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted w-4 text-right">{n}</span>
                    <span className="text-accent text-xs">★</span>
                    <div className="flex-1 h-2 bg-velour-100 rounded-full overflow-hidden">
                      <div className="h-full bg-velour-700 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-muted w-4">{cnt}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Review list */}
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-muted">
            <p className="text-3xl mb-2">✍️</p>
            <p>No reviews yet. Be the first to write one!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="bg-white border border-velour-100 rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <StarRating rating={r.rating} size="sm" />
                    {r.title && <p className="font-semibold text-velour-900 mt-1">{r.title}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-velour-900">{r.userName}</p>
                    <p className="text-xs text-muted">{new Date(r.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</p>
                  </div>
                </div>
                <p className="text-sm text-velour-800 leading-relaxed">{r.body}</p>
                {r.verified && <span className="inline-block mt-2 badge badge-green text-xs">✓ Verified Purchase</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      <Modal isOpen={reviewModal} onClose={() => setReviewModal(false)} title="Write a Review">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-velour-800 mb-2">Your Rating *</label>
            <div className="flex gap-2 text-3xl">
              {[1,2,3,4,5].map((n) => (
                <button key={n} onClick={() => setRvRating(n)} className="hover:scale-110 transition">
                  <span className={n <= rvRating ? "star" : "star-empty"}>★</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-velour-800 mb-1">Title</label>
            <input className="input-field" value={rvTitle} onChange={(e) => setRvTitle(e.target.value)} placeholder="Summarise your experience..." />
          </div>
          <div>
            <label className="block text-sm font-semibold text-velour-800 mb-1">Review *</label>
            <textarea className="input-field min-h-24" value={rvBody} onChange={(e) => setRvBody(e.target.value)} placeholder="What did you love (or not)?" />
          </div>
          <button onClick={submitReview} disabled={submitting} className="btn-velour w-full">
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
