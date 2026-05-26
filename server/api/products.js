import { Router } from 'express';
import { getDb } from '../db/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Helper: convert DB row to API format
function formatProduct(row) {
  return {
    ...row,
    inStock: Boolean(row.in_stock),
    stockStatus: row.stock_status || 'in_stock',
    oldPrice: row.old_price,
    categoryId: row.category_id,
    images: row.images ? JSON.parse(row.images) : [],
    sizes: row.sizes ? JSON.parse(row.sizes) : [],
    colors: row.colors ? JSON.parse(row.colors) : [],
  };
}

// GET /api/products — all products with specs (single JOIN query)
router.get('/', (req, res) => {
  const db = getDb();

  // Single query with JOIN instead of N+1
  const rows = db.prepare(`
    SELECT p.*, ps.key as spec_key, ps.value as spec_value
    FROM products p
    LEFT JOIN product_specs ps ON p.id = ps.product_id
    ORDER BY p.id
  `).all();

  // Group specs by product
  const productMap = {};
  for (const row of rows) {
    const id = row.id;
    if (!productMap[id]) {
      productMap[id] = formatProduct(row);
      productMap[id].specs = [];
    }
    if (row.spec_key) {
      productMap[id].specs.push({ key: row.spec_key, value: row.spec_value });
    }
  }

  res.json(Object.values(productMap));
});

// GET /api/products/:id — single product with specs
router.get('/:id', (req, res) => {
  const db = getDb();
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const specs = db.prepare('SELECT key, value FROM product_specs WHERE product_id = ?').all(product.id);
  res.json({
    ...formatProduct(product),
    specs,
  });
});

// GET /api/products/search — smart search
router.get('/search', (req, res) => {
  const db = getDb();
  const { q } = req.query;
  if (!q || q.length < 2) return res.json([]);

  const searchTerm = `%${q}%`;
  const rows = db.prepare(`
    SELECT DISTINCT p.*, ps.key as spec_key, ps.value as spec_value
    FROM products p
    LEFT JOIN product_specs ps ON p.id = ps.product_id
    WHERE p.name LIKE ? OR p.sku LIKE ? OR p.description LIKE ? OR ps.value LIKE ?
    ORDER BY p.rating DESC, p.reviews DESC
    LIMIT 20
  `).all(searchTerm, searchTerm, searchTerm, searchTerm);

  const productMap = {};
  for (const row of rows) {
    const id = row.id;
    if (!productMap[id]) {
      productMap[id] = formatProduct(row);
      productMap[id].specs = [];
    }
    if (row.spec_key) {
      productMap[id].specs.push({ key: row.spec_key, value: row.spec_value });
    }
  }

  res.json(Object.values(productMap));
});

// GET /api/products/filter — advanced filtering + sorting + pagination
router.get('/filter', (req, res) => {
  const db = getDb();
  const {
    category, minPrice, maxPrice, inStock,
    season, material, brand, protectionClass,
    size, color, sortBy, page = 1, limit = 12,
  } = req.query;

  let where = [];
  let params = [];

  if (category) { where.push('p.category_id = ?'); params.push(category); }
  if (minPrice) { where.push('p.price >= ?'); params.push(Number(minPrice)); }
  if (maxPrice) { where.push('p.price <= ?'); params.push(Number(maxPrice)); }
  if (inStock === 'true') { where.push('p.in_stock = 1'); }
  if (season) { where.push('p.season = ?'); params.push(season); }
  if (material) { where.push('p.material = ?'); params.push(material); }
  if (brand) { where.push('p.brand = ?'); params.push(brand); }
  if (protectionClass) { where.push('p.protection_class = ?'); params.push(protectionClass); }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

  // Sorting
  let orderBy = 'p.id';
  switch (sortBy) {
    case 'price_asc': orderBy = 'p.price ASC'; break;
    case 'price_desc': orderBy = 'p.price DESC'; break;
    case 'rating': orderBy = 'p.rating DESC'; break;
    case 'newest': orderBy = 'p.created_at DESC'; break;
    case 'popular': orderBy = '(p.rating * p.reviews) DESC'; break;
    default: orderBy = 'p.id';
  }

  // Count total
  const countRow = db.prepare(`SELECT COUNT(DISTINCT p.id) as total FROM products p ${whereClause}`).all(...params);
  const total = countRow[0]?.total || 0;

  // Paginate
  const offset = (Number(page) - 1) * Number(limit);
  params.push(Number(limit), offset);

  const rows = db.prepare(`
    SELECT DISTINCT p.* FROM products p ${whereClause}
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `).all(...params);

  res.json({
    products: rows.map(formatProduct),
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
  });
});

// POST /api/products — create product (auth required)
router.post('/', requireAuth, (req, res) => {
  const { name, slug, categoryId, price, oldPrice, sku, image, description, inStock, rating, reviews, specs } = req.body;
  if (!name || !slug || !price || !sku) {
    return res.status(400).json({ error: 'name, slug, price, sku are required' });
  }

  const db = getDb();
  const existing = db.prepare('SELECT id FROM products WHERE slug = ? OR sku = ?').get(slug, sku);
  if (existing) {
    return res.status(409).json({ error: 'Product with this slug or SKU already exists' });
  }

  const result = db.prepare(`
    INSERT INTO products (name, slug, category_id, price, old_price, sku, image, description, in_stock, rating, reviews)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(name, slug, categoryId, price, oldPrice || null, sku, image || '', description || '', inStock ? 1 : 0, rating || 0, reviews || 0);

  // Insert specs
  if (specs && Array.isArray(specs)) {
    const insertSpec = db.prepare('INSERT INTO product_specs (product_id, key, value) VALUES (?, ?, ?)');
    const insertSpecs = db.transaction((s) => {
      for (const sp of s) insertSpec.run(result.lastInsertRowid, sp.key, sp.value);
    });
    insertSpecs(specs);
  }

  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
  const productSpecs = db.prepare('SELECT key, value FROM product_specs WHERE product_id = ?').all(result.lastInsertRowid);

  res.status(201).json({
    ...product,
    specs: productSpecs,
    inStock: Boolean(product.in_stock),
    oldPrice: product.old_price,
    categoryId: product.category_id,
  });
});

// PUT /api/products/:id — update product (auth required)
router.put('/:id', requireAuth, (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Product not found' });

  const { name, slug, categoryId, price, oldPrice, sku, image, description, inStock, rating, reviews, specs } = req.body;

  db.prepare(`
    UPDATE products SET name = ?, slug = ?, category_id = ?, price = ?, old_price = ?, sku = ?, image = ?, description = ?, in_stock = ?, rating = ?, reviews = ?
    WHERE id = ?
  `).run(
    name ?? existing.name,
    slug ?? existing.slug,
    categoryId ?? existing.category_id,
    price ?? existing.price,
    oldPrice !== undefined ? oldPrice : existing.old_price,
    sku ?? existing.sku,
    image !== undefined ? image : existing.image,
    description !== undefined ? description : existing.description,
    inStock !== undefined ? (inStock ? 1 : 0) : existing.in_stock,
    rating ?? existing.rating,
    reviews ?? existing.reviews,
    req.params.id
  );

  // Replace specs if provided
  if (specs && Array.isArray(specs)) {
    db.prepare('DELETE FROM product_specs WHERE product_id = ?').run(req.params.id);
    const insertSpec = db.prepare('INSERT INTO product_specs (product_id, key, value) VALUES (?, ?, ?)');
    const insertSpecs = db.transaction((s) => {
      for (const sp of s) insertSpec.run(req.params.id, sp.key, sp.value);
    });
    insertSpecs(specs);
  }

  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  const productSpecs = db.prepare('SELECT key, value FROM product_specs WHERE product_id = ?').all(req.params.id);

  res.json({
    ...product,
    specs: productSpecs,
    inStock: Boolean(product.in_stock),
    oldPrice: product.old_price,
    categoryId: product.category_id,
  });
});

// DELETE /api/products/:id — delete product (admin only)
router.delete('/:id', requireAuth, requireRole('admin'), (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Product not found' });

  db.prepare('DELETE FROM product_specs WHERE product_id = ?').run(req.params.id);
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);

  res.json({ message: 'Product deleted' });
});

export default router;
