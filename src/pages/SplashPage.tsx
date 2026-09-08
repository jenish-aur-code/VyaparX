import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SplashPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    companies,
    currentCompany,
    setCurrentCompany,
    financialYears,
    currentFinancialYear,
    setCurrentFinancialYear,
  } = useApp();

  const [selectedCompanyId, setSelectedCompanyId] = useState<number | string>(
    currentCompany?.id || (companies[0]?.id ?? '')
  );
  const [selectedFY, setSelectedFY] = useState<string>(
    currentFinancialYear || (financialYears[0]?.id ?? '2026-2027')
  );

  const handleContinue = () => {
    const comp = companies.find(c => c.id === Number(selectedCompanyId));
    if (comp) {
      setCurrentCompany(comp);
    }
    if (selectedFY) {
      setCurrentFinancialYear(selectedFY);
    }
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-[#FF9800] flex flex-col items-center justify-between p-6 md:p-12 text-white">
      <div className="w-full flex justify-end">
        {/* Top spacer */}
      </div>

      <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6">
        {/* Briefcase App Icon matching screenshot 25 */}
        <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xs flex items-center justify-center border-2 border-white/20 shadow-2xl">
          <Briefcase className="w-14 h-14 text-white stroke-[2]" />
        </div>

        {/* Brand Title */}
        <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-sm">
          Sauda Book
        </h1>

        <div className="w-full space-y-4 pt-6">
          {/* Select Company Dropdown matching screenshot */}
          <div className="relative">
            <select
              value={selectedCompanyId || currentCompany?.id || ''}
              onChange={e => setSelectedCompanyId(e.target.value)}
              className="w-full py-4 px-5 bg-transparent border-2 border-white/60 rounded-2xl text-white font-bold text-base focus:outline-none focus:border-white appearance-none cursor-pointer tracking-wide"
            >
              {companies.map(c => (
                <option key={c.id} value={c.id} className="text-gray-900 font-semibold">
                  {c.name} {c.isDefault ? ' (Default)' : ''}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Select Financial Year Dropdown matching screenshot */}
          <div className="relative">
            <select
              value={selectedFY || currentFinancialYear}
              onChange={e => setSelectedFY(e.target.value)}
              className="w-full py-4 px-5 bg-transparent border-2 border-white/60 rounded-2xl text-white font-bold text-base focus:outline-none focus:border-white appearance-none cursor-pointer tracking-wide"
            >
              {financialYears.map(fy => (
                <option key={fy.id} value={fy.id} className="text-gray-900 font-semibold">
                  {fy.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Continue Button matching screenshot */}
          <button
            type="button"
            onClick={handleContinue}
            className="w-full py-4 px-6 bg-[#111827] hover:bg-black text-white font-bold text-base rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <ArrowRight className="w-5 h-5" />
            <span>Continue</span>
          </button>
        </div>
      </div>

      <div className="text-xs text-white/70 font-medium">
        Commodity Brokerage Management System
      </div>
    </div>
  );
};
