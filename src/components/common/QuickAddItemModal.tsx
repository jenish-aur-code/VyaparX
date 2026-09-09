import React, { useState } from 'react';
import { X, Package, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { itemService } from '../../services/itemService';
import type { Item } from '../../types';

interface QuickAddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemCreated: (item: Item) => void;
}

const COMMON_UNITS = ['100', 'KG', 'M.TON', 'BAGS', 'BALES'];

export const QuickAddItemModal: React.FC<QuickAddItemModalProps> = ({
  isOpen,
  onClose,
  onItemCreated,
}) => {
  const { palette } = useTheme();
  const toast = useToast();

  const [name, setName] = useState('');
  const [unit, setUnit] = useState('100');
  const [sellerRate, setSellerRate] = useState('2.8');
  const [buyerRate, setBuyerRate] = useState('2.6');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter Item Name');
      return;
    }

    try {
      setIsSubmitting(true);
      const itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt'> = {
        name: name.trim().toUpperCase(),
        unit: unit.trim() || '100',
        sellerCommissionRate: Number(sellerRate) || 0,
        buyerCommissionRate: Number(buyerRate) || 0,
      };

      const newId = await itemService.create(itemData);
      const createdItem = await itemService.getById(newId);

      if (createdItem) {
        toast.success(`Item "${createdItem.name}" added successfully`);
        onItemCreated(createdItem);
      }
      onClose();

      // Reset form
      setName('');
      setUnit('100');
      setSellerRate('2.8');
      setBuyerRate('2.6');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="px-5 py-4 text-white flex items-center justify-between shadow-xs"
          style={{ backgroundColor: palette.primary }}
        >
          <div className="flex items-center gap-2.5">
            <Package className="w-5 h-5 stroke-[2.5]" />
            <h2 className="font-extrabold text-base tracking-wide uppercase">Add New Item</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-black/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* ITEM NAME */}
          <div>
            <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-1.5">
              ITEM NAME <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. KAPAS, COTTON, KHOL"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-bold uppercase text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          {/* UNIT */}
          <div>
            <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-1.5">
              UNIT
            </label>
            <input
              type="text"
              placeholder="100"
              value={unit}
              onChange={e => setUnit(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[var(--primary)]"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {COMMON_UNITS.map(u => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-colors border ${
                    unit === u
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-transparent hover:bg-gray-200'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* COMMISSION RATES */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-1.5">
                SELLER COMM. RATE
              </label>
              <input
                type="number"
                step="any"
                placeholder="2.8"
                value={sellerRate}
                onChange={e => setSellerRate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-1.5">
                BUYER COMM. RATE
              </label>
              <input
                type="number"
                step="any"
                placeholder="2.6"
                value={buyerRate}
                onChange={e => setBuyerRate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-xs hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              style={{ backgroundColor: palette.primary }}
              className="flex-2 py-3 px-4 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{isSubmitting ? 'Saving...' : 'Save Item'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
