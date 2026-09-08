import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Zap } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { quickValueService } from '../../services/quickValueService';
import { useToast } from '../../context/ToastContext';
import type { QuickValue } from '../../types';

export const QuickValuesPage: React.FC = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<QuickValue['category']>('paymentTerms');
  const [items, setItems] = useState<QuickValue[]>([]);
  const [newValue, setNewValue] = useState('');

  const loadValues = async () => {
    const all = await quickValueService.getAll();
    setItems(all.filter(i => i.category === activeTab));
  };

  useEffect(() => {
    loadValues();
  }, [activeTab]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValue.trim()) return;

    try {
      await quickValueService.add(activeTab, newValue.trim().toUpperCase());
      toast.success('Quick value added');
      setNewValue('');
      loadValues();
    } catch (err) {
      toast.error('Failed to add quick value');
    }
  };

  const handleDelete = async (id: number) => {
    await quickValueService.delete(id);
    toast.success('Quick value removed');
    loadValues();
  };

  const tabs: { key: QuickValue['category']; label: string }[] = [
    { key: 'paymentTerms', label: 'Payment Terms' },
    { key: 'deliveryTerms', label: 'Delivery Terms' },
    { key: 'remark', label: 'Remarks' },
    { key: 'quality', label: 'Quality / Variety' },
    { key: 'unit', label: 'Units' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24 md:pb-12">
      <PageHeader
        title="Manage Quick Values"
        subtitle="Shortcuts for repetitive order fields"
      />

      <div className="p-4 md:p-6 max-w-xl mx-auto space-y-5">
        {/* Category Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
          {tabs.map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-[#FF9800] text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Add Input */}
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            required
            placeholder={`Add new ${activeTab}...`}
            value={newValue}
            onChange={e => setNewValue(e.target.value)}
            className="input-sauda uppercase text-xs flex-1"
          />
          <button
            type="submit"
            className="px-4 py-3 bg-[#FF9800] hover:bg-[#F57C00] text-white font-bold rounded-xl text-xs flex items-center gap-1 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>

        {/* List of shortcuts */}
        <div className="bg-white rounded-2xl border border-gray-200 card-shadow divide-y divide-gray-100 overflow-hidden">
          {items.map(item => (
            <div key={item.id} className="p-3.5 flex items-center justify-between hover:bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-gray-800 uppercase">{item.value}</span>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(item.id!)}
                className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {items.length === 0 && (
            <div className="p-8 text-center text-xs text-gray-400">
              No quick values in this category yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
