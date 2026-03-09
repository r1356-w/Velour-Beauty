// ============================================================
// services/api.js — طبقة التواصل مع API
// جميع الطلبات تمر من هنا باستخدام Axios
// ============================================================
import axios from "axios";

const BASE = "https://velour-beauty.onrender.com/api";

// إنشاء نسخة Axios مخصصة
const api = axios.create({ baseURL: BASE });

// إرفاق رمز JWT تلقائياً مع كل طلب
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("velour_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// معالج الأخطاء العام
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || "حدث خطأ ما";
    return Promise.reject(new Error(message));
  }
);

// ── المصادقة ─────────────────────────────────
export const authAPI = {
  register: (data)   => api.post("/auth/register", data),
  login:    (data)   => api.post("/auth/login", data),
  getMe:    ()       => api.get("/auth/me"),
};

// ── المنتجات ──────────────────────────────────
export const productAPI = {
  getAll:      (params) => api.get("/products", { params }),
  getFeatured: ()       => api.get("/products/featured"),
  getById:     (id)     => api.get(`/products/${id}`),
  create:      (data)   => api.post("/products", data),
  update:      (id, d)  => api.put(`/products/${id}`, d),
  delete:      (id)     => api.delete(`/products/${id}`),
};

// ── التصنيفات ─────────────────────────────────
export const categoryAPI = {
  getAll: () => api.get("/categories"),
};

// ── التقييمات ─────────────────────────────────
export const reviewAPI = {
  getByProduct: (productId) => api.get("/reviews", { params: { productId } }),
  create:       (data)      => api.post("/reviews", data),
  markHelpful:  (id)        => api.put(`/reviews/${id}/helpful`),
  delete:       (id)        => api.delete(`/reviews/${id}`),
};

// ── السلة ─────────────────────────────────────
export const cartAPI = {
  get:    ()                      => api.get("/cart"),
  add:    (productId, qty, shade) => api.post("/cart", { productId, qty, shade }),
  update: (productId, qty, shade) => api.put(`/cart/${productId}`, { qty, shade }),
  remove: (productId)             => api.delete(`/cart/${productId}`),
  clear:  ()                      => api.delete("/cart"),
};

// ── الطلبات ───────────────────────────────────
export const orderAPI = {
  getAll:   ()     => api.get("/orders"),
  getById:  (id)   => api.get(`/orders/${id}`),
  checkout: (data) => api.post("/orders", data),
};

// ── المفضلة ───────────────────────────────────
export const wishlistAPI = {
  get:    ()   => api.get("/wishlist"),
  toggle: (id) => api.post(`/wishlist/${id}`),
};

// ── الإدارة ───────────────────────────────────
export const adminAPI = {
  getDashboard: ()      => api.get("/admin/dashboard"),
  getUsers:     ()      => api.get("/admin/users"),
  updateUser:   (id, d) => api.put(`/admin/users/${id}`, d),
  deleteUser:   (id)    => api.delete(`/admin/users/${id}`),
  getReviews:   ()      => api.get("/admin/reviews"),
  deleteReview: (id)    => api.delete(`/admin/reviews/${id}`),
  getOrders:    ()      => api.get("/admin/orders"),
};

export default api;




