import { Request, Response } from 'express';
import { OrderModel, IngredientModel, ReservationModel } from '../../models';

export class ReportsController {
  static async getDashboardMetrics(req: Request, res: Response): Promise<void> {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      // Orders today
      const ordersToday = await OrderModel.find({ createdAt: { $gte: startOfDay } });

      // Revenue: eligible paid or completed orders only (exclude cancelled, refund_pending, refunded)
      const eligiblePaidOrders = ordersToday.filter(
        o => ['completed', 'ready_for_pickup', 'out_for_delivery', 'confirmed', 'accepted_by_kitchen', 'preparing'].includes(o.status) &&
             ['captured', 'pending'].includes(o.paymentStatus) &&
             !['cancelled', 'refunded', 'refund_pending'].includes(o.status)
      );

      const revenueInPaise = eligiblePaidOrders.reduce((sum, o) => sum + o.totalInPaise, 0);
      const pendingCount = ordersToday.filter(o =>
        ['pending_confirmation', 'confirmed', 'accepted_by_kitchen', 'preparing'].includes(o.status)
      ).length;
      const completedCount = ordersToday.filter(o => o.status === 'completed').length;
      const cancelledCount = ordersToday.filter(o => o.status === 'cancelled').length;

      const aovInPaise = eligiblePaidOrders.length > 0 ? Math.round(revenueInPaise / eligiblePaidOrders.length) : 0;

      // Low stock count
      const lowStockCount = await IngredientModel.countDocuments({
        $expr: { $lte: ['$currentStock', '$lowStockThreshold'] },
      });

      // Reservations today
      const todayDateStr = new Date().toISOString().split('T')[0];
      const reservationsToday = await ReservationModel.countDocuments({
        reservationDate: todayDateStr,
        status: { $in: ['confirmed', 'seated'] },
      });

      // Recent 10 orders
      const recentOrders = await OrderModel.find().sort({ createdAt: -1 }).limit(10);

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
