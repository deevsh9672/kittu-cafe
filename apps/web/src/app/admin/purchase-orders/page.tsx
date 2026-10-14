'use client';

import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Plus,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  PackageCheck,
  Search,
  ExternalLink,
} from 'lucide-react';
import { IPurchaseOrder } from '@kittu-cafe/shared';
import { formatPrice } from '../../../lib/api';

const DEMO_POS: IPurchaseOrder[] = [
  {
    _id: 'po-1',
    poNumber: 'PO-2026-001',
    supplierId: 'sup-1',
    supplierName: 'Dausa Beverage & Cold Drinks Distributors',
    status: 'ordered',
    orderDate: new Date(Date.now() - 3600000 * 24).toISOString(),
    items: [
      {
        itemId: 'bev-1',
        itemName: 'Red Bull Energy Drink (Can)',
        orderedQuantity: 48,
        receivedQuantity: 0,
        unitCostInPaise: 9500,
        totalCostInPaise: 456000,
      },
      {
        itemId: 'bev-2',
        itemName: 'Coca-Cola (Glass Bottle / Can)',
        orderedQuantity: 48,
        receivedQuantity: 0,
        unitCostInPaise: 2800,
        totalCostInPaise: 134400,
      },
    ],
    totalAmountInPaise: 590400,
    notes: 'Urgent weekend stock delivery for Kittu Cafe',
  },
  {
    _id: 'po-2',
    poNumber: 'PO-2026-002',
    supplierId: 'sup-3',
    supplierName: 'Chikmagalur Specialty Coffee Roasters',
    status: 'received',
    orderDate: new Date(Date.now() - 3600000 * 72).toISOString(),
    receivedDate: new Date(Date.now() - 3600000 * 12).toISOString(),
    invoiceNumber: 'INV-CHIK-9921',
    items: [
      {
        itemId: 'ing-1',
        itemName: '100% Arabica Coffee Beans (Whole)',
        orderedQuantity: 10,
        receivedQuantity: 10,
        unitCostInPaise: 110000,
        totalCostInPaise: 1100000,
      },
    ],
    totalAmountInPaise: 1100000,
    notes: 'Freshly roasted whole beans batch batch #882',
  },
  {
    _id: 'po-3',
    poNumber: 'PO-2026-003',
    supplierId: 'sup-2',
    supplierName: 'Rajasthan Fresh Dairy Cooperative',
    status: 'draft',
    orderDate: new Date().toISOString(),
    items: [
      {
        itemId: 'ing-2',
        itemName: 'Fresh Whole Dairy Milk',
        orderedQuantity: 30,
        receivedQuantity: 0,
        unitCostInPaise: 6500,
        totalCostInPaise: 195000,
      },
      {
        itemId: 'ing-4',
        itemName: '100% Mozzarella Pizza Cheese (Diced)',
        orderedQuantity: 10,
        receivedQuantity: 0,
        unitCostInPaise: 48000,
        totalCostInPaise: 480000,
      },
    ],
    totalAmountInPaise: 675000,
    notes: 'Weekly fresh dairy supply',
  },
];

export default function PurchaseOrdersPage() {
  const [pos, setPos] = useState<IPurchaseOrder[]>(DEMO_POS);
  const [selectedPO, setSelectedPO] = useState<IPurchaseOrder | null>(null);
  const [receivingInvoice, setReceivingInvoice] = useState('');
  const [isReceiving, setIsReceiving] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/admin/purchase-orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setPos(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleReceiveStock = (po: IPurchaseOrder) => {
    setIsReceiving(true);
    fetch(`http://localhost:5000/api/v1/admin/purchase-orders/${po._id}/receive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        invoiceNumber: receivingInvoice || `INV-AUTO-${Date.now().toString().slice(-4)}`,
        receivedItems: po.items.map((i) => ({
          itemId: i.itemId,
          receivedQuantity: i.orderedQuantity,
        })),
      }),
    })
      .catch(() => {})
      .finally(() => {
        setPos(
          pos.map((p) =>
            p._id === po._id
              ? {
                  ...p,
                  status: 'received',
                  receivedDate: new Date().toISOString(),
                  invoiceNumber: receivingInvoice || 'INV-RECEIVED-CONFIRMED',
                  items: p.items.map((i) => ({ ...i, receivedQuantity: i.orderedQuantity })),
                }
              : p
          )
        );
        setIsReceiving(false);
        setSelectedPO(null);
        setReceivingInvoice('');
      });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'received':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Received & In Stock
          </span>
        );
      case 'ordered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800">
            <Truck className="w-3 h-3 text-blue-600" />
            Ordered / In Transit
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3 text-amber-600" />
            Draft PO
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-stone-100 text-stone-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#D97736]">
            Procurement Pipeline
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#231709] tracking-tight mt-1">
            Purchase Orders & Receiving
          </h1>
          <p className="text-xs text-[#5D4037]">
            Issue purchase orders to suppliers and automatically update inventory and stock movement ledgers upon delivery.
          </p>
        </div>
      </div>

      {/* PO List */}
      <div className="grid grid-cols-1 gap-4">
        {pos.map((po) => (
          <div
            key={po._id}
            className="p-6 rounded-3xl bg-white border border-[#EBE0D2] shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#FAF6F0]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#D97736]">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-[#231709]">{po.poNumber}</span>
                    {getStatusBadge(po.status)}
                  </div>
                  <span className="text-xs text-stone-500 font-semibold block mt-0.5">
                    Vendor: {po.supplierName} &bull; Ordered on{' '}
                    {new Date(po.orderDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                    PO Value
                  </span>
                  <span className="text-base font-black text-[#231709]">
                    {formatPrice(po.totalAmountInPaise)}
                  </span>
                </div>

                {po.status === 'ordered' && (
                  <button
                    onClick={() => setSelectedPO(po)}
                    className="px-4 py-2 rounded-xl btn-3d-primary text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <PackageCheck className="w-3.5 h-3.5" />
                    <span>Receive Delivery</span>
                  </button>
                )}
              </div>
            </div>

            {/* Items in this PO */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block">
                Ordered Inventory Items
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {po.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-[#FAF6F0] border border-[#EBE0D2] text-xs space-y-1"
                  >
                    <span className="font-bold text-[#231709] block truncate">{item.itemName}</span>
                    <div className="flex justify-between text-stone-500 text-[11px]">
                      <span>Ordered: <strong>{item.orderedQuantity}</strong></span>
                      <span>Received: <strong>{item.receivedQuantity}</strong></span>
                    </div>
                    <div className="font-bold text-[#D97736] text-[11px]">
                      {formatPrice(item.totalCostInPaise)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {po.invoiceNumber && (
              <div className="pt-2 border-t border-[#FAF6F0] text-xs text-stone-500 font-medium">
                Invoice Reference: <span className="font-mono text-[#231709]">{po.invoiceNumber}</span>
                {po.receivedDate && (
                  <span>
                    {' '}&bull; Delivered on{' '}
                    {new Date(po.receivedDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Receive Stock Modal */}
      {selectedPO && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-[#EBE0D2] shadow-2xl">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#D97736]">
                Incoming Goods Verification
              </span>
              <h3 className="text-lg font-black text-[#231709] mt-0.5">
                Receive {selectedPO.poNumber}
              </h3>
              <p className="text-xs text-stone-500">
                Supplier: <strong>{selectedPO.supplierName}</strong>
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EBE0D2] space-y-2 text-xs">
              <span className="font-bold text-[#231709] block">Items to be incremented in stock:</span>
              <ul className="space-y-1 text-stone-600">
                {selectedPO.items.map((i, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{i.itemName}</span>
                    <span className="font-bold text-emerald-700">+{i.orderedQuantity} units</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#231709]">
                Supplier Invoice Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. INV-DB-88192"
                value={receivingInvoice}
                onChange={(e) => setReceivingInvoice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#FAF6F0]">
              <button
                type="button"
                onClick={() => setSelectedPO(null)}
                className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isReceiving}
                onClick={() => handleReceiveStock(selectedPO)}
                className="px-5 py-2.5 rounded-xl btn-3d-primary text-white text-xs font-black cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isReceiving ? 'Updating Inventory...' : 'Confirm Stock Receipt'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
