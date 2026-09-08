import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Info, Trash2, Search, CheckCircle } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { companyService } from '../../services/companyService';
import type { Company } from '../../types';
import { useToast } from '../../context/ToastContext';
import { useApp } from '../../context/AppContext';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { SaudaNoteTemplate } from '../../components/pdf/SaudaNoteTemplate';

const INDIAN_STATES = [
  'GUJARAT',
  'MAHARASHTRA',
  'RAJASTHAN',
  'MADHYA PRADESH',
  'PUNJAB',
  'HARYANA',
  'ANDHRA PRADESH',
  'TELANGANA',
  'KARNATAKA',
  'TAMIL NADU',
  'DELHI',
  'UTTAR PRADESH',
];

const COLOR_OPTIONS = [
  { label: 'RED', hex: '#DC2626' },
  { label: 'ORANGE', hex: '#FF9800' },
  { label: 'BLUE', hex: '#2563EB' },
  { label: 'GREEN', hex: '#059669' },
  { label: 'BLACK', hex: '#111827' },
];

export const AddEditCompanyPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const toast = useToast();
  const { refreshAppContext } = useApp();

  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('GUJARAT');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [upiId, setUpiId] = useState('');
  const [saudaNoteColor, setSaudaNoteColor] = useState<Company['saudaNoteColor']>('RED');
  const [pdfTemplate, setPdfTemplate] = useState<Company['pdfTemplate']>(1);
  const [showSignature, setShowSignature] = useState(true);
  const [isDefault, setIsDefault] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showGstModal, setShowGstModal] = useState(false);
  const [gstInput, setGstInput] = useState('');

  useEffect(() => {
    if (isEdit && id) {
      companyService.getById(Number(id)).then(comp => {
        if (comp) {
          setName(comp.name);
          setContactNumber(comp.contactNumber);
          setEmail(comp.email || '');
          setAddress(comp.address);
          setState(comp.state);
          setCity(comp.city);
          setPinCode(comp.pinCode);
          setGstNumber(comp.gstNumber || '');
          setPanNumber(comp.panNumber || '');
          setBankName(comp.bankName || '');
          setAccountNumber(comp.accountNumber || '');
          setAccountHolderName(comp.accountHolderName || '');
          setIfscCode(comp.ifscCode || '');
          setUpiId(comp.upiId || '');
          setSaudaNoteColor(comp.saudaNoteColor || 'RED');
          setPdfTemplate(comp.pdfTemplate || 1);
          setShowSignature(comp.showSignature !== false);
          setIsDefault(Boolean(comp.isDefault));
        } else {
          toast.error('Company not found');
          navigate('/companies');
        }
      });
    }
  }, [id, isEdit]);

  const handleApplyGst = () => {
    const gst = gstInput.trim().toUpperCase();
    if (gst.length >= 10) {
      setGstNumber(gst);
      if (gst.length >= 12) {
        setPanNumber(gst.substring(2, 12));
      }
      toast.success('GST & PAN extracted successfully');
      setShowGstModal(false);
      setGstInput('');
    } else {
      toast.error('Please enter a valid GST number');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Company Name is required');
      return;
    }
    if (!contactNumber.trim()) {
      toast.error('Contact Number is required');
      return;
    }
    if (!address.trim()) {
      toast.error('Address is required');
      return;
    }
    if (!state.trim()) {
      toast.error('State is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const companyData = {
        name: name.trim().toUpperCase(),
        contactNumber: contactNumber.trim(),
        email: email.trim(),
        address: address.trim().toUpperCase(),
        state: state.trim().toUpperCase(),
        city: city.trim().toUpperCase() || 'BOTAD',
        pinCode: pinCode.trim(),
        gstNumber: gstNumber.trim().toUpperCase(),
        panNumber: panNumber.trim().toUpperCase(),
        bankName: bankName.trim().toUpperCase(),
        accountNumber: accountNumber.trim(),
        accountHolderName: accountHolderName.trim().toUpperCase(),
        ifscCode: ifscCode.trim().toUpperCase(),
        upiId: upiId.trim(),
        saudaNoteColor,
        pdfTemplate,
        showSignature,
        isDefault,
      };

      if (isEdit && id) {
        await companyService.update(Number(id), companyData);
        toast.success('Company updated successfully');
      } else {
        await companyService.create(companyData);
        toast.success('Company created successfully');
      }
      await refreshAppContext();
      navigate('/companies');
    } catch (err) {
      toast.error('Failed to save company');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (id) {
      await companyService.delete(Number(id));
      toast.success('Company deleted successfully');
      await refreshAppContext();
      navigate('/companies');
    }
  };

  const currentColorHex =
    COLOR_OPTIONS.find(c => c.label === saudaNoteColor)?.hex || '#DC2626';

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24 md:pb-12">
      <PageHeader
        title={isEdit ? 'Edit Company' : 'Add Company'}
        onSearchByGst={() => setShowGstModal(true)}
        rightAction={
          isEdit ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              title="Delete Company"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          ) : null
        }
      />

      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
        {/* Info Banner */}
        <div className="p-4 bg-[#FFF8E1] border border-[#FFE082] rounded-2xl flex items-start gap-3 text-xs text-[#E65100] font-medium leading-relaxed shadow-xs">
          <Info className="w-5 h-5 text-[#FB8C00] shrink-0 mt-0.5" />
          <span>
            Fields marked with a red <span className="text-red-500 font-bold">*</span> are mandatory. Other details are optional and can be added later.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#1E293B] tracking-tight">
              Basic Information
            </h2>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                COMPANY NAME <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="COMPANY NAME"
                value={name}
                onChange={e => setName(e.target.value)}
                className="input-sauda uppercase font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                CONTACT NUMBER <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="CONTACT NUMBER"
                value={contactNumber}
                onChange={e => setContactNumber(e.target.value)}
                className="input-sauda font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                EMAIL (OPTIONAL)
              </label>
              <input
                type="email"
                placeholder="EMAIL"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-sauda font-medium lowercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                ADDRESS <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="ADDRESS"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="input-sauda font-medium uppercase"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                  STATE <span className="text-red-500 font-bold">*</span>
                </label>
                <select
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="input-sauda font-semibold text-xs px-2"
                >
                  {INDIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                  CITY <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="CITY"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="input-sauda uppercase font-medium text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                  PIN CODE <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="PIN CODE"
                  value={pinCode}
                  onChange={e => setPinCode(e.target.value)}
                  className="input-sauda uppercase font-medium text-xs"
                />
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="space-y-4 pt-2 border-t border-gray-200">
            <h2 className="text-xl font-bold text-[#1E293B] tracking-tight">
              Business Details
            </h2>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                GST NUMBER
              </label>
              <input
                type="text"
                placeholder="GST NUMBER"
                value={gstNumber}
                onChange={e => setGstNumber(e.target.value)}
                className="input-sauda uppercase font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                PAN NUMBER
              </label>
              <input
                type="text"
                placeholder="PAN NUMBER"
                value={panNumber}
                onChange={e => setPanNumber(e.target.value)}
                className="input-sauda uppercase font-semibold"
              />
            </div>
          </div>

          {/* Bank Details */}
          <div className="space-y-4 pt-2 border-t border-gray-200">
            <h2 className="text-xl font-bold text-[#1E293B] tracking-tight">
              Bank Details
            </h2>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                BANK NAME
              </label>
              <input
                type="text"
                placeholder="BANK NAME"
                value={bankName}
                onChange={e => setBankName(e.target.value)}
                className="input-sauda uppercase font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                ACCOUNT NUMBER
              </label>
              <input
                type="text"
                placeholder="ACCOUNT NUMBER"
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                className="input-sauda font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                ACCOUNT HOLDER NAME
              </label>
              <input
                type="text"
                placeholder="ACCOUNT HOLDER NAME"
                value={accountHolderName}
                onChange={e => setAccountHolderName(e.target.value)}
                className="input-sauda uppercase font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                IFSC CODE
              </label>
              <input
                type="text"
                placeholder="IFSC CODE"
                value={ifscCode}
                onChange={e => setIfscCode(e.target.value)}
                className="input-sauda uppercase font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                UPI ID
              </label>
              <input
                type="text"
                placeholder="UPI ID"
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
                className="input-sauda font-medium"
              />
            </div>
          </div>

          {/* Sauda Note Customization (Screenshots 13 & 14) */}
          <div className="space-y-4 pt-2 border-t border-gray-200">
            <h2 className="text-xl font-bold text-[#1E293B] tracking-tight">
              Sauda Note Customization
            </h2>

            {/* Sauda Note Color with Swatch */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                SAUDA NOTE COLOR
              </label>
              <div className="flex items-center gap-3">
                <select
                  value={saudaNoteColor}
                  onChange={e => setSaudaNoteColor(e.target.value as Company['saudaNoteColor'])}
                  className="input-sauda font-bold uppercase flex-1"
                >
                  {COLOR_OPTIONS.map(c => (
                    <option key={c.label} value={c.label}>{c.label}</option>
                  ))}
                </select>
                <div
                  className="w-12 h-12 rounded-xl shadow-xs border border-gray-300 shrink-0"
                  style={{ backgroundColor: currentColorHex }}
                  title={`Color Preview: ${saudaNoteColor}`}
                />
              </div>
            </div>

            {/* Sauda Note PDF Template Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-2">
                SAUDA NOTE PDF TEMPLATE
              </label>
              <div className="flex items-center gap-6 py-1">
                {[1, 2, 3, 4].map(num => (
                  <label key={num} className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-800">
                    <input
                      type="radio"
                      name="pdfTemplate"
                      checked={pdfTemplate === num}
                      onChange={() => setPdfTemplate(num as 1 | 2 | 3 | 4)}
                      className="w-4 h-4 text-[#FF9800] focus:ring-[#FF9800]"
                    />
                    <span>{num}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Signature Toggle */}
            <div className="flex items-center gap-3 py-1">
              <input
                type="checkbox"
                id="showSignature"
                checked={showSignature}
                onChange={e => setShowSignature(e.target.checked)}
                className="w-5 h-5 text-[#FF9800] rounded focus:ring-[#FF9800]"
              />
              <label htmlFor="showSignature" className="text-sm font-semibold text-gray-800 cursor-pointer">
                Show signature in Sauda Note PDF
              </label>
            </div>

            {/* Set Default Company */}
            <div className="flex items-center gap-3 py-1">
              <input
                type="checkbox"
                id="isDefaultCompany"
                checked={isDefault}
                onChange={e => setIsDefault(e.target.checked)}
                className="w-5 h-5 text-[#FF9800] rounded focus:ring-[#FF9800]"
              />
              <label htmlFor="isDefaultCompany" className="text-sm font-semibold text-gray-800 cursor-pointer">
                Set as Default Business Profile
              </label>
            </div>

            {/* Live PDF Template Preview Container matching Screenshot 14 */}
            <div className="pt-2">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Live PDF Template Preview:
              </div>
              <div className="border border-gray-200 rounded-2xl p-3 bg-gray-50 overflow-x-auto shadow-inner">
                <SaudaNoteTemplate
                  order={{
                    id: 13,
                    date: '2026-04-18',
                    itemName: 'KHOL',
                    itemQuality: '1 GADI',
                    quantity: 120,
                    unit: '50 KG',
                    billRate: 2099,
                    totalBillAmount: 251880,
                    sellerName: 'RAJ OIL MILL',
                    buyerName: 'JINESH GINNING AND PRESSING FECTORY',
                    paymentTerms: 'NEXT DAY',
                    deliveryTerms: 'next day',
                    remark: '10% moisture',
                  }}
                  company={{
                    name: name || 'KRISHNA FIBERS',
                    address: address || 'PALIYAD ROAD BOTAD',
                    city: city || 'BOTAD',
                    state: state || 'GUJARAT',
                    pinCode: pinCode || '364710',
                    panNumber: panNumber || 'ABCDE1234F',
                    gstNumber: gstNumber || '24ABCDE1234F1Z5',
                    contactNumber: contactNumber || '9574823170',
                    email: email || 'krishnafibers@gmail.com',
                  }}
                  color={saudaNoteColor}
                  template={pdfTemplate}
                  showSignature={showSignature}
                />
              </div>
            </div>
          </div>

          {/* Create / Update Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-4 bg-[#FF9800] hover:bg-[#F57C00] text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-md shadow-orange-500/20 transition-all duration-150 active:scale-[0.98] disabled:opacity-50 mt-6"
          >
            {isSubmitting ? 'SAVING...' : isEdit ? 'UPDATE COMPANY' : 'CREATE COMPANY'}
          </button>
        </form>
      </div>

      {/* GST Search Modal */}
      {showGstModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-5 space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-orange-600" />
              <span>Search by GST</span>
            </h3>
            <p className="text-xs text-gray-500">
              Enter 15-digit GSTIN to auto-fill GST & PAN:
            </p>
            <input
              type="text"
              placeholder="Ex. 24AAECK9823P1Z3"
              value={gstInput}
              onChange={e => setGstInput(e.target.value)}
              className="input-sauda uppercase font-bold text-xs"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowGstModal(false)}
                className="flex-1 py-2.5 px-3 border border-gray-200 text-gray-600 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyGst}
                className="flex-1 py-2.5 px-3 bg-[#FF9800] hover:bg-[#F57C00] text-white text-xs font-bold rounded-xl"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Company?"
        message="Are you sure you want to delete this company profile? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};
