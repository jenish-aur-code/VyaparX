import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { saudaService } from '../../services/saudaService';
import { useToast } from '../../context/ToastContext';
import type { SaudaOrder } from '../../types';
import { calculateBillAmount, calculateCommission } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';

export const EditSaudaPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();

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
          navigate('/sauda');
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

      toast.success('Sauda order updated successfully');
      navigate('/sauda');
    } catch (err) {
      toast.error('Failed to update Sauda order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24 md:pb-12">
      <PageHeader title={`Edit Sauda #${order.id}`} />

      <div className="p-4 md:p-6 max-w-xl mx-auto">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="p-4 bg-white rounded-2xl border border-gray-200 card-shadow space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="font-extrabold text-base text-gray-900">{order.itemName}</span>
              <span className="text-xs font-bold text-gray-500">Date: {order.date}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Quantity *</label>
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
                <label className="block text-xs font-bold text-gray-700 mb-1">Unit</label>
                <input
                  type="text"
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  className="input-sauda font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Bill Rate *</label>
              <input
                type="number"
                step="any"
                required
                value={billRate}
                onChange={e => setBillRate(e.target.value)}
                className="input-sauda font-bold border-2 border-[#FF9800]"
              />
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl flex justify-between font-bold text-xs text-emerald-800">
              <span>Total Bill Amount:</span>
              <span className="text-sm font-black">{formatCurrency(totalBillAmount)}</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Quality / Variety</label>
              <input
                type="text"
                value={itemQuality}
                onChange={e => setItemQuality(e.target.value)}
                className="input-sauda text-xs uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Bill No.</label>
              <input
                type="text"
                value={billNo}
                onChange={e => setBillNo(e.target.value)}
                className="input-sauda text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Seller ({order.sellerName}) Comm.
                </label>
                <input
                  type="number"
                  step="any"
                  value={sellerCommRate}
                  onChange={e => setSellerCommRate(e.target.value)}
                  className="input-sauda text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Buyer ({order.buyerName}) Comm.
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
              <label className="block text-xs font-bold text-gray-700 mb-1">Payment Terms</label>
              <input
                type="text"
                value={paymentTerms}
                onChange={e => setPaymentTerms(e.target.value)}
                className="input-sauda text-xs uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Delivery Terms</label>
              <input
                type="text"
                value={deliveryTerms}
                onChange={e => setDeliveryTerms(e.target.value)}
                className="input-sauda text-xs uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Remark</label>
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
            className="btn-primary"
          >
            {isSubmitting ? 'Updating...' : 'Update Sauda Order'}
          </button>
        </form>
      </div>
    </div>
  );
};
