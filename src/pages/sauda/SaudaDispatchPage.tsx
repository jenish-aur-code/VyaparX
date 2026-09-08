import React, { useState, useEffect } from 'react';
import { Truck, Search, Plus, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { DispatchModal } from '../../components/operations/DispatchModal';
import { saudaService } from '../../services/saudaService';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import type { SaudaOrder } from '../../types';
import { formatDate } from '../../utils/formatters';

export const SaudaDispatchPage: React.FC = () => {
  const { currentCompany, currentFinancialYear } = useApp();
  const { palette } = useTheme();
  const [orders, setOrders] = useState<SaudaOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<SaudaOrder | null>(null);

  const fetchOrders = async () => {
    const data = await saudaService.getAll({
      companyId: currentCompany?.id,
      financialYear: currentFinancialYear,
      query: searchQuery,
    });
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, [currentCompany?.id, currentFinancialYear, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0B1120] pb-24 md:pb-12 transition-colors">
      <PageHeader
        title="Vyapar Dispatch"
        subtitle="Manage dispatch tracking, vehicle numbers, and delivery status"
        onRefresh={fetchOrders}
      />

      <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by #ID, party or item..."
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-800 border border-gray-200/90 dark:border-gray-700 rounded-2xl text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[var(--primary)] transition-all placeholder-gray-400 dark:placeholder-gray-500 card-shadow"
          />
        </div>

        {/* Dispatch Orders List */}
        <div className="space-y-3">
          {orders.map(order => {
            const dispatched = order.dispatchedQuantity || 0;
            const remaining = Math.max(0, order.quantity - dispatched);
            const isCompleted = order.dispatchStatus === 'Completed' || remaining === 0;

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 card-shadow border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-xs font-black px-2.5 py-0.5 rounded-lg"
                      style={{ backgroundColor: palette.light, color: palette.text }}
                    >
                      #{order.id}
                    </span>
                    <span className="font-extrabold text-base text-gray-900 dark:text-gray-100">{order.itemName}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">({order.itemQuality})</span>
                  </div>

                  <div className="text-xs text-gray-600 dark:text-gray-300">
                    <strong>Seller:</strong> {order.sellerName} ➔ <strong>Buyer:</strong> {order.buyerName}
                  </div>

                  <div className="flex items-center gap-3 text-xs pt-1">
                    <span className="text-gray-500 dark:text-gray-400">Order: <strong>{order.quantity} {order.unit}</strong></span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">Dispatched: {dispatched}</span>
                    <span className="text-orange-700 dark:text-orange-400 font-bold">Remaining: {remaining}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      isCompleted
                        ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                        : dispatched > 0
                        ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300'
                        : 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                    <span>{order.dispatchStatus || 'Pending'}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    style={{ backgroundColor: palette.primary }}
                    className="py-2 px-3.5 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all hover:opacity-90"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Dispatch</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedOrder && (
        <DispatchModal
          isOpen={Boolean(selectedOrder)}
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSuccess={fetchOrders}
        />
      )}
    </div>
  );
};
