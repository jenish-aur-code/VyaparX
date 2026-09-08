import React, { useState, useEffect } from 'react';
import { Truck, Search, Plus, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { DispatchModal } from '../../components/operations/DispatchModal';
import { saudaService } from '../../services/saudaService';
import { useApp } from '../../context/AppContext';
import type { SaudaOrder } from '../../types';
import { formatDate } from '../../utils/formatters';

export const SaudaDispatchPage: React.FC = () => {
  const { currentCompany, currentFinancialYear } = useApp();
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
    <div className="min-h-screen bg-[#F5F7FA] pb-24 md:pb-12">
      <PageHeader
        title="Sauda Dispatch"
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
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200/90 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#FF9800] transition-all placeholder-gray-400 card-shadow"
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
                className="bg-white rounded-2xl p-4 card-shadow border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-orange-100 text-orange-900">
                      #{order.id}
                    </span>
                    <span className="font-extrabold text-base text-gray-900">{order.itemName}</span>
                    <span className="text-xs text-gray-500 font-medium">({order.itemQuality})</span>
                  </div>

                  <div className="text-xs text-gray-600">
                    <strong>Seller:</strong> {order.sellerName} ➔ <strong>Buyer:</strong> {order.buyerName}
                  </div>

                  <div className="flex items-center gap-3 text-xs pt-1">
                    <span className="text-gray-500">Order: <strong>{order.quantity} {order.unit}</strong></span>
                    <span className="text-emerald-700 font-bold">Dispatched: {dispatched}</span>
                    <span className="text-orange-700 font-bold">Remaining: {remaining}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : dispatched > 0
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
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
                    className="py-2 px-3.5 bg-[#FF9800] hover:bg-[#F57C00] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
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
