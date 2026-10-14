'use client';

import React, { useState, useEffect } from 'react';
import {
  Truck,
  Plus,
  Phone,
  Mail,
  MapPin,
  FileText,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { ISupplier } from '@kittu-cafe/shared';

const DEMO_SUPPLIERS: ISupplier[] = [
  {
    _id: 'sup-1',
    name: 'Dausa Beverage & Cold Drinks Distributors',
    contactPerson: 'Sunil Sharma',
    phone: '+91 94140 12345',
    email: 'dausa.beverages@example.com',
    address: 'Agra Road, Industrial Area, Dausa 303303',
    gstin: '08AAAAA0000A1Z5',
    paymentTerms: 'Net 15 Days',
    categoriesSupplied: ['Energy Drinks', 'Soft Drinks', 'Packaged Water'],
    isActive: true,
  },
  {
    _id: 'sup-2',
    name: 'Rajasthan Fresh Dairy Cooperative',
    contactPerson: 'Mahesh Gujjar',
    phone: '+91 98290 67890',
    email: 'dairy.dausa@example.com',
    address: 'Sainthal Road, Dausa, Rajasthan',
    gstin: '08BBBBB1111B1Z6',
    paymentTerms: 'Weekly Cash / UPI',
    categoriesSupplied: ['Fresh Milk', 'Paneer', 'Butter', 'Curd'],
    isActive: true,
  },
  {
    _id: 'sup-3',
    name: 'Chikmagalur Specialty Coffee Roasters',
    contactPerson: 'Arun Iyer',
    phone: '+91 80234 56789',
    email: 'orders@chikmagalur-beans.in',
    address: 'Estate #4, Chikmagalur, Karnataka',
    gstin: '29CCCCC2222C1Z7',
    paymentTerms: 'Immediate Advance via NEFT',
    categoriesSupplied: ['100% Arabica Beans', 'Espresso Roasts'],
    isActive: true,
  },
  {
    _id: 'sup-4',
    name: 'Dausa Sabzi Mandi Local Farmers Guild',
    contactPerson: 'Ramkishan Saini',
    phone: '+91 97850 43210',
    address: 'Mandi Yard, Railway Station Road, Dausa',
    paymentTerms: 'Daily Cash Settlement',
    categoriesSupplied: ['Tomatoes', 'Capsicum', 'Onions', 'Potatoes'],
    isActive: true,
  },
];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<ISupplier[]>(DEMO_SUPPLIERS);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    gstin: '',
    paymentTerms: 'Net 15 Days',
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/admin/suppliers')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setSuppliers(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.contactPerson || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.phone || '').includes(search)
  );

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplier.name || !newSupplier.phone) return;

    const created: ISupplier = {
      _id: 'sup-' + Date.now(),
      ...newSupplier,
      categoriesSupplied: ['General Supplies'],
      isActive: true,
    };

    fetch('http://localhost:5000/api/v1/admin/suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(created),
    }).catch(() => {});

    setSuppliers([...suppliers, created]);
    setIsModalOpen(false);
    setNewSupplier({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      gstin: '',
      paymentTerms: 'Net 15 Days',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#D97736]">
            Vendor Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#231709] tracking-tight mt-1">
            Suppliers Directory
          </h1>
          <p className="text-xs text-[#5D4037]">
            Authorized beverage distributors, dairy farms, coffee bean roasters, and local produce vendors in Dausa.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl btn-3d-primary text-white text-xs font-black flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Supplier</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-stone-400 shrink-0" />
        <input
          type="text"
          placeholder="Search suppliers by business name, contact person, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-transparent focus:outline-none text-[#231709]"
        />
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSuppliers.map((supplier) => (
          <div
            key={supplier._id}
            className="p-6 rounded-3xl bg-white border border-[#EBE0D2] shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#D97736] shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#231709]">{supplier.name}</h3>
                    <span className="text-[11px] text-stone-500 font-semibold">
                      Contact: {supplier.contactPerson}
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Active
                </span>
              </div>

              {/* Contact and address details */}
              <div className="space-y-1.5 text-xs text-[#5D4037] pt-2 border-t border-[#FAF6F0]">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#D97736]" />
                  <a href={`tel:${supplier.phone}`} className="hover:underline font-bold">
                    {supplier.phone}
                  </a>
                </div>
                {supplier.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#D97736]" />
                    <span>{supplier.email}</span>
                  </div>
                )}
                {supplier.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#D97736] shrink-0 mt-0.5" />
                    <span>{supplier.address}</span>
                  </div>
                )}
                {supplier.gstin && (
                  <div className="flex items-center gap-2 font-mono text-[11px] text-stone-600 pt-1">
                    <FileText className="w-3.5 h-3.5 text-[#D97736]" />
                    <span>GSTIN: {supplier.gstin}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-[#FAF6F0] flex items-center justify-between text-xs">
              <span className="text-[11px] font-semibold text-stone-500">
                Terms: <strong>{supplier.paymentTerms || 'Standard'}</strong>
              </span>
              <div className="flex flex-wrap gap-1">
                {(supplier.categoriesSupplied || []).map((cat) => (
                  <span
                    key={cat}
                    className="px-2 py-0.5 rounded-md bg-[#FAF6F0] border border-[#EBE0D2] text-[10px] font-semibold text-[#5D4037]"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Supplier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-[#EBE0D2] shadow-2xl">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#D97736]">
                Vendor Registration
              </span>
              <h3 className="text-lg font-black text-[#231709] mt-0.5">
                Register New Supplier
              </h3>
            </div>

            <form onSubmit={handleAddSupplier} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#231709]">Vendor / Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jaipur Beverage Wholesalers"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={newSupplier.contactPerson}
                    onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">GSTIN (Optional)</label>
                  <input
                    type="text"
                    placeholder="08AAAAA0000A1Z5"
                    value={newSupplier.gstin}
                    onChange={(e) => setNewSupplier({ ...newSupplier, gstin: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Payment Terms</label>
                  <select
                    value={newSupplier.paymentTerms}
                    onChange={(e) => setNewSupplier({ ...newSupplier, paymentTerms: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736] bg-white cursor-pointer"
                  >
                    <option value="Net 15 Days">Net 15 Days</option>
                    <option value="Net 30 Days">Net 30 Days</option>
                    <option value="Immediate Cash / UPI">Immediate Cash / UPI</option>
                    <option value="Weekly Settlement">Weekly Settlement</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#231709]">Vendor Address in Dausa / Rajasthan</label>
                <input
                  type="text"
                  placeholder="Street / Industrial Area, City"
                  value={newSupplier.address}
                  onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#FAF6F0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl btn-3d-primary text-white text-xs font-black cursor-pointer shadow-xs"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
