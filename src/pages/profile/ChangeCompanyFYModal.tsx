import React, { useState } from 'react';
import { X, Building2, Calendar, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangeCompanyFYModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    companies,
    currentCompany,
    setCurrentCompany,
    financialYears,
    currentFinancialYear,
    setCurrentFinancialYear,
  } = useApp();
  const toast = useToast();

  const [selectedCompanyId, setSelectedCompanyId] = useState<number>(
    currentCompany?.id || (companies[0]?.id ?? 1)
  );
  const [selectedFY, setSelectedFY] = useState<string>(
    currentFinancialYear || '2026-2027'
  );

  if (!isOpen) return null;

  const handleApply = () => {
    const comp = companies.find(c => c.id === Number(selectedCompanyId));
    if (comp) {
      setCurrentCompany(comp);
    }
    if (selectedFY) {
      setCurrentFinancialYear(selectedFY);
    }
    toast.success('Active Company and Financial Year switched!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h3 className="font-extrabold text-base text-gray-900">
            Change Company & FY
          </h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Company Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-700 uppercase flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-orange-600" />
            <span>Select Active Company</span>
          </label>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {companies.map(c => (
              <div
                key={c.id}
                onClick={() => setSelectedCompanyId(c.id!)}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                  selectedCompanyId === c.id
                    ? 'border-[#FF9800] bg-orange-50/70 text-orange-900'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div>
                  <div>{c.name}</div>
                  <div className="text-[10px] text-gray-400 font-medium">{c.city} • {c.state}</div>
                </div>
                {selectedCompanyId === c.id && (
                  <Check className="w-4 h-4 text-[#FF9800]" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Financial Year Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-700 uppercase flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-orange-600" />
            <span>Select Financial Year</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {financialYears.map(fy => (
              <button
                key={fy.id}
                type="button"
                onClick={() => setSelectedFY(fy.id)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  selectedFY === fy.id
                    ? 'border-[#FF9800] bg-orange-500 text-white'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {fy.name}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleApply}
          className="btn-primary"
        >
          Switch Context
        </button>
      </div>
    </div>
  );
};
