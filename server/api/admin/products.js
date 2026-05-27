import { Router } from 'express';
import { getDb } from '../../db/pg.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';

const router = Router();

// GET /api/admin/products — list with pagination
router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
  const db = getDb();
  const { page = 1, limit = 20, search, category, inStock } = req.query;

  let where = [];
  let params = [];

  if (search) { where.push('(p.name LIKE ? OR p.sku LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
  if (category) { where.push('p.category_id = ?'); params.push(category); }
  if (inStock === 'true') { where.push('p.in_stock = 1'); }
  if (inStock === 'false') { where.push('p.in_stock = 0'); }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';
  const offset = (Number(page) - 1) * Number(limit);

  const countRow = await db.prepare(`SELECT COUNT(*) as total FROM products p ${whereClause}`).all(...params);
  const total = countRow[0]?.total || 0;

  const products = await db.prepare(`
    SELECT p.*, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ${whereClause}
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?
  `).all(...params, Number(limit), offset);

  res.json({ products, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) });
});

// POST /api/admin/products — create
router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  const {
    name, slug, categoryId, price, oldPrice, sku, image, images, description,
    inStock, stockStatus, rating, reviews, season, material, brand,
    protectionClass, sizes, colors, pdfUrl, tags, badges,
    seoTitle, seoDescription, seoKeywords, isHidden, isLicensed, specs,
  } = req.body;

  if (!name || !slug || !price || !sku) {
    return res.status(400).json({ error: 'name, slug, price, sku are required' });
  }

  const db = getDb();
  const existing = await db.prepare('SELECT id FROM products WHERE slug = ? OR sku = ?').get(slug, sku);
  if (existing) return res.status(409).json({ error: 'Product with this slug or SKU already exists' });

  const result = await db.prepare(`
    INSERT INTO products (
      name, slug, category_id, price, old_price, sku, image, images, description,
      in_stock, stock_status, rating, reviews, season, material, brand,
      protection_class, sizes, colors, pdf_url, tags, badges,
      seo_title, seo_description, seo_keywords, is_hidden, is_licensed
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    name, slug, categoryId, price, oldPrice || null, sku, image || '', images ? JSON.stringify(images) : null,
    description || '', inStock ? 1 : 0, stockStatus || 'in_stock', rating || 0, reviews || 0,
    season || null, material || null, brand || 'ANT ARM', protectionClass || null,
    sizes ? JSON.stringify(sizes) : null, colors ? JSON.stringify(colors) : null,
    pdfUrl || null, tags ? JSON.stringify(tags) : null, badges ? JSON.stringify(badges) : null,
    seoTitle || null, seoDescription || null, seoKeywords || null,
    isHidden ? 1 : 0, isLicensed ? 1 : 0,
  );

  // Insert specs
  if (specs && Array.isArray(specs)) {
    const insertSpec = await db.prepare('INSERT INTO product_specs (product_id, key, value) VALUES (?, ?, ?)');
    const insertSpecs = db.transaction((s) => {
      for (const sp of s) insertSpec.run(result.lastInsertRowid, sp.key, sp.value);
    });
    insertSpecs(specs);
  }

  const product = await db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(product);
});

// PUT /api/admin/products/:id — update
router.put('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const db = getDb();
  const existing = await db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Product not found' });

  const {
    name, slug, categoryId, price, oldPrice, sku, image, images, description,
    inStock, stockStatus, rating, reviews, season, material, brand,
    protectionClass, sizes, colors, pdfUrl, tags, badges,
    seoTitle, seoDescription, seoKeywords, isHidden, isLicensed,
  } = req.body;

  // Check slug/sku uniqueness if changed
  if (slug && slug !== existing.slug) {
    const slugCheck = await db.prepare('SELECT id FROM products WHERE slug = ? AND id != ?').get(slug, req.params.id);
    if (slugCheck) return res.status(409).json({ error: 'Slug already in use' });
  }
  if (sku && sku !== existing.sku) {
    const skuCheck = await db.prepare('SELECT id FROM products WHERE sku = ? AND id != ?').get(sku, req.params.id);
    if (skuCheck) return res.status(409).json({ error: 'SKU already in use' });
  }

  await db.prepare(`
    UPDATE products SET
      name = ?, slug = ?, category_id = ?, price = ?, old_price = ?, sku = ?,
      image = ?, images = ?, description = ?, in_stock = ?, stock_status = ?,
      rating = ?, reviews = ?, season = ?, material = ?, brand = ?,
      protection_class = ?, sizes = ?, colors = ?, pdf_url = ?,
      tags = ?, badges = ?, seo_title = ?, seo_description = ?, seo_keywords = ?,
      is_hidden = ?, is_licensed = ?
    WHERE id = ?
  `).run(
    name ?? existing.name, slug ?? existing.slug, categoryId ?? existing.category_id,
    price ?? existing.price, oldPrice ?? existing.old_price, sku ?? existing.sku,
    image ?? existing.image, images !== undefined ? (images ? JSON.stringify(images) : null) : existing.images,
    description ?? existing.description, inStock !== undefined ? (inStock ? 1 : 0) : existing.in_stock,
    stockStatus ?? existing.stock_status, rating ?? existing.rating, reviews ?? existing.reviews,
    season ?? existing.season, material ?? existing.material, brand ?? existing.brand,
    protectionClass ?? existing.protection_class,
    sizes !== undefined ? (sizes ? JSON.stringify(sizes) : null) : existing.sizes,
    colors !== undefined ? (colors ? JSON.stringify(colors) : null) : existing.colors,
    pdfUrl ?? existing.pdf_url,
    tags !== undefined ? (tags ? JSON.stringify(tags) : null) : existing.tags,
    badges !== undefined ? (badges ? JSON.stringify(badges) : null) : existing.badges,
    seoTitle ?? existing.seo_title, seoDescription ?? existing.seo_description,
    seoKeywords ?? existing.seo_keywords,
    isHidden !== undefined ? (isHidden ? 1 : 0) : existing.is_hidden,
    isLicensed !== undefined ? (isLicensed ? 1 : 0) : existing.is_licensed,
    req.params.id,
  );

  const product = await db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  res.json(product);
});

// DELETE /api/admin/products/:id
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const db = getDb();
  const existing = await db.prepare('SELECT id FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Product not found' });

  await db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ success: true, id: req.params.id });
});

// POST /api/admin/products/bulk-update — bulk price/stock update
router.post('/bulk-update', requireAuth, requireRole('admin'), async (req, res) => {
  const { productIds, field, value, operation } = req.body;
  if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ error: 'productIds array is required' });
  }
  if (!field || value === undefined) {
    return res.status(400).json({ error: 'field and value are required' });
  }

  const db = getDb();
  const validFields = ['price', 'old_price', 'in_stock', 'stock_status'];
  if (!validFields.includes(field)) {
    return res.status(400).json({ error: `Invalid field. Must be one of: ${validFields.join(', ')}` });
  }

  let newValue;
  if (operation === 'multiply') {
    newValue = `CAST(${field} AS REAL) * ${Number(value)}`;
  } else if (operation === 'add') {
    newValue = `${field} + ${Number(value)}`;
  } else {
    newValue = typeof value === 'string' ? `'${value}'` : value;
  }

  const placeholders = productIds.map(() => '?').join(',');
  const stmt = `UPDATE products SET ${field} = ${newValue} WHERE id IN (${placeholders})`;
  await db.prepare(stmt).run(...productIds);

  res.json({ success: true, updated: productIds.length });
});

// POST /api/admin/products/import — CSV import (simulated)
router.post('/import', requireAuth, requireRole('admin'), async (req, res) => {
  const { csv } = req.body;
  if (!csv) return res.status(400).json({ error: 'CSV data is required' });

  const db = getDb();
  const lines = csv.split('\n').filter(l => l.trim());
  if (lines.length < 2) return res.status(400).json({ error: 'CSV must have header + data rows' });

  const headers = lines[0].split(',').map(h => h.trim());
  let imported = 0;
  let errors = [];

  const insertProduct = await db.prepare(`
    INSERT OR IGNORE INTO products (name, slug, price, sku, description, in_stock)
    VALUES (?, ?, ?, ?, ?, 1)
  `);

  for (let i = 1; i < lines.length; i++) {
    try {
      const values = lines[i].split(',').map(v => v.trim());
      const row = {};
      headers.forEach((h, idx) => { row[h] = values[idx] || ''; });

      if (!row.name || !row.price || !row.sku) {
        errors.push(`Row ${i + 1}: missing required fields`);
        continue;
      }

      const slug = row.slug || row.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-zа-я0-9-]/g, '');
      insertProduct.run(row.name, slug, Number(row.price), row.sku, row.description || '');
      imported++;
    } catch (err) {
      errors.push(`Row ${i + 1}: ${err.message}`);
    }
  }

  res.json({ success: true, imported, errors });
});

export default router;
