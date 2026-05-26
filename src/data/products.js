// Иерархия категорий: parent_id = null для родительских групп
export const categories = [
  // ===== Родительские группы (parent_id: null) =====
  { id: 1,  name: 'Тактическое снаряжение',   slug: 'takticheskoe-snaryazhenie',  icon: '🛡️', parentId: null, count: 10 },
  { id: 2,  name: 'Охота — рыбалка, туризм',  slug: 'ohota-rybalka-turizm',       icon: '🏕️', parentId: null, count: 5 },
  { id: 3,  name: 'Зоотовары',                slug: 'zootovary',                  icon: '🐾', parentId: null, count: 4 },
  { id: 4,  name: 'Одежда',                   slug: 'odezhda',                    icon: '👕', parentId: null, count: 3 },

  // ===== Тактическое снаряжение =====
  { id: 11, name: 'Бронежилеты',                   slug: 'bronezhilety',             icon: '🛡️', parentId: 1, count: 4 },
  { id: 12, name: 'Подсумки под автоматные магазины', slug: 'podsumki-avtomat',     icon: '📦', parentId: 1, count: 1 },
  { id: 13, name: 'Подсумки под гранаты',          slug: 'podsumki-granaty',         icon: '📦', parentId: 1, count: 1 },
  { id: 14, name: 'Варбелты',                      slug: 'varbelty',                 icon: '🎒', parentId: 1, count: 3 },
  { id: 15, name: 'Органайзеры',                   slug: 'organizery',               icon: '🗃️', parentId: 1, count: 1 },
  { id: 16, name: 'Утилитарные подсумки',           slug: 'utilitarnye-podsumki',    icon: '📦', parentId: 1, count: 2 },
  { id: 17, name: 'Кап',                            slug: 'kap',                     icon: '🎭', parentId: 1, count: 1 },
  { id: 18, name: 'Бафы тактические',               slug: 'bafy-takticheskie',       icon: '🧣', parentId: 1, count: 1 },
  { id: 19, name: 'Аксессуары',                     slug: 'aksessuary',              icon: '🔧', parentId: 1, count: 4 },
  { id: 20, name: 'Рюкзаки',                        slug: 'ryukzaki',                icon: '🎒', parentId: 1, count: 3 },

  // ===== Охота — рыбалка, туризм =====
  { id: 21, name: 'Верхняя одежда',     slug: 'verhnyaya-odezhda',     icon: '🧥', parentId: 2, count: 1 },
  { id: 22, name: 'Палатки',            slug: 'palatki',               icon: '⛺', parentId: 2, count: 1 },
  { id: 23, name: 'Оружейные чехлы',    slug: 'oruzheynye-chekhly',    icon: '🔫', parentId: 2, count: 1 },
  { id: 24, name: 'Аксессуары',         slug: 'aksessuary-ohota',      icon: '🔧', parentId: 2, count: 1 },
  { id: 25, name: 'Рюкзаки',            slug: 'ryukzaki-ohota',        icon: '🎒', parentId: 2, count: 1 },

  // ===== Зоотовары =====
  { id: 31, name: 'Прогулочные аксессуары', slug: 'progulochnye-aksessuary',  icon: '🦮', parentId: 3, count: 1 },
  { id: 32, name: 'Одежда летняя',          slug: 'odezhda-letnyaya',          icon: '👗', parentId: 3, count: 1 },
  { id: 33, name: 'Одежда зимняя',          slug: 'odezhda-zimnyaya',          icon: '🧥', parentId: 3, count: 1 },
  { id: 34, name: 'Одежда демисезонная',    slug: 'odezhda-demisezonnaya',     icon: '🧥', parentId: 3, count: 1 },

  // ===== Одежда =====
  { id: 41, name: 'Верхняя одежда', slug: 'verhnyaya-odezhda-obshchaya', icon: '🧥', parentId: 4, count: 1 },
  { id: 42, name: 'Брюки',          slug: 'bryuki',                       icon: '👖', parentId: 4, count: 1 },
  { id: 43, name: 'Обувь',          slug: 'obuv',                         icon: '👟', parentId: 4, count: 1 },
];

export const parentCategories = categories.filter(c => c.parentId === null);
export const subCategories = categories.filter(c => c.parentId !== null);

export function getSubcategories(parentId) {
  return categories.filter(c => c.parentId === parentId);
}

export function getParentCategory(categoryId) {
  const cat = categories.find(c => c.id === categoryId);
  if (!cat) return null;
  if (cat.parentId === null) return cat;
  return categories.find(c => c.id === cat.parentId) || null;
}

// ===== Товары =====
export const products = [
  // ===== Бронежилеты (id 11) =====
  {
    id: 1,
    name: 'Бронежилет ANT ARM TV-102',
    slug: 'tv-102',
    categoryId: 11,
    price: 12900,
    oldPrice: 15900,
    sku: 'ANT-TV102',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=TV-102',
    description: 'Тактический бронежилет с возможностью установки дополнительных модулей защиты. Изготовлен из высокопрочного нейлона 1000D. Подходит для использования в полевых условиях.',
    specs: [
      { key: 'Материал', value: 'Нейлон 1000D' },
      { key: 'Класс защиты', value: 'Бр3 (ГОСТ Р 50744-95)' },
      { key: 'Вес', value: '4.2 кг' },
      { key: 'Размеры', value: 'S, M, L, XL' },
      { key: 'Цвет', value: 'Олива, Койот, Чёрный' },
    ],
    inStock: true,
    rating: 4.8,
    reviews: 24,
  },
  {
    id: 2,
    name: 'Бронежилет ANT ARM TV-201',
    slug: 'tv-201',
    categoryId: 11,
    price: 18500,
    oldPrice: null,
    sku: 'ANT-TV201',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=TV-201',
    description: 'Усиленный бронежилет с увеличенной площадью защиты. Встроенные карманы для дополнительных бронепанелей. Система MOLLE для навески подсумков.',
    specs: [
      { key: 'Материал', value: 'Нейлон 1000D + Cordura' },
      { key: 'Класс защиты', value: 'Бр4 (ГОСТ Р 50744-95)' },
      { key: 'Вес', value: '5.8 кг' },
      { key: 'Размеры', value: 'M, L, XL' },
      { key: 'Цвет', value: 'Олива, Койот' },
    ],
    inStock: true,
    rating: 4.9,
    reviews: 18,
  },
  {
    id: 3,
    name: 'Бронежилет ANT ARM TV-300',
    slug: 'tv-300',
    categoryId: 11,
    price: 24900,
    oldPrice: 28900,
    sku: 'ANT-TV300',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=TV-300',
    description: 'Штурмовой бронежилет для специальных операций. Максимальная защита торса и плеч. Быстросбросная система.',
    specs: [
      { key: 'Материал', value: 'Cordura 1000D' },
      { key: 'Класс защиты', value: 'Бр5 (ГОСТ Р 50744-95)' },
      { key: 'Вес', value: '7.1 кг' },
      { key: 'Размеры', value: 'M, L, XL, XXL' },
      { key: 'Цвет', value: 'Чёрный, Олива' },
    ],
    inStock: true,
    rating: 5.0,
    reviews: 12,
  },
  {
    id: 4,
    name: 'Бронежилет ANT ARM TV-50',
    slug: 'tv-50',
    categoryId: 11,
    price: 8900,
    oldPrice: null,
    sku: 'ANT-TV50',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=TV-50',
    description: 'Лёгкий скрытый бронежилет для повседневного ношения. Минимальная заметность под одеждой.',
    specs: [
      { key: 'Материал', value: 'Нейлон 600D' },
      { key: 'Класс защиты', value: 'Бр2 (ГОСТ Р 50744-95)' },
      { key: 'Вес', value: '2.8 кг' },
      { key: 'Размеры', value: 'S, M, L, XL' },
      { key: 'Цвет', value: 'Чёрный' },
    ],
    inStock: false,
    rating: 4.5,
    reviews: 31,
  },

  // ===== Варбелты (id 14) — бывшие разгрузочные системы =====
  {
    id: 5,
    name: 'Разгрузка ANT ARM RL-10',
    slug: 'rl-10',
    categoryId: 14,
    price: 5900,
    oldPrice: 7200,
    sku: 'ANT-RL10',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=RL-10',
    description: 'Разгрузочный жилет с 8 подсумками для магазинов АК. Регулируемые лямки, система MOLLE.',
    specs: [
      { key: 'Материал', value: 'Нейлон 1000D' },
      { key: 'Подсумки', value: '8 x АК' },
      { key: 'Вес', value: '1.2 кг' },
      { key: 'Размеры', value: 'Универсальный (регулируемый)' },
      { key: 'Цвет', value: 'Олива, Койот, Мультикам' },
    ],
    inStock: true,
    rating: 4.6,
    reviews: 42,
  },
  {
    id: 6,
    name: 'Разгрузка ANT ARM RL-20',
    slug: 'rl-20',
    categoryId: 14,
    price: 7400,
    oldPrice: null,
    sku: 'ANT-RL20',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=RL-20',
    description: 'Разгрузочная система с интегрированным поясом. 12 подсумков, карман для рации, медицинский отсек.',
    specs: [
      { key: 'Материал', value: 'Cordura 1000D' },
      { key: 'Подсумки', value: '12 (АК/AR-15)' },
      { key: 'Вес', value: '1.8 кг' },
      { key: 'Размеры', value: 'M, L, XL' },
      { key: 'Цвет', value: 'Олива, Койот' },
    ],
    inStock: true,
    rating: 4.7,
    reviews: 28,
  },
  {
    id: 7,
    name: 'Разгрузка ANT ARM RL-5',
    slug: 'rl-5',
    categoryId: 14,
    price: 3900,
    oldPrice: null,
    sku: 'ANT-RL5',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=RL-5',
    description: 'Лёгкая разгрузка для тренировок и страйкбола. 4 подсумка, минимальный вес.',
    specs: [
      { key: 'Материал', value: 'Нейлон 600D' },
      { key: 'Подсумки', value: '4 x АК' },
      { key: 'Вес', value: '0.6 кг' },
      { key: 'Размеры', value: 'Универсальный' },
      { key: 'Цвет', value: 'Чёрный, Олива' },
    ],
    inStock: true,
    rating: 4.3,
    reviews: 56,
  },

  // ===== Подсумки под автоматные магазины (id 12) =====
  {
    id: 8,
    name: 'Подсумок ANT ARM PM-1',
    slug: 'pm-1',
    categoryId: 12,
    price: 1200,
    oldPrice: null,
    sku: 'ANT-PM1',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=PM-1',
    description: 'Подсумок для 2 магазинов АК. Крепление MOLLE. Клапан на фастексе.',
    specs: [
      { key: 'Материал', value: 'Нейлон 1000D' },
      { key: 'Вместимость', value: '2 магазина АК' },
      { key: 'Вес', value: '0.15 кг' },
      { key: 'Крепление', value: 'MOLLE' },
      { key: 'Цвет', value: 'Олива, Койот, Чёрный' },
    ],
    inStock: true,
    rating: 4.4,
    reviews: 67,
  },

  // ===== Утилитарные подсумки (id 16) =====
  {
    id: 9,
    name: 'Подсумок медицинский ANT ARM PM-MED',
    slug: 'pm-med',
    categoryId: 16,
    price: 2400,
    oldPrice: 2900,
    sku: 'ANT-PMMED',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=PM-MED',
    description: 'Медицинский подсумок IFAK. Отделение для турникета, бинтов, ножниц. Красный крест.',
    specs: [
      { key: 'Материал', value: 'Нейлон 1000D' },
      { key: 'Объём', value: '3 литра' },
      { key: 'Вес', value: '0.2 кг' },
      { key: 'Крепление', value: 'MOLLE + Velcro' },
      { key: 'Цвет', value: 'Олива, Койот, Мультикам' },
    ],
    inStock: true,
    rating: 4.8,
    reviews: 34,
  },
  {
    id: 10,
    name: 'Подсумок для рации ANT ARM PM-RADIO',
    slug: 'pm-radio',
    categoryId: 16,
    price: 1800,
    oldPrice: null,
    sku: 'ANT-PMRADIO',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=PM-RADIO',
    description: 'Подсумок для портативной рации. Регулируемый клапан, антенный порт.',
    specs: [
      { key: 'Материал', value: 'Нейлон 1000D' },
      { key: 'Совместимость', value: 'Baofeng, Motorola, Kenwood' },
      { key: 'Вес', value: '0.12 кг' },
      { key: 'Крепление', value: 'MOLLE' },
      { key: 'Цвет', value: 'Олива, Чёрный' },
    ],
    inStock: true,
    rating: 4.2,
    reviews: 19,
  },

  // ===== Рюкзаки (id 20) =====
  {
    id: 11,
    name: 'Рюкзак ANT ARM RK-30',
    slug: 'rk-30',
    categoryId: 20,
    price: 6900,
    oldPrice: 8400,
    sku: 'ANT-RK30',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=RK-30',
    description: 'Тактический рюкзак 30 литров. Отделение для гидратора, MOLLE, анатомическая спинка.',
    specs: [
      { key: 'Материал', value: 'Cordura 1000D' },
      { key: 'Объём', value: '30 литров' },
      { key: 'Вес', value: '1.4 кг' },
      { key: 'Гидратор', value: 'Да (отделение + порт)' },
      { key: 'Цвет', value: 'Олива, Койот, Чёрный' },
    ],
    inStock: true,
    rating: 4.7,
    reviews: 45,
  },
  {
    id: 12,
    name: 'Рюкзак ANT ARM RK-50',
    slug: 'rk-50',
    categoryId: 20,
    price: 9900,
    oldPrice: null,
    sku: 'ANT-RK50',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=RK-50',
    description: 'Экспедиционный рюкзак 50 литров. Каркасная спинка, поясной ремень, дождевик в комплекте.',
    specs: [
      { key: 'Материал', value: 'Cordura 1000D' },
      { key: 'Объём', value: '50 литров' },
      { key: 'Вес', value: '2.1 кг' },
      { key: 'Каркас', value: 'Алюминиевые вставки' },
      { key: 'Цвет', value: 'Олива, Койот' },
    ],
    inStock: true,
    rating: 4.9,
    reviews: 22,
  },
  {
    id: 13,
    name: 'Сумка ANT ARM RK-BAG',
    slug: 'rk-bag',
    categoryId: 20,
    price: 4200,
    oldPrice: null,
    sku: 'ANT-RKBAG',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=RK-BAG',
    description: 'Тактическая сумка через плечо. 3 отделения, MOLLE, регулируемый ремень.',
    specs: [
      { key: 'Материал', value: 'Нейлон 1000D' },
      { key: 'Объём', value: '10 литров' },
      { key: 'Вес', value: '0.7 кг' },
      { key: 'Отделения', value: '3 основных' },
      { key: 'Цвет', value: 'Олива, Койот, Чёрный' },
    ],
    inStock: false,
    rating: 4.5,
    reviews: 38,
  },

  // ===== Аксессуары (id 19) =====
  {
    id: 14,
    name: 'Ремень оружейный ANT ARM RB-1',
    slug: 'rb-1',
    categoryId: 19,
    price: 2200,
    oldPrice: null,
    sku: 'ANT-RB1',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=RB-1',
    description: 'Двухточечный ремень для оружия. Быстрая регулировка длины, антивибрационная вставка.',
    specs: [
      { key: 'Материал', value: 'Нейлон + резина' },
      { key: 'Длина', value: '90-130 см' },
      { key: 'Вес', value: '0.25 кг' },
      { key: 'Крепление', value: 'Антабки 25мм' },
      { key: 'Цвет', value: 'Чёрный, Олива' },
    ],
    inStock: true,
    rating: 4.6,
    reviews: 29,
  },
  {
    id: 15,
    name: 'Ремень тактический ANT ARM RB-2',
    slug: 'rb-2',
    categoryId: 19,
    price: 3400,
    oldPrice: 4100,
    sku: 'ANT-RB2',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=RB-2',
    description: 'Тактический ремень с внутренней стропой для подсумков. Пряжка-фастекс.',
    specs: [
      { key: 'Материал', value: 'Нейлон 1000D' },
      { key: 'Ширина', value: '45 мм' },
      { key: 'Вес', value: '0.35 кг' },
      { key: 'Пряжка', value: 'Cobra-совместимая' },
      { key: 'Цвет', value: 'Чёрный, Олива, Койот' },
    ],
    inStock: true,
    rating: 4.8,
    reviews: 15,
  },
  {
    id: 16,
    name: 'Перчатки тактические ANT ARM GL-1',
    slug: 'gl-1',
    categoryId: 19,
    price: 1800,
    oldPrice: null,
    sku: 'ANT-GL1',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=GL-1',
    description: 'Тактические перчатки с защитой костяшек. Сенсорные кончики пальцев.',
    specs: [
      { key: 'Материал', value: 'Синтетическая кожа + нейлон' },
      { key: 'Защита', value: 'Костяшки, ладонь' },
      { key: 'Сенсорные', value: 'Да (указательный + большой)' },
      { key: 'Размеры', value: 'S, M, L, XL' },
      { key: 'Цвет', value: 'Чёрный, Койот' },
    ],
    inStock: true,
    rating: 4.4,
    reviews: 52,
  },
  {
    id: 17,
    name: 'Аптечка FIRST AID KIT ANT ARM MK-1',
    slug: 'mk-1',
    categoryId: 19,
    price: 4500,
    oldPrice: 5200,
    sku: 'ANT-MK1',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=MK-1',
    description: 'Индивидуальная аптечка. Турникет CAT, бандаж NAR, ножницы, перчатки, марлевые салфетки.',
    specs: [
      { key: 'Состав', value: 'CAT, NAR, ножницы, перчатки' },
      { key: 'Вес', value: '0.6 кг' },
      { key: 'Размер', value: '20 x 15 x 8 см' },
      { key: 'Сумка', value: 'Да (нейлон 1000D)' },
      { key: 'Цвет', value: 'Олива, Койот' },
    ],
    inStock: true,
    rating: 4.9,
    reviews: 41,
  },

  // ===== Подсумки под гранаты (id 13) =====
  {
    id: 18,
    name: 'Подсумок для гранат ANT ARM PM-GRENADE',
    slug: 'pm-grenade',
    categoryId: 13,
    price: 1800,
    oldPrice: null,
    sku: 'ANT-PMGRENADE',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=PM-GRENADE',
    description: 'Подсумок для 2 ручных гранат. Крепление MOLLE, клапан на липучке, дренажное отверстие.',
    specs: [
      { key: 'Материал', value: 'Нейлон 1000D' },
      { key: 'Вместимость', value: '2 гранаты Ф-1 / РГД-5' },
      { key: 'Вес', value: '0.1 кг' },
      { key: 'Крепление', value: 'MOLLE' },
      { key: 'Цвет', value: 'Олива, Койот' },
    ],
    inStock: true,
    rating: 4.3,
    reviews: 8,
  },

  // ===== Органайзеры (id 15) =====
  {
    id: 19,
    name: 'Органайзер тактический ANT ARM OR-1',
    slug: 'or-1',
    categoryId: 15,
    price: 2500,
    oldPrice: null,
    sku: 'ANT-OR1',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=OR-1',
    description: 'Тактический органайзер для мелочей. 6 отделений на липучке, крепление MOLLE сзади.',
    specs: [
      { key: 'Материал', value: 'Нейлон 600D' },
      { key: 'Отделения', value: '6 карманов' },
      { key: 'Вес', value: '0.08 кг' },
      { key: 'Размер', value: '20 x 12 x 3 см' },
      { key: 'Цвет', value: 'Чёрный, Олива' },
    ],
    inStock: true,
    rating: 4.5,
    reviews: 14,
  },

  // ===== Кап (id 17) =====
  {
    id: 20,
    name: 'Кап тактический ANT ARM CP-1',
    slug: 'cp-1',
    categoryId: 17,
    price: 1200,
    oldPrice: null,
    sku: 'ANT-CP1',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=CP-1',
    description: 'Тактический кап-платок из быстросохнущей ткани. Защита от солнца и ветра.',
    specs: [
      { key: 'Материал', value: 'Полиэстер 100%' },
      { key: 'Размер', value: 'Универсальный' },
      { key: 'Вес', value: '0.05 кг' },
      { key: 'Цвет', value: 'Олива, Чёрный, Койот, Мультикам' },
    ],
    inStock: true,
    rating: 4.1,
    reviews: 23,
  },

  // ===== Бафы тактические (id 18) =====
  {
    id: 21,
    name: 'Баф тактический ANT ARM BF-1',
    slug: 'bf-1',
    categoryId: 18,
    price: 800,
    oldPrice: null,
    sku: 'ANT-BF1',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=BF-1',
    description: 'Многофункциональный тактический баф. Можно носить как шарф, бандану или повязку.',
    specs: [
      { key: 'Материал', value: 'Микрофибра' },
      { key: 'Размер', value: '50 x 25 см' },
      { key: 'Вес', value: '0.03 кг' },
      { key: 'Цвет', value: 'Олива, Чёрный, Койот' },
    ],
    inStock: true,
    rating: 4.0,
    reviews: 31,
  },

  // ===== Верхняя одежда / Охота (id 21) =====
  {
    id: 22,
    name: 'Куртка охотничья ANT ARM HJ-1',
    slug: 'hj-1',
    categoryId: 21,
    price: 8900,
    oldPrice: 10900,
    sku: 'ANT-HJ1',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=HJ-1',
    description: 'Охотничья куртка из ветрозащитной ткани. Множество карманов, капюшон, светоотражающие элементы.',
    specs: [
      { key: 'Материал', value: 'Полиэстер Oxford 300D' },
      { key: 'Утеплитель', value: 'Отсутствует (демисезон)' },
      { key: 'Вес', value: '0.9 кг' },
      { key: 'Карманы', value: '8 наружных, 4 внутренних' },
      { key: 'Цвет', value: 'Хаки, Олива, Камуфляж' },
    ],
    inStock: true,
    rating: 4.6,
    reviews: 17,
  },

  // ===== Палатки (id 22) =====
  {
    id: 23,
    name: 'Палатка ANT ARM TP-2',
    slug: 'tp-2',
    categoryId: 22,
    price: 15900,
    oldPrice: null,
    sku: 'ANT-TP2',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=TP-2',
    description: 'Двухместная палатка с тамбуром. Водонепроницаемый тент, двойные швы, алюминиевые дуги.',
    specs: [
      { key: 'Материал', value: 'Polyester 210T + PU покрытие' },
      { key: 'Вместимость', value: '2 человека' },
      { key: 'Вес', value: '3.2 кг' },
      { key: 'Водостойкость', value: '5000 мм' },
      { key: 'Цвет', value: 'Зелёный, Олива' },
    ],
    inStock: true,
    rating: 4.7,
    reviews: 11,
  },

  // ===== Оружейные чехлы (id 23) =====
  {
    id: 24,
    name: 'Чехол оружейный ANT ARM GC-1',
    slug: 'gc-1',
    categoryId: 23,
    price: 3500,
    oldPrice: null,
    sku: 'ANT-GC1',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=GC-1',
    description: 'Чехол для переноски оружия. Мягкая подкладка, карман для магазинов, регулируемый ремень.',
    specs: [
      { key: 'Материал', value: 'Нейлон 600D' },
      { key: 'Длина', value: '120 см' },
      { key: 'Вес', value: '0.5 кг' },
      { key: 'Подкладка', value: 'Поролон 10 мм' },
      { key: 'Цвет', value: 'Олива, Чёрный' },
    ],
    inStock: true,
    rating: 4.4,
    reviews: 9,
  },

  // ===== Аксессуары / Охота (id 24) =====
  {
    id: 25,
    name: 'Нож охотничий ANT ARM HK-1',
    slug: 'hk-1',
    categoryId: 24,
    price: 2900,
    oldPrice: 3500,
    sku: 'ANT-HK1',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=HK-1',
    description: 'Охотничий нож из нержавеющей стали. Деревянная рукоять, кожаные ножны в комплекте.',
    specs: [
      { key: 'Материал клинка', value: 'Нержавеющая сталь 440C' },
      { key: 'Длина клинка', value: '12 см' },
      { key: 'Общая длина', value: '24 см' },
      { key: 'Твёрдость', value: '58 HRC' },
      { key: 'Ножны', value: 'Кожаные' },
    ],
    inStock: true,
    rating: 4.5,
    reviews: 26,
  },

  // ===== Рюкзаки / Охота (id 25) =====
  {
    id: 26,
    name: 'Рюкзак охотничий ANT ARM HR-1',
    slug: 'hr-1',
    categoryId: 25,
    price: 5500,
    oldPrice: null,
    sku: 'ANT-HR1',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=HR-1',
    description: 'Охотничий рюкзак 40 литров. Отделение для гидратора, крепления для снаряжения, поясной ремень.',
    specs: [
      { key: 'Материал', value: 'Polyester Oxford 600D' },
      { key: 'Объём', value: '40 литров' },
      { key: 'Вес', value: '1.1 кг' },
      { key: 'Гидратор', value: 'Да (до 3 л)' },
      { key: 'Цвет', value: 'Хаки, Олива' },
    ],
    inStock: true,
    rating: 4.3,
    reviews: 15,
  },

  // ===== Прогулочные аксессуары / Зоотовары (id 31) =====
  {
    id: 27,
    name: 'Поводок светоотражающий ANT ARM DL-1',
    slug: 'dl-1',
    categoryId: 31,
    price: 900,
    oldPrice: null,
    sku: 'ANT-DL1',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=DL-1',
    description: 'Светоотражающий поводок для собак. Прочный нейлон, мягкая ручка, карабин из нержавейки.',
    specs: [
      { key: 'Материал', value: 'Нейлон 25 мм' },
      { key: 'Длина', value: '1.5 м / 2.5 м (регулируемый)' },
      { key: 'Ширина', value: '25 мм' },
      { key: 'Вес', value: '0.15 кг' },
      { key: 'Цвет', value: 'Олива, Чёрный, Синий' },
    ],
    inStock: true,
    rating: 4.6,
    reviews: 33,
  },

  // ===== Одежда летняя / Зоотовары (id 32) =====
  {
    id: 28,
    name: 'Футболка для собак ANT ARM DS-1',
    slug: 'ds-1',
    categoryId: 32,
    price: 1500,
    oldPrice: null,
    sku: 'ANT-DS1',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=DS-1',
    description: 'Летняя футболка для собак из дышащего хлопка. Защита от солнца, удобный вырез для ошейника.',
    specs: [
      { key: 'Материал', value: 'Хлопок 100%' },
      { key: 'Размеры', value: 'S, M, L, XL' },
      { key: 'Вес', value: '0.08 кг' },
      { key: 'Цвет', value: 'Олива, Хаки, Чёрный' },
    ],
    inStock: true,
    rating: 4.2,
    reviews: 19,
  },

  // ===== Одежда зимняя / Зоотовары (id 33) =====
  {
    id: 29,
    name: 'Комбинезон зимний для собак ANT ARM DW-1',
    slug: 'dw-1',
    categoryId: 33,
    price: 3200,
    oldPrice: null,
    sku: 'ANT-DW1',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=DW-1',
    description: 'Утеплённый комбинезон для собак. Водоотталкивающая ткань, светоотражающие полосы, застёжка на спине.',
    specs: [
      { key: 'Материал', value: 'Полиэстер Oxford + синтепон' },
      { key: 'Размеры', value: 'S, M, L, XL' },
      { key: 'Утеплитель', value: 'Синтепон 150 г/м²' },
      { key: 'Вес', value: '0.35 кг' },
      { key: 'Цвет', value: 'Чёрный, Олива, Красный' },
    ],
    inStock: true,
    rating: 4.7,
    reviews: 22,
  },

  // ===== Одежда демисезонная / Зоотовары (id 34) =====
  {
    id: 30,
    name: 'Дождевик для собак ANT ARM DR-1',
    slug: 'dr-1',
    categoryId: 34,
    price: 2100,
    oldPrice: null,
    sku: 'ANT-DR1',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=DR-1',
    description: 'Непромокаемый дождевик для собак. Лёгкий, складывается в компактный чехол, светоотражатели.',
    specs: [
      { key: 'Материал', value: 'Полиэстер 210T с PU покрытием' },
      { key: 'Размеры', value: 'S, M, L, XL' },
      { key: 'Вес', value: '0.12 кг' },
      { key: 'Водостойкость', value: '3000 мм' },
      { key: 'Цвет', value: 'Жёлтый, Олива, Синий' },
    ],
    inStock: true,
    rating: 4.4,
    reviews: 14,
  },

  // ===== Верхняя одежда / Одежда (id 41) =====
  {
    id: 31,
    name: 'Куртка тактическая ANT ARM CJ-1',
    slug: 'cj-1',
    categoryId: 41,
    price: 7500,
    oldPrice: 9200,
    sku: 'ANT-CJ1',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=CJ-1',
    description: 'Тактическая куртка из смесовой ткани. Усиленные локти, множество карманов, скрытый капюшон.',
    specs: [
      { key: 'Материал', value: 'Смесовая ткань (65% хлопок, 35% полиэстер)' },
      { key: 'Вес', value: '0.8 кг' },
      { key: 'Карманы', value: '6 наружных, 3 внутренних' },
      { key: 'Размеры', value: 'M, L, XL, XXL' },
      { key: 'Цвет', value: 'Олива, Чёрный, Койот' },
    ],
    inStock: true,
    rating: 4.6,
    reviews: 28,
  },

  // ===== Брюки (id 42) =====
  {
    id: 32,
    name: 'Брюки тактические ANT ARM CP-1',
    slug: 'cp-1',
    categoryId: 42,
    price: 4500,
    oldPrice: null,
    sku: 'ANT-CP1',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=CP-1',
    description: 'Тактические брюки с усиленными коленями (карманы для вставок). Множество карманов, свободный крой.',
    specs: [
      { key: 'Материал', value: 'Хлопок + эластан (рипстоп)' },
      { key: 'Размеры', value: 'M, L, XL, XXL' },
      { key: 'Вес', value: '0.5 кг' },
      { key: 'Усиление', value: 'Колени (карманы для вставок)' },
      { key: 'Цвет', value: 'Олива, Чёрный, Койот' },
    ],
    inStock: true,
    rating: 4.8,
    reviews: 36,
  },

  // ===== Обувь (id 43) =====
  {
    id: 33,
    name: 'Ботинки тактические ANT ARM CB-1',
    slug: 'cb-1',
    categoryId: 43,
    price: 9900,
    oldPrice: null,
    sku: 'ANT-CB1',
    image: 'https://placehold.co/400x400/2d2d2d/4a5d23?text=CB-1',
    description: 'Тактические ботинки с мембраной. Противоскользящая подошва, стабилизация голеностопа, стальной подносок.',
    specs: [
      { key: 'Материал', value: 'Натуральная кожа + Cordura' },
      { key: 'Мембрана', value: 'Водонепроницаемая' },
      { key: 'Размеры', value: '40–46' },
      { key: 'Вес', value: '1.3 кг (пара)' },
      { key: 'Цвет', value: 'Чёрный, Олива, Койот' },
    ],
    inStock: true,
    rating: 4.7,
    reviews: 19,
  },
];

// ===== Helper-функции (совместимость со старым API) =====

export function getProductBySlug(slug) {
  return products.find(p => p.slug === slug);
}

export function getProductsByCategory(categoryId) {
  return products.filter(p => p.categoryId === categoryId);
}

export function getCategoryBySlug(slug) {
  return categories.find(c => c.slug === slug);
}

export function getBestsellers(limit = 6) {
  return [...products]
    .filter(p => p.inStock)
    .sort((a, b) => b.reviews * b.rating - a.reviews * a.rating)
    .slice(0, limit);
}

export function searchProducts(query) {
  const q = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.sku.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  );
}

/** Получить название родительской группы для подкатегории */
export function getParentCategoryName(categoryId) {
  const cat = categories.find(c => c.id === categoryId);
  if (!cat) return '';
  if (cat.parentId === null) return cat.name;
  const parent = categories.find(c => c.id === cat.parentId);
  return parent ? parent.name : '';
}

/** Получить товары для подкатегории ИЛИ для родительской категории (суммарно по всем дочерним) */
export function getProductsByCategoryOrParent(categoryId, productsSource = products) {
  const cat = categories.find(c => c.id === categoryId);
  if (!cat) return [];
  // Если это родительская группа — собираем товары из всех дочерних
  if (cat.parentId === null) {
    const childIds = categories.filter(c => c.parentId === categoryId).map(c => c.id);
    return productsSource.filter(p => childIds.includes(p.categoryId));
  }
  // Если это подкатегория — только её товары
  return productsSource.filter(p => p.categoryId === categoryId);
}
