# Admin Panel & Auth System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full admin panel with JWT auth, SQLite database, product/order CRUD, and order status management for the ant-arm tactical gear e-commerce site.

**Spec:** `docs/superpowers/specs/2026-05-24-admin-panel-auth-design.md`

**Stack:** React 19 + Vite 8 + Express + SQLite (better-sqlite3) + JWT

**Architecture:** Two independent subsystems with clear API contract:
1. **Backend** (Phase 1): Express server, SQLite DB, REST API, auth middleware
2. **Frontend** (Phase 2): AuthContext, ProtectedRoute, admin pages, updated Login/Header

**Current state:**
- Frontend-only SPA, data in `src/data/products.js` (static JS array)
- Cart/favorites in localStorage
- Login page exists but is demo-only (alert on submit)
- No backend, no database, no real auth

---

## Phase 1: Backend (server/)

### Task 1.1: Install dependencies + configure package.json
**Files:** `package.json`

Add dependencies:
```bash
npm install express better-sqlite3 bcrypt jsonwebtoken cors dotenv
npm install -D concurrently nodemon
```

Update scripts:
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

### Task 1.2: Create database schema + seed script
**Files:** `server/db/schema.sql`, `server/db/init.js`

`schema.sql` — CREATE TABLE statements for: users, categories, products, product_specs, orders

`init.js` — 
- Creates `server/data/antarm.db` if not exists
- Runs schema.sql
- Seeds categories from existing `src/data/products.js`
- Seeds products from existing `src/data/products.js` (with specs)
- Creates admin user: `admin@antarm.ru` / `admin123` (bcrypt hashed)
- Creates sample orders (3-5 with different statuses)

### Task 1.3: Create Express server entry point
**Files:** `server/index.js`

- Express app with cors, json middleware
- Routes: auth, products, orders, categories
- Port 3001
- Health check: GET /api/health → {status: 'ok'}

### Task 1.4: Auth middleware
**Files:** `server/middleware/auth.js`

- `verifyToken(req, res, next)` — extract JWT from Authorization header
- `requireAuth` — calls verifyToken, sets req.user
- `requireRole(...roles)` — checks req.user.role against allowed roles

### Task 1.5: Auth API
**Files:** `server/api/auth.js`

- `POST /api/auth/login` — validate email/password, return JWT + user
- `POST /api/auth/register` — create user (admin only), return JWT + user
- JWT secret from `process.env.JWT_SECRET || 'dev-secret-change-in-prod'`
- JWT expiry: 24h

### Task 1.6: Products API
**Files:** `server/api/products.js`

- `GET /api/products` — all products with specs (JOIN)
- `GET /api/products/:id` — single product with specs
- `POST /api/products` — create product + specs (requireRole)
- `PUT /api/products/:id` — update product + replace specs (requireRole)
- `DELETE /api/products/:id` — delete product + specs (requireRole('admin'))

### Task 1.7: Orders API
**Files:** `server/api/orders.js`

- `POST /api/orders` — create order (any authenticated user)
- `GET /api/orders` — all orders (requireRole)
- `GET /api/orders/:id` — single order (requireRole)
- `PUT /api/orders/:id/status` — update status (requireRole)

### Task 1.8: Categories API
**Files:** `server/api/categories.js`

- `GET /api/categories` — all categories
- `POST /api/categories` — create (requireRole('admin'))
- `PUT /api/categories/:id` — update (requireRole('admin'))
- `DELETE /api/categories/:id` — delete (requireRole('admin'))

### Task 1.9: Configure Vite proxy
**Files:** `vite.config.js`

Add server.proxy:
```js
server: {
  proxy: {
    '/api': 'http://localhost:3001'
  }
}
```

### Task 1.10: Test backend
- Run `npm run server`
- Test endpoints with curl/Postman:
  - POST /api/auth/login → get token
  - GET /api/products → list products
  - GET /api/orders → list orders
  - PUT /api/orders/1/status → change status

---

## Phase 2: Frontend (src/)

### Task 2.1: Create API utility
**Files:** `src/utils/api.js`

- `api(path, options)` — fetch wrapper
- Auto-attaches `Authorization: Bearer <token>` from localStorage
- On 401 → clears token, redirects to /login
- Helper methods: `api.get()`, `api.post()`, `api.put()`, `api.delete()`

### Task 2.2: Create AuthContext
**Files:** `src/context/AuthContext.jsx`

- State: `user` (null | {id, email, role, name})
- `login(email, password)` → POST /api/auth/login → set user + token
- `logout()` → clear localStorage + state
- Computed: `isAuthenticated`, `isAdmin`, `isModerator`
- On mount: check localStorage for token, validate with /api/auth/me (new endpoint) or restore from stored user data

### Task 2.3: Create ProtectedRoute
**Files:** `src/components/ProtectedRoute.jsx`

- Wrapper component
- If not authenticated → redirect to /login
- If role not in allowedRoles → redirect to /
- Usage: `<ProtectedRoute allowedRoles={['admin', 'moderator']}>`

### Task 2.4: Update App.jsx routes
**Files:** `src/App.jsx`

Add admin routes wrapped in ProtectedRoute:
```jsx
<Route path="admin" element={<ProtectedRoute allowedRoles={['admin', 'moderator']}><AdminLayout /></ProtectedRoute>}>
  <Route index element={<Dashboard />} />
  <Route path="products" element={<Products />} />
  <Route path="orders" element={<Orders />} />
  <Route path="categories" element={<Categories />} />
</Route>
```

Wrap Cart checkout with ProtectedRoute (or allow guest checkout — spec says POST /api/orders requires auth).

### Task 2.5: Update Login.jsx
**Files:** `src/pages/Login.jsx`

- Connect form to `AuthContext.login()`
- Show server errors
- On success → redirect to /admin
- Remove demo alert

### Task 2.6: Update Header.jsx
**Files:** `src/components/Header.jsx`

- Import useAuth
- Show user name when logged in
- Show "Админка" link if isAdmin or isModerator
- Show "Выйти" button (calls logout)

### Task 2.7: Update main.jsx
**Files:** `src/main.jsx`

- Wrap with `<AuthProvider>` (outside or inside BrowserRouter — context needs router)

### Task 2.8: Create AdminLayout
**Files:** `src/pages/admin/AdminLayout.jsx`, `src/components/admin/Sidebar.jsx`

- AdminLayout: sidebar + outlet
- Sidebar: navigation links (Dashboard, Products, Orders, Categories)
- Dark theme matching site style
- "Back to site" link

### Task 2.9: Create Dashboard page
**Files:** `src/pages/admin/Dashboard.jsx`

- Fetch orders + products on mount
- Stats cards: total orders, revenue, products count
- Orders by status breakdown
- Recent orders table (last 10)

### Task 2.10: Create Products page
**Files:** `src/pages/admin/Products.jsx`, `src/components/admin/ProductForm.jsx`

- Table: ID, Image (thumbnail), Name, SKU, Price, Stock, Actions (Edit/Delete)
- "Add Product" button → opens modal
- ProductForm: name, slug, category (select), price, oldPrice, sku, image URL, description, specs (dynamic key-value rows), inStock (checkbox), rating, reviews
- Edit: populate form with existing data
- Delete: confirm dialog → DELETE /api/products/:id
- Optimistic update or refetch after mutation

### Task 2.11: Create Orders page
**Files:** `src/pages/admin/Orders.jsx`, `src/components/admin/OrderStatusBadge.jsx`

- Table: ID, Customer, Items summary, Total, Status (colored badge), Date, Actions
- Status dropdown: новый, в обработке, подтверждён, отправлен, доставлен, отменён
- Color coding: новый=blue, в обработке=yellow, подтверждён=purple, отправлен=orange, доставлен=green, отменён=red
- Click row → detail modal with full item list
- Filter by status (tabs or dropdown)

### Task 2.12: Create Categories page
**Files:** `src/pages/admin/Categories.jsx`

- Table: ID, Name, Slug, Icon, Count, Actions
- Add/Edit/Delete inline or modal
- Simple form: name, slug (auto-generated), icon (emoji)

### Task 2.13: Update Cart.jsx to submit orders
**Files:** `src/pages/Cart.jsx`

- On checkout: POST /api/orders with cart items + customer info
- Need customer info form (name, email, phone) if not already present
- On success → clear cart, show success page

### Task 2.14: Update data flow
**Files:** `src/pages/Catalog.jsx`, `src/pages/Category.jsx`, `src/pages/Home.jsx`, `src/pages/Product.jsx`

- Replace imports from `src/data/products.js` with API calls
- `useEffect` → `api.get('/api/products')` on mount
- Loading state while fetching
- Fallback to empty array on error

### Task 2.15: Test full flow
- Start both servers: `npm run dev:all`
- Login as admin@antarm.ru / admin123
- Navigate to /admin
- Test product CRUD
- Test order status changes
- Test category management
- Test guest checkout (if implemented)
- Test protected route redirects

---

## Testing Strategy

- Backend: manual testing via curl/Postman for each endpoint
- Frontend: visual testing in browser
- Auth flow: login → access admin → logout → verify redirect
- CRUD: create → read → update → delete for products
- Orders: create order from cart → verify in admin → change status

## Risk Mitigation

- **better-sqlite3 native module**: May need build tools on Windows. Fallback: `sql.js` (pure JS SQLite)
- **CORS issues**: Vite proxy handles this for dev
- **JWT persistence**: localStorage + auto-logout on 401
- **Data migration**: seed script reads from existing products.js to preserve current data
