import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Info, Contact, Trash2, Search } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { partyService } from '../../services/partyService';
import { useToast } from '../../context/ToastContext';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

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
  'WEST BENGAL',
];

export const AddEditPartyPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const toast = useToast();

  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('GUJARAT');
  const [city, setCity] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [upiId, setUpiId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showGstModal, setShowGstModal] = useState(false);
  const [gstInput, setGstInput] = useState('');

  useEffect(() => {
    if (isEdit && id) {
      partyService.getById(Number(id)).then(party => {
        if (party) {
          setName(party.name);
          setMobileNumber(party.mobileNumber);
          setEmail(party.email || '');
          setAddress(party.address || '');
          setState(party.state || 'GUJARAT');
          setCity(party.city || '');
          setLicenseNumber(party.licenseNumber || '');
          setGstNumber(party.gstNumber || '');
          setPanNumber(party.panNumber || '');
          setBankName(party.bankName || '');
          setAccountNumber(party.accountNumber || '');
          setIfscCode(party.ifscCode || '');
          setUpiId(party.upiId || '');
        } else {
          toast.error('Party not found');
          navigate('/parties');
        }
      });
    }
  }, [id, isEdit]);

  const handleSearchByGst = () => {
    setShowGstModal(true);
  };

  const handleApplyGst = () => {
    const gst = gstInput.trim().toUpperCase();
    if (gst.length >= 10) {
      setGstNumber(gst);
      // Auto-extract PAN (characters 3 to 12)
      if (gst.length >= 12) {
        const pan = gst.substring(2, 12);
        setPanNumber(pan);
      }
      toast.success('GST details extracted successfully');
      setShowGstModal(false);
      setGstInput('');
    } else {
      toast.error('Please enter a valid GST number');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Party Name is mandatory');
      return;
    }
    if (!state.trim()) {
      toast.error('State is mandatory');
      return;
    }

    try {
      setIsSubmitting(true);
      const partyData = {
        name: name.trim().toUpperCase(),
        mobileNumber: mobileNumber.trim(),
        email: email.trim(),
        address: address.trim(),
        state: state.trim().toUpperCase(),
        city: city.trim().toUpperCase() || 'BOTAD',
        licenseNumber: licenseNumber.trim(),
        gstNumber: gstNumber.trim().toUpperCase(),
        panNumber: panNumber.trim().toUpperCase(),
        bankName: bankName.trim().toUpperCase(),
        accountNumber: accountNumber.trim(),
        ifscCode: ifscCode.trim().toUpperCase(),
        upiId: upiId.trim(),
        partyType: 'both' as const,
      };

      if (isEdit && id) {
        await partyService.update(Number(id), partyData);
        toast.success('Party updated successfully');
      } else {
        await partyService.create(partyData);
        toast.success('Party created successfully');
      }
      navigate('/parties');
    } catch (err) {
      toast.error('Failed to save party');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (id) {
      await partyService.delete(Number(id));
      toast.success('Party deleted successfully');
      navigate('/parties');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24 md:pb-12">
      {/* Header Replicating Screenshots 6, 7 */}
      <PageHeader
        title={isEdit ? 'Edit Party' : 'Add Party'}
        onSearchByGst={handleSearchByGst}
        rightAction={
          isEdit ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              title="Delete Party"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          ) : null
        }
      />

      <div className="p-4 md:p-6 max-w-xl mx-auto space-y-6">
        {/* Info Banner */}
        <div className="p-4 bg-[#FFF8E1] border border-[#FFE082] rounded-2xl flex items-start gap-3 text-xs text-[#E65100] font-medium leading-relaxed shadow-xs">
          <Info className="w-5 h-5 text-[#FB8C00] shrink-0 mt-0.5" />
          <span>
            Fields marked with a red <span className="text-red-500 font-bold">*</span> are mandatory. Other details are optional and can be added later.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#1E293B] tracking-tight">
              Basic Information
            </h2>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                PARTY NAME <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="PARTY NAME"
                value={name}
                onChange={e => setName(e.target.value)}
                className="input-sauda uppercase font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                MOBILE NUMBER
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="MOBILE NUMBER"
                  value={mobileNumber}
                  onChange={e => setMobileNumber(e.target.value)}
                  className="input-sauda pr-12 font-medium"
                />
                <div className="w-8 h-8 rounded-lg bg-orange-100/70 text-orange-600 flex items-center justify-center absolute right-2.5 top-1/2 -translate-y-1/2">
                  <Contact className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                EMAIL
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
                ADDRESS
              </label>
              <input
                type="text"
                placeholder="ADDRESS"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="input-sauda font-medium uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                  STATE <span className="text-red-500 font-bold">*</span>
                </label>
                <select
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="input-sauda font-semibold"
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
                  placeholder="CITY"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="input-sauda uppercase font-medium"
                />
              </div>
            </div>
          </div>

          {/* 2. Business Details */}
          <div className="space-y-4 pt-2 border-t border-gray-200">
            <h2 className="text-xl font-bold text-[#1E293B] tracking-tight">
              Business Details
            </h2>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                LICENSE NUMBER
              </label>
              <input
                type="text"
                placeholder="LICENSE NUMBER"
                value={licenseNumber}
                onChange={e => setLicenseNumber(e.target.value)}
                className="input-sauda uppercase font-medium"
              />
            </div>

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

          {/* 3. Banking Details */}
          <div className="space-y-4 pt-2 border-t border-gray-200">
            <h2 className="text-xl font-bold text-[#1E293B] tracking-tight">
              Banking Details
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

          {/* Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-4 bg-[#FF9800] hover:bg-[#F57C00] text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-md shadow-orange-500/20 transition-all duration-150 active:scale-[0.98] disabled:opacity-50 mt-6"
          >
            {isSubmitting ? 'SAVING...' : isEdit ? 'UPDATE PARTY' : 'CREATE PARTY'}
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
              placeholder="Ex. 24ABCDE1234F1Z5"
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
        title="Delete Party?"
        message="Are you sure you want to delete this party? All related orders will retain reference but party record will be removed."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};
