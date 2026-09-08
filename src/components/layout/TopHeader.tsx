import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Calendar, Plus, User, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TopHeader: React.FC = () => {
  const {
    currentCompany,
    setCurrentCompany,
    companies,
    currentFinancialYear,
    setCurrentFinancialYear,
    financialYears,
    userProfile,
  } = useApp();
  const navigate = useNavigate();

  return (
    <header className="hidden md:flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        {/* Company Switcher */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 hover:border-[#FF9800] transition-colors">
          <Building2 className="w-4 h-4 text-orange-600 shrink-0" />
          <select
            value={currentCompany?.id || ''}
            onChange={e => {
              const comp = companies.find(c => c.id === Number(e.target.value));
              if (comp) setCurrentCompany(comp);
            }}
            className="bg-transparent text-xs font-bold text-gray-800 focus:outline-none cursor-pointer pr-1"
          >
            {companies.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} {c.isDefault ? '(Default)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Financial Year Switcher */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 hover:border-[#FF9800] transition-colors">
          <Calendar className="w-4 h-4 text-orange-600 shrink-0" />
          <select
            value={currentFinancialYear}
            onChange={e => setCurrentFinancialYear(e.target.value)}
            className="bg-transparent text-xs font-bold text-gray-800 focus:outline-none cursor-pointer pr-1"
          >
            {financialYears.map(fy => (
              <option key={fy.id} value={fy.id}>
                FY: {fy.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/sauda/create')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FF9800] hover:bg-[#F57C00] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-98"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Sauda</span>
        </button>

        <Link
          to="/profile"
          className="flex items-center gap-2 pl-3 pr-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-[#FF9800] text-white flex items-center justify-center text-xs font-black">
            {userProfile?.name?.charAt(0) || 'J'}
          </div>
          <span>{userProfile?.name || 'JENISH'}</span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 ml-1" />
        </Link>
      </div>
    </header>
  );
};
