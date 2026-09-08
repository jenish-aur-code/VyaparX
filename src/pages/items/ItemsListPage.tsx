import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, Plus } from 'lucide-react';
import { itemService } from '../../services/itemService';
import type { Item } from '../../types';
import { PageHeader } from '../../components/layout/PageHeader';
import { useTheme } from '../../context/ThemeContext';

export const ItemsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { palette } = useTheme();
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const data = await itemService.search(searchQuery);
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [searchQuery]);

  return (
    <div className="min-h-[calc(100vh-60px)] pb-24 md:pb-12 bg-[#F5F7FA] dark:bg-[#0B1120] transition-colors">
      {/* Header Replicating Screenshot 4 */}
      <PageHeader
        title={`ITEM DETAIL (${items.length})`}
        subtitle="Manage your commodity items"
        onRefresh={fetchItems}
      />

      <div className="p-4 md:p-6 space-y-4 max-w-3xl mx-auto">
        {/* Search Bar matching screenshot */}
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-800 border border-gray-200/90 dark:border-gray-700 rounded-2xl text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[var(--primary)] transition-all placeholder-gray-400 dark:placeholder-gray-500 card-shadow"
          />
        </div>

        {/* Item Cards List */}
        <div className="space-y-3">
          {items.map(item => (
            <div
              key={item.id}
              onClick={() => navigate(`/items/edit/${item.id}`)}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 card-shadow border border-gray-100/80 dark:border-gray-700 cursor-pointer hover:border-[var(--primary)] transition-all flex items-start gap-3.5 group"
            >
              {/* Box Icon in Theme Circle */}
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 border"
                style={{ backgroundColor: palette.light, borderColor: palette.primary + '33', color: palette.primary }}
              >
                <Package className="w-6 h-6 stroke-[2.2]" />
              </div>

              {/* Details matching screenshot 4 */}
              <div className="flex-1 min-w-0">
                <h3 className="font-extrabold text-base text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                  {item.name}
                </h3>
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mt-1">
                  UNIT: {item.unit}
                </div>
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-0.5">
                  RATE: {item.sellerCommissionRate} (Seller) | {item.buyerCommissionRate} (Buyer)
                </div>
                <div className="text-xs text-gray-400 italic mt-1 group-hover:text-[var(--primary)] transition-colors">
                  Tap to view or edit
                </div>
              </div>
            </div>
          ))}

          {!isLoading && items.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <div className="font-bold text-gray-700 dark:text-gray-200">No commodity items found</div>
              <p className="text-xs text-gray-400 mt-1">Click the + button below to add your first item.</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button (+) matching screenshot 4 */}
      <button
        type="button"
        onClick={() => navigate('/items/new')}
        style={{ backgroundColor: palette.primary }}
        className="fixed bottom-20 md:bottom-8 right-6 z-40 w-14 h-14 text-white rounded-2xl shadow-xl flex items-center justify-center transition-all active:scale-95 hover:opacity-90"
        aria-label="Add Item"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>
    </div>
  );
};
