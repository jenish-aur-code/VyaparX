import React, { useState, useEffect } from 'react';
import { X, CreditCard } from 'lucide-react';
import type { SaudaOrder, PaymentRecord } from '../../types';
import { paymentService } from '../../services/paymentService';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatISODate } from '../../utils/formatters';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: SaudaOrder;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  order,
  onSuccess,
}) => {
  const toast = useToast();
  const [history, setHistory] = useState<PaymentRecord[]>([]);
  const [paymentDate, setPaymentDate] = useState(formatISODate());
  const [amount, setAmount] = useState('');
  const [partyType, setPartyType] = useState<'buyer' | 'seller'>('buyer');
  const [paymentMode, setPaymentMode] = useState<PaymentRecord['paymentMode']>('Bank Transfer');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && order.id) {
      paymentService.getBySaudaId(order.id).then(setHistory);
      const remaining = Math.max(0, order.totalBillAmount - (order.paidAmount || 0));
      setAmount(remaining > 0 ? String(remaining) : '');
    }
  }, [isOpen, order]);

  if (!isOpen) return null;

  const remainingAmt = Math.max(0, order.totalBillAmount - (order.paidAmount || 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amtNum = Number(amount);
    if (!amtNum || amtNum <= 0) {
      toast.error('Please enter a valid payment amount');
      return;
    }

    try {
      setIsSubmitting(true);
      await paymentService.addPayment({
        saudaId: order.id!,
        partyType,
        paymentDate,
        amount: amtNum,
        paymentMode,
        referenceNumber: referenceNumber.trim(),
        remarks: remarks.trim(),
      });

      toast.success('Payment recorded successfully');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error('Failed to record payment');
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
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">Record Payment</h2>
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
          {/* Amount Status Card */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 rounded-xl text-center text-xs border border-gray-200">
            <div>
              <div className="text-gray-400 font-medium">Bill Amount</div>
              <div className="font-bold text-gray-900 text-xs mt-0.5">{formatCurrency(order.totalBillAmount)}</div>
            </div>
            <div>
              <div className="text-gray-400 font-medium">Paid</div>
              <div className="font-bold text-emerald-600 text-xs mt-0.5">{formatCurrency(order.paidAmount || 0)}</div>
            </div>
            <div>
              <div className="text-gray-400 font-medium">Remaining</div>
              <div className="font-bold text-red-600 text-xs mt-0.5">{formatCurrency(remainingAmt)}</div>
            </div>
          </div>

          <form id="payment-form" onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Payment Date *</label>
                <input
                  type="date"
                  required
                  value={paymentDate}
                  onChange={e => setPaymentDate(e.target.value)}
                  className="input-sauda text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="Amount"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="input-sauda text-xs font-bold text-emerald-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Party</label>
                <select
                  value={partyType}
                  onChange={e => setPartyType(e.target.value as 'buyer' | 'seller')}
                  className="input-sauda text-xs font-semibold"
                >
                  <option value="buyer">Buyer ({order.buyerName})</option>
                  <option value="seller">Seller ({order.sellerName})</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Payment Mode</label>
                <select
                  value={paymentMode}
                  onChange={e => setPaymentMode(e.target.value as PaymentRecord['paymentMode'])}
                  className="input-sauda text-xs font-semibold"
                >
                  <option value="Bank Transfer">Bank Transfer / NEFT</option>
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Reference / UTR / Cheque No.</label>
              <input
                type="text"
                placeholder="Ex. UTR12345678"
                value={referenceNumber}
                onChange={e => setReferenceNumber(e.target.value)}
                className="input-sauda text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Remarks</label>
              <input
                type="text"
                placeholder="Optional notes"
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                className="input-sauda text-xs"
              />
            </div>
          </form>

          {/* Past Payments History */}
          {history.length > 0 && (
            <div className="pt-3 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Previous Payments</h4>
              <div className="space-y-2">
                {history.map(item => (
                  <div key={item.id} className="p-2.5 bg-gray-50 rounded-lg text-xs flex justify-between items-center border border-gray-200">
                    <div>
                      <span className="font-bold text-emerald-700">{formatCurrency(item.amount)}</span>
                      <span className="text-gray-500 ml-2">via {item.paymentMode}</span>
                      <div className="text-[10px] text-gray-400">
                        {item.paymentDate} • {item.partyType === 'buyer' ? 'Received from Buyer' : 'Paid to Seller'}
                        {item.referenceNumber ? ` • Ref: ${item.referenceNumber}` : ''}
                      </div>
                    </div>
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
            form="payment-form"
            disabled={isSubmitting}
            className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-sm transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};
