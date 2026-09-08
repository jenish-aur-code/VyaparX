import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Calendar, Share2, Trash2 } from 'lucide-react';
import type { SaudaOrder } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface SaudaCardProps {
  order: SaudaOrder;
  onShare: (order: SaudaOrder) => void;
  onDelete: (order: SaudaOrder) => void;
}

export const SaudaCard: React.FC<SaudaCardProps> = ({
  order,
  onShare,
  onDelete,
}) => {
  const navigate = useNavigate();

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-2xl p-4 card-shadow border border-gray-100/80 dark:border-gray-700 transition-all hover:border-orange-200 dark:hover:border-gray-600"
    >
      {/* Top Header: Item Name Badge + Bill Rate */}
      <div className="flex items-center justify-between mb-3">
        <span className="px-3 py-1 bg-amber-100/70 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 font-bold text-xs rounded-lg uppercase tracking-wider">
          {order.itemName}
        </span>
        <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-normal mr-1">BILL RATE:</span>
          {formatCurrency(order.billRate, 0)}
        </div>
      </div>

      {/* Seller & Buyer 2-Column Cards */}
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        {/* Seller Subcard */}
        <div className="bg-[#E8F5E9] dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-100 dark:border-emerald-800 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">SELLER</span>
          <div className="font-extrabold text-gray-900 dark:text-gray-100 text-sm mt-0.5 truncate uppercase">
            {order.sellerName}
          </div>
          <div className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 mt-1">
            COMM. RATE: {order.sellerCommissionRate}
          </div>
        </div>

        {/* Buyer Subcard */}
        <div className="bg-[#E1F5FE] dark:bg-sky-950/40 p-3 rounded-xl border border-sky-100 dark:border-sky-800 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-sky-700 dark:text-sky-400 tracking-wider">BUYER</span>
          <div className="font-extrabold text-gray-900 dark:text-gray-100 text-sm mt-0.5 truncate uppercase">
            {order.buyerName}
          </div>
          <div className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 mt-1">
            COMM. RATE: {order.buyerCommissionRate}
          </div>
        </div>
      </div>

      {/* Quantity & Unit Row */}
      <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 font-bold mb-2">
        <Scale className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
        <span>QUANTITY: {Number(order.quantity).toFixed(2)}</span>
        <span className="text-gray-500 dark:text-gray-400 font-normal">{order.unit}</span>
      </div>

      {/* Date, ID & Action Buttons Row */}
      <div className="flex items-center justify-between py-1 mb-2">
        <div className="flex items-center gap-4 text-xs font-semibold text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-bold">
            <Calendar className="w-4 h-4 text-[#FF9800]" />
            <span>{formatDate(order.date)}</span>
          </div>
          <span className="text-gray-400 dark:text-gray-500"># ID: {order.id}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onShare(order);
            }}
            className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-colors shadow-xs"
            title="Share Sauda PDF"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onDelete(order);
            }}
            className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 flex items-center justify-center transition-colors shadow-xs"
            title="Delete Sauda"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tap to view or edit link */}
      <div 
        onClick={() => navigate(`/sauda/edit/${order.id}`)}
        className="text-center text-xs text-gray-400 dark:text-gray-500 italic cursor-pointer hover:text-orange-500 pt-2 border-t border-gray-100 dark:border-gray-700 transition-colors"
      >
        Tap to view or edit
      </div>
    </div>
  );
};
