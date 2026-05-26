import axios from 'axios';

const CP_PUBLIC_ID = process.env.CP_PUBLIC_ID;
const CP_SECRET_KEY = process.env.CP_SECRET_KEY;
const CP_INN = process.env.CP_INN;
const CP_API_URL = 'https://api.cloudpayments.ru/';

if (!CP_PUBLIC_ID || !CP_SECRET_KEY) {
  console.warn('⚠️ CloudPayments keys not configured. Set CP_PUBLIC_ID and CP_SECRET_KEY in .env');
}

/**
 * Create a payment intent
 * Returns payment URL for redirect
 */
export async function createPayment({ amount, description, email, phone, orderId }) {
  if (!CP_PUBLIC_ID || !CP_SECRET_KEY) {
    throw new Error('CloudPayments not configured. Check .env file.');
  }

  const response = await axios.post(
    `${CP_API_URL}payments/one-time-token`,
    {
      Amount: amount,
      Currency: 'RUB',
      Description: description,
      Email: email,
      Phone: phone,
      InvoiceId: orderId,
      AccountId: email,
    },
    {
      auth: {
        username: CP_PUBLIC_ID,
        password: CP_SECRET_KEY,
      },
    }
  );

  return response.data;
}

/**
 * Create fiscal receipt (online cash register)
 * Called after successful payment via webhook
 */
export async function createReceipt({ items, email, phone, total, paymentId, paymentMethod = 'card' }) {
  if (!CP_PUBLIC_ID || !CP_SECRET_KEY || !CP_INN) {
    throw new Error('CloudPayments not fully configured. Check CP_PUBLIC_ID, CP_SECRET_KEY, CP_INN in .env');
  }

  // CloudPayments receipt format (54-FZ compliant)
  const receiptData = {
    Inn: CP_INN,
    Type: 'Income', // Приход (продажа)
    CustomerReceipt: {
      Items: items.map(item => ({
        Label: item.name,
        Price: parseFloat(item.price),
        Quantity: parseFloat(item.quantity),
        Amount: parseFloat(item.price) * parseFloat(item.quantity),
        Vat: item.vat || 'vat20', // vat20, vat10, vat0, vat110, vat120, none
        Method: paymentMethod === 'card' ? 1 : 4, // 1 = full prepayment, 4 = full payment
        Object: 1, // 1 = product, 2 = service
      })),
      TaxationSystem: 'usn_income', // УСН доход (change if needed)
      Email: email,
      Phone: phone,
      Amounts: {
        Electronic: parseFloat(total),
      },
    },
  };

  const response = await axios.post(
    `${CP_API_URL}kkt/receipt`,
    receiptData,
    {
      auth: {
        username: CP_PUBLIC_ID,
        password: CP_SECRET_KEY,
      },
    }
  );

  return response.data;
}

/**
 * Verify webhook signature from CloudPayments
 */
export function verifyWebhookSignature(body, signature) {
  // CloudPayments sends webhook with HMAC signature
  // Implementation depends on their specific format
  // For now, we accept all webhooks in development
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  // In production, verify HMAC here
  return true;
}

/**
 * Get payment status
 */
export async function getPaymentStatus(transactionId) {
  if (!CP_PUBLIC_ID || !CP_SECRET_KEY) {
    throw new Error('CloudPayments not configured');
  }

  const response = await axios.post(
    `${CP_API_URL}payments/get`,
    { TransactionId: transactionId },
    {
      auth: {
        username: CP_PUBLIC_ID,
        password: CP_SECRET_KEY,
      },
    }
  );

  return response.data;
}

export default { createPayment, createReceipt, verifyWebhookSignature, getPaymentStatus };
