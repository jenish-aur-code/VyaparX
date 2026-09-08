import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CheckCircle2, ChevronDown } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { SearchSelectModal, type SelectOption } from '../../components/common/SearchSelectModal';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { itemService } from '../../services/itemService';
import { partyService } from '../../services/partyService';
import { saudaService } from '../../services/saudaService';
import { quickValueService } from '../../services/quickValueService';
import type { Item, Party } from '../../types';
import { calculateBillAmount, calculateCommission } from '../../utils/calculations';
import { formatCurrency, formatISODate } from '../../utils/formatters';

export const CreateSaudaPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { currentCompany, currentFinancialYear } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Entities
  const [items, setItems] = useState<Item[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [quickValues, setQuickValues] = useState<Record<string, string[]>>({});

  // Step 1: Item Data
  const [date, setDate] = useState(formatISODate());
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemQuality, setItemQuality] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('100');
  const [billRate, setBillRate] = useState('');
  const [withGST, setWithGST] = useState(false);
  const [gstPercent, setGstPercent] = useState('5');
  const [billNo, setBillNo] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [deliveryTerms, setDeliveryTerms] = useState('');
  const [remark, setRemark] = useState('');
  const [termsConditions, setTermsConditions] = useState(
    'Our responsibility and duty are restricted to communication and coordination only.'
  );

  // Step 2: Seller Data
  const [selectedSellerId, setSelectedSellerId] = useState<number | null>(null);
  const [sellerName, setSellerName] = useState('');
  const [sellerCommRate, setSellerCommRate] = useState('2.8');
  const [sellerContactPerson, setSellerContactPerson] = useState('');

  // Step 3: Buyer Data
  const [selectedBuyerId, setSelectedBuyerId] = useState<number | null>(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerCommRate, setBuyerCommRate] = useState('2.6');
  const [buyerContactPerson, setBuyerContactPerson] = useState('');

  // Modal selector states
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [isBuyerModalOpen, setIsBuyerModalOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch initial lookups
  useEffect(() => {
    Promise.all([
      itemService.getAll(),
      partyService.getAll(),
      quickValueService.getAll(),
    ]).then(([fetchedItems, fetchedParties, fetchedQV]) => {
      setItems(fetchedItems);
      setParties(fetchedParties);

      // Group quick values
      const qvMap: Record<string, string[]> = {};
      fetchedQV.forEach(q => {
        if (!qvMap[q.category]) qvMap[q.category] = [];
        qvMap[q.category].push(q.value);
      });
      setQuickValues(qvMap);

      // Auto-select first item if available
      if (fetchedItems.length > 0) {
        const first = fetchedItems[0];
        setSelectedItemId(first.id!);
        setItemName(first.name);
        setUnit(first.unit || '100');
        setSellerCommRate(String(first.sellerCommissionRate || 2.8));
        setBuyerCommRate(String(first.buyerCommissionRate || 2.6));
      }
    });
  }, []);

  // Dynamically calculate bill amounts
  const { subtotal, gstAmount, totalBillAmount } = useMemo(() => {
    return calculateBillAmount(
      Number(quantity) || 0,
      Number(billRate) || 0,
      withGST,
      Number(gstPercent) || 5
    );
  }, [quantity, billRate, withGST, gstPercent]);

  // Dynamically calculate commissions
  const sellerCommissionAmount = useMemo(() => {
    return calculateCommission(Number(quantity) || 0, Number(sellerCommRate) || 0);
  }, [quantity, sellerCommRate]);

  const buyerCommissionAmount = useMemo(() => {
    return calculateCommission(Number(quantity) || 0, Number(buyerCommRate) || 0);
  }, [quantity, buyerCommRate]);

  // Convert items and parties to SearchSelectModal options matching screenshots 21 & 22
  const itemOptions: SelectOption[] = useMemo(() => {
    return items.map(item => ({
      id: item.id!,
      title: item.name,
      subtitle: `UNIT: ${item.unit} • SELLER: ${item.sellerCommissionRate} • BUYER: ${item.buyerCommissionRate}`,
      raw: item,
    }));
  }, [items]);

  const partyOptions: SelectOption[] = useMemo(() => {
    return parties.map(p => ({
      id: p.id!,
      title: p.name,
      subtitle: `ID: ${p.id} • ${p.city || 'BOTAD'} • ${p.state || 'GUJARAT'}`,
      raw: p,
    }));
  }, [parties]);

  // Step 1 Validation & Next
  const handleNextFromItem = () => {
    if (!itemName) {
      toast.error('Please select an Item Name');
      return;
    }
    if (!quantity || Number(quantity) <= 0) {
      toast.error('Please enter a valid Quantity');
      return;
    }
    if (!billRate || Number(billRate) <= 0) {
      toast.error('Please enter Bill Rate');
      return;
    }
    setStep(2);
  };

  // Step 2 Validation & Next
  const handleNextFromSeller = () => {
    if (!sellerName) {
      toast.error('Please select a Seller');
      return;
    }
    setStep(3);
  };

  // Step 3 Save Order to IndexedDB
  const handleSaveOrder = async () => {
    if (!buyerName) {
      toast.error('Please select a Buyer');
      return;
    }
    if (selectedSellerId === selectedBuyerId) {
      toast.error('Seller and Buyer cannot be the same party');
      return;
    }

    try {
      setIsSubmitting(true);
      await saudaService.create({
        companyId: currentCompany?.id || 1,
        financialYear: currentFinancialYear || '2026-2027',
        date,
        itemId: selectedItemId || 1,
        itemName,
        itemQuality: itemQuality || 'STANDARD',
        quantity: Number(quantity),
        unit,
        billRate: Number(billRate),
        withGST,
        gstPercent: Number(gstPercent) || 5,
        gstAmount,
        totalBillAmount,
        billNo: billNo || `ORD-${Date.now().toString().slice(-4)}`,
        paymentTerms,
        deliveryTerms,
        remark,
        termsConditions,
        sellerId: selectedSellerId || 1,
        sellerName,
        sellerCommissionRate: Number(sellerCommRate),
        sellerCommissionAmount,
        sellerContactPerson,
        buyerId: selectedBuyerId || 2,
        buyerName,
        buyerCommissionRate: Number(buyerCommRate),
        buyerCommissionAmount,
        buyerContactPerson,
        dispatchStatus: 'Pending',
        paymentStatus: 'Pending',
      });

      toast.success('Sauda order saved successfully');
      navigate('/sauda');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save Sauda order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24 md:pb-12">
      {/* Header Replicating Screenshot 18/19 */}
      <PageHeader title="Create Sauda Order" />

      <div className="p-4 md:p-6 max-w-xl mx-auto space-y-5">
        {/* 3-Step Indicator Bar Replicating Screenshots 18, 19, 20 */}
        <div className="grid grid-cols-3 gap-2">
          {/* Step 1: Item */}
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-all ${
              step === 1
                ? 'bg-[#FF9800] text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            {step > 1 ? (
              <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" />
            ) : (
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center text-[9px]"></div>
            )}
            <span>Item</span>
          </button>

          {/* Step 2: Seller */}
          <button
            type="button"
            onClick={() => {
              if (quantity && billRate) setStep(2);
            }}
            className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-all ${
              step === 2
                ? 'bg-[#FF9800] text-white shadow-xs'
                : step > 2
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-white text-gray-400 border border-gray-200'
            }`}
          >
            {step > 2 ? (
              <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" />
            ) : step === 2 ? (
              <Check className="w-4 h-4 stroke-[3]" />
            ) : (
              <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300"></div>
            )}
            <span>Seller</span>
          </button>

          {/* Step 3: Buyer */}
          <button
            type="button"
            onClick={() => {
              if (quantity && billRate && sellerName) setStep(3);
            }}
            className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-all ${
              step === 3
                ? 'bg-[#FF9800] text-white shadow-xs'
                : 'bg-white text-gray-400 border border-gray-200'
            }`}
          >
            {step === 3 ? (
              <Check className="w-4 h-4 stroke-[3]" />
            ) : (
              <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300"></div>
            )}
            <span>Buyer</span>
          </button>
        </div>

        {/* STEP 1: ITEM FORM (Replicating Screenshots 19 & 20) */}
        {step === 1 && (
          <div className="space-y-4">
            {/* DATE */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                DATE
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="input-sauda font-semibold"
              />
            </div>

            {/* ITEM NAME * */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                ITEM NAME <span className="text-red-500 font-bold">*</span>
              </label>
              <div
                onClick={() => setIsItemModalOpen(true)}
                className="input-sauda flex items-center justify-between cursor-pointer font-bold uppercase text-gray-900"
              >
                <span>{itemName || 'SELECT ITEM NAME'}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* ITEM QUALITY / VARIETY */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                ITEM QUALITY / VARIETY
              </label>
              <input
                type="text"
                placeholder="EX. 1 GADI, 50 BORI 40 Kg ,30-40 M.TON, etc."
                value={itemQuality}
                onChange={e => setItemQuality(e.target.value)}
                className="input-sauda font-medium uppercase text-xs"
              />
              {/* Quick Values Chips */}
              {quickValues.quality && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {quickValues.quality.slice(0, 4).map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setItemQuality(val)}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-800 font-semibold transition-colors"
                    >
                      + {val}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* QUANTITY & UNIT */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                  QUANTITY <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="EX. 200"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  className="input-sauda font-extrabold text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                  UNIT
                </label>
                <input
                  type="text"
                  placeholder="EX. KG"
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  className="input-sauda font-bold text-gray-900"
                />
              </div>
            </div>

            {/* BILL RATE * */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                BILL RATE <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="number"
                step="any"
                required
                placeholder="EX. 10,000"
                value={billRate}
                onChange={e => setBillRate(e.target.value)}
                className="input-sauda font-extrabold text-gray-900 border-2 border-[#FF9800]"
              />
            </div>

            {/* Total Bill Amount Calculated Box (Matching Screenshot 20: ₹18,62,496.00) */}
            {quantity && billRate && (
              <div className="p-3.5 bg-[#E8F5E9] border border-emerald-200 rounded-2xl flex items-center justify-between text-sm font-bold text-emerald-800 shadow-xs animate-in fade-in">
                <span>Total Bill Amount:</span>
                <span className="text-lg font-black">{formatCurrency(totalBillAmount)}</span>
              </div>
            )}

            {/* WITH GST Checkbox */}
            <div className="flex items-center gap-2.5 py-1">
              <input
                type="checkbox"
                id="withGST"
                checked={withGST}
                onChange={e => setWithGST(e.target.checked)}
                className="w-5 h-5 text-[#FF9800] rounded border-gray-300 focus:ring-[#FF9800]"
              />
              <label htmlFor="withGST" className="text-xs font-extrabold text-gray-800 uppercase tracking-wider cursor-pointer">
                WITH GST
              </label>
            </div>

            {withGST && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">GST Percentage:</span>
                  <select
                    value={gstPercent}
                    onChange={e => setGstPercent(e.target.value)}
                    className="p-1.5 bg-white border border-gray-300 rounded-lg font-bold"
                  >
                    <option value="5">5% (Commodity/Cotton)</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>
                <div className="flex justify-between font-bold text-gray-800 pt-1 border-t border-gray-200">
                  <span>GST Amount:</span>
                  <span>{formatCurrency(gstAmount)}</span>
                </div>
              </div>
            )}

            {/* BILL NO. & PAYMENT TERMS (Progressive fields from Screenshot 20) */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                BILL NO.
              </label>
              <input
                type="text"
                placeholder="EX. 0123"
                value={billNo}
                onChange={e => setBillNo(e.target.value)}
                className="input-sauda font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                PAYMENT TERMS
              </label>
              <input
                type="text"
                placeholder="EX. VAR TO VAR"
                value={paymentTerms}
                onChange={e => setPaymentTerms(e.target.value)}
                className="input-sauda font-medium uppercase"
              />
              {quickValues.paymentTerms && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {quickValues.paymentTerms.map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setPaymentTerms(val)}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-800 font-semibold transition-colors"
                    >
                      + {val}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                DELIVERY TERMS
              </label>
              <input
                type="text"
                placeholder="EX. NEXT DAY"
                value={deliveryTerms}
                onChange={e => setDeliveryTerms(e.target.value)}
                className="input-sauda font-medium uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                REMARK
              </label>
              <input
                type="text"
                placeholder="EX. 10% moisture"
                value={remark}
                onChange={e => setRemark(e.target.value)}
                className="input-sauda font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                TERMS & CONDITIONS
              </label>
              <textarea
                rows={2}
                value={termsConditions}
                onChange={e => setTermsConditions(e.target.value)}
                className="input-sauda font-medium text-xs leading-relaxed"
              />
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNextFromItem}
              disabled={!quantity || !billRate}
              className="btn-primary mt-6 disabled:opacity-50 disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        )}

        {/* STEP 2: SELLER FORM (Replicating Screenshot 18) */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            {/* SELLER NAME * */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                NAME <span className="text-red-500 font-bold">*</span>
              </label>
              <div
                onClick={() => setIsSellerModalOpen(true)}
                className="input-sauda flex items-center justify-between cursor-pointer font-bold uppercase text-gray-900"
              >
                <span>{sellerName || 'SELECT SELLER'}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* COMM. RATE */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                COMM. RATE
              </label>
              <input
                type="number"
                step="any"
                value={sellerCommRate}
                onChange={e => setSellerCommRate(e.target.value)}
                className="input-sauda font-extrabold text-gray-900"
              />
            </div>

            {/* Commission Amount Banner (Matching Screenshot 18: ₹806.40) */}
            <div className="p-3.5 bg-[#E8F5E9] border border-emerald-200 rounded-2xl flex items-center justify-between text-sm font-bold text-emerald-800 shadow-xs">
              <span>Commission Amount:</span>
              <span className="text-lg font-black">{formatCurrency(sellerCommissionAmount)}</span>
            </div>

            {/* SELLER CONTACT PERSON */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                SELLER CONTACT PERSON
              </label>
              <input
                type="text"
                placeholder="Eg. Sharma"
                value={sellerContactPerson}
                onChange={e => setSellerContactPerson(e.target.value)}
                className="input-sauda font-medium"
              />
            </div>

            {/* Buttons: Previous and Next */}
            <div className="flex gap-3 mt-6 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3.5 px-4 bg-[#FF9800] hover:bg-[#F57C00] text-white font-bold rounded-xl shadow-xs transition-all"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNextFromSeller}
                disabled={!sellerName}
                className="flex-1 py-3.5 px-4 bg-[#FF9800] hover:bg-[#F57C00] text-white font-bold rounded-xl shadow-xs transition-all disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: BUYER FORM (Replicating Screenshot 22) */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            {/* BUYER NAME * */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                NAME <span className="text-red-500 font-bold">*</span>
              </label>
              <div
                onClick={() => setIsBuyerModalOpen(true)}
                className="input-sauda flex items-center justify-between cursor-pointer font-bold uppercase text-gray-900"
              >
                <span>{buyerName || 'SELECT BUYER'}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* COMM. RATE */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                COMM. RATE
              </label>
              <input
                type="number"
                step="any"
                value={buyerCommRate}
                onChange={e => setBuyerCommRate(e.target.value)}
                className="input-sauda font-extrabold text-gray-900"
              />
            </div>

            {/* Commission Amount Banner */}
            <div className="p-3.5 bg-[#E1F5FE] border border-sky-200 rounded-2xl flex items-center justify-between text-sm font-bold text-sky-800 shadow-xs">
              <span>Commission Amount:</span>
              <span className="text-lg font-black">{formatCurrency(buyerCommissionAmount)}</span>
            </div>

            {/* BUYER CONTACT PERSON */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                BUYER CONTACT PERSON
              </label>
              <input
                type="text"
                placeholder="Eg. Sharma"
                value={buyerContactPerson}
                onChange={e => setBuyerContactPerson(e.target.value)}
                className="input-sauda font-medium"
              />
            </div>

            {/* Buttons: Previous and SAVE */}
            <div className="flex gap-3 mt-6 pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 py-3.5 px-4 bg-[#FF9800] hover:bg-[#F57C00] text-white font-bold rounded-xl shadow-xs transition-all"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleSaveOrder}
                disabled={!buyerName || isSubmitting}
                className="flex-1 py-3.5 px-4 bg-[#FF9800] hover:bg-[#F57C00] text-white font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'SAVING...' : 'SAVE'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Item Search Selector Modal (Replicating Screenshots 21 & 22) */}
      <SearchSelectModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        title="Select Commodity Item"
        placeholder="Search items..."
        options={itemOptions}
        onSelect={opt => {
          const itm = opt.raw as Item;
          setSelectedItemId(itm.id!);
          setItemName(itm.name);
          setUnit(itm.unit || '100');
          setSellerCommRate(String(itm.sellerCommissionRate || 2.8));
          setBuyerCommRate(String(itm.buyerCommissionRate || 2.6));
        }}
      />

      {/* Seller Search Selector Modal (Replicating Screenshot 21) */}
      <SearchSelectModal
        isOpen={isSellerModalOpen}
        onClose={() => setIsSellerModalOpen(false)}
        title="Select Seller Party"
        placeholder="Search..."
        options={partyOptions}
        onSelect={opt => {
          const p = opt.raw as Party;
          setSelectedSellerId(p.id!);
          setSellerName(p.name);
        }}
      />

      {/* Buyer Search Selector Modal (Replicating Screenshot 22) */}
      <SearchSelectModal
        isOpen={isBuyerModalOpen}
        onClose={() => setIsBuyerModalOpen(false)}
        title="Select Buyer Party"
        placeholder="Search..."
        options={partyOptions}
        onSelect={opt => {
          const p = opt.raw as Party;
          setSelectedBuyerId(p.id!);
          setBuyerName(p.name);
        }}
      />
    </div>
  );
};
