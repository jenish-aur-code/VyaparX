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
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { saudaService } from '../services/saudaService';
import { ChangeCompanyFYModal } from './profile/ChangeCompanyFYModal';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentCompany, currentFinancialYear } = useApp();
  const { palette } = useTheme();
  const { t } = useLanguage();

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalAmount: 0,
  });
  const [showSwitchModal, setShowSwitchModal] = useState(false);

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
    <div className="p-4 md:p-6 pb-24 md:pb-8 space-y-3.5 sm:space-y-4 max-w-4xl mx-auto">
      {/* 1. Top Active Company & FY Glass Card (iOS 18 Liquid Glass - Visible Above All Cards) */}
      <div
        onClick={() => setShowSwitchModal(true)}
        className="group relative overflow-hidden rounded-3xl p-3.5 sm:p-4 bg-white/75 dark:bg-gray-900/70 backdrop-blur-2xl border border-white/60 dark:border-white/12 shadow-glass hover:shadow-glass-hover active:scale-[0.99] transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 min-w-0"
        title="Tap to switch Company or Financial Year"
      >
        {/* Specular top highlight */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />

        {/* Left: Company Icon + Details */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs transition-transform duration-300 group-hover:scale-105"
            style={{
              backgroundColor: `${palette.primary}18`,
              border: `1px solid ${palette.primary}35`,
              color: palette.primary,
            }}
          >
            <Building2 className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: palette.primary }} />
              <span>{t('home.activeCompany', 'Active Company')}</span>
            </div>
            <div className="text-sm sm:text-base font-black text-gray-900 dark:text-white truncate tracking-tight">
              {currentCompany?.name || 'VyaparX'}
            </div>
          </div>
        </div>

        {/* Right: Financial Year Capsule + Switch Chevron */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/60 dark:border-white/12 shadow-2xs text-[11px] sm:text-xs font-bold text-gray-700 dark:text-gray-200">
            <Calendar className="w-3.5 h-3.5 opacity-75" style={{ color: palette.primary }} />
            <span className="text-gray-500 dark:text-gray-400 hidden xs:inline">{t('common.financialYear', 'FY')}:</span>
            <strong className="text-gray-900 dark:text-white font-black">{currentFinancialYear}</strong>
          </div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-gray-800/60 border border-white/50 dark:border-white/10 flex items-center justify-center text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 group-hover:translate-x-0.5 transition-all shadow-2xs">
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* Top Banner: Total Vyapar Orders (iOS Frosted Glass Widget) */}
      <div 
        onClick={() => navigate('/vyapar')}
        className="relative overflow-hidden rounded-3xl p-4 sm:p-5 md:p-6 text-white cursor-pointer group shadow-glass-card hover:shadow-glass-hover hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 border border-white/40"
      >
        {/* Radiant Glass Gradient Background */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 opacity-95 transition-opacity"
          style={{
            background: `linear-gradient(135deg, ${palette.primary} 0%, #F59E0B 50%, #EA580C 100%)`,
          }}
        />
        {/* Frosted glass top specular highlight */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

        <div className="relative z-10 flex items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
              <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs md:text-sm font-bold text-white/90 tracking-wide uppercase truncate">
                {t('home.totalOrders', 'Total Vyapar Orders')}
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight drop-shadow-xs truncate">
                {stats.totalOrders}
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 text-xs font-bold shadow-xs shrink-0">
            <span>{t('common.all', 'All')}</span>
            <span className="text-white/80">&rarr;</span>
          </div>
        </div>
      </div>

      {/* 6 Grid Action Cards (Apple iOS Glass Cards) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 pt-1">
        {/* 1. Party List */}
        <button
          type="button"
          onClick={() => navigate('/parties')}
          className="relative group overflow-hidden rounded-3xl p-3.5 sm:p-5 glass-card-interactive flex flex-col items-center justify-center text-center gap-2 sm:gap-3 min-h-[115px] sm:min-h-[135px]"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/15 dark:bg-emerald-500/25 border border-emerald-500/30 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xs shrink-0">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </div>
          <span className="font-black text-[11px] sm:text-xs md:text-sm uppercase tracking-wide text-gray-800 dark:text-gray-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
            {t('home.partyList', 'PARTY LIST')}
          </span>
        </button>

        {/* 2. Vyapar Order List */}
        <button
          type="button"
          onClick={() => navigate('/vyapar')}
          className="relative group overflow-hidden rounded-3xl p-3.5 sm:p-5 glass-card-interactive flex flex-col items-center justify-center text-center gap-2 sm:gap-3 min-h-[115px] sm:min-h-[135px]"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-500/15 dark:bg-blue-500/25 border border-blue-500/30 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xs shrink-0">
            <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </div>
          <span className="font-black text-[11px] sm:text-xs md:text-sm uppercase tracking-wide text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
            {t('home.saudaList', 'VYAPAR ORDER LIST')}
          </span>
        </button>

        {/* 3. Create New Vyapar Order (Hero Action) */}
        <button
          type="button"
          onClick={() => navigate('/vyapar/create')}
          className="relative group overflow-hidden rounded-3xl p-3.5 sm:p-5 glass-card-interactive flex flex-col items-center justify-center text-center gap-2 sm:gap-3 min-h-[115px] sm:min-h-[135px] border-orange-300/60 dark:border-orange-500/30"
        >
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl text-white flex items-center justify-center shadow-md shadow-orange-500/25 group-hover:scale-110 transition-transform duration-300 shrink-0"
            style={{ backgroundColor: palette.primary }}
          >
            <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.3]" />
          </div>
          <span
            className="font-black text-[11px] sm:text-xs md:text-sm uppercase tracking-wide leading-snug transition-colors line-clamp-2"
            style={{ color: palette.primary }}
          >
            {t('home.createSauda', 'CREATE NEW VYAPAR ORDER')}
          </span>
        </button>

        {/* 4. Item List */}
        <button
          type="button"
          onClick={() => navigate('/items')}
          className="relative group overflow-hidden rounded-3xl p-3.5 sm:p-5 glass-card-interactive flex flex-col items-center justify-center text-center gap-2 sm:gap-3 min-h-[115px] sm:min-h-[135px]"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-purple-500/15 dark:bg-purple-500/25 border border-purple-500/30 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xs shrink-0">
            <Package className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </div>
          <span className="font-black text-[11px] sm:text-xs md:text-sm uppercase tracking-wide text-gray-800 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2 leading-snug">
            {t('home.itemList', 'ITEM LIST')}
          </span>
        </button>

        {/* 5. Companies */}
        <button
          type="button"
          onClick={() => navigate('/companies')}
          className="relative group overflow-hidden rounded-3xl p-3.5 sm:p-5 glass-card-interactive flex flex-col items-center justify-center text-center gap-2 sm:gap-3 min-h-[115px] sm:min-h-[135px]"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-teal-500/15 dark:bg-teal-500/25 border border-teal-500/30 dark:border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xs shrink-0">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </div>
          <span className="font-black text-[11px] sm:text-xs md:text-sm uppercase tracking-wide text-gray-800 dark:text-gray-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2 leading-snug">
            {t('home.companies', 'COMPANIES')}
          </span>
        </button>

        {/* 6. Vyapar Bill */}
        <button
          type="button"
          onClick={() => navigate('/vyapar/bills')}
          className="relative group overflow-hidden rounded-3xl p-3.5 sm:p-5 glass-card-interactive flex flex-col items-center justify-center text-center gap-2 sm:gap-3 min-h-[115px] sm:min-h-[135px]"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/15 dark:bg-amber-500/25 border border-amber-500/30 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xs shrink-0">
            <Receipt className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </div>
          <span className="font-black text-[11px] sm:text-xs md:text-sm uppercase tracking-wide text-gray-800 dark:text-gray-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
            {t('home.saudaBill', 'VYAPAR BILL')}
          </span>
        </button>
      </div>

      {/* Switch Company & Financial Year Modal */}
      <ChangeCompanyFYModal
        isOpen={showSwitchModal}
        onClose={() => setShowSwitchModal(false)}
      />
    </div>
  );
};
