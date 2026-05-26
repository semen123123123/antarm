import { Router } from 'express';
import { getDb } from '../db/db.js';
import { createPayment, createReceipt, verifyWebhookSignature, getPaymentStatus } from '../robokassa.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// POST /api/init-payment — create order and payment intent
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
    const products = db.prepare(`SELECT id, name, price, in_stock FROM products WHERE id IN (${placeholders})`).all(...ids);
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
    const orderResult = db.prepare(`
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

    // 3. Create payment intent with CloudPayments
    try {
      const payment = await createPayment({
        amount: total,
        description: `Order #${orderId} — ${items.length} items`,
        email: email,
        phone: phone,
        orderId: orderId,
      });

      // Update order with payment transaction ID
      if (payment.Model?.TransactionId) {
        db.prepare('UPDATE orders SET payment_id = ? WHERE id = ?').run(
          payment.Model.TransactionId.toString(),
          orderId
        );
      }

      res.json({
        success: true,
        orderId: orderId,
        paymentUrl: payment.Model?.PaReq || null,
        transactionId: payment.Model?.TransactionId || null,
        total: total,
        message: 'Payment initialized',
      });
    } catch (paymentErr) {
      // If CloudPayments fails, return order for manual payment
      console.error('CloudPayments error:', paymentErr.message);
      res.json({
        success: true,
        orderId: orderId,
        paymentUrl: null,
        total: total,
        message: 'Order created. CloudPayments not configured — manual payment required.',
      });
    }
  } catch (err) {
    console.error('Init payment error:', err);
    res.status(500).json({ error: err.message || 'Payment initialization failed' });
  }
});

// POST /api/webhook/payment-success — CloudPayments webhook
router.post('/webhook/payment-success', async (req, res) => {
  try {
    const { TransactionId, InvoiceId, Status, Email, Phone } = req.body;

    // Verify webhook (skip in development)
    // const signature = req.headers['x-cloudpayments-signature'];
    // if (!verifyWebhookSignature(req.body, signature)) {
    //   return res.status(400).send('Invalid signature');
    // }

    if (Status !== 'Completed') {
      return res.status(200).send('OK'); // Acknowledge but don't process
    }

    const db = getDb();
    const orderId = parseInt(InvoiceId);
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);

    if (!order) {
      console.error(`Webhook: Order ${orderId} not found`);
      return res.status(404).send('Order not found');
    }

    if (order.status === 'paid') {
      return res.status(200).send('Already processed');
    }

    // 1. Update order status
    db.prepare('UPDATE orders SET status = ?, payment_id = ? WHERE id = ?').run('paid', TransactionId?.toString(), orderId);

    // 2. Create fiscal receipt
    try {
      const items = JSON.parse(order.items);
      const receipt = await createReceipt({
        items: items.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          vat: 'vat20',
        })),
        email: order.customer_email || Email,
        phone: order.customer_phone || Phone,
        total: order.total,
        paymentId: TransactionId?.toString(),
        paymentMethod: 'card',
      });

      // Save receipt ID
      if (receipt.Model?.ReceiptId) {
        db.prepare('UPDATE orders SET receipt_id = ? WHERE id = ?').run(receipt.Model.ReceiptId.toString(), orderId);
      }

      console.log(`✅ Order ${orderId} paid, receipt created`);
    } catch (receiptErr) {
      console.error(`Receipt creation failed for order ${orderId}:`, receiptErr.message);
      // Order is paid but receipt failed — log for manual processing
    }

    res.status(200).send('OK');
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).send('Error');
  }
});

// GET /api/check-payment — check payment status
router.get('/check-payment/:orderId', async (req, res) => {
  try {
    const db = getDb();
    const orderId = parseInt(req.params.orderId);
    const order = db.prepare('SELECT status, payment_id, receipt_id, total FROM orders WHERE id = ?').get(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // If payment_id exists, check with CloudPayments
    let paymentStatus = null;
    if (order.payment_id) {
      try {
        const cpStatus = await getPaymentStatus(order.payment_id);
        paymentStatus = cpStatus.Model?.Status;
      } catch (err) {
        console.error('CloudPayments status check failed:', err.message);
      }
    }

    res.json({
      success: order.status === 'paid',
      status: order.status,
      paymentStatus: paymentStatus,
      receiptId: order.receipt_id,
      total: order.total,
    });
  } catch (err) {
    console.error('Check payment error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders — create order (public, no auth required)
router.post('/orders', async (req, res) => {
  try {
    const {
      customer_name, customer_email, customer_phone,
      delivery_method, delivery_address, payment_method,
      items, subtotal, total, comment
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    const db = getDb();
    const result = db.prepare(`
      INSERT INTO orders (
        customer_name, customer_email, customer_phone,
        delivery_method, delivery_address, payment_method,
        items, subtotal, total, status, comment
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      customer_name,
      customer_email || null,
      customer_phone,
      delivery_method || 'courier',
      delivery_address || null,
      payment_method || 'online',
      JSON.stringify(items),
      subtotal,
      total,
      'новый',
      comment || null
    );

    res.status(201).json({
      id: result.lastInsertRowid,
      status: 'новый',
      total,
    });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
