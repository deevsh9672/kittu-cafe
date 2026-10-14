'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  Search,
} from 'lucide-react';
import { IMenuCategory } from '@kittu-cafe/shared';

const DEFAULT_CATEGORIES: IMenuCategory[] = [
  { _id: 'c1', name: 'Hot & Cold Coffee', sortOrder: 1, isActive: true },
  { _id: 'c2', name: 'Burgers & Sandwiches', sortOrder: 2, isActive: true },
  { _id: 'c3', name: 'Pizzas & Garlic Breads', sortOrder: 3, isActive: true },
  { _id: 'c4', name: 'Snacks & Sides', sortOrder: 4, isActive: true },
  { _id: 'c5', name: 'Desserts & Shakes', sortOrder: 5, isActive: true },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<IMenuCategory[]>(DEFAULT_CATEGORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<IMenuCategory | null>(null);
  const [name, setName] = useState('');
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/menu/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setCategories(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setSortOrder(categories.length + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: IMenuCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSortOrder(cat.sortOrder);
    setIsActive(cat.isActive);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCategory) {
      setCategories(
        categories.map((c) =>
          c._id === editingCategory._id ? { ...c, name, sortOrder, isActive } : c
        )
      );
    } else {
      const newCat: IMenuCategory = {
        _id: 'c' + Date.now(),
        name,
        sortOrder,
        isActive,
      };
      setCategories([...categories, newCat]);
    }

    setIsModalOpen(false);
  };

  const handleToggleActive = (id: string) => {
    setCategories(
      categories.map((c) => (c._id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#D97736]">
            Catalog Hierarchy
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#231709] tracking-tight mt-1">
            Menu Categories
          </h1>
          <p className="text-xs text-[#5D4037]">
            Organize dishes into customer-facing digital menu sections with custom display orders.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl btn-3d-primary text-white text-xs font-black flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="rounded-3xl bg-white border border-[#EBE0D2] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF6F0] border-b border-[#EBE0D2] text-[10px] font-black uppercase text-[#5D4037] tracking-wider">
            <tr>
              <th className="p-4 text-center w-16">Sort</th>
              <th className="p-4">Category Name</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FAF6F0]">
            {categories
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((cat) => (
                <tr key={cat._id} className="hover:bg-[#FFFDFB] transition-colors">
                  <td className="p-4 text-center font-mono font-bold text-stone-600">
                    #{cat.sortOrder}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#D97736] shrink-0">
                        <Layers className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-sm text-[#231709]">{cat.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleToggleActive(cat._id)}
                      className="cursor-pointer"
                    >
                      {cat.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Visible on Menu
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-stone-200 text-stone-700">
                          <XCircle className="w-3 h-3 text-stone-500" />
                          Hidden
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="px-3 py-1.5 rounded-xl border border-[#EBE0D2] bg-white hover:bg-[#FAF6F0] text-xs font-bold text-[#231709] transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-[#EBE0D2] shadow-2xl">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#D97736]">
                Category Configuration
              </span>
              <h3 className="text-lg font-black text-[#231709] mt-0.5">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#231709]">Category Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artisanal Mocktails & Shakes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#231709]">Display Sequence Order</label>
                <input
                  type="number"
                  required
                  value={sortOrder}
                  onChange={(e) => setSortOrder(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-[#D97736] focus:ring-[#D97736]"
                />
                <label htmlFor="activeCheck" className="text-xs font-bold text-[#231709] cursor-pointer">
                  Publish actively to Customer Digital Menu
                </label>
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
