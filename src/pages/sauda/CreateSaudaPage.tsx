import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CheckCircle2, ChevronDown } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { SearchSelectModal, type SelectOption } from '../../components/common/SearchSelectModal';
import { QuickAddItemModal } from '../../components/common/QuickAddItemModal';
import { QuickAddPartyModal } from '../../components/common/QuickAddPartyModal';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
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
  const { palette } = useTheme();

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

  // Quick creation modal states
  const [isQuickAddItemOpen, setIsQuickAddItemOpen] = useState(false);
  const [isQuickAddPartyOpen, setIsQuickAddPartyOpen] = useState(false);
  const [quickAddPartyContext, setQuickAddPartyContext] = useState<'seller' | 'buyer'>('seller');

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

  // Seller party options excluding currently selected buyer party
  const sellerPartyOptions: SelectOption[] = useMemo(() => {
    return parties
      .filter(p => !selectedBuyerId || p.id !== selectedBuyerId)
      .map(p => ({
        id: p.id!,
        title: p.name,
        subtitle: `ID: ${p.id} • ${p.city || 'BOTAD'} • ${p.state || 'GUJARAT'}`,
        raw: p,
      }));
  }, [parties, selectedBuyerId]);

  // Buyer party options excluding currently selected seller party
  const buyerPartyOptions: SelectOption[] = useMemo(() => {
    return parties
      .filter(p => !selectedSellerId || p.id !== selectedSellerId)
      .map(p => ({
        id: p.id!,
        title: p.name,
        subtitle: `ID: ${p.id} • ${p.city || 'BOTAD'} • ${p.state || 'GUJARAT'}`,
        raw: p,
      }));
  }, [parties, selectedSellerId]);

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

      toast.success('Vyapar order saved successfully');
      navigate('/vyapar');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save Vyapar order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-12 transition-colors">
      {/* Header Replicating Screenshot 18/19 */}
      <PageHeader title="Create Vyapar Order" />

      <div className="p-4 md:p-6 max-w-xl mx-auto space-y-5">
        {/* 3-Step Wizard Indicator matching Image 4 */}
        <div className="liquid-glass-card p-4 sm:p-5 rounded-3xl shadow-glass-card">
          <div className="relative flex items-center justify-between max-w-sm sm:max-w-md mx-auto px-2">
            {/* Step 1: Item */}
            <button
              type="button"
              onClick={() => setStep(1)}
              className="relative z-10 flex flex-col items-center group focus:outline-none transition-transform active:scale-95"
            >
              <div
                style={step >= 1 ? { backgroundColor: palette.primary } : {}}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shadow-md ${
                  step >= 1
                    ? 'text-white shadow-glass'
                    : 'bg-white/60 dark:bg-card-dark text-gray-400 border-2 border-gray-300 dark:border-gray-600'
                }`}
              >
                {step > 1 ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                ) : (
                  <span>1</span>
                )}
              </div>
              <span
                style={step === 1 ? { color: palette.primary } : {}}
                className={`mt-1.5 text-xs sm:text-sm font-bold tracking-tight transition-colors ${
                  step === 1
                    ? 'font-extrabold'
                    : step > 1
                    ? 'text-gray-700 dark:text-gray-300'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                Item
              </span>
            </button>

            {/* Connecting Track 1 -> 2 */}
            <div className="flex-1 h-[2.5px] mx-2 -mt-5 bg-gray-200 dark:bg-white/10 relative rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300 rounded-full"
                style={{
                  backgroundColor: palette.primary,
                  width: step >= 2 ? '100%' : '0%',
                }}
              />
            </div>

            {/* Step 2: Seller */}
            <button
              type="button"
              onClick={() => {
                if (quantity && billRate) setStep(2);
              }}
              disabled={!quantity || !billRate}
              className="relative z-10 flex flex-col items-center group focus:outline-none transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div
                style={step >= 2 ? { backgroundColor: palette.primary } : {}}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shadow-md ${
                  step >= 2
                    ? 'text-white shadow-glass'
                    : 'bg-white/60 dark:bg-card-dark text-gray-400 border-2 border-gray-300 dark:border-gray-600'
                }`}
              >
                {step > 2 ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                ) : (
                  <span>2</span>
                )}
              </div>
              <span
                style={step === 2 ? { color: palette.primary } : {}}
                className={`mt-1.5 text-xs sm:text-sm font-bold tracking-tight transition-colors ${
                  step === 2
                    ? 'font-extrabold'
                    : step > 2
                    ? 'text-gray-700 dark:text-gray-300'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                Seller
              </span>
            </button>

            {/* Connecting Track 2 -> 3 */}
            <div className="flex-1 h-[2.5px] mx-2 -mt-5 bg-gray-200 dark:bg-white/10 relative rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300 rounded-full"
                style={{
                  backgroundColor: palette.primary,
                  width: step >= 3 ? '100%' : '0%',
                }}
              />
            </div>

            {/* Step 3: Buyer */}
            <button
              type="button"
              onClick={() => {
                if (quantity && billRate && sellerName) setStep(3);
              }}
              disabled={!quantity || !billRate || !sellerName}
              className="relative z-10 flex flex-col items-center group focus:outline-none transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div
                style={step === 3 ? { backgroundColor: palette.primary } : {}}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shadow-md ${
                  step === 3
                    ? 'text-white shadow-glass'
                    : 'bg-white/60 dark:bg-card-dark text-gray-400 border-2 border-gray-300 dark:border-gray-600'
                }`}
              >
                <span>3</span>
              </div>
              <span
                style={step === 3 ? { color: palette.primary } : {}}
                className={`mt-1.5 text-xs sm:text-sm font-bold tracking-tight transition-colors ${
                  step === 3
                    ? 'font-extrabold'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                Buyer
              </span>
            </button>
          </div>
        </div>

        {/* STEP 1: ITEM FORM (Replicating Screenshots 19 & 20) */}
        {step === 1 && (
          <div className="liquid-glass-card p-5 md:p-6 rounded-3xl space-y-4 shadow-glass-card">
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
                className="input-sauda font-extrabold text-gray-900 dark:text-gray-100 border-2 border-[var(--primary)]"
              />
            </div>

            {/* Total Bill Amount Calculated Box (Matching Screenshot 20: ₹18,62,496.00) */}
            {quantity && billRate && (
              <div className="p-3.5 sm:p-4 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-sm font-bold text-emerald-800 dark:text-emerald-300 shadow-glass-card backdrop-blur-md animate-in fade-in">
                <span className="text-[11px] sm:text-xs uppercase tracking-wider font-extrabold text-emerald-700 dark:text-emerald-300">Total Bill Amount:</span>
                <span className="text-base sm:text-xl font-black text-emerald-600 dark:text-emerald-400 break-all">{formatCurrency(totalBillAmount)}</span>
              </div>
            )}

            {/* WITH GST Checkbox */}
            <div className="flex items-center gap-2.5 py-1">
              <input
                type="checkbox"
                id="withGST"
                checked={withGST}
                onChange={e => setWithGST(e.target.checked)}
                className="w-5 h-5 text-[var(--primary)] rounded border-gray-300 dark:border-gray-600 focus:ring-[var(--primary)]"
              />
              <label htmlFor="withGST" className="text-xs font-extrabold text-gray-800 uppercase tracking-wider cursor-pointer">
                WITH GST
              </label>
            </div>

            {withGST && (
              <div className="p-4 glass-card-subtle rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300 font-medium">GST Percentage:</span>
                  <select
                    value={gstPercent}
                    onChange={e => setGstPercent(e.target.value)}
                    className="p-1.5 bg-white/70 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg font-bold backdrop-blur-xs text-gray-800 dark:text-gray-100"
                  >
                    <option value="5">5% (Commodity/Cotton)</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>
                <div className="flex justify-between font-bold text-gray-800 dark:text-gray-100 pt-2 border-t border-gray-200/60 dark:border-white/10">
                  <span>GST Amount:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{formatCurrency(gstAmount)}</span>
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

            {/* Step 1 Footer matching Image 4 */}
            <div className="flex items-center justify-between pt-4 mt-6 border-t border-gray-200/50 dark:border-white/10">
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                Step 1 of 3
              </span>
              <button
                type="button"
                onClick={handleNextFromItem}
                disabled={!quantity || !billRate}
                style={{ backgroundColor: palette.primary }}
                className="px-7 py-2.5 rounded-xl text-white font-bold text-sm shadow-glass-card hover:shadow-glass-hover hover:opacity-95 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELLER FORM (Replicating Screenshot 18) */}
        {step === 2 && (
          <div className="liquid-glass-card p-5 md:p-6 rounded-3xl space-y-4 shadow-glass-card animate-in fade-in">
            {/* SELLER NAME * */}
            <div>
              <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-1.5">
                NAME <span className="text-red-500 font-bold">*</span>
              </label>
              <div
                onClick={() => setIsSellerModalOpen(true)}
                className="input-sauda flex items-center justify-between cursor-pointer font-bold uppercase text-gray-900 dark:text-gray-100"
              >
                <span>{sellerName || 'SELECT SELLER'}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* COMM. RATE */}
            <div>
              <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-1.5">
                COMM. RATE
              </label>
              <input
                type="number"
                step="any"
                value={sellerCommRate}
                onChange={e => setSellerCommRate(e.target.value)}
                className="input-sauda font-extrabold text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Commission Amount Banner (Matching Screenshot 18: ₹806.40) */}
            <div className="p-3.5 sm:p-4 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-sm font-bold text-emerald-800 dark:text-emerald-300 shadow-glass-card backdrop-blur-md">
              <span className="text-[11px] sm:text-xs uppercase tracking-wider font-extrabold text-emerald-700 dark:text-emerald-300">Commission Amount:</span>
              <span className="text-base sm:text-xl font-black text-emerald-600 dark:text-emerald-400 break-all">{formatCurrency(sellerCommissionAmount)}</span>
            </div>

            {/* SELLER CONTACT PERSON */}
            <div>
              <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-1.5">
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

            {/* Step 2 Footer matching Image 4 */}
            <div className="flex items-center justify-between pt-4 mt-6 border-t border-gray-200/50 dark:border-white/10">
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                Step 2 of 3
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 bg-white/60 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 font-bold text-sm shadow-sm active:scale-95 transition-all"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextFromSeller}
                  disabled={!sellerName}
                  style={{ backgroundColor: palette.primary }}
                  className="px-7 py-2.5 rounded-xl text-white font-bold text-sm shadow-glass-card hover:shadow-glass-hover hover:opacity-95 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: BUYER FORM (Replicating Screenshot 22) */}
        {step === 3 && (
          <div className="liquid-glass-card p-5 md:p-6 rounded-3xl space-y-4 shadow-glass-card animate-in fade-in">
            {/* BUYER NAME * */}
            <div>
              <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-1.5">
                NAME <span className="text-red-500 font-bold">*</span>
              </label>
              <div
                onClick={() => setIsBuyerModalOpen(true)}
                className="input-sauda flex items-center justify-between cursor-pointer font-bold uppercase text-gray-900 dark:text-gray-100"
              >
                <span>{buyerName || 'SELECT BUYER'}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* COMM. RATE */}
            <div>
              <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-1.5">
                COMM. RATE
              </label>
              <input
                type="number"
                step="any"
                value={buyerCommRate}
                onChange={e => setBuyerCommRate(e.target.value)}
                className="input-sauda font-extrabold text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Commission Amount Banner */}
            <div className="p-3.5 sm:p-4 bg-sky-500/10 dark:bg-sky-500/15 border border-sky-500/30 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-sm font-bold text-sky-800 dark:text-sky-300 shadow-glass-card backdrop-blur-md">
              <span className="text-[11px] sm:text-xs uppercase tracking-wider font-extrabold text-sky-700 dark:text-sky-300">Commission Amount:</span>
              <span className="text-base sm:text-xl font-black text-sky-600 dark:text-sky-400 break-all">{formatCurrency(buyerCommissionAmount)}</span>
            </div>

            {/* BUYER CONTACT PERSON */}
            <div>
              <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-1.5">
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

            {/* Step 3 Footer matching Image 4 */}
            <div className="flex items-center justify-between pt-4 mt-6 border-t border-gray-200/50 dark:border-white/10">
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                Step 3 of 3
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 bg-white/60 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 font-bold text-sm shadow-sm active:scale-95 transition-all"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleSaveOrder}
                  disabled={!buyerName || isSubmitting}
                  style={{ backgroundColor: palette.primary }}
                  className="px-7 py-2.5 rounded-xl text-white font-bold text-sm shadow-glass-card hover:shadow-glass-hover hover:opacity-95 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'SAVING...' : 'SAVE'}
                </button>
              </div>
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
        onAddNew={() => setIsQuickAddItemOpen(true)}
        addNewButtonText="ADD ITEM"
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
        options={sellerPartyOptions}
        onAddNew={() => {
          setQuickAddPartyContext('seller');
          setIsQuickAddPartyOpen(true);
        }}
        addNewButtonText="ADD PARTY"
        onSelect={opt => {
          const p = opt.raw as Party;
          setSelectedSellerId(p.id!);
          setSellerName(p.name);
          if (selectedBuyerId === p.id) {
            setSelectedBuyerId(null);
            setBuyerName('');
          }
        }}
      />

      {/* Buyer Search Selector Modal (Replicating Screenshot 22) */}
      <SearchSelectModal
        isOpen={isBuyerModalOpen}
        onClose={() => setIsBuyerModalOpen(false)}
        title="Select Buyer Party"
        placeholder="Search..."
        options={buyerPartyOptions}
        onAddNew={() => {
          setQuickAddPartyContext('buyer');
          setIsQuickAddPartyOpen(true);
        }}
        addNewButtonText="ADD PARTY"
        onSelect={opt => {
          const p = opt.raw as Party;
          setSelectedBuyerId(p.id!);
          setBuyerName(p.name);
          if (selectedSellerId === p.id) {
            setSelectedSellerId(null);
            setSellerName('');
          }
        }}
      />

      {/* Quick Add Item Modal */}
      <QuickAddItemModal
        isOpen={isQuickAddItemOpen}
        onClose={() => setIsQuickAddItemOpen(false)}
        onItemCreated={newItem => {
          setItems(prev => [newItem, ...prev.filter(i => i.id !== newItem.id)]);
          setSelectedItemId(newItem.id!);
          setItemName(newItem.name);
          setUnit(newItem.unit || '100');
          setSellerCommRate(String(newItem.sellerCommissionRate || 2.8));
          setBuyerCommRate(String(newItem.buyerCommissionRate || 2.6));
          setIsItemModalOpen(false);
        }}
      />

      {/* Quick Add Party Modal */}
      <QuickAddPartyModal
        isOpen={isQuickAddPartyOpen}
        onClose={() => setIsQuickAddPartyOpen(false)}
        defaultPartyType={quickAddPartyContext === 'seller' ? 'seller' : 'buyer'}
        onPartyCreated={newParty => {
          setParties(prev => [newParty, ...prev.filter(p => p.id !== newParty.id)]);
          if (quickAddPartyContext === 'seller') {
            setSelectedSellerId(newParty.id!);
            setSellerName(newParty.name);
            if (selectedBuyerId === newParty.id) {
              setSelectedBuyerId(null);
              setBuyerName('');
            }
            setIsSellerModalOpen(false);
          } else {
            setSelectedBuyerId(newParty.id!);
            setBuyerName(newParty.name);
            if (selectedSellerId === newParty.id) {
              setSelectedSellerId(null);
              setSellerName('');
            }
            setIsBuyerModalOpen(false);
          }
        }}
      />
    </div>
  );
};
