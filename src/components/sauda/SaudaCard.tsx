import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Calendar, Share2, Trash2, Truck, CreditCard } from 'lucide-react';
import type { SaudaOrder } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface SaudaCardProps {
  order: SaudaOrder;
  onShare: (order: SaudaOrder) => void;
  onDelete: (order: SaudaOrder) => void;
  onDispatch: (order: SaudaOrder) => void;
  onPayment: (order: SaudaOrder) => void;
}

export const SaudaCard: React.FC<SaudaCardProps> = ({
  order,
  onShare,
  onDelete,
  onDispatch,
  onPayment,
}) => {
  const navigate = useNavigate();

  return (
    <div 
      className="bg-white rounded-2xl p-4 card-shadow border border-gray-100/80 transition-all hover:border-orange-200"
    >
      {/* Top Header: Item Name Badge + Bill Rate */}
      <div className="flex items-center justify-between mb-3">
        <span className="px-3 py-1 bg-amber-100/70 text-amber-900 font-bold text-xs rounded-lg uppercase tracking-wider">
          {order.itemName}
        </span>
        <div className="text-sm font-bold text-gray-900">
          <span className="text-xs text-gray-500 font-normal mr-1">BILL RATE:</span>
          {formatCurrency(order.billRate, 0)}
        </div>
      </div>

      {/* Seller & Buyer 2-Column Cards */}
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        {/* Seller Subcard */}
        <div className="bg-[#E8F5E9] p-3 rounded-xl border border-emerald-100 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-emerald-700 tracking-wider">SELLER</span>
          <div className="font-extrabold text-gray-900 text-sm mt-0.5 truncate uppercase">
            {order.sellerName}
          </div>
          <div className="text-[10px] font-semibold text-gray-600 mt-1">
            COMM. RATE: {order.sellerCommissionRate}
          </div>
        </div>

        {/* Buyer Subcard */}
        <div className="bg-[#E1F5FE] p-3 rounded-xl border border-sky-100 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-sky-700 tracking-wider">BUYER</span>
          <div className="font-extrabold text-gray-900 text-sm mt-0.5 truncate uppercase">
            {order.buyerName}
          </div>
          <div className="text-[10px] font-semibold text-gray-600 mt-1">
            COMM. RATE: {order.buyerCommissionRate}
          </div>
        </div>
      </div>

      {/* Quantity & Unit Row */}
      <div className="flex items-center gap-2 text-xs text-gray-700 font-bold mb-2">
        <Scale className="w-4 h-4 text-gray-500 shrink-0" />
        <span>QUANTITY: {Number(order.quantity).toFixed(2)}</span>
        <span className="text-gray-500 font-normal">{order.unit}</span>
      </div>

      {/* Date, ID & Action Buttons Row */}
      <div className="flex items-center justify-between py-1 mb-2">
        <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
          <div className="flex items-center gap-1.5 text-orange-600 font-bold">
            <Calendar className="w-4 h-4 text-[#FF9800]" />
            <span>{formatDate(order.date)}</span>
          </div>
          <span className="text-gray-400"># ID: {order.id}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onShare(order);
            }}
            className="w-9 h-9 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors shadow-xs"
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
            className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors shadow-xs"
            title="Delete Sauda"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tap to view or edit link */}
      <div 
        onClick={() => navigate(`/sauda/edit/${order.id}`)}
        className="text-center text-xs text-gray-400 italic cursor-pointer hover:text-orange-500 py-1 transition-colors"
      >
        Tap to view or edit
      </div>

      {/* Dispatch & Payment Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-2 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onDispatch(order);
          }}
          className="w-full py-2.5 px-3 rounded-xl border border-[#FF9800] text-[#FF9800] hover:bg-orange-50 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          <Truck className="w-4 h-4 stroke-[2.2]" />
          <span>Dispatch</span>
          {order.dispatchStatus === 'Completed' && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Completed"></span>
          )}
        </button>

        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onPayment(order);
          }}
          className="w-full py-2.5 px-3 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          <CreditCard className="w-4 h-4 stroke-[2.2]" />
          <span>Payment</span>
          {order.paymentStatus === 'Paid' && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Paid"></span>
          )}
        </button>
      </div>
    </div>
  );
};
