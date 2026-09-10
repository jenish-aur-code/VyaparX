import React, { useState, useEffect } from 'react';
import { X, Truck } from 'lucide-react';
import type { SaudaOrder, DispatchRecord } from '../../types';
import { dispatchService } from '../../services/dispatchService';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { formatISODate } from '../../utils/formatters';

interface DispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: SaudaOrder;
  onSuccess: () => void;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({
  isOpen,
  onClose,
  order,
  onSuccess,
}) => {
  const toast = useToast();
  const { palette } = useTheme();
  const [history, setHistory] = useState<DispatchRecord[]>([]);
  const [dispatchDate, setDispatchDate] = useState(formatISODate());
  const [quantity, setQuantity] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [transporter, setTransporter] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverContact, setDriverContact] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && order.id) {
      dispatchService.getBySaudaId(order.id).then(setHistory);
      const remaining = order.quantity - (order.dispatchedQuantity || 0);
      setQuantity(remaining > 0 ? String(remaining) : '');
    }
  }, [isOpen, order]);

  if (!isOpen) return null;

  const remainingQty = Math.max(0, order.quantity - (order.dispatchedQuantity || 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qtyNum = Number(quantity);
    if (!qtyNum || qtyNum <= 0) {
      toast.error('Please enter a valid dispatch quantity');
      return;
    }
    if (!vehicleNumber.trim()) {
      toast.error('Please enter vehicle number');
      return;
    }

    try {
      setIsSubmitting(true);
      await dispatchService.addDispatch({
        saudaId: order.id!,
        dispatchDate,
        quantity: qtyNum,
        vehicleNumber: vehicleNumber.trim().toUpperCase(),
        transporter: transporter.trim(),
        driverName: driverName.trim(),
        driverContact: driverContact.trim(),
        remarks: remarks.trim(),
        status: qtyNum >= remainingQty ? 'Completed' : 'Partial',
      });

      toast.success('Dispatch entry recorded successfully');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error('Failed to save dispatch entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-xl animate-in fade-in"
      style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
    >
      <div 
        className="w-full max-w-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-3xl rounded-3xl shadow-glass-hover overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 border border-white/70 dark:border-white/15"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200/50 dark:border-white/10 flex items-center justify-between bg-white/40 dark:bg-white/5 backdrop-blur-xs">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-9 h-9 rounded-xl text-white flex items-center justify-center shadow-glass"
              style={{ backgroundColor: palette.primary }}
            >
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-gray-100 text-base">Record Dispatch</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Vyapar #{order.id} • {order.itemName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Order Summary Status */}
          <div className="grid grid-cols-3 gap-2 p-3.5 glass-card-subtle rounded-2xl text-center text-xs">
            <div>
              <div className="text-gray-400 dark:text-gray-500 font-medium">Order Qty</div>
              <div className="font-bold text-gray-900 dark:text-gray-100 text-sm mt-0.5">{order.quantity} {order.unit}</div>
            </div>
            <div>
              <div className="text-gray-400 dark:text-gray-500 font-medium">Dispatched</div>
              <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">{order.dispatchedQuantity || 0} {order.unit}</div>
            </div>
            <div>
              <div className="text-gray-400 dark:text-gray-500 font-medium">Remaining</div>
              <div className="font-bold text-sm mt-0.5" style={{ color: palette.primary }}>{remainingQty} {order.unit}</div>
            </div>
          </div>

          <form id="dispatch-form" onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Dispatch Date *</label>
                <input
                  type="date"
                  required
                  value={dispatchDate}
                  onChange={e => setDispatchDate(e.target.value)}
                  className="input-sauda text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Quantity ({order.unit}) *</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder={`Max ${remainingQty}`}
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  className="input-sauda text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Vehicle Number *</label>
              <input
                type="text"
                required
                placeholder="Ex. GJ04 AB 1234"
                value={vehicleNumber}
                onChange={e => setVehicleNumber(e.target.value)}
                className="input-sauda text-xs uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Transporter Name</label>
                <input
                  type="text"
                  placeholder="Ex. Maruti Roadways"
                  value={transporter}
                  onChange={e => setTransporter(e.target.value)}
                  className="input-sauda text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Driver Contact</label>
                <input
                  type="text"
                  placeholder="Phone number"
                  value={driverContact}
                  onChange={e => setDriverContact(e.target.value)}
                  className="input-sauda text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Remarks</label>
              <input
                type="text"
                placeholder="Optional notes or lr no."
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                className="input-sauda text-xs"
              />
            </div>
          </form>

          {/* Past History */}
          {history.length > 0 && (
            <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
              <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Previous Dispatches</h4>
              <div className="space-y-2">
                {history.map(item => (
                  <div key={item.id} className="p-2.5 bg-gray-50 dark:bg-gray-900 rounded-lg text-xs flex justify-between items-center border border-gray-200 dark:border-gray-700">
                    <div>
                      <span className="font-bold text-gray-900 dark:text-gray-100">{item.quantity} {order.unit}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-2">({item.vehicleNumber})</span>
                      <div className="text-[10px] text-gray-400">{item.dispatchDate} • {item.transporter || 'Self'}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-gray-200/50 dark:border-white/10 flex gap-3 bg-white/40 dark:bg-white/5 backdrop-blur-xs">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 border border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl hover:bg-white/60 dark:hover:bg-white/10 text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="dispatch-form"
            disabled={isSubmitting}
            style={{ backgroundColor: palette.primary }}
            className="flex-1 py-2.5 px-4 text-white font-bold rounded-2xl text-sm shadow-glass-card hover:shadow-glass-hover transition-all disabled:opacity-50 hover:opacity-90"
          >
            {isSubmitting ? 'Saving...' : 'Save Dispatch'}
          </button>
        </div>
      </div>
    </div>
  );
};
