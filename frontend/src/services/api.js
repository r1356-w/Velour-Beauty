// ============================================================
// services/api.js — API Service Layer
// All requests pass through here using Axios
// ============================================================
import axios from "axios";

// Use environment variable from .env.production with strong fallback
const BASE_URL = process.env.REACT_APP_API_URL || "https://velour-beauty.onrender.com/api";

// Create custom Axios instance
const api = axios.create({ baseURL: BASE_URL });

// Debug logging - show both env and final URL
console.log("Environment API URL:", process.env.REACT_APP_API_URL);
console.log("Final API Base URL:", BASE_URL);

// Add request interceptor for debugging
api.interceptors.request.use((config) => {
  console.log("Making request to:", config.baseURL + config.url);
  const token = localStorage.getItem("velour_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// General error handler
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || "An error occurred";
    return Promise.reject(new Error(message));
  }
);

// ── Authentication ─────────────────────────────────
export const authAPI = {
  register: (data)   => api.post("/auth/register", data),
  login:    (data)   => api.post("/auth/login", data),
  getMe:    ()       => api.get("/auth/me"),
};

// ── Products ──────────────────────────────────
export const productAPI = {
  getAll:      (params) => api.get("/products", { params }),
  getFeatured: ()       => api.get("/products/featured"),
  getById:     (id)     => api.get(`/products/${id}`),
  create:      (data)   => api.post("/products", data),
  update:      (id, d)  => api.put(`/products/${id}`, d),
  delete:      (id)     => api.delete(`/products/${id}`),
};

// ── Categories ─────────────────────────────────
export const categoryAPI = {
  getAll: () => api.get("/categories"),
};

// ── Reviews ─────────────────────────────────
export const reviewAPI = {
  getByProduct: (productId) => api.get("/reviews", { params: { productId } }),
  create:       (data)      => api.post("/reviews", data),
  markHelpful:  (id)        => api.put(`/reviews/${id}/helpful`),
  delete:       (id)        => api.delete(`/reviews/${id}`),
};

// ── Cart ─────────────────────────────────────
export const cartAPI = {
  get:    ()                      => api.get("/cart"),
  add:    (productId, qty, shade) => api.post("/cart", { productId, qty, shade }),
  update: (productId, qty, shade) => api.put(`/cart/${productId}`, { qty, shade }),
  remove: (productId)             => api.delete(`/cart/${productId}`),
  clear:  ()                      => api.delete("/cart"),
};

// ── Orders ───────────────────────────────────
export const orderAPI = {
  getAll:   ()     => api.get("/orders"),
  getById:  (id)   => api.get(`/orders/${id}`),
  checkout: (data) => api.post("/orders", data),
};

// ── Wishlist ───────────────────────────────────
export const wishlistAPI = {
  get:    ()   => api.get("/wishlist"),
  toggle: (id) => api.post(`/wishlist/${id}`),
};

// ── Admin ───────────────────────────────────
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




