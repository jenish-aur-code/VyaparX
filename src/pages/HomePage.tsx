import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Users,
  ClipboardList,
  PlusCircle,
  Package,
  Building2,
  Receipt,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { saudaService } from '../services/saudaService';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentCompany, currentFinancialYear } = useApp();
  const { palette } = useTheme();
  const { t } = useLanguage();

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalAmount: 0,
  });

  const loadStats = async () => {
    try {
      const data = await saudaService.getDashboardStats(
        currentCompany?.id,
        currentFinancialYear
      );
      setStats({
        totalOrders: data.totalOrders,
        totalAmount: data.totalAmount,
      });
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    }
  };

  useEffect(() => {
    loadStats();
  }, [currentCompany?.id, currentFinancialYear]);

  const cardStyle = {
    backgroundColor: palette.primary,
  };

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-4xl mx-auto">
      {/* Top Banner: Total Vyapar Orders (Replicating Screenshot 24) */}
      <div 
        onClick={() => navigate('/vyapar')}
        style={cardStyle}
        className="rounded-2xl p-5 text-white shadow-md shadow-orange-500/10 cursor-pointer hover:opacity-95 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white/90">{t('home.totalOrders', 'Total Vyapar Orders')}</div>
            <div className="text-4xl font-black tracking-tight">{stats.totalOrders}</div>
          </div>
        </div>
      </div>

      {/* 6 Grid Action Cards */}
      <div className="grid grid-cols-2 gap-3.5 pt-1">
        {/* 1. Party List */}
        <button
          type="button"
          onClick={() => navigate('/parties')}
          style={cardStyle}
          className="hover:opacity-95 text-white p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-2.5 shadow-md transition-all active:scale-[0.98] min-h-[120px]"
        >
          <Users className="w-7 h-7 stroke-[2.2]" />
          <span className="font-extrabold text-sm uppercase tracking-wide">
            {t('home.partyList', 'PARTY LIST')}
          </span>
        </button>

        {/* 2. Vyapar Order List */}
        <button
          type="button"
          onClick={() => navigate('/vyapar')}
          style={cardStyle}
          className="hover:opacity-95 text-white p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-2.5 shadow-md transition-all active:scale-[0.98] min-h-[120px]"
        >
          <ClipboardList className="w-7 h-7 stroke-[2.2]" />
          <span className="font-extrabold text-sm uppercase tracking-wide">
            {t('home.saudaList', 'VYAPAR ORDER LIST')}
          </span>
        </button>

        {/* 3. Create New Vyapar Order */}
        <button
          type="button"
          onClick={() => navigate('/vyapar/create')}
          style={cardStyle}
          className="hover:opacity-95 text-white p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-2.5 shadow-md transition-all active:scale-[0.98] min-h-[120px]"
        >
          <PlusCircle className="w-7 h-7 stroke-[2.2]" />
          <span className="font-extrabold text-sm uppercase tracking-wide leading-tight">
            {t('home.createSauda', 'CREATE NEW VYAPAR ORDER')}
          </span>
        </button>

        {/* 4. Item List */}
        <button
          type="button"
          onClick={() => navigate('/items')}
          style={cardStyle}
          className="hover:opacity-95 text-white p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-2.5 shadow-md transition-all active:scale-[0.98] min-h-[120px]"
        >
          <Package className="w-7 h-7 stroke-[2.2]" />
          <span className="font-extrabold text-sm uppercase tracking-wide">
            {t('home.itemList', 'ITEM LIST')}
          </span>
        </button>

        {/* 5. Companies */}
        <button
          type="button"
          onClick={() => navigate('/companies')}
          style={cardStyle}
          className="hover:opacity-95 text-white p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-2.5 shadow-md transition-all active:scale-[0.98] min-h-[120px]"
        >
          <Building2 className="w-7 h-7 stroke-[2.2]" />
          <span className="font-extrabold text-sm uppercase tracking-wide">
            {t('home.companies', 'COMPANIES')}
          </span>
        </button>

        {/* 6. Vyapar Bill */}
        <button
          type="button"
          onClick={() => navigate('/vyapar/bills')}
          style={cardStyle}
          className="hover:opacity-95 text-white p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-2.5 shadow-md transition-all active:scale-[0.98] min-h-[120px]"
        >
          <Receipt className="w-7 h-7 stroke-[2.2]" />
          <span className="font-extrabold text-sm uppercase tracking-wide">
            {t('home.saudaBill', 'VYAPAR BILL')}
          </span>
        </button>
      </div>

      {/* Quick Status Bar on Desktop */}
      <div className="hidden md:flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-300 transition-colors">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" style={{ color: palette.primary }} />
          <span>{t('home.activeCompany', 'Active Company')}: <strong className="text-gray-900 dark:text-white">{currentCompany?.name}</strong></span>
        </div>
        <div>
          <span>{t('home.fy', 'Financial Year')}: <strong className="text-gray-900 dark:text-white">{currentFinancialYear}</strong></span>
        </div>
      </div>
    </div>
  );
};
