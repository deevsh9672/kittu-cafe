import request from 'supertest';
import { createApp } from '../src/app';
import jwt from 'jsonwebtoken';
import { config } from '../src/config/env';

const app = createApp();

describe('Auth & RBAC Middleware', () => {
  it('blocks protected admin routes when no token is supplied', async () => {
    const res = await request(app).get('/api/v1/admin/staff');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('blocks customer role from accessing admin-only routes', async () => {
    const customerToken = jwt.sign(
      { userId: '123', role: 'customer', phone: '+919999999999' },
      config.JWT_SECRET
    );

    const res = await request(app)
      .get('/api/v1/admin/staff')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  it('returns health check status successfully without authentication', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.location).toBe('Dausa, Rajasthan, India');
  });
});
