// ============================================================
// components/products/ProductCard.jsx - Product card
// ============================================================
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StarRating, TagBadge, PriceDisplay } from "../ui";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { wishlistAPI } from "../../services/api";
import { useToast } from "../../context/ToastContext";

export default function ProductCard({ product, wishlistIds = [], onWishToggle }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [adding, setAdding] = useState(false);
  const [wished, setWished] = useState(wishlistIds.includes(product.id));

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login first");
      navigate("/auth");
      return;
    }

    setAdding(true);
    try {
      await addToCart(product.id, 1, product.shades?.[0] || null);
      toast.success(`${product.name} added to cart 🛒`);
    } catch {
      toast.error("An error occurred");
    } finally {
      setAdding(false);
    }
  };

  const handleWishToggle = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login");
      navigate("/auth");
      return;
    }

    try {
      await wishlistAPI.toggle(product.id);
      setWished((v) => !v);
      onWishToggle?.(product.id);
      toast.info(wished ? "Removed from favorites" : "Added to favorites 💜");
    } catch {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="card group cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="relative overflow-hidden bg-velour-50 h-56">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "/assets/products/fallback.png";
          }}
        />

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.tags?.slice(0, 2).map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>

        <button
          onClick={handleWishToggle}
          className={`absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-sm shadow transition
            opacity-0 group-hover:opacity-100 ${wished ? "!opacity-100 text-rose-500" : "text-muted hover:text-rose-500"}`}
        >
          {wished ? "♥" : "♡"}
        </button>

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="badge badge-amber text-xs">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs text-velour-500 font-semibold mb-1">{product.brand}</p>
        <h3 className="font-serif font-semibold text-velour-900 text-base leading-snug mb-2 line-clamp-2">
          {product.name}
        </h3>

        {product.reviewCount > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <StarRating rating={Math.round(product.avgRating || 0)} size="sm" />
            <span className="text-xs text-muted">
              {(product.avgRating || 0).toFixed(1)} ({product.reviewCount})
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 mt-3 flex-wrap">
          <PriceDisplay price={product.price} originalPrice={product.originalPrice} />
          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
            className="btn-velour py-2 px-4 text-xs shrink-0"
          >
            {adding ? "..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
