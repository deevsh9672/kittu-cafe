import { Request, Response } from 'express';
import { OrderModel } from '../../models';
import { emitOrderStatusUpdated } from '../../utils/socket';
import { OrderStatus } from '@kittu-cafe/shared';

export class KDSController {
  static async getActiveOrders(req: Request, res: Response): Promise<void> {
    try {
      // Active states for kitchen display
      const activeStatuses = ['confirmed', 'accepted_by_kitchen', 'preparing'];
      const orders = await OrderModel.find({
        status: { $in: activeStatuses },
      }).sort({ createdAt: 1 }); // Oldest first for queue priority

      res.json({
        success: true,
        data: {
          orders,
          count: orders.length,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'KDS_FETCH_ERROR', message: error.message } });
    }
  }

  static async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.body as { status: OrderStatus };
      const validKdsStatuses: OrderStatus[] = ['accepted_by_kitchen', 'preparing', 'ready_for_pickup'];

      if (!validKdsStatuses.includes(status)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_KDS_STATUS',
            message: `KDS can only set statuses: ${validKdsStatuses.join(', ')}`,
          },
        });
        return;
      }

      const order = await OrderModel.findById(req.params.id);
      if (!order) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } });
        return;
      }

      order.status = status;
      order.statusHistory.push({
        status,
        changedBy: req.user?.name || 'Kitchen Staff',
        timestamp: new Date(),
        notes: `KDS status update to ${status}`,
      });
      await order.save();

      emitOrderStatusUpdated(order._id.toString(), status, order);

      res.json({ success: true, message: `Order marked as ${status}`, data: order });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'KDS_UPDATE_ERROR', message: error.message } });
    }
  }
}
