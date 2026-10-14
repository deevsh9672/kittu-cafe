import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import { errorHandler } from './middlewares/errorHandler';

// Route imports
import authRoutes from './modules/auth/auth.routes';
import restaurantRoutes from './modules/restaurant/restaurant.routes';
import menuRoutes from './modules/menu/menu.routes';
import ordersRoutes from './modules/orders/orders.routes';
import paymentsRoutes from './modules/payments/payments.routes';
import kdsRoutes from './modules/kds/kds.routes';
import reservationsRoutes from './modules/reservations/reservations.routes';
import inventoryRoutes from './modules/inventory/inventory.routes';
import couponsRoutes from './modules/coupons/coupons.routes';
import reportsRoutes from './modules/reports/reports.routes';
import staffRoutes from './modules/staff/staff.routes';
import suppliersRoutes from './modules/suppliers/suppliers.routes';
import purchaseOrdersRoutes from './modules/purchase-orders/purchase-orders.routes';
import expensesRoutes from './modules/expenses/expenses.routes';

export function createApp(): Application {
  const app = express();

  // Standard Middlewares
  app.use(helmet());
  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true,
    })
  );
  app.use(morgan('dev'));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Liveness and Readiness Health Check
  app.get(`${config.API_PREFIX}/health`, (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      service: 'Kittu Cafe REST API',
      timestamp: new Date().toISOString(),
      location: 'Dausa, Rajasthan, India',
      version: '1.0.0',
    });
  });

  // API v1 Routes
  app.use(`${config.API_PREFIX}/auth`, authRoutes);
  app.use(`${config.API_PREFIX}/restaurant`, restaurantRoutes);
  app.use(`${config.API_PREFIX}/menu`, menuRoutes);
  app.use(`${config.API_PREFIX}/orders`, ordersRoutes);
  app.use(`${config.API_PREFIX}/payments`, paymentsRoutes);
  app.use(`${config.API_PREFIX}/kds`, kdsRoutes);
  app.use(`${config.API_PREFIX}/reservations`, reservationsRoutes);
  app.use(`${config.API_PREFIX}/admin/inventory`, inventoryRoutes);
  app.use(`${config.API_PREFIX}/inventory`, inventoryRoutes);
  app.use(`${config.API_PREFIX}/coupons`, couponsRoutes);
  app.use(`${config.API_PREFIX}/admin/reports`, reportsRoutes);
  app.use(`${config.API_PREFIX}/admin/staff`, staffRoutes);
  app.use(`${config.API_PREFIX}/admin/suppliers`, suppliersRoutes);
  app.use(`${config.API_PREFIX}/admin/purchase-orders`, purchaseOrdersRoutes);
  app.use(`${config.API_PREFIX}/admin/expenses`, expensesRoutes);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
