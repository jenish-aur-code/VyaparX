import React, { useState, useEffect } from 'react';
import { X, Truck } from 'lucide-react';
import type { SaudaOrder, DispatchRecord } from '../../types';
import { dispatchService } from '../../services/dispatchService';
import { useToast } from '../../context/ToastContext';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-orange-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FF9800] text-white flex items-center justify-center shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">Record Dispatch</h2>
              <p className="text-xs text-gray-500">Sauda #{order.id} • {order.itemName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Order Summary Status */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 rounded-xl text-center text-xs border border-gray-200">
            <div>
              <div className="text-gray-400 font-medium">Order Qty</div>
              <div className="font-bold text-gray-900 text-sm mt-0.5">{order.quantity} {order.unit}</div>
            </div>
            <div>
              <div className="text-gray-400 font-medium">Dispatched</div>
              <div className="font-bold text-emerald-600 text-sm mt-0.5">{order.dispatchedQuantity || 0} {order.unit}</div>
            </div>
            <div>
              <div className="text-gray-400 font-medium">Remaining</div>
              <div className="font-bold text-orange-600 text-sm mt-0.5">{remainingQty} {order.unit}</div>
            </div>
          </div>

          <form id="dispatch-form" onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Dispatch Date *</label>
                <input
                  type="date"
                  required
                  value={dispatchDate}
                  onChange={e => setDispatchDate(e.target.value)}
                  className="input-sauda text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Quantity ({order.unit}) *</label>
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
              <label className="block text-xs font-bold text-gray-700 mb-1">Vehicle Number *</label>
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
                <label className="block text-xs font-bold text-gray-700 mb-1">Transporter Name</label>
                <input
                  type="text"
                  placeholder="Ex. Maruti Roadways"
                  value={transporter}
                  onChange={e => setTransporter(e.target.value)}
                  className="input-sauda text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Driver Contact</label>
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
              <label className="block text-xs font-bold text-gray-700 mb-1">Remarks</label>
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
            <div className="pt-3 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Previous Dispatches</h4>
              <div className="space-y-2">
                {history.map(item => (
                  <div key={item.id} className="p-2.5 bg-gray-50 rounded-lg text-xs flex justify-between items-center border border-gray-200">
                    <div>
                      <span className="font-bold text-gray-900">{item.quantity} {order.unit}</span>
                      <span className="text-gray-500 ml-2">({item.vehicleNumber})</span>
                      <div className="text-[10px] text-gray-400">{item.dispatchDate} • {item.transporter || 'Self'}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-gray-100 flex gap-3 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-white text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="dispatch-form"
            disabled={isSubmitting}
            className="flex-1 py-2.5 px-4 bg-[#FF9800] hover:bg-[#F57C00] text-white font-bold rounded-xl text-sm shadow-sm transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Dispatch'}
          </button>
        </div>
      </div>
    </div>
  );
};
