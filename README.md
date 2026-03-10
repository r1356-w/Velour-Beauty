# 🌸 Velour Beauty

> **Professional Beauty E-commerce Store**  
> Full-stack beauty e-commerce application built with **React** (frontend) and **Node.js/Express** (backend), using **MongoDB** for authentication and seed data workflows, plus an in-memory store for core catalog/order routes.

---

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Current Runtime Architecture](#current-runtime-architecture)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Authentication and Roles](#authentication-and-roles)
- [API Reference](#api-reference)
- [Images and Assets](#images-and-assets)
- [Data Seeding](#data-seeding)
- [Troubleshooting](#troubleshooting)
- [Roadmap Recommendations](#roadmap-recommendations)

---

## 🎯 Project Overview

**Velour Beauty** provides:
- 🛍️ Product browsing with filtering and sorting
- 📝 Product details and reviews
- 🛒 Cart and checkout flow
- ❤️ Wishlist
- 👤 Admin dashboard views for users, orders, and reviews
- 🔐 JWT-based authentication (register/login/me)

The UI is styled with **Tailwind CSS** and uses a purple-forward brand system.

---

## � Screenshots

### Application Overview
<div align="center">

| Home Page | Product Listing | Product Details |
|-----------|----------------|-----------------|
| ![Home](screens/1.PNG) | ![Products](screens/2.PNG) | ![Product Details](screens/3.PNG) |

| Shopping Cart | Checkout | User Dashboard |
|---------------|----------|----------------|
| ![Cart](screens/4.PNG) | ![Checkout](screens/5.PNG) | ![Dashboard](screens/6.PNG) |

| Admin Dashboard | User Management | Order Management |
|-----------------|-----------------|-----------------|
| ![Admin Dashboard](screens/7.PNG) | ![User Management](screens/8.PNG) | ![Order Management](screens/9.PNG) |

| Product Categories | Search Results | Wishlist |
|-------------------|----------------|----------|
| ![Categories](screens/11.PNG) | ![Search](screens/12.PNG) | ![Wishlist](screens/13.PNG) |

| Order History | Product Reviews | Admin Products |
|---------------|-----------------|----------------|
| ![Order History](screens/14.PNG) | ![Reviews](screens/15.PNG) | ![Admin Products](screens/16.PNG) |

| Admin Categories | Admin Orders | Settings |
|------------------|---------------|----------|
| ![Admin Categories](screens/17.PNG) | ![Admin Orders](screens/18.PNG) | ![Settings](screens/15.PNG) |

</div>

---

## ��️ Tech Stack

### Frontend
- **React 18**
- **React Router 6**
- **Axios**
- **Tailwind CSS**
- **react-scripts** (CRA)

### Backend
- **Node.js + Express**
- **JWT** (`jsonwebtoken`)
- **Password hashing** (`bcryptjs`)
- **CORS**
- **Mongoose + MongoDB**

---

## 📁 Repository Structure

```text
velour/
  📂 backend/
    📂 config/
      📄 database.js
      📄 index.js
    📂 data/
      📄 store.js
    📂 middleware/
      📄 auth.js
    📂 models/
      📄 User.js
      📄 Product.js
      📄 Category.js
      📄 Review.js
      📄 Order.js
      📄 Cart.js
      📄 Wishlist.js
      📄 PromoCode.js
    📂 routes/
      📄 auth.js
      📄 products.js
      📄 categories.js
      📄 reviews.js
      📄 cart.js
      📄 orders.js
      📄 wishlist.js
      📄 admin.js
    📂 seed/
      📄 seedDatabase.js
    📄 server.js
    📄 .env
    📄 package.json

  📂 frontend/
    📂 public/
      📂 assets/products/
    📂 src/
      📂 components/
      📂 context/
      📂 pages/
      📄 services/api.js
    📄 package.json

  📄 README.md
```

---

## 🏗️ Current Runtime Architecture

This codebase currently uses a **hybrid data model**:

- **MongoDB-backed**:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
  - Seed script (`backend/seed/seedDatabase.js`)

- **In-memory store** (`backend/data/store.js`):
  - Products, categories, reviews, cart, orders, wishlist, admin routes

This is functional for development and demos, but not a production-final architecture. See [Roadmap Recommendations](#roadmap-recommendations).

---

## 💻 Local Setup

### 1️⃣ Prerequisites
- **Node.js 18+** (Node 20+ recommended)
- **npm**
- **MongoDB** running locally

### 2️⃣ Install dependencies
```bash
cd backend
npm install

cd ../frontend
npm install
```

### 3️⃣ Configure backend env
Create or edit:
- `backend/.env`

Expected values:
```env
MONGODB_URI=mongodb://localhost:27017/velour-beauty
PORT=5010
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

### 4️⃣ Seed database (optional but recommended)
```bash
cd backend
npm run seed
```

### 5️⃣ Start backend
```bash
cd backend
node server.js
```
Expected log:
- `MongoDB Connected: localhost`
- `API running on http://localhost:5010`

### 6️⃣ Start frontend
```bash
cd frontend
npm start
```
Open:
- `http://localhost:3000`

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
- `MONGODB_URI`: Mongo connection string
- `PORT`: API port (current project default: `5010`)
- `JWT_SECRET`: JWT signing key
- `JWT_EXPIRES_IN`: token expiry (example: `7d`)
- `CLIENT_URL`: allowed frontend origin for CORS

### Frontend
API base URL is configured in:
- `frontend/src/services/api.js`

Current fallback base URL:
- `http://127.0.0.1:5010/api`

---

## 🚀 Available Scripts

### Backend
From `backend/`:
- `npm start` -> run `node server.js`
- `npm run dev` -> run `nodemon server.js`
- `npm run seed` -> run seed script
- `npm run seed:new` -> currently mapped to same seed script

### Frontend
From `frontend/`:
- `npm start` -> run dev server
- `npm run build` -> production build

---

## 🔐 Authentication and Roles

- Auth uses JWT bearer tokens
- Token is saved in frontend localStorage key: `velour_token`
- Roles:
  - `user`
  - `admin`

Default seeded admin credentials (if seed was executed):
- Email: `admin@velour.com`
- Password: `admin123`

---

## 📡 API Reference

Base path: `/api`

### 🏥 Health
- `GET /health`

### 🔑 Auth
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me` (protected)

### 🛍️ Products
- `GET /products`
  - supports query params: `category`, `search`, `sort`, `page`, `limit`, `tag`
- `GET /products/featured`
- `GET /products/:id`
- `POST /products` (admin)
- `PUT /products/:id` (admin)
- `DELETE /products/:id` (admin)

### 📂 Categories
- `GET /categories`

### ⭐ Reviews
- `GET /reviews?productId=...`
- `POST /reviews` (protected)
- `PUT /reviews/:id/helpful` (protected)
- `DELETE /reviews/:id` (owner/admin)

### 🛒 Cart
- `GET /cart` (protected)
- `POST /cart` (protected)
- `PUT /cart/:productId` (protected)
- `DELETE /cart/:productId` (protected)
- `DELETE /cart` (protected)

### 📦 Orders
- `GET /orders` (protected)
- `GET /orders/:id` (protected)
- `POST /orders` (protected)
- `PUT /orders/:id/status` (admin)

### ❤️ Wishlist
- `GET /wishlist` (protected)
- `POST /wishlist/:id` (protected, toggle)

### 👤 Admin
- `GET /admin/dashboard` (admin)
- `GET /admin/users` (admin)
- `PUT /admin/users/:id` (admin)
- `DELETE /admin/users/:id` (admin)
- `GET /admin/reviews` (admin)
- `DELETE /admin/reviews/:id` (admin)
- `GET /admin/orders` (admin)

---

## 🖼️ Images and Assets

Product images are served locally from:
- `frontend/public/assets/products`

Current mapping is driven by product IDs in backend store data:
- `p1.jpg` ... `p12.jpg`

If you replace product images, keep filename conventions aligned with IDs used in `backend/data/store.js`.

---

## 🌱 Data Seeding

Seed script:
- `backend/seed/seedDatabase.js`

**What it does:**
- Clears existing Mongo collections
- Creates users, categories, products, reviews, promo codes, sample cart/order/wishlist
- Builds deterministic image URLs for seeded Mongo products

**Note:**
- Main shop flow currently reads from `backend/data/store.js`, not seeded Mongo product collections.

---

## 🔧 Troubleshooting

### 🌐 API unreachable from frontend
**Symptoms:**
- Browser runtime error with generic message like "Something went wrong"

**Checks:**
1. Confirm backend is running:
```bash
curl http://127.0.0.1:5010/api/health
```
2. Confirm frontend API base in `frontend/src/services/api.js` points to same port
3. Restart frontend after API base changes
4. Hard-refresh browser (`Ctrl+F5`)

### 🔌 Port already in use
**Symptoms:**
- `EADDRINUSE`

**Action:**
- Stop the process using the port, or change `PORT` in `backend/.env` and update frontend API base accordingly.

### 🚫 CORS errors
**Symptoms:**
- Requests blocked in browser console

**Action:**
- Ensure `CLIENT_URL` in `backend/.env` matches frontend origin
- Restart backend after `.env` changes

### 🔓 Register/Login returns server error
**Action:**
- Confirm MongoDB is running
- Confirm `MONGODB_URI` is correct
- Check backend terminal logs for stack traces

---

## 🗺️ Roadmap Recommendations

For production readiness, prioritize:
1. 🔄 Migrate all routes to MongoDB (remove in-memory store dependency)
2. ✅ Add validation layer (Joi/Zod/express-validator)
3. 🛡️ Add centralized error handling and structured logging
4. 🧪 Add integration tests for auth, cart, orders, and admin workflows
5. 🔐 Use secure secret management and environment separation
6. 🚀 Add CI pipeline for lint/test/build

---

## 📄 License

No license file is currently included in this repository. Add one before public distribution.


