import { Router } from 'express';
import { getDb } from '../db/pg.js';
import { createPaymentUrl, verifyResultSignature, verifyReceiptSignature } from '../robokassa.js';

const router = Router();

// POST /api/init-payment — create order and get RoboKassa payment URL
router.post('/init-payment', async (req, res) => {
  try {
    const { cart, email, phone, deliveryMethod, deliveryAddress, comment } = req.body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    if (!email && !phone) {
      return res.status(400).json({ error: 'Email or phone is required for receipt' });
    }

    const db = getDb();

    // 1. Verify products and calculate total
    const ids = cart.map(i => i.id);
    const placeholders = ids.map(() => '?').join(',');
    const products = await db.prepare(`SELECT id, name, price, in_stock FROM products WHERE id IN (${placeholders})`).all(...ids);
    const productMap = new Map(products.map(p => [p.id, p]));

    let items = [];
    let total = 0;
    for (const { id, quantity, size } of cart) {
      const product = productMap.get(id);
      if (!product) {
        return res.status(400).json({ error: `Product ${id} not found` });
      }
      if (!product.in_stock) {
        return res.status(400).json({ error: `Product "${product.name}" is out of stock` });
      }

      const qty = parseInt(quantity) || 1;
      const price = parseFloat(product.price);
      const sum = price * qty;
      total += sum;

      items.push({
        product_id: id,
        name: product.name,
        price: price,
        quantity: qty,
        size: size || null,
        sum: sum,
      });
    }

    // 2. Create order in database
    const orderResult = await db.prepare(`
      INSERT INTO orders (
        customer_name, customer_email, customer_phone,
        delivery_method, delivery_address, payment_method,
        items, subtotal, total, status, comment
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      email?.split('@')[0] || 'Customer',
      email || null,
      phone || null,
      deliveryMethod || 'courier',
      deliveryAddress || null,
      'card',
      JSON.stringify(items),
      total,
      total,
      'pending',
      comment || null
    );

    const orderId = orderResult.lastInsertRowid;

    // 3. Create RoboKassa payment URL with fiscal receipt (54-FZ)
    const paymentUrl = createPaymentUrl({
      amount: total,
      orderId: orderId,
      description: `Order #${orderId} — ${items.length} items`,
      email: email,
      receipt: {
        items: items.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          vat: 'none', // УСН без НДС
        })),
      },
    });

    res.json({
      success: true,
      orderId: orderId,
      paymentUrl: paymentUrl,
      total: total,
      message: 'Redirect to RoboKassa for payment',
    });
  } catch (err) {
    console.error('Init payment error:', err);
    res.status(500).json({ error: err.message || 'Payment initialization failed' });
  }
});

// POST /api/robokassa/result — RoboKassa ResultURL webhook (server-to-server)
router.post('/robokassa/result', async (req, res) => {
  try {
    const { OutSum, InvId, SignatureValue, Receipt, PaymentMethod } = req.body;

    // Verify signature
    let validSignature;
    if (Receipt) {
      validSignature = verifyReceiptSignature(OutSum, InvId, Receipt, SignatureValue);
    } else {
      validSignature = verifyResultSignature(OutSum, InvId, SignatureValue);
    }

    if (!validSignature) {
      console.error('Invalid RoboKassa signature');
      return res.status(400).send('Invalid signature');
    }

    const db = getDb();
    const orderId = parseInt(InvId);
    const order = await db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);

    if (!order) {
      console.error(`RoboKassa: Order ${orderId} not found`);
      return res.status(404).send('Order not found');
    }

    if (order.status === 'paid') {
      return res.status(200).send('OK'); // Already processed
    }

    // Update order status to paid
    await db.prepare('UPDATE orders SET status = ?, payment_id = ? WHERE id = ?').run('paid', PaymentMethod || 'robokassa', orderId);

    console.log(`✅ Order ${orderId} paid via RoboKassa`);
    res.status(200).send('OK');
  } catch (err) {
    console.error('RoboKassa result error:', err);
    res.status(500).send('Error');
  }
});

// GET /api/robokassa/success — RoboKassa SuccessURL (customer redirect)
router.get('/robokassa/success', async (req, res) => {
  try {
    const { OutSum, InvId, SignatureValue } = req.query;

    // Verify signature
    const valid = verifyResultSignature(OutSum, InvId, SignatureValue);
    if (!valid) {
      return res.redirect('/cart?error=invalid_signature');
    }

    const db = getDb();
    const orderId = parseInt(InvId);
    const order = await db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);

    if (order) {
      await db.prepare('UPDATE orders SET status = ? WHERE id = ?').run('paid', orderId);
    }

    // Redirect to success page
    res.redirect(`/success?orderId=${orderId}`);
  } catch (err) {
    console.error('RoboKassa success error:', err);
    res.redirect('/cart?error=payment_failed');
  }
});

// GET /api/robokassa/fail — RoboKassa FailURL (payment failed)
router.get('/robokassa/fail', async (req, res) => {
  try {
    const { OutSum, InvId } = req.query;
    
    const db = getDb();
    const orderId = parseInt(InvId);
    
    if (orderId) {
      await db.prepare('UPDATE orders SET status = ? WHERE id = ?').run('failed', orderId);
    }

    // Redirect to cart with error
    res.redirect('/cart?error=payment_failed');
  } catch (err) {
    console.error('RoboKassa fail error:', err);
    res.redirect('/cart?error=payment_failed');
  }
});

// GET /api/check-payment/:orderId — check payment status
router.get('/check-payment/:orderId', async (req, res) => {
  try {
    const db = getDb();
    const orderId = parseInt(req.params.orderId);
    const order = await db.prepare('SELECT status, payment_id, receipt_id, total FROM orders WHERE id = ?').get(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      success: order.status === 'paid',
      status: order.status,
      paymentMethod: order.payment_id,
      receiptId: order.receipt_id,
      total: order.total,
    });
  } catch (err) {
    console.error('Check payment error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
