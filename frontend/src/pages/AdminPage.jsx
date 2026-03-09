// ============================================================
// pages/AdminPage.jsx — لوحة الإدارة الكاملة
// ============================================================
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI, productAPI, categoryAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { PageLoader, Modal, Spinner } from "../components/ui";

const TABS = ["Overview","Products","Users","Reviews","Orders"];

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab,       setTab]       = useState("Overview");
  const [dashboard, setDashboard] = useState(null);
  const [products,  setProducts]  = useState([]);
  const [users,     setUsers]     = useState([]);
  const [reviews,   setReviews]   = useState([]);
  const [orders,    setOrders]    = useState([]);
  const [categories,setCategories]= useState([]);
  const [loading,   setLoading]   = useState(true);

  // Add product modal
  const [addModal, setAddModal] = useState(false);
  const [adding,   setAdding]   = useState(false);
  const [form, setForm] = useState({ name:"",brand:"",price:"",originalPrice:"",categoryId:"",description:"",formula:"",shades:"",image:"",stock:"50",tags:[],featured:false });

  useEffect(() => {
    if (!user || !isAdmin) { navigate("/"); return; }
    Promise.all([
      adminAPI.getDashboard(),
      adminAPI.getUsers(),
      adminAPI.getReviews(),
      adminAPI.getOrders(),
      productAPI.getAll({ limit: 100 }),
      categoryAPI.getAll(),
    ]).then(([dash, u, rv, ord, prod, cats]) => {
      setDashboard(dash.data);
      setUsers(u.data.users);
      setReviews(rv.data.reviews);
      setOrders(ord.data.orders);
      setProducts(prod.data.products);
      setCategories(cats.data.categories);
    }).finally(() => setLoading(false));
  }, [user, isAdmin]);

  const refreshProducts = () => productAPI.getAll({ limit: 100 }).then(({ data }) => setProducts(data.products));

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await productAPI.delete(id); toast.success("Product deleted"); refreshProducts();
  };
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await adminAPI.deleteUser(id); toast.success("User deleted");
    setUsers((v) => v.filter((u) => u.id !== id));
  };
  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    await adminAPI.deleteReview(id); toast.success("Review deleted");
    setReviews((v) => v.filter((r) => r.id !== id));
  };

  const addProduct = async () => {
    if (!form.name || !form.brand || !form.price || !form.categoryId) { toast.error("الحقول الأساسية مطلوبة"); return; }
    setAdding(true);
    try {
      await productAPI.create({
        ...form,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        stock: parseInt(form.stock),
        shades: form.shades.split(",").map((s) => s.trim()).filter(Boolean),
        images: form.image ? [form.image] : [],
      });
      toast.success("Product added ✓");
      setAddModal(false);
      setForm({ name:"",brand:"",price:"",originalPrice:"",categoryId:"",description:"",formula:"",shades:"",image:"",stock:"50",tags:[],featured:false });
      refreshProducts();
    } catch (e) { toast.error(e.message); }
    finally { setAdding(false); }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-3xl text-velour-900">Admin Dashboard</h1>
          <p className="text-muted text-sm">Velour Beauty Management</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-velour-700 text-white flex items-center justify-center font-bold text-sm uppercase">
          {user?.name[0]}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-velour-100 rounded-2xl p-1 gap-1 mb-6 flex-wrap">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition whitespace-nowrap ${tab === t ? "bg-white text-velour-700 shadow-sm" : "text-muted hover:text-velour-700"}`}
          >{t}</button>
        ))}
      </div>

      {/* ── Overview ── */}
      {tab === "Overview" && dashboard && (
        <div>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {[
              ["👥","Users",      dashboard.stats.totalUsers],
              ["💄","Products",   dashboard.stats.totalProducts],
              ["📦","Orders",     dashboard.stats.totalOrders],
              ["💰","Revenue",    `$${dashboard.stats.totalRevenue.toFixed(0)}`],
              ["⭐","Reviews",    dashboard.stats.totalReviews],
            ].map(([icon, label, val]) => (
              <div key={label} className="bg-white border border-velour-100 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">{icon}</div>
                <div className="font-serif text-2xl text-velour-900">{val}</div>
                <div className="text-xs text-muted font-semibold uppercase tracking-wide mt-1">{label}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Top Products */}
            <div className="bg-white border border-velour-100 rounded-2xl p-5">
              <h3 className="font-semibold text-velour-900 mb-4">🏆 Top Selling Products</h3>
              {dashboard.topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-bold text-muted w-5">{i+1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-velour-900 truncate">{p.name}</p>
                    <p className="text-xs text-muted">{p.sold} sold · ${p.price.toFixed(2)}</p>
                  </div>
                  <div className="w-20 bg-velour-100 rounded-full h-1.5">
                    <div className="bg-velour-700 h-1.5 rounded-full" style={{ width: `${(p.sold / dashboard.topProducts[0].sold) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white border border-velour-100 rounded-2xl p-5">
              <h3 className="font-semibold text-velour-900 mb-4">📋 Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-xs text-muted uppercase">
                    <th className="text-left pb-2">ID</th>
                    <th className="text-left pb-2">Customer</th>
                    <th className="text-right pb-2">Total</th>
                  </tr></thead>
                  <tbody>
                    {dashboard.recentOrders.map((o) => (
                      <tr key={o.id} className="border-t border-velour-50">
                        <td className="py-2 font-mono text-xs font-bold">#{o.id.slice(-6).toUpperCase()}</td>
                        <td className="py-2 text-velour-800">{o.userName}</td>
                        <td className="py-2 text-right font-bold">${o.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Products ── */}
      {tab === "Products" && (
        <div>
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <p className="text-sm text-muted">{products.length} products</p>
            <button onClick={() => setAddModal(true)} className="btn-velour py-2.5 px-5 text-sm">+ Add Product</button>
          </div>
          <div className="bg-white border border-velour-100 rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-velour-50"><tr>
                {["Product","Category","Price","Stock","Sold",""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-velour-50 hover:bg-velour-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} className="w-10 h-10 rounded-xl object-cover bg-velour-50" alt="" onError={(e) => {e.target.style.display="none";}} />
                        <div>
                          <p className="font-semibold text-velour-900">{p.name}</p>
                          <p className="text-xs text-muted">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted text-sm">
                      {categories.find((c) => c.id === p.categoryId)?.name || "—"}
                    </td>
                    <td className="px-4 py-3 font-semibold">${p.price.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${p.stock < 10 ? "badge-amber" : "badge-green"}`}>{p.stock}</span>
                    </td>
                    <td className="px-4 py-3 text-muted">{p.sold}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteProduct(p.id)} className="text-rose-500 hover:text-rose-700 text-xs font-semibold transition">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Users ── */}
      {tab === "Users" && (
        <div className="bg-white border border-velour-100 rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead className="bg-velour-50"><tr>
              {["User","Email","Role","Joined",""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-velour-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-velour-700 text-white rounded-full flex items-center justify-center text-xs font-bold uppercase">{u.name[0]}</div>
                      <span className="font-semibold text-velour-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted text-xs">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${u.role === "admin" ? "badge-velour" : "badge-purple"}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-muted text-xs">{new Date(u.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</td>
                  <td className="px-4 py-3">
                    {u.role !== "admin" && (
                      <button onClick={() => deleteUser(u.id)} className="text-rose-500 hover:text-rose-700 text-xs font-semibold">Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Reviews ── */}
      {tab === "Reviews" && (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white border border-velour-100 rounded-2xl p-4 flex gap-4 items-start">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex text-accent text-sm">{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</div>
                  <span className="text-xs text-muted">{r.userName} · {r.productName}</span>
                </div>
                {r.title && <p className="font-semibold text-velour-900 text-sm">{r.title}</p>}
                <p className="text-sm text-muted line-clamp-2">{r.body}</p>
              </div>
              <button onClick={() => deleteReview(r.id)} className="text-rose-500 hover:text-rose-700 text-xs font-semibold shrink-0">Delete</button>
            </div>
          ))}
        </div>
      )}

      {/* ── Orders ── */}
      {tab === "Orders" && (
        <div className="bg-white border border-velour-100 rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-velour-50"><tr>
              {["Order ID","Customer","Items","Total","Status","Date"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {[...orders].reverse().map((o) => (
                <tr key={o.id} className="border-t border-velour-50">
                  <td className="px-4 py-3 font-mono text-xs font-bold">#{o.id.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3 text-velour-900">{o.userName}</td>
                  <td className="px-4 py-3 text-muted">{o.items.length}</td>
                  <td className="px-4 py-3 font-bold">${o.total.toFixed(2)}</td>
                  <td className="px-4 py-3"><span className="badge badge-purple">{o.status}</span></td>
                  <td className="px-4 py-3 text-xs text-muted">{new Date(o.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Product Modal */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add New Product" maxW="max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          {[["name","Product Name *","text"],["brand","Brand *","text"],["price","Price ($) *","number"],["originalPrice","Original Price ($)","number"]].map(([key,label,type]) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-velour-800 mb-1">{label}</label>
              <input type={type} className="input-field" value={form[key]} onChange={(e) => setForm({...form,[key]:e.target.value})} />
            </div>
          ))}
          <div>
            <label className="block text-sm font-semibold text-velour-800 mb-1">Category *</label>
            <select className="input-field" value={form.categoryId} onChange={(e) => setForm({...form,categoryId:e.target.value})}>
              <option value="">-- Select --</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-velour-800 mb-1">Stock</label>
            <input type="number" className="input-field" value={form.stock} onChange={(e) => setForm({...form,stock:e.target.value})} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-velour-800 mb-1">Image URL</label>
            <input className="input-field" value={form.image} onChange={(e) => setForm({...form,image:e.target.value})} placeholder="https://images.unsplash.com/..." />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-velour-800 mb-1">Description</label>
            <textarea className="input-field min-h-20" value={form.description} onChange={(e) => setForm({...form,description:e.target.value})} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-velour-800 mb-1">Shades (comma-separated)</label>
            <input className="input-field" value={form.shades} onChange={(e) => setForm({...form,shades:e.target.value})} placeholder="Ivory, Sand, Warm Beige" />
          </div>
          <div className="col-span-2 flex flex-wrap gap-4">
            {["bestseller","new","vegan","cruelty-free"].map((t) => (
              <label key={t} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" className="accent-velour-700" checked={form.tags.includes(t)}
                  onChange={(e) => setForm({...form, tags: e.target.checked ? [...form.tags,t] : form.tags.filter((x)=>x!==t)})} />
                {t}
              </label>
            ))}
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" className="accent-velour-700" checked={form.featured}
                onChange={(e) => setForm({...form,featured:e.target.checked})} />
              Featured
            </label>
          </div>
        </div>
        <button onClick={addProduct} disabled={adding} className="btn-velour w-full mt-5">
          {adding ? <Spinner size="sm" className="border-white border-t-transparent mx-auto" /> : "Add Product"}
        </button>
      </Modal>
    </div>
  );
}
