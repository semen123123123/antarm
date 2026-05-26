# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- WB (wb_url) and Ozon (ozon_url) fields to product edit form
- Auto-generation of slug from product name (Cyrillic transliteration)
- Responsive sidebar (mobile hamburger menu) to admin layout
- **Reviews system**: database table, API endpoint, review form on product page, admin management page
- **News system**: database table, API endpoint, admin CRUD page
- **File upload for product photos**: replace URL input with file upload, auto-crop to 3:4 ratio via Canvas API
- **Favorites management**: delete individual items and "Delete all" with confirmation
- **Video reviews system**: database table, API endpoint, admin CRUD with video file upload and preview
- **Promocodes system**: database tables (promocodes, used_promocodes), API with validate/use endpoints, admin CRUD
- **Video file upload**: video reviews can now be uploaded as file (base64) or via URL link
- **Interactive photo cropping** for news: click on photo to reposition crop area in 16:9 ratio
- **"Заявки" section** in Contacts page
- **Security headers**: X-Content-Type-Options, X-Frame-Options, HSTS, X-XSS-Protection
- **Rate limiter**: 100 requests per 15 min per IP, stricter 10 req/15 min for auth
- **Error handlers**: uncaughtException, unhandledRejection, graceful shutdown

### Changed
- **Admin panel redesigned**: full white minimalistic theme across all pages
- AdminLayout: white sidebar (240px), cleaner visual, renamed "Обзоры"→"Отзывы", added "Промокоды" and "Обзоры" nav items
- Dashboard: white stat cards with shadows, light gray backgrounds
- Products: white table with WB/Ozon link columns, clean action buttons
- ProductForm: white modal, human-readable field labels, removed "Рейтинг" field
- Orders: white theme, pill-shaped status filters, collapsible order details, promo code field
- Categories: white theme, clean form modal
- Users: white theme, simplified but fully functional
- Logs: white theme, clean filters and pagination
- **NewsAdmin**: removed "Заголовок" field (auto-generated from first line of text), added interactive crop with click-to-reposition
- **Home page**: constructor banner moved after catalog section, "О компании" section now has background photo with overlay
- **Checkout**: removed "Адрес доставки" section, promo code support
- **Cart**: added promo code input with AJAX validation
- **Server JSON limit**: increased from 10mb to 100mb for video uploads

### Fixed
- Field labels now in plain Russian (slug → Адрес в URL, SKU → Артикул, oldPrice → Цена до скидки)
- Slug auto-generated from name with full Cyrillic support
- **App.jsx**: added 5 missing lazy imports (Checkout, Constructor, AdminCategories, AdminUsers, AdminLicenses) that caused ReferenceError and gray screen on page load
- **Reviews approve**: added api.patch method, fixed error when approving review
- **ProductCard**: rating/stars only shown when reviews exist
- **News CRUD**: improved error handling with detailed error messages
- **Video reviews CRUD**: improved error handling
- **ProductForm**: Constructor.jsx fixed missing imports
