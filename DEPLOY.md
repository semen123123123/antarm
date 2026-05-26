# 🚀 Деплой Ant-Arm на Render + Vercel

## Быстрый старт (15 минут)

### 1. Backend (Render.com) — бесплатно
1. Идём на https://render.com и логинимся через GitHub
2. **New → Web Service → Build and deploy from a GitHub repository**
3. Выбираем репозиторий `ant-arm`
4. Настройки:
   - **Name**: `ant-arm-backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Нажимаем **Advanced → Add Environment Variable**:
   ```
   NODE_ENV=production
   JWT_SECRET=ant-arm-secret-2026-change-me
   ROBOKASSA_SHOP_ID=Ant_Arm
   ROBOKASSA_PASS_1=KI2QFOVr4X99TT7iCUDe
   ROBOKASSA_PASS_2=DLjrOVNoukYs9d4G11e9
   ROBOKASSA_TEST=false
   ```
6. Нажимаем **Create Web Service**
7. Ждём 2-3 минуты. Получаем URL: `https://ant-arm-backend.onrender.com`

### 2. Frontend (Vercel) — бесплатно
1. Идём на https://vercel.com и логинимся через GitHub
2. **Add New Project → Import Git Repository**
3. Выбираем `ant-arm`
4. **Framework Preset**: Vite
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`
7. Нажимаем **Environment Variables** и добавляем:
   ```
   VITE_API_URL=https://ant-arm-backend.onrender.com
   ```
8. Нажимаем **Deploy**
9. Получаем URL: `https://ant-arm.vercel.app`

### 3. Подключаем домен (antarm.ru)
1. В **Vercel** → Project Settings → Domains
2. Добавляем `antarm.ru`
3. В **reg.ru** DNS-записи:
   - Тип `CNAME`
   - Имя: `@`
   - Значение: `cname.vercel-dns.com`
4. Ждём 5-60 минут

### 4. Настраиваем RoboKassa
1. Идём в личный кабинет RoboKassa: https://partner.robokassa.ru/
2. Настройки магазина:
   - **Result URL**: `https://ant-arm-backend.onrender.com/api/payments/robokassa/result`
   - **Success URL**: `https://antarm.ru/success`
   - **Fail URL**: `https://antarm.ru/cart`
   - Метод: `POST` (для Result URL), `GET` (для Success/Fail)
3. Сохраняем

---

## 📁 Файлы для деплоя

| Файл | Назначение |
|------|-----------|
| `render.yaml` | Конфиг для Render.com (можно использовать при импорте) |
| `vercel.json` | SPA-роутинг для Vercel |
| `.env.example` | Шаблон переменных окружения |

## ⚠️ Важно

- **SQLite** на Render: данные сохраняются на диске, но при перезапуске (Free план спит) — всё остаётся, т.к. диск персистентный
- **Images**: фото товаров лежат в `public/img/` — они попадут в билд Vercel
- **RoboKassa**: убедитесь что `ROBOKASSA_TEST=false` для реальных платежей

## 🔄 Обновление сайта

1. Делаете `git push` в репозиторий
2. **Render** и **Vercel** автоматически пересоберут и задеплоят
3. Никаких ручных загрузок архивов!
