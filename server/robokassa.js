import crypto from 'crypto';

// RoboKassa configuration
const SHOP_ID = process.env.ROBOKASSA_SHOP_ID || 'Ant_Arm';
const PASSWORD_1 = process.env.ROBOKASSA_PASS_1 || 'KI2QFOVr4X99TT7iCUDe';
const PASSWORD_2 = process.env.ROBOKASSA_PASS_2 || 'DLjrOVNoukYs9d4G11e9';
const IS_TEST = process.env.ROBOKASSA_TEST === 'true' || false;

const ROBOKASSA_URL = 'https://auth.robokassa.ru/Merchant/Index.aspx';

/**
 * Generate MD5 signature for RoboKassa
 * Format: md5(ShopId:OutSum:InvId:Password1)
 */
function generateSignature(outSum, invId, pass) {
  const str = `${SHOP_ID}:${outSum}:${invId}:${pass}`;
  return crypto.createHash('md5').update(str).digest('hex').toUpperCase();
}

/**
 * Generate signature for receipts with 54-FZ
 * Format: md5(ShopId:OutSum:InvId:Receipt:Password1)
 */
function generateReceiptSignature(outSum, invId, receipt, pass) {
  const str = `${SHOP_ID}:${outSum}:${invId}:${receipt}:${pass}`;
  return crypto.createHash('md5').update(str).digest('hex').toUpperCase();
}

/**
 * Create payment URL for redirect to RoboKassa
 */
export function createPaymentUrl({ amount, orderId, description, email, receipt }) {
  const outSum = parseFloat(amount).toFixed(2);
  const invId = orderId;
  
  // Build fiscal receipt for 54-FZ
  let receiptData = null;
  if (receipt && receipt.items) {
    receiptData = {
      sno: 'usn_income', // УСН доход
      items: receipt.items.map(item => ({
        name: item.name.substring(0, 128), // Max 128 chars
        quantity: parseFloat(item.quantity),
        sum: (parseFloat(item.price) * parseFloat(item.quantity)).toFixed(2),
        tax: item.vat || 'none',
        payment_method: 'full_payment',
        payment_object: 'commodity',
      })),
    };
  }

  const params = {
    MerchantLogin: SHOP_ID,
    OutSum: outSum,
    InvId: invId,
    Description: description || `Order #${invId}`,
    Email: email || '',
    Culture: 'ru',
    Encoding: 'utf-8',
    IsTest: IS_TEST ? '1' : '0',
  };

  // Add receipt if provided (54-FZ compliance)
  if (receiptData) {
    const receiptJson = JSON.stringify(receiptData);
    params.Receipt = receiptJson;
    params.SignatureValue = generateReceiptSignature(outSum, invId, receiptJson, PASSWORD_1);
  } else {
    params.SignatureValue = generateSignature(outSum, invId, PASSWORD_1);
  }

  // Build URL
  const queryParams = new URLSearchParams(params);
  return `${ROBOKASSA_URL}?${queryParams.toString()}`;
}

/**
 * Verify webhook signature from RoboKassa (SuccessURL/FailURL)
 * Format: md5(OutSum:InvId:Password2)
 */
export function verifyWebhookSignature(outSum, invId, signature) {
  const expected = generateSignature(outSum, invId, PASSWORD_2);
  return signature.toUpperCase() === expected;
}

/**
 * Verify ResultURL signature (server-to-server notification)
 * Format: md5(OutSum:InvId:Password2)
 */
export function verifyResultSignature(outSum, invId, signature) {
  const expected = generateSignature(outSum, invId, PASSWORD_2);
  return signature.toUpperCase() === expected;
}

/**
 * Verify receipt webhook signature
 * Format: md5(OutSum:InvId:Receipt:Password2)
 */
export function verifyReceiptSignature(outSum, invId, receipt, signature) {
  const expected = generateReceiptSignature(outSum, invId, receipt, PASSWORD_2);
  return signature.toUpperCase() === expected;
}

export default {
  createPaymentUrl,
  verifyWebhookSignature,
  verifyResultSignature,
  verifyReceiptSignature,
};
