import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Info, Package, Scale, Binary, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { itemService } from '../../services/itemService';
import { useToast } from '../../context/ToastContext';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useTheme } from '../../context/ThemeContext';

export const AddEditItemPage: React.FC = () => {
  const navigate = useNavigate();
  const { palette } = useTheme();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const toast = useToast();

  const [name, setName] = useState('');
  const [sellerRate, setSellerRate] = useState('2.8');
  const [buyerRate, setBuyerRate] = useState('2.6');
  const [unit, setUnit] = useState('100');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      itemService.getById(Number(id)).then(item => {
        if (item) {
          setName(item.name);
          setSellerRate(String(item.sellerCommissionRate));
          setBuyerRate(String(item.buyerCommissionRate));
          setUnit(item.unit);
        } else {
          toast.error('Item not found');
          navigate('/items');
        }
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter Item Name');
      return;
    }

    try {
      setIsSubmitting(true);
      const itemData = {
        name: name.trim().toUpperCase(),
        sellerCommissionRate: Number(sellerRate) || 0,
        buyerCommissionRate: Number(buyerRate) || 0,
        unit: unit.trim() || '100',
      };

      if (isEdit && id) {
        await itemService.update(Number(id), itemData);
        toast.success('Item updated successfully');
      } else {
        await itemService.create(itemData);
        toast.success('Item created successfully');
      }
      navigate('/items');
    } catch (err) {
      toast.error('Failed to save item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (id) {
      await itemService.delete(Number(id));
      toast.success('Item deleted successfully');
      navigate('/items');
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-12 transition-colors">
      <PageHeader
        title={isEdit ? 'Edit Item' : 'Add Item'}
        rightAction={
          isEdit ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
              title="Delete Item"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          ) : null
        }
      />

      <div className="p-4 md:p-6 max-w-xl mx-auto space-y-5">
        {/* Info Banner matching screenshot 5 */}
        <div 
          className="p-4 rounded-2xl flex items-start gap-3 text-xs font-medium leading-relaxed glass-card-subtle"
          style={{ borderColor: palette.primary + '33', color: palette.text }}
        >
          <Info className="w-5 h-5 shrink-0 mt-0.5" style={{ color: palette.primary }} />
          <span>
            Fields marked with a red <span className="text-red-500 font-bold">*</span> are mandatory. Other details are optional and can be added later.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="glass-card p-5 md:p-6 rounded-3xl space-y-4">
            <h2 className="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: palette.primary }}></span>
              Item Details
            </h2>

            {/* Item Name */}
            <div>
              <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-1.5 uppercase">
                Item Name <span className="text-red-500 font-bold">*</span>
              </label>
              <div className="relative">
                <Package className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ex. KAPAS"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="input-vyapar pl-12 pr-4 py-3.5 font-bold text-sm uppercase"
                />
              </div>
            </div>

            {/* Commission Rate (Seller) */}
            <div>
              <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-1.5 uppercase">
                Commission Rate (Seller)
              </label>
              <div className="relative">
                <Binary className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  step="any"
                  placeholder="2.8"
                  value={sellerRate}
                  onChange={e => setSellerRate(e.target.value)}
                  className="input-vyapar pl-12 pr-4 py-3.5 font-bold text-sm"
                />
              </div>
            </div>

            {/* Commission Rate (Buyer) */}
            <div>
              <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-1.5 uppercase">
                Commission Rate (Buyer)
              </label>
              <div className="relative">
                <Binary className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  step="any"
                  placeholder="2.6"
                  value={buyerRate}
                  onChange={e => setBuyerRate(e.target.value)}
                  className="input-vyapar pl-12 pr-4 py-3.5 font-bold text-sm"
                />
              </div>
            </div>

            {/* Unit */}
            <div>
              <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-1.5 uppercase">
                Unit
              </label>
              <div className="relative">
                <Scale className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="100"
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  className="input-vyapar pl-12 pr-4 py-3.5 font-bold text-sm uppercase"
                />
              </div>
            </div>

            {/* Dynamic Summary Box matching screenshot 5 */}
            <div className="p-4 bg-sky-500/10 dark:bg-sky-500/15 border border-sky-500/30 rounded-2xl flex items-start gap-3 text-xs text-sky-800 dark:text-sky-300 font-semibold leading-relaxed backdrop-blur-md shadow-glass-card">
              <Info className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div>Seller Comm: <strong>{sellerRate || '0'}</strong> per <strong>{unit || '100'}</strong></div>
                <div>Buyer Comm: <strong>{buyerRate || '0'}</strong> per <strong>{unit || '100'}</strong></div>
              </div>
            </div>
          </div>

          {/* Create Item Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ backgroundColor: palette.primary }}
            className="w-full py-4 px-4 text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-glass-card hover:shadow-glass-hover transition-all duration-150 active:scale-[0.98] hover:opacity-90 disabled:opacity-50 mt-4"
          >
            {isSubmitting ? 'SAVING...' : isEdit ? 'UPDATE ITEM' : 'CREATE ITEM'}
          </button>
        </form>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Item?"
        message="Are you sure you want to delete this commodity item? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};
