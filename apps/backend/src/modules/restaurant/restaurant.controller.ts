import { Request, Response } from 'express';
import { RestaurantModel } from '../../models';
import { logAudit } from '../../utils/audit';
import { isDBConnected } from '../../config/database';
import { BUSINESS_CONFIG } from '@kittu-cafe/shared';

const FALLBACK_RESTAURANT = {
  name: BUSINESS_CONFIG.name,
  address: BUSINESS_CONFIG.address,
  phone: BUSINESS_CONFIG.contactNumber,
  isOnlineOrderingEnabled: true,
  isDineInOrderingEnabled: true,
  isTakeawayEnabled: true,
  taxPercentage: 5,
  deliveryFeeInPaise: 4000,
  freeDeliveryThresholdInPaise: 49900,
  minOrderInPaise: 15000,
  openingHours: [
    { day: 'Monday', open: '10:00', close: '22:30', isClosed: false },
    { day: 'Tuesday', open: '10:00', close: '22:30', isClosed: false },
    { day: 'Wednesday', open: '10:00', close: '22:30', isClosed: false },
    { day: 'Thursday', open: '10:00', close: '22:30', isClosed: false },
    { day: 'Friday', open: '10:00', close: '23:00', isClosed: false },
    { day: 'Saturday', open: '10:00', close: '23:00', isClosed: false },
    { day: 'Sunday', open: '10:00', close: '23:00', isClosed: false },
  ],
};

export class RestaurantController {
  static async getDetails(req: Request, res: Response): Promise<void> {
    try {
      let restaurant: any = null;
      if (isDBConnected()) {
        try {
          restaurant = await RestaurantModel.findOne();
          if (!restaurant) {
            restaurant = await RestaurantModel.create(FALLBACK_RESTAURANT);
          }
        } catch (dbErr) {
          restaurant = null;
        }
      }

      res.json({ success: true, data: restaurant || FALLBACK_RESTAURANT });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } });
    }
  }

  static async updateDetails(req: Request, res: Response): Promise<void> {
    try {
      let restaurant: any = null;
      if (isDBConnected()) {
        try {
          restaurant = await RestaurantModel.findOne();
          if (!restaurant) {
            restaurant = new RestaurantModel();
          }
          const updates = req.body;
          Object.assign(restaurant, updates);
          await restaurant.save();
        } catch (e) {
          restaurant = { ...FALLBACK_RESTAURANT, ...req.body };
        }
      } else {
        restaurant = { ...FALLBACK_RESTAURANT, ...req.body };
      }

      if (req.user) {
        logAudit('UPDATE_RESTAURANT_SETTINGS', req.user.phone, req.user.role, req.body);
      }

      res.json({ success: true, message: 'Restaurant settings updated', data: restaurant });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'UPDATE_ERROR', message: error.message } });
    }
  }
}
