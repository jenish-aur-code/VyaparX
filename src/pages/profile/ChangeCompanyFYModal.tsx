import React, { useState } from 'react';
import { X, Building2, Calendar, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';

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
  const { palette } = useTheme();
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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-xl animate-in fade-in"
      style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
    >
      <div 
        className="w-full max-w-sm bg-white/95 dark:bg-gray-900/95 backdrop-blur-3xl rounded-3xl shadow-glass-hover p-6 space-y-5 animate-in zoom-in-95 border border-white/70 dark:border-white/15"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-white/60 dark:border-white/10 pb-3">
          <h3 className="font-extrabold text-base text-gray-900 dark:text-gray-100 tracking-tight">
            Change Company & FY
          </h3>
          <button onClick={onClose} className="p-1 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Company Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" style={{ color: palette.primary }} />
            <span>Select Active Company</span>
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {companies.map(c => {
              const isSelected = selectedCompanyId === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCompanyId(c.id!)}
                  style={isSelected ? { borderColor: palette.primary, backgroundColor: palette.light, color: palette.text } : undefined}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'border-2 shadow-xs'
                      : 'border-white/70 dark:border-white/10 bg-white/50 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-white/10 shadow-2xs'
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="font-extrabold text-xs truncate" title={c.name}>{c.name}</div>
                    <div className="text-[10px] text-gray-400 font-semibold truncate">{c.city} • {c.state}</div>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 stroke-[3] shrink-0" style={{ color: palette.primary }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Financial Year Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" style={{ color: palette.primary }} />
            <span>Select Financial Year</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {financialYears.map(fy => {
              const isSelected = selectedFY === fy.id;
              return (
                <button
                  key={fy.id}
                  type="button"
                  onClick={() => setSelectedFY(fy.id)}
                  style={isSelected ? { borderColor: palette.primary, backgroundColor: palette.primary, color: '#fff' } : undefined}
                  className={`py-2.5 px-3 rounded-2xl border text-xs font-bold transition-all ${
                    isSelected
                      ? 'shadow-glass'
                      : 'border-white/70 dark:border-white/10 bg-white/50 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-white/10 shadow-2xs'
                  }`}
                >
                  {fy.name}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={handleApply}
          style={{ backgroundColor: palette.primary }}
          className="w-full py-3 px-4 font-bold rounded-2xl text-white shadow-glass hover:opacity-90 active:scale-[0.98] transition-all text-xs flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>Switch Context</span>
        </button>
      </div>
    </div>
  );
};
