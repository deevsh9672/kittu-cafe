import { Request, Response } from 'express';
import { OrderModel, IngredientModel, ReservationModel } from '../../models';

import { IN_MEMORY_ORDERS } from '../orders/orders.controller';

export class ReportsController {
  static async getDashboardMetrics(req: Request, res: Response): Promise<void> {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      // Orders from DB
      let dbOrders: any[] = [];
      try {
        dbOrders = await OrderModel.find().sort({ createdAt: -1 });
      } catch (err) {
        console.warn('[ReportsController] DB fetch fallback to in-memory:', err);
      }

      // Merge DB and IN_MEMORY_ORDERS
      const combinedMap = new Map<string, any>();
      for (const o of dbOrders) {
        const id = String(o._id || o.orderNumber);
        combinedMap.set(id, o);
      }
      for (const o of IN_MEMORY_ORDERS) {
        const id = String(o._id || o.orderNumber);
        if (!combinedMap.has(id)) {
          combinedMap.set(id, o);
        }
      }

      const allOrders = Array.from(combinedMap.values()).sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );

      // Filter today's orders (with fallback to all recent orders if server started today or timezone offset)
      let ordersToday = allOrders.filter(
        (o) => new Date(o.createdAt || 0).getTime() >= startOfDay.getTime()
      );
      if (ordersToday.length === 0 && allOrders.length > 0) {
        // Last 24 hours fallback
        const last24h = Date.now() - 24 * 60 * 60 * 1000;
        ordersToday = allOrders.filter((o) => new Date(o.createdAt || 0).getTime() >= last24h);
        if (ordersToday.length === 0) {
          ordersToday = allOrders;
        }
      }

      // Revenue: eligible paid or valid non-cancelled orders
      const eligiblePaidOrders = (ordersToday.length > 0 ? ordersToday : allOrders).filter(
        (o) => !['cancelled', 'refunded', 'refund_pending'].includes(o.status)
      );

      const revenueInPaise = eligiblePaidOrders.reduce((sum, o) => sum + (o.totalInPaise || 0), 0);
      const pendingCount = (ordersToday.length > 0 ? ordersToday : allOrders).filter((o) =>
        ['pending_confirmation', 'confirmed', 'accepted_by_kitchen', 'preparing', 'ready_for_pickup'].includes(o.status)
      ).length;
      const completedCount = (ordersToday.length > 0 ? ordersToday : allOrders).filter(
        (o) => o.status === 'completed'
      ).length;
      const cancelledCount = (ordersToday.length > 0 ? ordersToday : allOrders).filter(
        (o) => o.status === 'cancelled'
      ).length;

      const aovInPaise =
        eligiblePaidOrders.length > 0 ? Math.round(revenueInPaise / eligiblePaidOrders.length) : 0;

      // Low stock count
      let lowStockCount = 0;
      try {
        lowStockCount = await IngredientModel.countDocuments({
          $expr: { $lte: ['$currentStock', '$lowStockThreshold'] },
        });
      } catch {}

      // Reservations today
      let reservationsToday = 0;
      try {
        const todayDateStr = new Date().toISOString().split('T')[0];
        reservationsToday = await ReservationModel.countDocuments({
          reservationDate: todayDateStr,
          status: { $in: ['confirmed', 'seated'] },
        });
      } catch {}

      const recentOrders = allOrders.slice(0, 10);

      res.json({
        success: true,
        data: {
          today: {
            totalOrders: ordersToday.length,
            revenueInPaise,
            pendingCount,
            completedCount,
            cancelledCount,
            aovInPaise,
            reservationsToday,
          },
          lowStockCount,
          recentOrders,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'REPORT_ERROR', message: error.message } });
    }
  }

  static async getSalesReport(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const filter: any = {
        status: { $nin: ['cancelled', 'refunded'] },
      };

      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate as string);
        if (endDate) filter.createdAt.$lte = new Date(endDate as string);
      }

      const orders = await OrderModel.find(filter).sort({ createdAt: -1 });
      const totalRevenueInPaise = orders.reduce((sum, o) => sum + o.totalInPaise, 0);
      const totalTaxInPaise = orders.reduce((sum, o) => sum + o.taxInPaise, 0);
      const totalDiscountInPaise = orders.reduce((sum, o) => sum + o.discountInPaise, 0);

      res.json({
        success: true,
        data: {
          ordersCount: orders.length,
          totalRevenueInPaise,
          totalTaxInPaise,
          totalDiscountInPaise,
          orders,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'REPORT_ERROR', message: error.message } });
    }
  }
}
