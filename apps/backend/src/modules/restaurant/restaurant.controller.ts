import { Request, Response } from 'express';
import { RestaurantModel } from '../../models';
import { logAudit } from '../../utils/audit';

export class RestaurantController {
  static async getDetails(req: Request, res: Response): Promise<void> {
    try {
      let restaurant = await RestaurantModel.findOne();
      if (!restaurant) {
        restaurant = await RestaurantModel.create({
          openingHours: [
            { day: 'Monday', open: '10:00', close: '22:30', isClosed: false },
            { day: 'Tuesday', open: '10:00', close: '22:30', isClosed: false },
            { day: 'Wednesday', open: '10:00', close: '22:30', isClosed: false },
            { day: 'Thursday', open: '10:00', close: '22:30', isClosed: false },
            { day: 'Friday', open: '10:00', close: '23:00', isClosed: false },
            { day: 'Saturday', open: '10:00', close: '23:00', isClosed: false },
            { day: 'Sunday', open: '10:00', close: '23:00', isClosed: false },
          ],
        });
      }
      res.json({ success: true, data: restaurant });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } });
    }
  }

  static async updateDetails(req: Request, res: Response): Promise<void> {
    try {
      let restaurant = await RestaurantModel.findOne();
      if (!restaurant) {
        restaurant = new RestaurantModel();
      }

      const updates = req.body;
      Object.assign(restaurant, updates);
      await restaurant.save();

      if (req.user) {
        logAudit('UPDATE_RESTAURANT_SETTINGS', req.user.phone, req.user.role, updates);
      }

      res.json({ success: true, message: 'Restaurant settings updated', data: restaurant });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'UPDATE_ERROR', message: error.message } });
    }
  }
}
