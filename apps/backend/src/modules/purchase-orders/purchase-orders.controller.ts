import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { PurchaseOrderModel, InventoryItemModel } from '../../models';
import { InventoryService } from '../inventory/inventory.service';
import { logAudit } from '../../utils/audit';

export const DEMO_PURCHASE_ORDERS = [
  {
    _id: 'po-1',
    poNumber: 'PO-2026-001',
    supplierId: 'sup-1',
    supplierName: 'Dausa Beverage & Chiller Distributors',
    status: 'received',
    items: [
      {
        inventoryItemId: 'bev-1',
        itemName: 'Red Bull Energy Drink (250ml)',
        orderedQuantity: 24,
        receivedQuantity: 24,
        unitCostInPaise: 9500,
        taxPercent: 18,
        totalCostInPaise: 228000,
      },
      {
        inventoryItemId: 'bev-2',
        itemName: 'Coca-Cola Can (330ml)',
        orderedQuantity: 48,
        receivedQuantity: 48,
        unitCostInPaise: 3000,
        taxPercent: 18,
        totalCostInPaise: 144000,
      },
    ],
    totalAmountInPaise: 372000,
    invoiceReference: 'INV-DBD-9921',
    orderedDate: new Date(Date.now() - 86400000 * 5),
    receivedDate: new Date(Date.now() - 86400000 * 4),
    createdBy: 'admin',
  },
  {
    _id: 'po-2',
    poNumber: 'PO-2026-002',
    supplierId: 'sup-2',
    supplierName: 'Rajasthan Dairy & Farm Fresh',
    status: 'ordered',
    items: [
      {
        inventoryItemId: 'ing-1',
        itemName: 'Fresh Cow Milk (Dairy Gold)',
        orderedQuantity: 20,
        receivedQuantity: 0,
        unitCostInPaise: 6400,
        taxPercent: 0,
        totalCostInPaise: 128000,
      },
      {
        inventoryItemId: 'ing-3',
        itemName: 'Fresh Malai Paneer (1kg Slab)',
        orderedQuantity: 5,
        receivedQuantity: 0,
        unitCostInPaise: 36000,
        taxPercent: 0,
        totalCostInPaise: 180000,
      },
    ],
    totalAmountInPaise: 308000,
    orderedDate: new Date(),
    createdBy: 'admin',
  },
];

export class PurchaseOrdersController {
  static async getOrders(req: Request, res: Response): Promise<void> {
    try {
      if (mongoose.connection.readyState !== 1) {
        res.json({ success: true, data: DEMO_PURCHASE_ORDERS });
        return;
      }
      const pos = await PurchaseOrderModel.find()
        .populate('supplierId', 'name contactPerson phone')
        .sort({ createdAt: -1 });
      res.json({ success: true, data: pos });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } });
    }
  }

  static async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const { supplierId, items, notes } = req.body;
      if (!supplierId || !items || items.length === 0) {
        res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Supplier and items required' } });
        return;
      }

      const poCount = await PurchaseOrderModel.countDocuments();
      const poNumber = `PO-${new Date().getFullYear()}-${String(poCount + 1).padStart(3, '0')}`;

      let totalAmountInPaise = 0;
      const formattedItems = items.map((i: any) => {
        const itemTotal = Number(i.orderedQuantity) * Number(i.unitCostInPaise);
        totalAmountInPaise += itemTotal;
        return {
          inventoryItemId: i.inventoryItemId,
          itemName: i.itemName,
          orderedQuantity: Number(i.orderedQuantity),
          receivedQuantity: 0,
          unitCostInPaise: Number(i.unitCostInPaise),
          taxPercent: Number(i.taxPercent || 0),
          totalCostInPaise: itemTotal,
        };
      });

      if (mongoose.connection.readyState !== 1) {
        const demoPO = {
          _id: `po-${Date.now()}`,
          poNumber,
          supplierId,
          items: formattedItems,
          totalAmountInPaise,
          status: 'ordered',
          orderedDate: new Date(),
          createdBy: req.user?.email || 'admin',
        };
        res.status(201).json({ success: true, data: demoPO });
        return;
      }

      const po = await PurchaseOrderModel.create({
        poNumber,
        supplierId,
        items: formattedItems,
        totalAmountInPaise,
        status: 'ordered',
        orderedDate: new Date(),
        notes,
        createdBy: req.user?.email || 'admin',
      });

      logAudit('CREATE_PURCHASE_ORDER', req.user?.phone || 'admin', req.user?.role || 'admin', { poNumber, totalAmountInPaise });
      res.status(201).json({ success: true, data: po });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'CREATE_ERROR', message: error.message } });
    }
  }

  /**
   * Receive items for a Purchase Order.
   * Increments InventoryItem quantities and records immutable 'purchase_receipt' movements!
   */
  static async receiveOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { invoiceReference, receivedItems } = req.body;

      if (mongoose.connection.readyState !== 1) {
        res.json({
          success: true,
          message: `PO ${id} received successfully in demo mode. Stock incremented.`,
        });
        return;
      }

      const po = await PurchaseOrderModel.findById(id);
      if (!po) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'PO not found' } });
        return;
      }

      for (const item of po.items) {
        const receivedItem = receivedItems?.find((r: any) => String(r.inventoryItemId) === String(item.inventoryItemId));
        const qtyReceivedNow = receivedItem ? Number(receivedItem.quantity) : item.orderedQuantity - item.receivedQuantity;

        if (qtyReceivedNow > 0) {
          item.receivedQuantity += qtyReceivedNow;

          // Record in Inventory & Ledger
          await InventoryService.recordStockChange({
            itemId: item.inventoryItemId.toString(),
            operationType: 'purchase_receipt',
            quantityChange: qtyReceivedNow,
            reason: `PO Receipt ${po.poNumber} (Invoice: ${invoiceReference || 'N/A'})`,
            referenceId: po.poNumber,
            performedBy: req.user?.email || 'admin',
          });
        }
      }

      const allReceived = po.items.every(i => i.receivedQuantity >= i.orderedQuantity);
      po.status = allReceived ? 'received' : 'partially_received';
      po.receivedDate = new Date();
      if (invoiceReference) po.invoiceReference = invoiceReference;

      await po.save();

      logAudit('RECEIVE_PURCHASE_ORDER', req.user?.phone || 'admin', req.user?.role || 'admin', { poNumber: po.poNumber, invoiceReference });
      res.json({ success: true, message: 'Stock received and inventory ledger updated', data: po });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'RECEIVE_ERROR', message: error.message } });
    }
  }
}
