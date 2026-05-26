# ANT ARM Admin Panel — Техническое задание и план разработки

> Версия: 2.0 | Дата: 2026-05-24 | Стек: React 19 + Express 5 + SQLite (better-sqlite3)

---

## 1. Техническое задание

### 1.1 Ролевая модель

| Роль | Товары | Заказы | Клиенты | Контент | Аналитика | Настройки | Логи |
|---|---|---|---|---|---|---|---|
| **admin** | CRUD | CRUD | CRUD | CRUD | RW | RW | R |
| **product_manager** | CRUD | R | R | — | R | — | R |
| **order_manager** | R | CRUD | CRUD | — | R | — | R |
| **content_editor** | R | — | — | CRUD | R | RW | — |
| **analyst** | R | R | R | R | R | — | R |

### 1.2 Модули

| # | Модуль | Описание | Приоритет |
|---|---|---|---|
| M1 | Аутентификация + RBAC | JWT + роли + 2FA (TOTP) + IP-allowlist | 🔴 |
| M2 | Activity Log | Все действия: кто, что, когда, IP | 🔴 |
| M3 | Dashboard | Выручка, заказы, конверсия, топ-5, график, статус | 🔴 |
| M4 | Каталог товаров | CRUD + 10 фото + SEO + WYSIWYG + маркировки | 🔴 |
| M5 | Заказы | Список + карточка + статусы + история + печать | 🔴 |
| M6 | Клиенты | База + история + сегментация + блокировка + лояльность | 🟡 |
| M7 | Контент | Страницы + блог + баннеры с расписанием | 🟡 |
| M8 | Настройки | Магазин + доставка + оплата + налоги | 🟡 |
| M9 | Аналитика | Продажи, прибыль, география, источники, экспорт | 🟢 |
| M10 | ФЗ-150 | Верификация лицензий, скрытие запрещённых | 🔴 |
| M11 | Dev Tools | API-ключи, вебхуки, логи, песочница | 🟢 |

---

## 2. ER-диаграмма

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│   users      │     │   activity_logs  │     │   categories │
├──────────────┤     ├──────────────────┤     ├──────────────┤
│ id           │──┐  │ id               │  ┌──│ id           │
│ email        │  │  │ user_id      │──┘  │  │ name         │
│ password_hash│  │  │ action           │     │ slug         │
│ role         │  │  │ entity_type      │     │ icon         │
│ name         │  │  │ entity_id        │     │ parent_id    │
│ phone        │  │  │ old_value        │     │ count        │
│ address      │  │  │ new_value        │     └──────────────┘
│ is_blocked   │  │  │ ip_address       │            │
│ loyalty_pts  │  │  │ created_at       │            │
│ created_at   │  │  └──────────────────┘            │
└──────────────┘                                    │
       │                                            │
       │          ┌──────────────────┐              │
       │          │    products      │◄─────────────┘
       │          ├──────────────────┤
       │          │ id               │
       │          │ name             │
       │          │ slug             │
       │          │ category_id      │──┐
       │          │ price            │  │
       │          │ old_price        │  │  ┌──────────────────┐
       │          │ sku              │  │  │   orders         │
       │          │ images (JSON)    │  │  ├──────────────────┤
       │          │ description      │  │  │ id               │
       │          │ in_stock         │  │  │ user_id      │──┘
       │          │ stock_status     │  │  │ customer_name    │
       │          │ rating           │  │  │ customer_email   │
       │          │ season/material  │  │  │ customer_phone   │
       │          │ protection_class │  │  │ delivery_method  │
       │          │ tags (JSON)      │  │  │ delivery_address │
       │          │ is_hidden        │  │  │ payment_method   │
       │          │ seo_title        │  │  │ subtotal/total   │
       │          │ seo_description  │  │  │ status           │
       │          │ badges (JSON)    │  │  │ created_at       │
       │          │ created_at       │  │  └────────┬─────────┘
       │          └────────┬─────────┘              │
       │                   │                        │
       │          ┌────────▼─────────┐     ┌────────▼─────────┐
       │          │  product_specs   │     │   order_items    │
       │          ├──────────────────┤     ├──────────────────┤
       │          │ id               │     │ id               │
       │          │ product_id   │───┘     │ order_id     │──┘
       │          │ key              │     │ product_id   │──┐
       │          │ value            │     │ product_name   │ │
       │          └──────────────────┘     │ quantity/price │ │
       │                                   │ size           │ │
       │          ┌──────────────────┐     └──────────────────┘ │
       │          │  order_status_   │                          │
       │          │  history         │                          │
       │          ├──────────────────┤                          │
       │          │ id               │                          │
       │          │ order_id     │───┘                          │
       │          │ old_status       │                          │
       │          │ new_status       │                          │
       │          │ changed_by       │                          │
       │          │ created_at       │                          │
       │          └──────────────────┘                          │
       │                                                        │
       │          ┌──────────────────┐     ┌──────────────────┐ │
       │          │license_verif.    │     │   blog_posts     │ │
       │          ├──────────────────┤     ├──────────────────┤ │
       │          │ id               │     │ id               │ │
       │          │ user_id      │──┐ │     │ title/slug     │ │
       │          │ license_number   │ │     │ content        │ │
       │          │ license_type     │ │     │ category       │ │
       │          │ verified         │ │     │ author_id  │──┘ │
       │          │ created_at       │ │     │ published      │ │
       │          └──────────────────┘ │     │ created_at     │ │
       │                               │     └──────────────────┘
       │          ┌──────────────────┐ │
       │          │  api_keys        │ │
       │          ├──────────────────┤ │
       │          │ id               │ │
       │          │ user_id      │───┘ │
       │          │ key_hash         │
       │          │ permissions      │
       │          │ active           │
       │          └──────────────────┘
```

---

## 3. API-спецификация

### Auth
| Method | Endpoint | Role | Описание |
|---|---|---|---|
| POST | `/api/admin/auth/login` | public | Вход + 2FA |
| POST | `/api/admin/auth/verify-2fa` | public | Подтверждение TOTP |
| GET | `/api/admin/auth/me` | auth | Текущий пользователь |
| POST | `/api/admin/auth/logout` | auth | Выход |

### Users
| Method | Endpoint | Role | Описание |
|---|---|---|---|
| GET | `/api/admin/users` | admin | Список пользователей |
| POST | `/api/admin/users` | admin | Создание |
| PUT | `/api/admin/users/:id` | admin | Обновление |
| PUT | `/api/admin/users/:id/block` | admin | Блокировка |
| PUT | `/api/admin/users/:id/loyalty` | admin | Начисление баллов |

### Products
| Method | Endpoint | Role | Описание |
|---|---|---|---|
| GET | `/api/admin/products` | PM+ | Список с пагинацией |
| POST | `/api/admin/products` | PM | Создание |
| PUT | `/api/admin/products/:id` | PM | Обновление |
| DELETE | `/api/admin/products/:id` | PM | Удаление |
| POST | `/api/admin/products/bulk-update` | PM | Массовое обновление |
| POST | `/api/admin/products/import` | PM | Импорт CSV |
| GET | `/api/admin/products/export` | PM | Экспорт CSV |

### Orders
| Method | Endpoint | Role | Описание |
|---|---|---|---|
| GET | `/api/admin/orders` | OM+ | Список с фильтрами |
| GET | `/api/admin/orders/:id` | OM+ | Детали |
| PUT | `/api/admin/orders/:id/status` | OM | Смена статуса |
| GET | `/api/admin/orders/:id/print` | OM | Печать накладной |
| POST | `/api/admin/orders/:id/notify` | OM | Уведомление клиенту |

### Customers
| Method | Endpoint | Role | Описание |
|---|---|---|---|
| GET | `/api/admin/customers` | OM+ | Список |
| GET | `/api/admin/customers/:id` | OM+ | Профиль + история |
| PUT | `/api/admin/customers/:id/block` | admin | Блокировка |

### Content
| Method | Endpoint | Role | Описание |
|---|---|---|---|
| GET/POST/PUT/DELETE | `/api/admin/pages` | CE | Страницы |
| GET/POST/PUT/DELETE | `/api/admin/blog` | CE | Блог |
| GET/POST/PUT/DELETE | `/api/admin/banners` | CE | Баннеры |

### Analytics
| Method | Endpoint | Role | Описание |
|---|---|---|---|
| GET | `/api/admin/analytics/dashboard` | A+ | Метрики дашборда |
| GET | `/api/admin/analytics/sales` | A+ | Продажи по периодам |
| GET | `/api/admin/analytics/top-products` | A+ | Топ товаров |
| GET | `/api/admin/analytics/geography` | A+ | География |
| GET | `/api/admin/analytics/export` | A+ | Экспорт CSV |

### Settings
| Method | Endpoint | Role | Описание |
|---|---|---|---|
| GET/PUT | `/api/admin/settings` | admin/CE | Настройки магазина |
| GET/POST/PUT/DELETE | `/api/admin/settings/delivery` | admin | Доставка |
| GET/POST/PUT/DELETE | `/api/admin/settings/payment` | admin | Оплата |

### Logs
| Method | Endpoint | Role | Описание |
|---|---|---|---|
| GET | `/api/admin/logs` | admin | Activity log |
| GET | `/api/admin/logs/api` | admin | API логи |

### Licenses (ФЗ-150)
| Method | Endpoint | Role | Описание |
|---|---|---|---|
| GET | `/api/admin/licenses` | admin | Список лицензий |
| PUT | `/api/admin/licenses/:id/verify` | admin | Верификация |
| GET | `/api/admin/licenses/expiring` | admin | Истекающие |

---

## 4. UI-кит

### Компоненты

| Компонент | Состояния | Описание |
|---|---|---|
| `Button` | default / hover / active / disabled / loading | Основная кнопка |
| `Input` | default / focus / error / disabled | Текстовое поле |
| `Select` | default / focus / disabled | Выпадающий список |
| `DataTable` | loading / empty / sorted / paginated | Таблица с сортировкой |
| `Modal` | open / close | Модальное окно |
| `Toast` | success / error / warning / info | Уведомление |
| `Badge` | green / red / yellow / blue / gray | Статус-метка |
| `Card` | default / hover | Карточка-контейнер |
| `Tabs` | active / inactive | Вкладки |
| `Pagination` | active / disabled | Навигация по страницам |
| `FileUpload` | idle / uploading / done / error | Загрузка файлов |
| `RichEditor` | default / fullscreen | WYSIWYG |
| `Chart` | loading / data / empty | Графики |
| `Sidebar` | collapsed / expanded | Боковое меню |

### Цветовая схема

| Переменная | Light | Dark |
|---|---|---|
| `--bg-primary` | `#f5f5f5` | `#1a1a2e` |
| `--bg-card` | `#ffffff` | `#16213e` |
| `--text-primary` | `#1a1a2e` | `#e0e0e0` |
| `--accent` | `#4a9eff` | `#4a9eff` |
| `--success` | `#28a745` | `#28a745` |
| `--danger` | `#ff4444` | `#ff4444` |
| `--warning` | `#f59e0b` | `#f59e0b` |

---

## 5. План разработки (8 недель)

### Неделя 1-2: Фундамент
- [x] M1: RBAC — 5 ролей, middleware авторизации
- [x] M2: Activity Log — таблица + middleware логирования
- [x] M3: Dashboard — метрики, графики, статус системы
- [ ] M10: ФЗ-150 — верификация лицензий, скрытие товаров

### Неделя 3-4: Каталог и заказы
- [ ] M4: Каталог — CRUD, загрузка фото, SEO, WYSIWYG, маркировки
- [ ] M5: Заказы — карточка, история статусов, печать, уведомления
- [ ] M4: Импорт/экспорт CSV, массовое обновление цен

### Неделя 5-6: Клиенты и контент
- [ ] M6: Клиенты — профиль, история, сегментация, лояльность
- [ ] M7: Контент — страницы, блог, баннеры с расписанием
- [ ] M8: Настройки — магазин, доставка, оплата

### Неделя 7-8: Аналитика и Dev Tools
- [ ] M9: Аналитика — отчёты, экспорт, интеграции
- [ ] M11: Dev Tools — API-ключи, вебхуки, логи, песочница
- [ ] Тестирование, оптимизация, документация

---

## 6. Критерии приёмки

### M1 — Аутентификация + RBAC
- [ ] 5 ролей с корректными правами
- [ ] 2FA через TOTP для всех ролей
- [ ] IP-allowlist для admin
- [ ] JWT refresh token

### M2 — Activity Log
- [ ] Все CRUD-действия логируются
- [ ] Запись: user_id, action, entity, old/new, IP, timestamp
- [ ] Фильтрация и поиск по логам

### M3 — Dashboard
- [ ] Выручка за месяц (реальные данные)
- [ ] Количество заказов, конверсия
- [ ] Топ-5 товаров
- [ ] График посещаемости (7 дней)
- [ ] Статус сервера

### M4 — Каталог
- [ ] CRUD с валидацией
- [ ] Загрузка до 10 изображений
- [ ] SEO-поля
- [ ] Маркировки (Хит/Новинка/Акция)
- [ ] Импорт/экспорт CSV
- [ ] Массовое обновление цен

### M5 — Заказы
- [ ] Фильтрация по статусу, поиск
- [ ] Карточка с историей статусов
- [ ] Печать накладной
- [ ] Уведомление клиенту

### M10 — ФЗ-150
- [ ] Верификация лицензий
- [ ] Скрытие запрещённых товаров
- [ ] Уведомления об истечении

---

## 7. Документация по ролям

### Администратор
1. Вход → 2FA → Dashboard
2. Управление пользователями: Users → Create/Edit/Block
3. Настройки: Settings → Store/Delivery/Payment
4. Логи: Logs → фильтрация по дате/пользователю
5. API-ключи: Dev Tools → Generate key

### Менеджер по товарам
1. Каталог → Products → Add product
2. Загрузка фото → drag & drop до 10 штук
3. SEO → заполнить title, description, keywords
4. Массовое обновление → Bulk update → выбрать товары → применить
5. Импорт → Import CSV → загрузить файл → маппинг полей

### Менеджер заказов
1. Orders → список с фильтрами
2. Клик по заказу → карточка → сменить статус
3. Print → печать накладной
4. Notify → отправка email/SMS клиенту

### Контент-редактор
1. Pages → создать/редактировать страницу
2. Blog → написать статью → премодерация
3. Banners → загрузить изображение → настроить расписание

### Аналитик
1. Dashboard → просмотр метрик
2. Analytics → Sales/Geography/Traffic
3. Export → выбрать поля → скачать CSV
