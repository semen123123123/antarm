# Admin Panel & Auth System — Design Spec

**Date**: 2026-05-24
**Project**: ant-arm (React 19 + Vite 8)

## 1. Architecture Overview

### Tech Stack
- **Backend**: Node.js + Express
- **Database**: SQLite (`better-sqlite3`)
- **Auth**: JWT (`jsonwebtoken` + `bcrypt`)
- **Frontend**: React 19 + React Router 7 (existing)

### Directory Structure
```
ant-arm/
├── server/
│   ├── index.js              # Express entry point
│   ├── db/
│   │   ├── init.js           # SQLite initialization + seed data
│   │   └── schema.sql        # Database schema
│   ├── api/
│   │   ├── auth.js           # POST /api/auth/login, /register
│   │   ├── products.js       # CRUD /api/products
│   │   ├── orders.js         # GET/PUT /api/orders
│   │   └── categories.js     # CRUD /api/categories
│   └── middleware/
│       └── auth.js           # JWT verify + role check
├── src/
│   ├── context/
│   │   └── AuthContext.jsx   # Global auth state + API helper
│   ├── pages/
│   │   ├── Login.jsx         # Updated login page (real auth)
│   │   └── admin/
│   │       ├── Dashboard.jsx # Stats overview
│   │       ├── Products.jsx  # Product table + CRUD modal
│   │       ├── Orders.jsx    # Order table + status dropdown
│   │       └── Categories.jsx# Category management
│   ├── components/
│   │   ├── admin/
│   │   │   ├── Sidebar.jsx   # Admin navigation
│   │   │   ├── ProductForm.jsx # Add/Edit product form
│   │   │   └── OrderStatusBadge.jsx # Status badge + dropdown
│   │   └── ProtectedRoute.jsx # Auth guard wrapper
│   └── utils/
│       └── api.js            # fetch wrapper with JWT header
├── package.json              # Updated scripts
└── vite.config.js            # Updated proxy config
```

## 2. Database Schema (SQLite)

```sql
-- Users
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'moderator', -- 'admin' | 'moderator'
  name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  count INTEGER DEFAULT 0
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  price INTEGER NOT NULL,
  old_price INTEGER,
  sku TEXT UNIQUE NOT NULL,
  image TEXT,
  description TEXT,
  in_stock INTEGER DEFAULT 1,
  rating REAL DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Product Specs
CREATE TABLE IF NOT EXISTS product_specs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT NOT NULL
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  items TEXT NOT NULL,  -- JSON array: [{id, name, price, qty, size, image}]
  total INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'новый',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 3. API Endpoints

### Auth
- `POST /api/auth/login` — {email, password} → {token, user: {id, email, role, name}}
- `POST /api/auth/register` — {email, password, name} → {token, user} (admin only)

### Products
- `GET /api/products` — List all products (with specs)
- `GET /api/products/:id` — Single product detail
- `POST /api/products` — Create product (admin/moderator)
- `PUT /api/products/:id` — Update product (admin/moderator)
- `DELETE /api/products/:id` — Delete product (admin only)

### Orders
- `POST /api/orders` — Create order (any authenticated user)
- `GET /api/orders` — List all orders (admin/moderator)
- `GET /api/orders/:id` — Single order detail
- `PUT /api/orders/:id/status` — Update status (admin/moderator)

### Categories
- `GET /api/categories` — List all
- `POST /api/categories` — Create (admin)
- `PUT /api/categories/:id` — Update (admin)
- `DELETE /api/categories/:id` — Delete (admin)

## 4. Order Statuses

`новый` → `в обработке` → `подтверждён` → `отправлен` → `доставлен`
`отменён` (terminal)

## 5. Auth Flow

1. User visits `/login`
2. Enters email + password → POST /api/auth/login
3. Server validates → returns JWT + user info
4. Client stores JWT in localStorage
5. AuthContext provides `user`, `login()`, `logout()`, `isAuthenticated`, `isAdmin`
6. Protected routes (`/admin/*`) check `isAuthenticated` + role
7. Header shows user name + "Админка" link (if authorized)

### Seed Admin
Default admin created on first server start:
- email: `admin@antarm.ru`
- password: `admin123`
- role: `admin`

## 6. Admin Panel Pages

### Dashboard (`/admin`)
- Total orders count + revenue
- Orders by status (breakdown)
- Recent orders table (last 10)
- Total products count

### Products (`/admin/products`)
- Table: ID, Image, Name, SKU, Price, Stock, Actions
- "Add Product" button → modal form
- Edit/Delete per row
- Form fields: name, slug, category, price, oldPrice, sku, image URL, description, specs (key-value pairs), inStock, rating, reviews

### Orders (`/admin/orders`)
- Table: ID, Customer, Items, Total, Status, Date, Actions
- Status dropdown per row with color-coded badges
- Click row → order detail modal (full items list)
- Filter by status

### Categories (`/admin/categories`)
- Table: ID, Name, Slug, Icon, Count
- Add/Edit/Delete

## 7. Frontend Changes

### AuthContext.jsx
- `user` state (null or user object)
- `login(email, password)` — POST to /api/auth/login
- `logout()` — clear localStorage + state
- `isAuthenticated` — computed
- `isAdmin` / `isModerator` — role checks

### ProtectedRoute.jsx
- Wrapper component
- Redirects to `/login` if not authenticated
- Redirects to `/` if insufficient role

### Header.jsx
- Shows user name when logged in
- "Админка" link (if role = admin/moderator)
- "Выйти" button

### Login.jsx
- Connect to AuthContext.login()
- Redirect to /admin on success
- Error messages from server

### API Utility
- `api.js` — fetch wrapper that auto-attaches JWT header
- Handles 401 → auto-logout

## 8. Vite Proxy Config

```js
server: {
  proxy: {
    '/api': 'http://localhost:3001'
  }
}
```

## 9. Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "server": "node server/index.js",
    "dev:all": "concurrently \"npm run server\" \"npm run dev\"",
    "build": "vite build",
    "seed": "node server/db/init.js"
  }
}
```

## 10. Security Considerations

- Passwords hashed with bcrypt (salt rounds: 10)
- JWT secret stored in `.env` (default for dev)
- CORS configured for localhost:5173
- SQL parameterized queries (no injection)
- Protected routes on both frontend and backend
- Role-based access control on all write endpoints
