// ============================================================
// pages/HomePage.jsx — الصفحة الرئيسية
// ============================================================
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { productAPI, categoryAPI } from "../services/api";
import { wishlistAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/products/ProductCard";
import { PageLoader, ProductSkeleton } from "../components/ui";

export default function HomePage() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [featured,    setFeatured]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [feat, cats, best] = await Promise.all([
          productAPI.getFeatured(),
          categoryAPI.getAll(),
          productAPI.getAll({ sort: "bestseller", limit: 8 }),
        ]);
        
        setFeatured(feat.data.products);
        setCategories(cats.data.categories);
        setBestsellers(best.data.products);
        
        // Load wishlist separately for authenticated users
        if (user) {
          try {
            const wish = await wishlistAPI.get();
            setWishlistIds(wish.data.wishlist.map((p) => p.id));
          } catch (error) {
            console.log("Wishlist load failed:", error);
          }
        }
      } catch (error) {
        console.error("Failed to load home data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user]);

  if (loading) return <PageLoader />;

  return (
    <div>
      {/* ══ Hero ══════════════════════════════════════════════ */}
      <section className="min-h-[88vh] bg-gradient-to-br from-velour-950 via-velour-900 to-velour-700 flex items-center relative overflow-hidden">
        {/* دوائر الخلفية */}
        <div className="absolute top-[10%] right-[8%] w-80 h-80 bg-accent/20 rounded-full blur-[70px]" />
        <div className="absolute bottom-[10%] left-[5%] w-64 h-64 bg-pink-500/15 rounded-full blur-[60px]" />

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center py-20 relative z-10">
          {/* نص */}
          <div className="text-white animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/40 text-accent text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              ✦ New Season Collection
            </div>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] mb-5">
              Beauty,<br />
              <em className="not-italic font-semibold text-accent">Redefined.</em>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-md mb-8">
              Luxury formulas that honour your skin. Cruelty-free, vegan-friendly, made for every complexion.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link to="/shop" className="btn-velour bg-white !text-velour-700 hover:!bg-velour-100 text-base px-8 py-3.5">
                Shop the Collection →
              </Link>
              <Link to="/shop?tag=new" className="btn-outline !border-white/40 !text-white hover:!bg-white/10 text-base px-8 py-3.5">
                What's New
              </Link>
            </div>
            {/* Stats */}
            <div className="flex gap-8 mt-10 pt-8 border-t border-white/15">
              {[["50K+","Happy customers"],["100%","Cruelty-free"],["4.8★","Avg rating"]].map(([v,l]) => (
                <div key={l}>
                  <p className="text-2xl font-bold text-white">{v}</p>
                  <p className="text-xs text-white/50 mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* صور */}
          <div className="hidden md:grid grid-cols-2 gap-3 h-[460px]">
            <div className="row-span-2 rounded-2xl overflow-hidden">
              <img src="/assets/products/p3.jpg" className="w-full h-full object-cover brightness-90" alt="Amethyst Dreams Palette" onError={(e) => { e.target.src = '/assets/products/fallback.png'; }} />
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img src="/assets/products/p7.jpg" className="w-full h-full object-cover brightness-90" alt="Silk Canvas Serum Foundation" onError={(e) => { e.target.src = '/assets/products/fallback.png'; }} />
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img src="/assets/products/p12.jpg" className="w-full h-full object-cover brightness-90" alt="Barrier Shield SPF 50 Sunscreen" onError={(e) => { e.target.src = '/assets/products/fallback.png'; }} />
            </div>
          </div>
        </div>
      </section>

      {/* ══ Categories ════════════════════════════════════════ */}
      <section className="py-16 bg-velour-soft">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-serif text-4xl text-velour-900">Shop by Category</h2>
            <p className="text-muted mt-2">Explore our curated collection</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/shop?category=${c.slug}`}
                className="flex items-center gap-2 px-5 py-3 bg-white border border-velour-200 rounded-full text-sm font-medium text-velour-800 hover:border-velour-700 hover:bg-velour-50 hover:text-velour-700 transition-all"
              >
                <span>{c.icon}</span>
                <span>{c.name}</span>
                <span className="text-xs text-muted">({c.productCount})</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Featured Products ══════════════════════════════════ */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <p className="text-xs font-bold text-velour-700 uppercase tracking-widest mb-1">✦ Editor's Choice</p>
              <h2 className="font-serif text-4xl text-velour-900">Featured Products</h2>
            </div>
            <Link to="/shop" className="btn-outline py-2.5 px-5 text-sm">View All →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} wishlistIds={wishlistIds} onWishToggle={(id) => {
                setWishlistIds((v) => v.includes(id) ? v.filter((x) => x !== id) : [...v, id]);
              }} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ Brand Values ══════════════════════════════════════ */}
      <section className="py-14 bg-velour-soft">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            ["🌿","Clean & Vegan","Formulated without harmful chemicals. Good for you and the planet."],
            ["🐰","100% Cruelty-Free","We never test on animals — a promise we will always keep."],
            ["📦","Free Shipping $75+","Complimentary shipping on orders over $75, delivered in 2–5 days."],
          ].map(([icon, title, desc]) => (
            <div key={title} className="card p-6 flex gap-4 items-start">
              <span className="text-3xl shrink-0">{icon}</span>
              <div>
                <h3 className="font-semibold text-velour-900 mb-1">{title}</h3>
                <p className="text-muted text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ Bestsellers Rail ══════════════════════════════════ */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
            <h2 className="font-serif text-4xl text-velour-900">Bestsellers</h2>
            <Link to="/shop?tag=bestseller" className="btn-outline py-2 px-5 text-sm">See All</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin">
            {bestsellers.map((p) => (
              <div key={p.id} className="shrink-0 w-56">
                <ProductCard product={p} wishlistIds={wishlistIds} onWishToggle={(id) => {
                  setWishlistIds((v) => v.includes(id) ? v.filter((x) => x !== id) : [...v, id]);
                }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
