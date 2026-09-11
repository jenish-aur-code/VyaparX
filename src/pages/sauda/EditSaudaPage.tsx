import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { saudaService } from '../../services/saudaService';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import type { SaudaOrder } from '../../types';
import { calculateBillAmount, calculateCommission } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';

export const EditSaudaPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const { palette } = useTheme();

  const [order, setOrder] = useState<SaudaOrder | null>(null);
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [billRate, setBillRate] = useState('');
  const [itemQuality, setItemQuality] = useState('');
  const [sellerCommRate, setSellerCommRate] = useState('');
  const [buyerCommRate, setBuyerCommRate] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [deliveryTerms, setDeliveryTerms] = useState('');
  const [remark, setRemark] = useState('');
  const [billNo, setBillNo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      saudaService.getById(Number(id)).then(ord => {
        if (ord) {
          setOrder(ord);
          setQuantity(String(ord.quantity));
          setUnit(ord.unit);
          setBillRate(String(ord.billRate));
          setItemQuality(ord.itemQuality);
          setSellerCommRate(String(ord.sellerCommissionRate));
          setBuyerCommRate(String(ord.buyerCommissionRate));
          setPaymentTerms(ord.paymentTerms || '');
          setDeliveryTerms(ord.deliveryTerms || '');
          setRemark(ord.remark || '');
          setBillNo(ord.billNo || '');
        } else {
          toast.error('Order not found');
          navigate('/vyapar');
        }
      });
    }
  }, [id]);

  if (!order) return null;

  const { totalBillAmount } = calculateBillAmount(
    Number(quantity) || 0,
    Number(billRate) || 0,
    order.withGST,
    order.gstPercent
  );

  const sellerCommAmt = calculateCommission(Number(quantity) || 0, Number(sellerCommRate) || 0);
  const buyerCommAmt = calculateCommission(Number(quantity) || 0, Number(buyerCommRate) || 0);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await saudaService.update(order.id!, {
        quantity: Number(quantity),
        unit,
        billRate: Number(billRate),
        itemQuality,
        totalBillAmount,
        sellerCommissionRate: Number(sellerCommRate),
        sellerCommissionAmount: sellerCommAmt,
        buyerCommissionRate: Number(buyerCommRate),
        buyerCommissionAmount: buyerCommAmt,
        paymentTerms,
        deliveryTerms,
        remark,
        billNo,
      });

      toast.success('Vyapar order updated successfully');
      navigate('/vyapar');
    } catch (err) {
      toast.error('Failed to update Vyapar order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-12 transition-colors">
      <PageHeader title={`Edit Vyapar #${order.id}`} />

      <div className="p-4 md:p-6 max-w-xl mx-auto">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="liquid-glass-card p-5 md:p-6 rounded-3xl space-y-4 shadow-glass-card">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200/60 dark:border-white/10">
              <span className="font-extrabold text-base text-gray-900 dark:text-gray-100">{order.itemName}</span>
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Date: {order.date}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-1.5">
                  QUANTITY <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  className="input-sauda font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-1.5">
                  UNIT
                </label>
                <input
                  type="text"
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  className="input-sauda font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-1.5">
                BILL RATE <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="number"
                step="any"
                required
                value={billRate}
                onChange={e => setBillRate(e.target.value)}
                style={{ borderColor: palette.primary }}
                className="input-sauda font-bold border-2"
              />
            </div>

            <div className="p-3.5 sm:p-4 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-2xl flex flex-wrap justify-between items-center gap-2 font-bold text-xs text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 backdrop-blur-md shadow-glass-card">
              <span className="uppercase tracking-wider font-extrabold text-[11px] sm:text-xs text-emerald-700 dark:text-emerald-300">Total Bill Amount:</span>
              <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 break-all">{formatCurrency(totalBillAmount)}</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-1.5">
                QUALITY / VARIETY
              </label>
              <input
                type="text"
                value={itemQuality}
                onChange={e => setItemQuality(e.target.value)}
                className="input-sauda text-xs uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-1.5">
                BILL NO.
              </label>
              <input
                type="text"
                value={billNo}
                onChange={e => setBillNo(e.target.value)}
                className="input-sauda text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-3 border-t border-gray-200/60 dark:border-white/10 min-w-0">
              <div className="min-w-0">
                <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-1.5 truncate" title={`Seller (${order.sellerName}) Comm.`}>
                  SELLER COMM.
                  <span className="block text-[10px] text-gray-400 dark:text-gray-500 truncate font-normal">({order.sellerName})</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={sellerCommRate}
                  onChange={e => setSellerCommRate(e.target.value)}
                  className="input-sauda text-xs font-bold"
                />
              </div>
              <div className="min-w-0">
                <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-1.5 truncate" title={`Buyer (${order.buyerName}) Comm.`}>
                  BUYER COMM.
                  <span className="block text-[10px] text-gray-400 dark:text-gray-500 truncate font-normal">({order.buyerName})</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={buyerCommRate}
                  onChange={e => setBuyerCommRate(e.target.value)}
                  className="input-sauda text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-1.5">
                PAYMENT TERMS
              </label>
              <input
                type="text"
                value={paymentTerms}
                onChange={e => setPaymentTerms(e.target.value)}
                className="input-sauda text-xs uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-1.5">
                DELIVERY TERMS
              </label>
              <input
                type="text"
                value={deliveryTerms}
                onChange={e => setDeliveryTerms(e.target.value)}
                className="input-sauda text-xs uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-1.5">
                REMARK
              </label>
              <input
                type="text"
                value={remark}
                onChange={e => setRemark(e.target.value)}
                className="input-sauda text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{ backgroundColor: palette.primary }}
            className="btn-primary hover:opacity-90 transition-opacity rounded-2xl shadow-glass-card hover:shadow-glass-hover flex items-center justify-center gap-2"
          >
            <Save className={`w-4 h-4 stroke-[2.5] ${isSubmitting ? 'animate-spin' : ''}`} />
            <span>{isSubmitting ? 'UPDATING...' : 'UPDATE VYAPAR ORDER'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
