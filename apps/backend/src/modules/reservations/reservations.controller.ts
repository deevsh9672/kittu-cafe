import { Request, Response } from 'express';
import { ReservationModel } from '../../models';
import { logAudit } from '../../utils/audit';

const TOTAL_TABLES = ['Table T1', 'Table T2', 'Table T3', 'Table T4', 'Table T5', 'Table T6'];

export class ReservationsController {
  static async checkAvailability(req: Request, res: Response): Promise<void> {
    try {
      const { date, time } = req.query;
      if (!date || !time) {
        res.status(400).json({ success: false, error: { code: 'MISSING_PARAMS', message: 'date and time required' } });
        return;
      }

      const bookedReservations = await ReservationModel.find({
        reservationDate: date as string,
        reservationTime: time as string,
        status: { $in: ['confirmed', 'seated'] },
      }).select('tableNumber');

      const bookedTables = bookedReservations.map((r: any) => r.tableNumber);
      const availableTables = TOTAL_TABLES.filter(t => !bookedTables.includes(t));

      res.json({
        success: true,
        data: {
          date,
          time,
          totalTables: TOTAL_TABLES.length,
          availableCount: availableTables.length,
          isAvailable: availableTables.length > 0,
          availableTables,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'CHECK_ERROR', message: error.message } });
    }
  }

  static async createReservation(req: Request, res: Response): Promise<void> {
    try {
      const { customerName, customerPhone, customerEmail, partySize, reservationDate, reservationTime, specialRequests } = req.body;

      // Find currently booked tables for slot
      const existingBookings = await ReservationModel.find({
        reservationDate,
        reservationTime,
        status: { $in: ['confirmed', 'seated'] },
      });

      const bookedTables = existingBookings.map(b => b.tableNumber);
      const assignedTable = TOTAL_TABLES.find(t => !bookedTables.includes(t));

      if (!assignedTable) {
        res.status(409).json({
          success: false,
          error: {
            code: 'SLOT_FULL',
            message: 'All tables are booked for this time slot. Please choose another time or call Kittu Cafe at +91 95113 17456.',
          },
        });
        return;
      }

      const reservationNumber = `RES-${Date.now().toString().slice(-6)}`;
      const reservation = await ReservationModel.create({
        reservationNumber,
        customerName,
        customerPhone,
        customerEmail,
        partySize: Number(partySize),
        reservationDate,
        reservationTime,
        tableNumber: assignedTable,
        status: 'confirmed',
        specialRequests,
      });

      res.status(201).json({
        success: true,
        message: 'Table reserved successfully at Kittu Cafe',
        data: reservation,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'RESERVATION_ERROR', message: error.message } });
    }
  }

  static async getMyReservations(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Auth required' } });
        return;
      }
      const reservations = await ReservationModel.find({ customerPhone: req.user.phone }).sort({ reservationDate: -1 });
      res.json({ success: true, data: reservations });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } });
    }
  }

  static async adminGetReservations(req: Request, res: Response): Promise<void> {
    try {
      const { date, status } = req.query;
      const filter: any = {};
      if (date) filter.reservationDate = date;
      if (status) filter.status = status;

      const reservations = await ReservationModel.find(filter).sort({ reservationDate: 1, reservationTime: 1 });
      res.json({ success: true, data: reservations });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } });
    }
  }

  static async adminUpdateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.body;
      const reservation = await ReservationModel.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      if (!reservation) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Reservation not found' } });
        return;
      }

      if (req.user) {
        logAudit('UPDATE_RESERVATION_STATUS', req.user.phone, req.user.role, {
          reservationId: reservation._id,
          status,
        });
      }

      res.json({ success: true, data: reservation });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'UPDATE_ERROR', message: error.message } });
    }
  }
}
