import React, { useState } from 'react';
import { X, Users, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { partyService } from '../../services/partyService';
import type { Party } from '../../types';

interface QuickAddPartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPartyCreated: (party: Party) => void;
  defaultPartyType?: 'seller' | 'buyer' | 'both';
}

const COMMON_STATES = ['GUJARAT', 'MAHARASHTRA', 'RAJASTHAN', 'MADHYA PRADESH', 'PUNJAB', 'HARYANA'];

export const QuickAddPartyModal: React.FC<QuickAddPartyModalProps> = ({
  isOpen,
  onClose,
  onPartyCreated,
}) => {
  const { palette } = useTheme();
  const toast = useToast();

  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [city, setCity] = useState('BOTAD');
  const [state, setState] = useState('GUJARAT');
  const [address, setAddress] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter Party Name');
      return;
    }
    if (!mobileNumber.trim()) {
      toast.error('Please enter Mobile Number');
      return;
    }

    try {
      setIsSubmitting(true);
      const partyData: Omit<Party, 'id' | 'createdAt' | 'updatedAt'> = {
        name: name.trim().toUpperCase(),
        mobileNumber: mobileNumber.trim(),
        city: city.trim().toUpperCase() || 'BOTAD',
        state: state.trim().toUpperCase() || 'GUJARAT',
        partyType: 'both',
        address: address.trim(),
        gstNumber: gstNumber.trim().toUpperCase(),
      };

      const newId = await partyService.create(partyData);
      const createdParty = await partyService.getById(newId);

      if (createdParty) {
        toast.success(`Party "${createdParty.name}" added successfully`);
        onPartyCreated(createdParty);
      }
      onClose();

      // Reset form
      setName('');
      setMobileNumber('');
      setAddress('');
      setGstNumber('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create party');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="px-5 py-4 text-white flex items-center justify-between shadow-xs"
          style={{ backgroundColor: palette.primary }}
        >
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 stroke-[2.5]" />
            <h2 className="font-extrabold text-base tracking-wide uppercase">ADD NEW PARTY</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-black/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* PARTY NAME */}
          <div>
            <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-1.5">
              PARTY / FIRM NAME <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. SHREE RAM TRADERS, SKY GINNING"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-bold uppercase text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          {/* MOBILE NUMBER */}
          <div>
            <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-1.5">
              MOBILE NUMBER <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              type="tel"
              required
              maxLength={10}
              placeholder="e.g. 9876543210"
              value={mobileNumber}
              onChange={e => setMobileNumber(e.target.value.replace(/\D/g, ''))}
              className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          {/* CITY & STATE */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-1.5">
                CITY
              </label>
              <input
                type="text"
                placeholder="BOTAD"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-semibold uppercase text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-1.5">
                STATE
              </label>
              <input
                type="text"
                placeholder="GUJARAT"
                value={state}
                onChange={e => setState(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-semibold uppercase text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[var(--primary)]"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {COMMON_STATES.slice(0, 3).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setState(s)}
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* GST NUMBER (OPTIONAL) */}
          <div>
            <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-1.5">
              GST NUMBER (OPTIONAL)
            </label>
            <input
              type="text"
              maxLength={15}
              placeholder="e.g. 24AAAAA0000A1Z5"
              value={gstNumber}
              onChange={e => setGstNumber(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-mono uppercase text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-xs hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !mobileNumber.trim() || isSubmitting}
              style={{ backgroundColor: palette.primary }}
              className="flex-2 py-3 px-4 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{isSubmitting ? 'Saving...' : 'Save Party'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
