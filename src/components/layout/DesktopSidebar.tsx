import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Package,
  Users,
  ReceiptText,
  Building2,
  User,
  Briefcase,
  PlusCircle,
  FileSpreadsheet,
  BarChart3,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export const DesktopSidebar: React.FC = () => {
  const { currentCompany, currentFinancialYear, isPinLocked } = useApp();
  const { palette } = useTheme();
  const { t } = useLanguage();
  const location = useLocation();

  const mainNav = [
    { to: '/home', label: t('nav.dashboard', 'Dashboard'), icon: Home },
    { to: '/vyapar', label: t('nav.saudaOrders', 'Vyapar Orders'), icon: ReceiptText },
    { to: '/vyapar/create', label: t('nav.createSauda', 'Create Vyapar Order'), icon: PlusCircle, isHighlight: true },
    { to: '/items', label: t('nav.items', 'Commodity Items'), icon: Package },
    { to: '/parties', label: t('nav.parties', 'Parties (Buyers/Sellers)'), icon: Users },
    { to: '/companies', label: t('nav.companies', 'Companies'), icon: Building2 },
  ];

  const quickLinks = [
    { to: '/vyapar/bills', label: t('nav.bills', 'Vyapar Bills & PDF'), icon: FileSpreadsheet },
    { to: '/profile/reports', label: t('nav.reports', 'Brokerage Reports'), icon: BarChart3 },
    { to: '/profile', label: t('nav.settings', 'Settings & Profile'), icon: User },
  ];

  const isItemActive = (path: string) => {
    if (path === '/home') return location.pathname === '/home';
    if (path === '/vyapar' || path === '/sauda') return location.pathname === '/vyapar' || location.pathname === '/sauda';
    if (path === '/vyapar/create' || path === '/sauda/create') return location.pathname === '/vyapar/create' || location.pathname === '/sauda/create';
    if (path === '/vyapar/bills' || path === '/sauda/bills') return location.pathname === '/vyapar/bills' || location.pathname === '/sauda/bills';
    if (path === '/items') return location.pathname.startsWith('/items');
    if (path === '/parties') return location.pathname.startsWith('/parties');
    if (path === '/companies') return location.pathname.startsWith('/companies');
    if (path === '/profile/reports') return location.pathname === '/profile/reports';
    if (path === '/profile') return location.pathname.startsWith('/profile') && location.pathname !== '/profile/reports';
    return location.pathname === path;
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen sticky top-0 shrink-0 z-30 shadow-xs select-none transition-colors">
      {/* Brand Header */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-gradient-to-r from-orange-50/70 dark:from-gray-800/40 to-transparent">
        <div
          className="w-10 h-10 rounded-xl text-white flex items-center justify-center shadow-md shrink-0"
          style={{ backgroundColor: palette.primary }}
        >
          <Briefcase className="w-5 h-5" />
        </div>
        <div>
          <span className="font-black text-xl text-gray-900 dark:text-white tracking-tight block leading-none">
            VyaparX
          </span>
          <span
            className="text-[11px] font-bold uppercase tracking-wider"
            style={{ color: palette.primary }}
          >
            Commodity ERP
          </span>
        </div>
      </div>

      {/* Active Company & FY Badge */}
      <div className="px-4 py-3 bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-800">
        <div className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
          {t('nav.activeProfile', 'Active Profile')}:
        </div>
        <div className="font-bold text-xs text-gray-900 dark:text-gray-100 truncate">
          {currentCompany?.name || 'KRISHNA FIBERS'}
        </div>
        <div
          className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-md"
          style={{ backgroundColor: palette.light, color: palette.text }}
        >
          {t('common.financialYear', 'FY')}: {currentFinancialYear}
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-1">
          {t('nav.mainMenu', 'Main Menu')}
        </div>
        {mainNav.map(item => {
          const Icon = item.icon;
          const active = isItemActive(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              style={active ? { backgroundColor: palette.primary } : undefined}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? 'text-white shadow-sm'
                  : item.isHighlight
                  ? 'bg-orange-50 dark:bg-gray-800 text-orange-800 dark:text-orange-300 hover:bg-orange-100/70 dark:hover:bg-gray-750 font-bold'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 stroke-[2.2]" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <div className="pt-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-1">
          {t('nav.operations', 'Operations & Reports')}
        </div>
        {quickLinks.map(item => {
          const Icon = item.icon;
          const active = isItemActive(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              style={active ? { backgroundColor: palette.primary } : undefined}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? 'text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 stroke-[2.2]" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
        <NavLink to="/profile/security" className="flex items-center gap-1.5 hover:text-orange-600 font-medium">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{isPinLocked ? 'PIN Locked' : 'PIN Security'}</span>
        </NavLink>
        <span>v1.0 Web</span>
      </div>
    </aside>
  );
};
