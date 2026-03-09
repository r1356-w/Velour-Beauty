// ============================================================
// pages/WishlistPage.jsx — قائمة المفضلة
// ============================================================
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { wishlistAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import ProductCard from "../components/products/ProductCard";
import { PageLoader, EmptyState, Spinner } from "../components/ui";

export function WishlistPage() {
  const { user }  = useAuth();
  const navigate   = useNavigate();
  const [items,   setItems]   = useState([]);
  const [ids,     setIds]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    wishlistAPI.get()
      .then(({ data }) => {
        setItems(data.wishlist);
        setIds(data.wishlist.map((p) => p.id));
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleToggle = (id) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
    setIds((prev) => prev.filter((x) => x !== id));
  };

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-serif text-4xl text-velour-900 mb-6">My Wishlist</h1>
      {items.length === 0 ? (
        <EmptyState icon="♡" title="Your wishlist is empty"
          description="Save products you love by clicking the heart icon."
          action={<Link to="/shop" className="btn-velour">Browse Products</Link>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} wishlistIds={ids} onWishToggle={handleToggle} />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// pages/AuthPage.jsx — تسجيل الدخول وإنشاء حساب
// ============================================================
export function AuthPage() {
  const { login, register } = useAuth();
  const { toast }  = useToast();
  const navigate   = useNavigate();
  const [mode,     setMode]     = useState("login"); // "login" | "register"
  const [loading,  setLoading]  = useState(false);
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    if (!email || !password) { toast.error("الرجاء تعبئة جميع الحقول"); return; }
    if (mode === "register" && !name) { toast.error("الاسم مطلوب"); return; }
    setLoading(true);
    try {
      if (mode === "login") {
        const user = await login(email, password);
        toast.success(`Welcome back, ${user.name.split(" ")[0]}! 💜`);
      } else {
        const user = await register(name, email, password);
        toast.success(`Welcome to Velour, ${user.name.split(" ")[0]}! 💜`);
      }
      navigate("/");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-velour-soft">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-1">💜</div>
          <h1 className="font-serif text-2xl gradient-text font-semibold">Velour Beauty</h1>
          <p className="text-muted text-sm mt-1">Luxury beauty, delivered.</p>
        </div>

        <div className="bg-white rounded-3xl border border-velour-100 shadow-velour overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-velour-100">
            {["login","register"].map((m) => (
              <button key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-4 text-sm font-semibold transition ${mode === m ? "text-velour-700 border-b-2 border-velour-700" : "text-muted hover:text-velour-800"}`}
              >{m === "login" ? "Sign In" : "Create Account"}</button>
            ))}
          </div>

          <div className="p-7 space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-sm font-semibold text-velour-800 mb-1">Full Name</label>
                <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Sara Johnson" />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-velour-800 mb-1">Email</label>
              <input className="input-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-velour-800 mb-1">Password</label>
              <input className="input-field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" onKeyDown={(e) => e.key === "Enter" && submit()} />
            </div>

            <button onClick={submit} disabled={loading} className="btn-velour w-full py-3.5 text-base">
              {loading ? <Spinner size="sm" className="border-white border-t-transparent mx-auto" /> : mode === "login" ? "Sign In →" : "Create Account →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
