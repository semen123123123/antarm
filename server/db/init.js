import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, '..', 'data', 'antarm.db');
const SCHEMA_PATH = join(__dirname, 'schema.sql');

// Ensure data directory exists
const dataDir = join(__dirname, '..', 'data');
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

// Delete existing DB to re-seed
if (existsSync(DB_PATH)) {
  const fs = await import('fs');
  fs.unlinkSync(DB_PATH);
  console.log('🗑️  Existing database removed');
}

const db = new Database(DB_PATH);

// Enable WAL mode and foreign keys
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Run schema
const schema = readFileSync(SCHEMA_PATH, 'utf-8');
db.exec(schema);
console.log('📋 Schema applied');

// ---- Seed Users (admin only) ----
const users = [
  { email: 'admin@antarm.ru', password: 'admin123', role: 'admin', name: 'Администратор' },
];

const insertUser = db.prepare('INSERT INTO users (email, password_hash, role, name) VALUES (?, ?, ?, ?)');
const insertUsers = db.transaction((usrs) => {
  for (const u of usrs) {
    const hash = bcrypt.hashSync(u.password, 10);
    insertUser.run(u.email, hash, u.role, u.name);
  }
});
insertUsers(users);
console.log(`👤 ${users.length} user(s) seeded (admin only)`);

// ---- Seed Categories ----
const categories = [
  { id: 1, name: 'Бронежилеты', slug: 'bronezhilety', icon: '🛡️', count: 4 },
  { id: 2, name: 'Разгрузочные системы', slug: 'razgruzochnye-sistemy', icon: '🎒', count: 3 },
  { id: 3, name: 'Подсумки', slug: 'podsumki', icon: '📦', count: 3 },
  { id: 4, name: 'Рюкзаки и сумки', slug: 'ryukzaki-i-sumki', icon: '🎒', count: 3 },
  { id: 5, name: 'Ремни оружейные', slug: 'remni-oruzheynye', icon: '🔗', count: 2 },
  { id: 6, name: 'Аксессуары', slug: 'aksessuary', icon: '🔧', count: 2 },
];

const insertCat = db.prepare('INSERT INTO categories (id, name, slug, icon, count) VALUES (?, ?, ?, ?, ?)');
const insertCatMany = db.transaction((cats) => {
  for (const c of cats) insertCat.run(c.id, c.name, c.slug, c.icon, c.count);
});
insertCatMany(categories);
console.log(`📂 ${categories.length} categories seeded`);

// ---- Seed Products ----
const products = [
  {
    id: 1, name: 'Бронежилет ANT ARM TV-102', slug: 'tv-102', categoryId: 1,
    price: 12900, oldPrice: 15900, sku: 'ANT-TV102',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=TV-102',
    description: 'Тактический бронежилет с возможностью установки дополнительных модулей защиты. Изготовлен из высокопрочного нейлона 1000D. Подходит для использования в полевых условиях.',
    inStock: true, rating: 4.8, reviews: 24,
    season: 'Всесезон', material: 'Нейлон 1000D', brand: 'ANT ARM',
    protectionClass: 'Бр3', sizes: ['S','M','L','XL'], colors: ['Олива','Койот','Чёрный'],
    badges: JSON.stringify(['Хит','Акция']), tags: JSON.stringify(['бронежилет','тактика','защита']),
    isLicensed: true,
    seoTitle: 'Бронежилет ANT ARM TV-102 — купить тактический бронежилет',
    seoDescription: 'Тактический бронежилет TV-102, класс защиты Бр3. Нейлон 1000D, MOLLE. Доставка по России.',
    specs: [
      { key: 'Материал', value: 'Нейлон 1000D' },
      { key: 'Класс защиты', value: 'Бр3 (ГОСТ Р 50744-95)' },
      { key: 'Вес', value: '4.2 кг' },
      { key: 'Размеры', value: 'S, M, L, XL' },
      { key: 'Цвет', value: 'Олива, Койот, Чёрный' },
    ],
  },
  {
    id: 2, name: 'Бронежилет ANT ARM TV-201', slug: 'tv-201', categoryId: 1,
    price: 18500, oldPrice: null, sku: 'ANT-TV201',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=TV-201',
    description: 'Усиленный бронежилет с увеличенной площадью защиты. Встроенные карманы для дополнительных бронепанелей. Система MOLLE для навески подсумков.',
    inStock: true, rating: 4.9, reviews: 18,
    season: 'Всесезон', material: 'Нейлон 1000D + Cordura', brand: 'ANT ARM',
    protectionClass: 'Бр4', sizes: ['M','L','XL'], colors: ['Олива','Койот'],
    badges: JSON.stringify(['Новинка']), tags: JSON.stringify(['бронежилет','усиленный','MOLLE']),
    isLicensed: true,
    seoTitle: 'Бронежилет ANT ARM TV-201 — усиленный, класс Бр4',
    seoDescription: 'Усиленный бронежилет TV-201, класс защиты Бр4. Увеличенная площадь защиты, MOLLE.',
    specs: [
      { key: 'Материал', value: 'Нейлон 1000D + Cordura' },
      { key: 'Класс защиты', value: 'Бр4 (ГОСТ Р 50744-95)' },
      { key: 'Вес', value: '5.8 кг' },
      { key: 'Размеры', value: 'M, L, XL' },
      { key: 'Цвет', value: 'Олива, Койот' },
    ],
  },
  {
    id: 3, name: 'Бронежилет ANT ARM TV-300', slug: 'tv-300', categoryId: 1,
    price: 24900, oldPrice: 28900, sku: 'ANT-TV300',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=TV-300',
    description: 'Штурмовой бронежилет для специальных операций. Максимальная защита торса и плеч. Быстросбросная система.',
    inStock: true, rating: 5.0, reviews: 12,
    season: 'Всесезон', material: 'Cordura 1000D', brand: 'ANT ARM',
    protectionClass: 'Бр5', sizes: ['M','L','XL','XXL'], colors: ['Чёрный','Олива'],
    badges: JSON.stringify(['Хит']), tags: JSON.stringify(['бронежилет','штурмовой','спецоперации']),
    isLicensed: true,
    seoTitle: 'Бронежилет ANT ARM TV-300 — штурмовой, класс Бр5',
    seoDescription: 'Штурмовой бронежилет TV-300, максимальная защита. Быстросбросная система.',
    specs: [
      { key: 'Материал', value: 'Cordura 1000D' },
      { key: 'Класс защиты', value: 'Бр5 (ГОСТ Р 50744-95)' },
      { key: 'Вес', value: '7.1 кг' },
      { key: 'Размеры', value: 'M, L, XL, XXL' },
      { key: 'Цвет', value: 'Чёрный, Олива' },
    ],
  },
  {
    id: 4, name: 'Бронежилет ANT ARM TV-50', slug: 'tv-50', categoryId: 1,
    price: 8900, oldPrice: null, sku: 'ANT-TV50',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=TV-50',
    description: 'Лёгкий скрытый бронежилет для повседневного ношения. Минимальная заметность под одеждой.',
    inStock: false, rating: 4.5, reviews: 31,
    season: 'Всесезон', material: 'Нейлон 600D', brand: 'ANT ARM',
    protectionClass: 'Бр2', sizes: ['S','M','L','XL'], colors: ['Чёрный'],
    badges: JSON.stringify([]), tags: JSON.stringify(['бронежилет','скрытый','лёгкий']),
    isLicensed: true,
    seoTitle: 'Бронежилет ANT ARM TV-50 — скрытый, лёгкий, класс Бр2',
    seoDescription: 'Лёгкий скрытый бронежилет TV-50 для повседневного ношения.',
    specs: [
      { key: 'Материал', value: 'Нейлон 600D' },
      { key: 'Класс защиты', value: 'Бр2 (ГОСТ Р 50744-95)' },
      { key: 'Вес', value: '2.8 кг' },
      { key: 'Размеры', value: 'S, M, L, XL' },
      { key: 'Цвет', value: 'Чёрный' },
    ],
  },
  {
    id: 5, name: 'Разгрузка ANT ARM RL-10', slug: 'rl-10', categoryId: 2,
    price: 5900, oldPrice: 7200, sku: 'ANT-RL10',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=RL-10',
    description: 'Разгрузочный жилет с 8 подсумками для магазинов АК. Регулируемые лямки, система MOLLE.',
    inStock: true, rating: 4.6, reviews: 42,
    specs: [
      { key: 'Материал', value: 'Нейлон 1000D' },
      { key: 'Подсумки', value: '8 x АК' },
      { key: 'Вес', value: '1.2 кг' },
      { key: 'Размеры', value: 'Универсальный (регулируемый)' },
      { key: 'Цвет', value: 'Олива, Койот, Мультикам' },
    ],
  },
  {
    id: 6, name: 'Разгрузка ANT ARM RL-20', slug: 'rl-20', categoryId: 2,
    price: 7400, oldPrice: null, sku: 'ANT-RL20',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=RL-20',
    description: 'Разгрузочная система с интегрированным поясом. 12 подсумков, карман для рации, медицинский отсек.',
    inStock: true, rating: 4.7, reviews: 28,
    specs: [
      { key: 'Материал', value: 'Cordura 1000D' },
      { key: 'Подсумки', value: '12 (АК/AR-15)' },
      { key: 'Вес', value: '1.8 кг' },
      { key: 'Размеры', value: 'M, L, XL' },
      { key: 'Цвет', value: 'Олива, Койот' },
    ],
  },
  {
    id: 7, name: 'Разгрузка ANT ARM RL-5', slug: 'rl-5', categoryId: 2,
    price: 3900, oldPrice: null, sku: 'ANT-RL5',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=RL-5',
    description: 'Лёгкая разгрузка для тренировок и страйкбола. 4 подсумка, минимальный вес.',
    inStock: true, rating: 4.3, reviews: 56,
    specs: [
      { key: 'Материал', value: 'Нейлон 600D' },
      { key: 'Подсумки', value: '4 x АК' },
      { key: 'Вес', value: '0.6 кг' },
      { key: 'Размеры', value: 'Универсальный' },
      { key: 'Цвет', value: 'Олива, Койот, Чёрный' },
    ],
  },
  {
    id: 8, name: 'Подсумок ANT ARM PS-1', slug: 'ps-1', categoryId: 3,
    price: 1200, oldPrice: null, sku: 'ANT-PS1',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=PS-1',
    description: 'Универсальный подсумок для магазинов АК. Крепление MOLLE.',
    inStock: true, rating: 4.4, reviews: 67,
    specs: [
      { key: 'Материал', value: 'Нейлон 1000D' },
      { key: 'Вместимость', value: '2 x АК' },
      { key: 'Вес', value: '0.15 кг' },
      { key: 'Цвет', value: 'Олива, Койот, Чёрный' },
    ],
  },
  {
    id: 9, name: 'Подсумок ANT ARM PS-2', slug: 'ps-2', categoryId: 3,
    price: 1500, oldPrice: 1800, sku: 'ANT-PS2',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=PS-2',
    description: 'Подсумок для аптечки IFAK. Быстрый доступ, отстёгивающаяся крышка.',
    inStock: true, rating: 4.6, reviews: 34,
    specs: [
      { key: 'Материал', value: 'Cordura 500D' },
      { key: 'Вместимость', value: 'IFAK стандарт' },
      { key: 'Вес', value: '0.2 кг' },
      { key: 'Цвет', value: 'Олива, Койот' },
    ],
  },
  {
    id: 10, name: 'Подсумок ANT ARM PS-3', slug: 'ps-3', categoryId: 3,
    price: 900, oldPrice: null, sku: 'ANT-PS3',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=PS-3',
    description: 'Подсумок для гранаты. Эластичная фиксация, крепление MOLLE.',
    inStock: true, rating: 4.2, reviews: 21,
    specs: [
      { key: 'Материал', value: 'Нейлон 1000D' },
      { key: 'Совместимость', value: 'РГО, Ф-1, M67' },
      { key: 'Вес', value: '0.1 кг' },
      { key: 'Цвет', value: 'Олива, Койот, Чёрный' },
    ],
  },
  {
    id: 11, name: 'Рюкзак ANT ARM RK-30', slug: 'rk-30', categoryId: 4,
    price: 6500, oldPrice: 7800, sku: 'ANT-RK30',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=RK-30',
    description: 'Тактический рюкзак 30 литров. Система MOLLE, каркасная спинка, гидратор.',
    inStock: true, rating: 4.7, reviews: 45,
    specs: [
      { key: 'Материал', value: 'Cordura 1000D' },
      { key: 'Объём', value: '30 литров' },
      { key: 'Вес', value: '1.4 кг' },
      { key: 'Цвет', value: 'Олива, Койот, Чёрный' },
    ],
  },
  {
    id: 12, name: 'Рюкзак ANT ARM RK-45', slug: 'rk-45', categoryId: 4,
    price: 8900, oldPrice: null, sku: 'ANT-RK45',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=RK-45',
    description: 'Рюкзак для длительных выходов. 45 литров, анатомическая подвеска, дождевик в комплекте.',
    inStock: true, rating: 4.8, reviews: 33,
    specs: [
      { key: 'Материал', value: 'Cordura 1000D' },
      { key: 'Объём', value: '45 литров' },
      { key: 'Вес', value: '2.1 кг' },
      { key: 'Цвет', value: 'Олива, Койот' },
    ],
  },
  {
    id: 13, name: 'Сумка ANT ARM SM-10', slug: 'sm-10', categoryId: 4,
    price: 3200, oldPrice: null, sku: 'ANT-SM10',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=SM-10',
    description: 'Поясная сумка для документов и мелочей. 3 отделения, MOLLE.',
    inStock: true, rating: 4.3, reviews: 28,
    specs: [
      { key: 'Материал', value: 'Нейлон 600D' },
      { key: 'Объём', value: '2 литра' },
      { key: 'Вес', value: '0.3 кг' },
      { key: 'Цвет', value: 'Олива, Койот, Чёрный' },
    ],
  },
  {
    id: 14, name: 'Ремень оружейный ANT ARM RO-1', slug: 'ro-1', categoryId: 5,
    price: 1800, oldPrice: null, sku: 'ANT-RO1',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=RO-1',
    description: 'Двухточечный ремень для автомата. Быстрая регулировка, антипроскальзывающая пряжка.',
    inStock: true, rating: 4.5, reviews: 52,
    specs: [
      { key: 'Материал', value: 'Нейлон 1000D' },
      { key: 'Длина', value: '80-120 см' },
      { key: 'Вес', value: '0.25 кг' },
      { key: 'Цвет', value: 'Олива, Койот, Чёрный' },
    ],
  },
  {
    id: 15, name: 'Ремень оружейный ANT ARM RO-2', slug: 'ro-2', categoryId: 5,
    price: 2400, oldPrice: 2800, sku: 'ANT-RO2',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=RO-2',
    description: 'Трёхточечный ремень с амортизатором. Для динамичных операций.',
    inStock: true, rating: 4.7, reviews: 19,
    specs: [
      { key: 'Материал', value: 'Cordura 1000D' },
      { key: 'Длина', value: '90-140 см' },
      { key: 'Вес', value: '0.35 кг' },
      { key: 'Цвет', value: 'Чёрный, Олива' },
    ],
  },
  {
    id: 16, name: 'Перчатки ANT ARM PG-1', slug: 'pg-1', categoryId: 6,
    price: 1500, oldPrice: null, sku: 'ANT-PG1',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=PG-1',
    description: 'Тактические перчатки с защитой костяшек. Сенсорные кончики.',
    inStock: true, rating: 4.4, reviews: 73,
    specs: [
      { key: 'Материал', value: 'Синтетическая кожа + нейлон' },
      { key: 'Размеры', value: 'S, M, L, XL' },
      { key: 'Цвет', value: 'Чёрный, Койот' },
    ],
  },
  {
    id: 17, name: 'Налобный фонарь ANT ARM FL-1', slug: 'fl-1', categoryId: 6,
    price: 2200, oldPrice: 2600, sku: 'ANT-FL1',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=FL-1',
    description: 'LED фонарь 500 люмен. 3 режима, ИК-фильтр, крепление на шлем.',
    inStock: true, rating: 4.6, reviews: 41,
    specs: [
      { key: 'Мощность', value: '500 люмен' },
      { key: 'Режимы', value: '3 + ИК' },
      { key: 'Питание', value: '2 x CR123A' },
      { key: 'Вес', value: '0.12 кг' },
    ],
  },
];

const insertProduct = db.prepare(`
  INSERT INTO products (id, name, slug, category_id, price, old_price, sku, image, description,
    in_stock, rating, reviews, season, material, brand, protection_class, sizes, colors,
    badges, tags, seo_title, seo_description, is_licensed)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
const insertSpec = db.prepare('INSERT INTO product_specs (product_id, key, value) VALUES (?, ?, ?)');

const seedProducts = db.transaction((prods) => {
  for (const p of prods) {
    insertProduct.run(
      p.id, p.name, p.slug, p.categoryId, p.price, p.oldPrice,
      p.sku, p.image, p.description, p.inStock ? 1 : 0, p.rating, p.reviews,
      p.season || null, p.material || null, p.brand || 'ANT ARM',
      p.protectionClass || null,
      p.sizes ? JSON.stringify(p.sizes) : null,
      p.colors ? JSON.stringify(p.colors) : null,
      p.badges || '[]', p.tags || '[]',
      p.seoTitle || null, p.seoDescription || null,
      p.isLicensed ? 1 : 0,
    );
    for (const s of p.specs) {
      insertSpec.run(p.id, s.key, s.value);
    }
  }
});
seedProducts(products);
console.log(`📦 ${products.length} products seeded with specs`);

// ---- Seed Sample Orders ----
const orders = [
  {
    customer_name: 'Иванов Иван',
    customer_email: 'ivanov@mail.ru',
    customer_phone: '+7 (999) 123-45-67',
    delivery_method: 'courier',
    delivery_address: 'Москва, ул. Ленина, д. 10, кв. 5',
    delivery_cost: 0,
    payment_method: 'online',
    items: JSON.stringify([
      { product_id: 1, product_name: 'Бронежилет ANT ARM TV-102', quantity: 1, price: 12900, size: 'L' },
      { product_id: 8, product_name: 'Подсумок ANT ARM PS-1', quantity: 2, price: 1200, size: null },
    ]),
    subtotal: 15300,
    total: 15300,
    status: 'новый',
    comment: '',
    tracking_number: '',
  },
  {
    customer_name: 'Петров Сергей',
    customer_email: 'petrov@gmail.com',
    customer_phone: '+7 (916) 555-33-22',
    delivery_method: 'cdek',
    delivery_address: 'СПб, Невский пр., д. 25',
    delivery_cost: 350,
    payment_method: 'sbp',
    items: JSON.stringify([
      { product_id: 11, product_name: 'Рюкзак ANT ARM RK-30', quantity: 1, price: 6500, size: null },
    ]),
    subtotal: 6500,
    total: 6850,
    status: 'в обработке',
    comment: '',
    tracking_number: '',
  },
  {
    customer_name: 'Сидорова Анна',
    customer_email: 'sidorova@yandex.ru',
    customer_phone: '+7 (903) 777-11-44',
    delivery_method: 'courier',
    delivery_address: 'Казань, ул. Баумана, д. 5',
    delivery_cost: 500,
    payment_method: 'online',
    items: JSON.stringify([
      { product_id: 2, product_name: 'Бронежилет ANT ARM TV-201', quantity: 1, price: 18500, size: 'M' },
      { product_id: 14, product_name: 'Ремень оружейный ANT ARM RO-1', quantity: 1, price: 1800, size: null },
    ]),
    subtotal: 20300,
    total: 20800,
    status: 'подтверждён',
    comment: 'Позвонить перед доставкой',
    tracking_number: '',
  },
  {
    customer_name: 'Козлов Дмитрий',
    customer_email: 'kozlov@mail.ru',
    customer_phone: '+7 (925) 888-66-55',
    delivery_method: 'pochta',
    delivery_address: 'Новосибирск, ул. Красный проспект, д. 50',
    delivery_cost: 250,
    payment_method: 'cash',
    items: JSON.stringify([
      { product_id: 5, product_name: 'Разгрузка ANT ARM RL-10', quantity: 1, price: 5900, size: null },
      { product_id: 16, product_name: 'Перчатки ANT ARM PG-1', quantity: 1, price: 1500, size: 'XL' },
    ]),
    subtotal: 7400,
    total: 7650,
    status: 'отправлен',
    comment: '',
    tracking_number: 'СДЭК-1234567890',
  },
  {
    customer_name: 'Морозова Елена',
    customer_email: 'morozova@gmail.com',
    customer_phone: '+7 (977) 444-22-11',
    delivery_method: 'pickup',
    delivery_address: '',
    delivery_cost: 0,
    payment_method: 'online',
    items: JSON.stringify([
      { product_id: 3, product_name: 'Бронежилет ANT ARM TV-300', quantity: 1, price: 24900, size: 'L' },
    ]),
    subtotal: 24900,
    total: 24900,
    status: 'доставлен',
    comment: '',
    tracking_number: '',
  },
];

const insertOrder = db.prepare(`
  INSERT INTO orders (customer_name, customer_email, customer_phone,
    delivery_method, delivery_address, delivery_cost, payment_method,
    items, subtotal, total, status, comment, tracking_number)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
const seedOrders = db.transaction((ords) => {
  for (const o of ords) {
    const result = insertOrder.run(
      o.customer_name, o.customer_email, o.customer_phone,
      o.delivery_method, o.delivery_address, o.delivery_cost, o.payment_method,
      o.items, o.subtotal, o.total, o.status, o.comment, o.tracking_number,
    );

    // Insert order_items
    const items = JSON.parse(o.items);
    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name, quantity, price, size)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    for (const item of items) {
      insertItem.run(result.lastInsertRowid, item.product_id, item.product_name, item.quantity, item.price, item.size);
    }

    // Insert status history
    const insertHistory = db.prepare(`
      INSERT INTO order_status_history (order_id, old_status, new_status, changed_by)
      VALUES (?, NULL, ?, 1)
    `);
    insertHistory.run(result.lastInsertRowid, o.status);
  }
});
seedOrders(orders);
console.log(`📋 ${orders.length} sample orders seeded`);

// ---- Seed Blog Posts ----
const blogPosts = [
  {
    title: 'Как выбрать бронежилет: полное руководство',
    slug: 'kak-vybrat-bronezhilet',
    content: '<p>Выбор бронежилета — ответственная задача. В этой статье мы разберём классы защиты, материалы и сценарии использования.</p>',
    excerpt: 'Полное руководство по выбору бронежилета для различных задач.',
    category: 'Гайды',
    authorId: 1,
    published: true,
    seoTitle: 'Как выбрать бронежилет — руководство ANT ARM',
    seoDescription: 'Разбираем классы защиты, материалы и критерии выбора бронежилета.',
  },
  {
    title: 'Уход за тактической одеждой: 5 правил',
    slug: 'ukhod-za-takticheskoy-odezhdoy',
    content: '<p>Правильный уход продлевает срок службы тактической экипировки. Вот 5 основных правил.</p>',
    excerpt: '5 правил ухода за тактической одеждой для максимального срока службы.',
    category: 'Советы',
    authorId: 1,
    published: true,
    seoTitle: 'Уход за тактической одеждой — 5 правил',
    seoDescription: 'Как правильно ухаживать за тактической одеждой и экипировкой.',
  },
];

const insertBlog = db.prepare(`
  INSERT INTO blog_posts (title, slug, content, excerpt, category, author_id, published, seo_title, seo_description)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
for (const post of blogPosts) {
  insertBlog.run(post.title, post.slug, post.content, post.excerpt, post.category, post.authorId, post.published ? 1 : 0, post.seoTitle, post.seoDescription);
}
console.log(`📝 ${blogPosts.length} blog posts seeded`);

// ---- Seed Pages ----
const pages = [
  { title: 'О компании', slug: 'about', content: '<p>ANT ARM — российский производитель тактического снаряжения.</p>', published: true },
  { title: 'Доставка и оплата', slug: 'delivery', content: '<p>Информация о доставке и способах оплаты.</p>', published: true },
  { title: 'Гарантия и возврат', slug: 'warranty', content: '<p>Гарантия 2 года на все товары.</p>', published: true },
];

const insertPage = db.prepare(`
  INSERT INTO pages (title, slug, content, published) VALUES (?, ?, ?, ?)
`);
for (const page of pages) {
  insertPage.run(page.title, page.slug, page.content, page.published ? 1 : 0);
}
console.log(`📄 ${pages.length} pages seeded`);

// ---- Seed Settings ----
const settings = [
  { key: 'store_name', value: 'ANT ARM' },
  { key: 'store_phone', value: '+7 (800) 555-35-35' },
  { key: 'store_email', value: 'info@ant-arm.ru' },
  { key: 'store_address', value: 'Москва, ул. Тактическая, д. 1' },
  { key: 'store_hours', value: 'Пн-Пт: 9:00-18:00' },
  { key: 'free_shipping_threshold', value: '10000' },
  { key: 'loyalty_rate', value: '1' },
  { key: 'vat_rate', value: '20' },
];

const insertSetting = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
const seedSettings = db.transaction((s) => {
  for (const setting of s) insertSetting.run(setting.key, setting.value);
});
seedSettings(settings);
console.log(`⚙️ ${settings.length} settings seeded`);

// ---- Seed Sample Activity Logs ----
const insertLog = db.prepare(`
  INSERT INTO activity_logs (user_id, action, entity_type, entity_id, old_value, new_value, ip_address)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
const sampleLogs = [
  { userId: 1, action: 'create', entityType: 'product', entityId: 1, oldValue: null, newValue: 'Бронежилет ANT ARM TV-102', ip: '127.0.0.1' },
  { userId: 1, action: 'update', entityType: 'order', entityId: 1, oldValue: 'новый', newValue: 'в обработке', ip: '127.0.0.1' },
  { userId: 1, action: 'update', entityType: 'product', entityId: 3, oldValue: null, newValue: 'Цена изменена: 24900 → 22900', ip: '127.0.0.1' },
];
for (const log of sampleLogs) {
  insertLog.run(log.userId, log.action, log.entityType, log.entityId, log.oldValue, log.newValue, log.ip);
}
console.log(`📝 ${sampleLogs.length} activity logs seeded`);

db.close();
console.log('\n✅ Database seeded successfully!');
console.log('📍 Database location:', DB_PATH);
console.log('\n🔐 Credentials:');
console.log('   Admin:  admin@antarm.ru / admin123');
