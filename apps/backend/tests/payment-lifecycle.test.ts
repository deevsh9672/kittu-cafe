import crypto from 'crypto';
import request from 'supertest';
import { createApp } from '../src/app';
import { config } from '../src/config/env';

const app = createApp();

describe('Payment Signature Verification', () => {
  it('rejects tampered or forged payment signatures', async () => {
    const orderId = 'order_test_12345';
    const paymentId = 'pay_test_67890';
    const fakeSignature = 'fake_invalid_sha256_hash_here';

    const res = await request(app)
      .post('/api/v1/payments/verify')
      .send({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: fakeSignature,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('SIGNATURE_VERIFICATION_FAILED');
  });

  it('validates a genuine HMAC SHA256 payment signature', () => {
    const orderId = 'order_test_12345';
    const paymentId = 'pay_test_67890';

    const validSignature = crypto
      .createHmac('sha256', config.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const checkSignature = crypto
      .createHmac('sha256', config.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    expect(checkSignature).toBe(validSignature);
  });
});
