// ============================================================
// pages/ShopPage.jsx — Shop page with filtering and sorting
// ============================================================
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { productAPI, categoryAPI, wishlistAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/products/ProductCard";
import { ProductSkeleton, EmptyState } from "../components/ui";

const SORT_OPTIONS = [
  { value: "",            label: "Recommended" },
  { value: "bestseller",  label: "Best Selling" },
  { value: "newest",      label: "Newest" },
  { value: "rating",      label: "Top Rated" },
  { value: "price_asc",   label: "Price: Low → High" },
  { value: "price_desc",  label: "Price: High → Low" },
];

const TAGS = ["bestseller","new","vegan","cruelty-free"];

export default function ShopPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [wishlistIds,setWishlistIds] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [total,      setTotal]      = useState(0);

  const cat    = searchParams.get("category") || "";
  const tag    = searchParams.get("tag")      || "";
  const search = searchParams.get("search")   || "";
  const sort   = searchParams.get("sort")     || "";

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    setSearchParams(p);
  };

  const clearFilters = () => setSearchParams({});

  const fetchProducts = useCallback(() => {
    setLoading(true);
    productAPI.getAll({ category: cat, tag, search, sort, limit: 24 })
      .then(({ data }) => { setProducts(data.products); setTotal(data.total); })
      .finally(() => setLoading(false));
  }, [cat, tag, search, sort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    categoryAPI.getAll().then(({ data }) => setCategories(data.categories));
    if (user) wishlistAPI.get().then(({ data }) => setWishlistIds(data.wishlist.map((p) => p.id)));
  }, [user]);

  const pageTitle = search ? `"${search}"` : cat ? categories.find((c) => c.slug === cat)?.name || "Products"
                           : tag ? tag.charAt(0).toUpperCase() + tag.slice(1) : "All Products";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-4xl text-velour-900">{pageTitle}</h1>
        <p className="text-muted text-sm mt-1">{total} product{total !== 1 ? "s" : ""} found</p>
      </div>

      <div className="flex gap-6 items-start">
        {/* ── Sidebar Filters ── */}
        <aside className="w-52 shrink-0 sticky top-20 hidden md:block">
          <div className="bg-white border border-velour-100 rounded-2xl p-4 space-y-5">

            {/* Categories */}
            <div>
              <p className="text-[11px] font-bold text-velour-700 uppercase tracking-widest mb-2">Category</p>
              <button
                onClick={() => setParam("category","")}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition ${!cat ? "bg-velour-700 text-white" : "text-velour-800 hover:bg-velour-50"}`}
              >All Products</button>
              {categories.map((c) => (
                <button key={c.id}
                  onClick={() => setParam("category", c.slug)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 ${cat === c.slug ? "bg-velour-700 text-white" : "text-velour-800 hover:bg-velour-50"}`}
                >
                  <span>{c.icon}</span>{c.name}
                </button>
              ))}
            </div>

            {/* Tags */}
            <div>
              <p className="text-[11px] font-bold text-velour-700 uppercase tracking-widest mb-2">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {["", ...TAGS].map((t) => (
                  <button key={t || "all"}
                    onClick={() => setParam("tag", t)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition ${tag === t ? "bg-velour-700 text-white border-velour-700" : "border-velour-200 text-velour-800 hover:border-velour-700"}`}
                  >{t || "All"}</button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <p className="text-[11px] font-bold text-velour-700 uppercase tracking-widest mb-2">Sort By</p>
              <select
                value={sort}
                onChange={(e) => setParam("sort", e.target.value)}
                className="w-full input-field text-sm py-2"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {(cat || tag || search || sort) && (
              <button onClick={clearFilters} className="btn-ghost w-full py-2 text-sm">
                ✕ Clear Filters
              </button>
            )}
          </div>
        </aside>

        {/* ── Product Grid ── */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array(6).fill(0).map((_,i) => <ProductSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No products found"
              description="Try adjusting your filters or search query."
              action={<button onClick={clearFilters} className="btn-velour">Clear Filters</button>}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  wishlistIds={wishlistIds}
                  onWishToggle={(id) => setWishlistIds((v) => v.includes(id) ? v.filter((x) => x !== id) : [...v, id])}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
