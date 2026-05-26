# Development Summary — Ant Arm (ant-arm.ru)

## Goal
- Полная переработка сайта и админки: конструктор с маппингом категорий, загрузка фото 3:4, система отзывов (БД + модерация + карточки), новости с фото 16:9, видео-обзоры на главной, промокоды (БД + корзина + админка), раздел "Заявки" в контактах, удаление "Адрес доставки" из чекаута, DDoS-защита сервера

## Constraints & Preferences
- "Сделай подраздел Заявки в разделе контакты в шапке сайта"
- "ссылку на ozon обнови вот (https://www.ozon.ru/search/?brand=101865860&brand_was_predicted=true&deny_category_prediction=true&from_global=true&text=ant+arm)"
- "Оформление заказа убери секцию Адрес доставки"
- "В админ панели форма для создания промокода с полями: Название кода, Тип скидки (процент/фиксированная), Размер скидки, Дата окончания, Лимит использований"
- "Поле ввода промокода на странице корзины/оформления заказа. Кнопка 'Применить'. AJAX-запрос. Должен показывать сообщения: 'Промокод применен, скидка X', 'Промокод просрочен', 'Лимит исчерпан', 'Неверный код'. Промокод применяется только к сумме корзины. Нельзя применить один промокод дважды."
- "В базе данных должна быть таблица promocodes и used_promocodes"
- "Измени название в админ панели обзоры на отзывы"
- "исправь ошибку при одобрении отзыва, высвечивается окно ошибка при обновлении отзыва"
- "в разделе Товары на сайте в карточках сделай так, чтобы отзывы если они есть отображались на карточке, если их нет то нет"
- "в админ панели в редакторе убери редактор Рейтинг, и чтобы на карточке не было рейтинга, а рейтинг появлялся только тогда, когда пользователь делает отзыв"
- "Раздел в админ панели Новости, сопряжи с новостями которые на сайте на главной странице ... В редакторе новостей Оставь только текст и загрузить фото (именно загрузить 16:9 не ссылка)"
- "Сделай новый раздел в админ панели Обзоры. На главной странице сайта, уже есть Обзоры, подвяжи эти видео и превью в админ панель ... Загрузить превью ... и добавить видео. И главное чтобы внизу слева как на сайте главном, была надпись слева снизу Смотреть обзор"
- "Проверь сервер полностью на функционал, убедись что бэкенд в любом случае не падает, проверь сайт на защиту от дудоса, нужно чтобы сервер мог обрабатывать больше 50 запросов и при этом не отключаться"

## Progress
### Phase 1: Database & Backend
- ✅ DB schema: `promocodes`, `used_promocodes`, `video_reviews` tables with indexes
- ✅ API `promocodes.js` — CRUD + validate (check code/expiry/limit) + use (spend code)
- ✅ API `video-reviews.js` — CRUD with sort_order, is_active
- ✅ API `orders.js` — accepts `promo_code`/`promo_discount`, stores in `comment` field
- ✅ Server hardening — security headers (XSS, frame, MIME), process error handlers (uncaughtException/unhandledRejection), graceful shutdown (SIGTERM/SIGINT), JSON parse error handler

### Phase 2: Frontend — Cart & Checkout
- ✅ **Cart.jsx** — promo code input with AJAX validation, shows: "Промокод применён", "Неверный код", "Просрочен", "Лимит исчерпан". Discount line. Stores promo in localStorage.
- ✅ **Checkout.jsx** — reads promo from localStorage, passes with order, calculates adjusted total
- ✅ Removed "Адрес доставки" from Checkout form

### Phase 3: Frontend — Admin Pages
- ✅ **AdminLayout** — nav: "Обзоры"→"Отзывы", added "Промокоды" + "Обзоры" (video)
- ✅ **VideoReviewsAdmin.jsx** — create/edit/delete video reviews with preview upload (16:9 crop), video URL, active toggle
- ✅ **PromocodesAdmin.jsx** — CRUD for promocodes with code, type (percent/fixed), value, expiry date, usage limit
- ✅ **NewsAdmin.jsx** — rewritten: image upload with 16:9 crop instead of URL, only title + content + image, auto-slug
- ✅ **ReviewsAdmin** — uses `api.patch()` (fixed approve bug by adding `patch` method)
- ✅ **ProductForm** — removed Rating field
- ✅ **App.jsx** — routes: `/admin/video-reviews`, `/admin/promocodes`

### Phase 4: Frontend — Site Pages
- ✅ **ProductCard** — rating/reviews shown only when `product.reviews > 0` (dynamic stars)
- ✅ **Home.jsx** — fetches news from `/api/news` and video reviews from `/api/video-reviews`; shows sections only if items exist
- ✅ **Contacts.jsx** — added `id="applications"` section, updated Ozon link
- ✅ **Header** — added "Заявки" subitem in "Контакты"
- ✅ **Constructor** — category mapping uses new IDs (11-43)

### Phase 5: Server Protection
- ✅ Rate limiting: 100 req/15min per IP (general), 5 req/15min (auth)
- ✅ Security headers: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, HSTS
- ✅ Compression (gzip), CORS, 10mb JSON limit
- ✅ Process-level error handlers: uncaughtException, unhandledRejection (prevent crash)
- ✅ Graceful shutdown: SIGTERM, SIGINT
- ✅ JSON parse error handler (400 for malformed body)

### Pending Next
- 🔄 Mark all `[→]` items as `[x]` in todos.md
- 🔄 Update CHANGELOG.md
- 🔄 Final test — run server, check all endpoints, verify no errors
- 🔄 Git commit all changes

## Blockers
- Right panel (token structure) unavailable — "Insufficient balance" for explore agents
- No `rg` (ripgrep) on Windows — limiting search, but all work completed via direct file operations

## Key Decisions
- Promo code stored in localStorage (`antarm-promo`), passed through Checkout → Order API
- Promo info stored in `comment` field (no schema migration needed)
- Video previews uploaded as base64 data URL (same pattern as products/news)
- News photos cropped to 16:9 client-side with canvas
- Security headers done via manual middleware (no helmet dependency, no npm install needed)
- Orders table not modified — promo_code/discount stored inline in comment

## Critical Context
- **SQLite DB** (better-sqlite3), auto-sync at server start
- Vite dev → port 3000, backend → 3001, CORS configured
- News API supports `?published=true` filter; Home uses `GET /api/news` and filters client-side
- Video reviews API supports `?active=true` filter; Home fetches all and filters `.filter(v => v.is_active)`
- Promo code validation: POST `/api/promocodes/validate` — checks exist/is_active/expiry/limit
- DB file: `server/data/antarm.db`

## Relevant Files
- `src/pages/Cart.jsx` — promo code input + AJAX + localStorage
- `src/pages/Checkout.jsx` — reads promo from localStorage, passes to order API
- `src/pages/Home.jsx` — fetches news + video reviews from API
- `src/pages/admin/NewsAdmin.jsx` — file upload 16:9, auto-slug
- `src/pages/admin/VideoReviewsAdmin.jsx` — NEW (CRUD video reviews)
- `src/pages/admin/PromocodesAdmin.jsx` — NEW (CRUD promocodes)
- `src/pages/admin/AdminLayout.jsx` — updated nav items
- `src/components/ProductCard.jsx` — dynamic rating display
- `server/api/orders.js` — handles promo_code/promo_discount in comment
- `server/index.js` — security headers, error handlers, graceful shutdown
- `src/App.jsx` — added /admin/video-reviews, /admin/promocodes routes

## Agent Verification State
- ✅ All major features implemented
- ✅ Remaining: testing, changelog, commit, final verification
