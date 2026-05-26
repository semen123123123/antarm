import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useCart } from '../context/CartContext';
import { api } from '../utils/api';
import { categories as staticCategories } from '../data/products';

// Маппинг categoryId → зона на силуэте
const CATEGORY_TO_ZONE = {
  11: 'chest',   // Бронежилеты
  12: 'waist',   // Подсумки под автомат
  13: 'waist',   // Подсумки под гранаты
  14: 'waist',   // Варбелты (ремни)
  15: 'chest',   // Органайзеры
  16: 'waist',   // Утилитарные подсумки
  17: 'head',    // Кап
  18: 'neck',    // Бафы
  19: 'side',    // Аксессуары
  20: 'back',    // Рюкзаки
  21: 'chest',   // Верхняя одежда (охота)
  23: 'back',    // Оружейные чехлы
  24: 'side',    // Аксессуары (охота)
  25: 'back',    // Рюкзаки (охота)
  41: 'chest',   // Верхняя одежда
  42: 'legs',    // Брюки
  43: 'legs',    // Обувь
};

// Якорные позиции для каждой зоны (% от контейнера)
const ZONE_ANCHORS = {
  head:   [{ left: 44, top: 5 }],
  neck:   [{ left: 44, top: 12 }],
  chest:  [
    { left: 38, top: 20 },
    { left: 52, top: 22 },
    { left: 34, top: 26 },
    { left: 46, top: 30 },
    { left: 44, top: 28 },
  ],
  waist:  [
    { left: 36, top: 42 },
    { left: 48, top: 44 },
    { left: 30, top: 44 },
    { left: 40, top: 38 },
    { left: 55, top: 38 },
    { left: 58, top: 44 },
    { left: 62, top: 48 },
  ],
  hands:  [{ left: 70, top: 30 }],
  legs:   [
    { left: 38, top: 56 },
    { left: 50, top: 62 },
  ],
  back:   [
    { left: 63, top: 18 },
    { left: 68, top: 24 },
    { left: 66, top: 12 },
  ],
  side:   [
    { left: 74, top: 36 },
    { left: 22, top: 36 },
  ],
};

const COLORS = [
  '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6',
  '#1abc9c', '#e67e22', '#34495e', '#e91e63', '#00bcd4',
  '#ff5722', '#607d8b', '#795548', '#cddc39', '#3f51b5',
];

function getColor(index) {
  return COLORS[index % COLORS.length];
}

// Категории конструктора: parentId 1 + 2 (тактика), parentId 4 (одежда)
const TACTICAL_PARENT_IDS = [1, 2];
const CLOTHES_PARENT_IDS = [4];
const EXCLUDED_CATEGORY_IDS = [22]; // Палатки — не экипировка

function getParentId(categoryId) {
  const cat = staticCategories.find(c => c.id === categoryId);
  if (!cat) return null;
  return cat.parentId;
}

export default function Constructor() {
  const { constructorItems, addConstructorItem, removeConstructorItem, clearConstructorItems, syncConstructorToCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCats, setOpenCats] = useState({ tactical: true, clothes: true });

  useEffect(() => {
    // Маппинг старых ID категорий на новые (как в Category.jsx)
    const oldToNewCategoryId = { 1: 11, 2: 14, 3: 12, 4: 20, 5: 19, 6: 19 };
    const mapCategoryId = (id) => oldToNewCategoryId[id] || id;

    api.get('/products').then(prods => {
      if (prods && prods.length > 0) {
        const mapped = prods.map(p => ({
          ...p,
          categoryId: mapCategoryId(p.categoryId || p.category_id),
        }));
        setProducts(mapped);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Фильтруем товары: только тактика и одежда, без зоотоваров и палаток
  const constructorProducts = products.filter(p => {
    const catId = p.categoryId;
    const parentId = getParentId(catId);
    if (!parentId) return false;
    if (EXCLUDED_CATEGORY_IDS.includes(catId)) return false;
    return TACTICAL_PARENT_IDS.includes(parentId) || CLOTHES_PARENT_IDS.includes(parentId);
  });

  // Назначаем позиции по зонам
  const zoneCounters = {};
  const positionedProducts = constructorProducts.map(p => {
    const zone = CATEGORY_TO_ZONE[p.categoryId] || 'side';
    const counter = zoneCounters[zone] || 0;
    zoneCounters[zone] = counter + 1;
    const anchors = ZONE_ANCHORS[zone] || ZONE_ANCHORS.side;
    const anchor = anchors[counter % anchors.length];
    return {
      ...p,
      zone,
      pos: anchor,
    };
  });

  const tacticalProducts = positionedProducts.filter(p => {
    const parentId = getParentId(p.categoryId);
    return TACTICAL_PARENT_IDS.includes(parentId);
  });

  const clothesProducts = positionedProducts.filter(p => {
    const parentId = getParentId(p.categoryId);
    return CLOTHES_PARENT_IDS.includes(parentId);
  });

  const toggleCat = (cat) => {
    setOpenCats(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const toggleItem = (item) => {
    addConstructorItem({
      id: item.id,
      name: item.name,
      price: item.price,
      pos: item.pos,
      zone: item.zone,
    });
  };

  const isSelected = (id) => constructorItems.some(p => p.id === id);

  const total = constructorItems.reduce((sum, item) => sum + item.price, 0);

  const handleGoToCart = () => {
    syncConstructorToCart();
    navigate('/cart');
  };

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <div className="container" style={{ padding: '28px 0 60px' }}>
        <div style={{ marginBottom: 24 }}>
          <Breadcrumbs items={[{ label: 'Конструктор экипировки' }]} color="#999" activeColor="#333" />
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#222', marginBottom: 8 }}>
          Конструктор экипировки
        </h1>
        <p style={{ fontSize: 14, color: '#999', marginBottom: 32 }}>
          Выберите предметы экипировки — они отобразятся на силуэте
        </p>

        {/* Main grid: silhouette + panel */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '40% 60%',
          gap: 32,
          alignItems: 'flex-start',
        }}>
          {/* Left: silhouette */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid rgba(0,0,0,0.06)',
            padding: '20px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '500px',
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <img
                src="/img/man.jpg"
                alt="Силуэт"
                style={{
                  width: '95%',
                  maxWidth: '420px',
                  height: 'auto',
                  display: 'block',
                }}
              />
              {/* Markers */}
              {constructorItems.map((item, idx) => (
                <div
                  key={item.id}
                  title={item.name}
                  onClick={() => toggleItem(item)}
                  style={{
                    position: 'absolute',
                    left: `${item.pos.left}%`,
                    top: `${item.pos.top}%`,
                    transform: `translate(-50%, -50%) translate(${Math.sin(idx * 2.3) * 6}px, ${Math.cos(idx * 1.7) * 6}px)`,
                    zIndex: 10 + idx,
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: getColor(idx),
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    userSelect: 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = e.currentTarget.style.transform.replace(')', ') scale(1.3)');
                    e.currentTarget.style.boxShadow = '0 3px 10px rgba(0,0,0,0.35)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = e.currentTarget.style.transform.replace(' scale(1.3)', '');
                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.25)';
                  }}
                >
                  {item.name[0]}
                </div>
              ))}
            </div>
          </div>

          {/* Right: panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>Загрузка товаров...</div>
            ) : (
              <>
                <CategoryPanel
                  title={`Тактическое снаряжение (${tacticalProducts.length})`}
                  items={tacticalProducts}
                  open={openCats.tactical}
                  onToggle={() => toggleCat('tactical')}
                  isSelected={isSelected}
                  onToggleItem={toggleItem}
                />
                <CategoryPanel
                  title={`Одежда (${clothesProducts.length})`}
                  items={clothesProducts}
                  open={openCats.clothes}
                  onToggle={() => toggleCat('clothes')}
                  isSelected={isSelected}
                  onToggleItem={toggleItem}
                />
              </>
            )}
          </div>
        </div>

        {/* Bottom: summary */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          border: '1px solid rgba(0,0,0,0.06)',
          padding: 24,
          marginTop: 24,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: constructorItems.length > 0 ? 16 : 0 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#222' }}>Итого</h2>
            <span style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#222' }}>
              {total.toLocaleString('ru-RU')} ₽
            </span>
          </div>

          {constructorItems.length === 0 && (
            <p style={{ fontSize: 14, color: '#bbb', marginTop: 4 }}>
              Выберите товары из списка справа
            </p>
          )}

          {constructorItems.length > 0 && (
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {constructorItems.map((item, idx) => (
                  <div key={item.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    background: '#fafafa',
                    borderRadius: '8px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%',
                        background: getColor(idx), color: '#fff',
                        fontSize: 9, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {item.name[0]}
                      </div>
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>{item.name}</span>
                        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#999', marginLeft: 8 }}>
                          {item.price.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleItem(item)}
                      style={{
                        width: 24, height: 24, borderRadius: '50%',
                        border: 'none', background: 'transparent',
                        color: '#ccc', cursor: 'pointer', fontSize: 14,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleGoToCart}
                style={{
                  display: 'block', width: '100%', marginTop: 20,
                  padding: '14px', background: '#333', color: '#fff',
                  fontSize: 14, fontWeight: 600, textTransform: 'uppercase',
                  letterSpacing: '0.05em', borderRadius: '8px',
                  border: 'none', cursor: 'pointer',
                }}
              >
                Перейти в корзину
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CategoryPanel({ title, items, open, onToggle, isSelected, onToggleItem }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      border: '1px solid rgba(0,0,0,0.06)',
      overflow: 'hidden',
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '16px 20px',
          background: open ? '#333' : '#f5f5f5',
          color: open ? '#fff' : '#333',
          fontSize: 14,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'all 0.2s',
        }}
      >
        <span>{title}</span>
        <span style={{
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s',
          fontSize: 12,
        }}>
          ▾
        </span>
      </button>

      {open && (
        <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {items.length === 0 && (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#bbb', fontSize: 13, padding: 20 }}>
              Нет товаров в этой категории
            </p>
          )}
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onToggleItem(item)}
              style={{
                padding: '10px 8px',
                border: isSelected(item.id) ? '2px solid #333' : '1px solid rgba(0,0,0,0.08)',
                borderRadius: '8px',
                background: isSelected(item.id) ? '#f5f5f5' : '#fff',
                cursor: 'pointer',
                transition: 'all 0.15s',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 500, color: '#333', lineHeight: 1.3 }}>
                {isSelected(item.id) && <span style={{ marginRight: 4, fontSize: 11 }}>✓</span>}
                {item.name}
              </span>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#999' }}>
                {item.price.toLocaleString('ru-RU')} ₽
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
