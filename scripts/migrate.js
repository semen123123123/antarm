import Database from 'better-sqlite3';
import { createClient } from '@supabase/supabase-js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'server', 'data', 'antarm.db');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://rrjtfenhfkmkvgolwefi.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyanRmZW5oZmtta3Znb2x3ZWZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NjIyMDYsImV4cCI6MjA5NTQzODIwNn0.5h2MKYxfoxwi8reZtgWLq9jjd-JDk3jUJ0RCxprstoA';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function insertAll(table, rows, conflictCol = 'id') {
  if (rows.length === 0) return 0;
  let count = 0;
  for (let i = 0; i < rows.length; i += 50) {
    const batch = rows.slice(i, i + 50);
    const { error } = await supabase.from(table).upsert(batch, { onConflict: conflictCol });
    if (error) {
      console.error(`  Batch error ${table}:`, error.message);
      throw error;
    }
    count += batch.length;
  }
  return count;
}

async function migrate() {
  console.log('Connecting to SQLite...');
  const sqlite = new Database(DB_PATH);
  sqlite.pragma('journal_mode = WAL');

  console.log('Connecting to Supabase...');
  const { error: testErr } = await supabase.from('users').select('count', { count: 'exact', head: true });
  if (testErr) console.log('  Note:', testErr.message);

  try {
    // 1. Users
    console.log('\nUsers...');
    const users = sqlite.prepare('SELECT * FROM users').all().map(u => ({
      id: u.id, email: u.email, password_hash: u.password_hash, role: u.role, name: u.name,
      phone: u.phone, address: u.address, is_blocked: !!u.is_blocked,
      two_factor_secret: u.two_factor_secret, two_factor_enabled: !!u.two_factor_enabled,
      loyalty_points: u.loyalty_points || 0, total_spent: u.total_spent || 0,
      created_at: u.created_at,
    }));
    await insertAll('users', users);
    console.log(`  OK: ${users.length} users`);

    // 2. Categories
    console.log('Categories...');
    const categories = sqlite.prepare('SELECT * FROM categories').all().map(c => ({
      id: c.id, name: c.name, slug: c.slug, icon: c.icon || null,
      parent_id: c.parent_id || null, count: c.count || 0,
    }));
    await insertAll('categories', categories);
    console.log(`  OK: ${categories.length} categories`);

    // 3. Products
    console.log('Products...');
    const products = sqlite.prepare('SELECT * FROM products').all().map(p => ({
      id: p.id, name: p.name, slug: p.slug, category_id: p.category_id,
      price: p.price, old_price: p.old_price, sku: p.sku,
      image: p.image, images: p.images, description: p.description,
      in_stock: p.in_stock, stock_status: p.stock_status, rating: p.rating, reviews: p.reviews,
      season: p.season, material: p.material, brand: p.brand,
      protection_class: p.protection_class, sizes: p.sizes, colors: p.colors,
      pdf_url: p.pdf_url, tags: p.tags, badges: p.badges,
      seo_title: p.seo_title, seo_description: p.seo_description, seo_keywords: p.seo_keywords,
      is_hidden: !!p.is_hidden, is_licensed: !!p.is_licensed, created_at: p.created_at,
    }));
    await insertAll('products', products);
    console.log(`  OK: ${products.length} products`);

    // 4. Product Specs
    console.log('Product specs...');
    const specs = sqlite.prepare('SELECT * FROM product_specs').all();
    if (specs.length > 0) await insertAll('product_specs', specs);
    console.log(`  OK: ${specs.length} specs`);

    // 5. Orders
    console.log('Orders...');
    const orders = sqlite.prepare('SELECT * FROM orders').all().map(o => ({
      id: o.id, user_id: o.user_id, customer_name: o.customer_name,
      customer_email: o.customer_email, customer_phone: o.customer_phone,
      delivery_method: o.delivery_method, delivery_address: o.delivery_address,
      delivery_cost: o.delivery_cost || 0, payment_method: o.payment_method,
      items: o.items, subtotal: o.subtotal, total: o.total,
      status: o.status, comment: o.comment, tracking_number: o.tracking_number,
      created_at: o.created_at, updated_at: o.updated_at || o.created_at,
    }));
    await insertAll('orders', orders);
    console.log(`  OK: ${orders.length} orders`);

    // 6. Order items
    console.log('Order items...');
    const orderItems = sqlite.prepare('SELECT * FROM order_items').all().map(item => ({
      id: item.id, order_id: item.order_id, product_id: item.product_id || null,
      name: item.name || item.product_name, price: item.price,
      quantity: item.quantity, size: item.size || null, created_at: item.created_at,
    }));
    await insertAll('order_items', orderItems);
    console.log(`  OK: ${orderItems.length} items`);

    // 7. Messages
    console.log('Messages...');
    const messages = sqlite.prepare('SELECT * FROM messages').all().map(m => ({
      id: m.id, name: m.name, email: m.email, phone: m.phone,
      message: m.message, is_read: !!m.is_read, created_at: m.created_at,
    }));
    await insertAll('messages', messages);
    console.log(`  OK: ${messages.length} messages`);

    // 8. Promocodes
    try {
      console.log('Promocodes...');
      const promocodes = sqlite.prepare('SELECT * FROM promocodes').all().map(p => ({
        id: p.id, code: p.code, discount: p.discount, type: p.type || 'percentage',
        max_uses: p.max_uses, used_count: p.used_count || 0,
        expires_at: p.expires_at, is_active: !!p.is_active, created_at: p.created_at,
      }));
      await insertAll('promocodes', promocodes);
      console.log(`  OK: ${promocodes.length} promocodes`);
    } catch (e) { console.log('  (no promocodes table)'); }

    // 9. Reviews
    try {
      console.log('Reviews...');
      const reviews = sqlite.prepare('SELECT * FROM reviews').all().map(r => ({
        id: r.id, product_id: r.product_id, author_name: r.author_name,
        author_email: r.author_email, rating: r.rating,
        text: r.text || r.comment, is_approved: !!r.is_approved, created_at: r.created_at,
      }));
      await insertAll('reviews', reviews);
      console.log(`  OK: ${reviews.length} reviews`);
    } catch (e) { console.log('  (no reviews table)'); }

    // 10. News
    try {
      console.log('News...');
      const news = sqlite.prepare('SELECT * FROM news').all().map(n => ({
        id: n.id, title: n.title, slug: n.slug, content: n.content,
        excerpt: n.excerpt, image: n.image, is_published: !!n.is_published,
        created_at: n.created_at,
      }));
      await insertAll('news', news);
      console.log(`  OK: ${news.length} news`);
    } catch (e) { console.log('  (no news table)'); }

    console.log('\n=== Migration complete! ===');

  } catch (err) {
    console.error('Migration error:', err.message || err);
  } finally {
    sqlite.close();
  }
}

migrate().catch(console.error);
