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
  ShieldCheck,
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { usePwa } from '../../context/PwaContext';

export const DesktopSidebar: React.FC = () => {
  const { isSidebarCollapsed } = useApp();
  const { palette } = useTheme();
  const { t } = useLanguage();
  const { isInstalled, promptInstall } = usePwa();
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
    <aside
      className={`hidden md:flex flex-col ${
        isSidebarCollapsed ? 'w-[72px]' : 'w-64'
      } bg-white/75 dark:bg-gray-900/70 backdrop-blur-2xl border-r border-white/50 dark:border-white/15 h-screen shrink-0 z-30 shadow-glass dark:shadow-glass-dark select-none transition-[width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden`}
    >
      {/* Brand Header - Exactly h-16 to perfectly align horizontally with TopHeader */}
      <div
        className="h-16 border-b border-white/40 dark:border-white/10 flex items-center shrink-0 px-3.5 gap-3 bg-gradient-to-r from-orange-50/50 dark:from-white/5 to-transparent overflow-hidden"
      >
        <div
          className="w-10 h-10 rounded-2xl text-white flex items-center justify-center shadow-md shadow-orange-500/25 shrink-0 transition-transform active:scale-95 cursor-pointer"
          style={{ backgroundColor: palette.primary }}
          title="VyaparX Commodity ERP"
        >
          <Briefcase className="w-5 h-5" />
        </div>
        <div
          className={`min-w-0 flex-1 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden whitespace-nowrap ${
            isSidebarCollapsed ? 'opacity-0 max-w-0 pointer-events-none -translate-x-2' : 'opacity-100 max-w-[180px] translate-x-0'
          }`}
        >
          <span className="font-black text-xl text-gray-900 dark:text-white tracking-tight block leading-none truncate">
            VyaparX
          </span>
          <span
            className="text-[11px] font-bold uppercase tracking-wider block truncate mt-0.5"
            style={{ color: palette.primary }}
          >
            Commodity ERP
          </span>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className={`flex-1 overflow-y-auto space-y-1.5 scrollbar-thin pt-3.5 ${isSidebarCollapsed ? 'px-2 pb-2' : 'px-3 pb-2'}`}>
        {!isSidebarCollapsed ? (
          <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-1 animate-in fade-in duration-200">
            {t('nav.mainMenu', 'Main Menu')}
          </div>
        ) : null}

        {mainNav.map(item => {
          const Icon = item.icon;
          const active = isItemActive(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={isSidebarCollapsed ? item.label : undefined}
              style={active ? { backgroundColor: palette.primary } : undefined}
              className={`flex items-center rounded-2xl transition-all duration-200 active:scale-95 overflow-hidden whitespace-nowrap ${
                isSidebarCollapsed
                  ? 'justify-center w-11 h-11 mx-auto px-0'
                  : 'gap-3 px-3.5 py-2.5 text-sm font-semibold'
              } ${
                active
                  ? 'text-white shadow-md shadow-orange-500/20 font-bold'
                  : item.isHighlight
                  ? 'bg-orange-50/70 dark:bg-orange-950/30 text-orange-800 dark:text-orange-300 hover:bg-orange-100/70 dark:hover:bg-orange-900/40 border border-orange-200/50 dark:border-orange-800/30 font-bold'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`${isSidebarCollapsed ? 'w-5 h-5' : 'w-4 h-4'} stroke-[2.2] shrink-0`} />
              <span
                className={`transition-all duration-200 ease-out overflow-hidden whitespace-nowrap truncate ${
                  isSidebarCollapsed ? 'opacity-0 max-w-0 pointer-events-none' : 'opacity-100 max-w-[180px]'
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}

        {/* Section Divider */}
        {isSidebarCollapsed ? (
          <div className="my-2 border-t border-white/40 dark:border-white/10 mx-2" />
        ) : (
          <div className="pt-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-1 animate-in fade-in duration-200">
            {t('nav.operations', 'Operations & Reports')}
          </div>
        )}

        {quickLinks.map(item => {
          const Icon = item.icon;
          const active = isItemActive(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={isSidebarCollapsed ? item.label : undefined}
              style={active ? { backgroundColor: palette.primary } : undefined}
              className={`flex items-center rounded-2xl transition-all duration-200 active:scale-95 overflow-hidden whitespace-nowrap ${
                isSidebarCollapsed
                  ? 'justify-center w-11 h-11 mx-auto px-0'
                  : 'gap-3 px-3.5 py-2.5 text-sm font-semibold'
              } ${
                active
                  ? 'text-white shadow-md shadow-orange-500/20 font-bold'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`${isSidebarCollapsed ? 'w-5 h-5' : 'w-4 h-4'} stroke-[2.2] shrink-0`} />
              <span
                className={`transition-all duration-200 ease-out overflow-hidden whitespace-nowrap truncate ${
                  isSidebarCollapsed ? 'opacity-0 max-w-0 pointer-events-none' : 'opacity-100 max-w-[180px]'
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>

      {/* Download Web App Button in Sidebar */}
      <div className={isSidebarCollapsed ? 'px-2 pb-2 flex justify-center' : 'px-3 pb-2'}>
        <button
          type="button"
          onClick={promptInstall}
          title={isSidebarCollapsed ? (isInstalled ? t('nav.appInstalled', 'App Installed') : t('nav.downloadApp', 'Download App')) : undefined}
          className={`${
            isSidebarCollapsed
              ? 'w-11 h-11 flex items-center justify-center rounded-2xl'
              : 'w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl text-xs'
          } bg-orange-50/70 hover:bg-orange-100/70 dark:bg-orange-950/30 dark:hover:bg-orange-900/40 backdrop-blur-xl border border-orange-200/80 dark:border-orange-800/50 text-orange-700 dark:text-orange-300 font-bold transition-all shadow-2xs active:scale-95 cursor-pointer overflow-hidden whitespace-nowrap`}
        >
          <Download className="w-4 h-4 stroke-[2.5] shrink-0" />
          <span
            className={`transition-all duration-200 ease-out overflow-hidden whitespace-nowrap truncate ${
              isSidebarCollapsed ? 'opacity-0 max-w-0 pointer-events-none' : 'opacity-100 max-w-[180px]'
            }`}
          >
            {isInstalled ? t('nav.appInstalled', 'App Installed') : t('nav.downloadApp', 'Download App')}
          </span>
        </button>
      </div>

      {/* Footer Info (Plain text Security info & v1.0) */}
      <div
        className={`border-t border-white/40 dark:border-white/10 flex items-center ${
          isSidebarCollapsed ? 'h-12 justify-center px-1' : 'h-12 px-4 justify-between text-xs'
        } text-gray-400 dark:text-gray-500 bg-white/20 dark:bg-gray-900/20 shrink-0 overflow-hidden whitespace-nowrap select-none`}
      >
        <div
          title={isSidebarCollapsed ? 'Security • v1.0' : undefined}
          className="flex items-center gap-1.5 font-medium text-gray-500 dark:text-gray-400 overflow-hidden"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span
            className={`text-xs font-semibold tracking-wide transition-all duration-200 ease-out overflow-hidden whitespace-nowrap truncate ${
              isSidebarCollapsed ? 'opacity-0 max-w-0 pointer-events-none' : 'opacity-100 max-w-[120px]'
            }`}
          >
            {t('nav.security', 'Security')}
          </span>
        </div>
        {!isSidebarCollapsed && (
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-white/50 dark:bg-gray-800/50 border border-white/40 dark:border-white/10 text-gray-400 dark:text-gray-500 font-bold shrink-0 animate-in fade-in">
            v1.0
          </span>
        )}
      </div>
    </aside>
  );
};
