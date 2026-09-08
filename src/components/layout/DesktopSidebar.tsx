import React from 'react';
import { NavLink } from 'react-router-dom';
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
  Truck,
  CreditCard,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DesktopSidebar: React.FC = () => {
  const { currentCompany, currentFinancialYear, isPinLocked } = useApp();

  const mainNav = [
    { to: '/home', label: 'Dashboard', icon: Home },
    { to: '/sauda', label: 'Sauda Orders', icon: ReceiptText },
    { to: '/sauda/create', label: 'Create Sauda Order', icon: PlusCircle, isHighlight: true },
    { to: '/items', label: 'Commodity Items', icon: Package },
    { to: '/parties', label: 'Parties (Buyers/Sellers)', icon: Users },
    { to: '/companies', label: 'Companies', icon: Building2 },
  ];

  const quickLinks = [
    { to: '/sauda/dispatch', label: 'Sauda Dispatch', icon: Truck },
    { to: '/sauda/bills', label: 'Sauda Bills & PDF', icon: FileSpreadsheet },
    { to: '/profile/reports', label: 'Brokerage Reports', icon: CreditCard },
    { to: '/profile', label: 'Settings & Profile', icon: User },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0 shrink-0 z-30 shadow-xs select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-gray-100 flex items-center gap-3 bg-gradient-to-r from-orange-50/70 to-transparent">
        <div className="w-10 h-10 rounded-xl bg-[#FF9800] text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
          <Briefcase className="w-5 h-5" />
        </div>
        <div>
          <span className="font-black text-xl text-gray-900 tracking-tight block leading-none">
            Sauda Book
          </span>
          <span className="text-[11px] font-semibold text-orange-600 uppercase tracking-wider">
            Commodity ERP
          </span>
        </div>
      </div>

      {/* Active Company & FY Badge */}
      <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-100">
        <div className="text-[11px] font-medium text-gray-500">Active Profile:</div>
        <div className="font-bold text-xs text-gray-900 truncate">
          {currentCompany?.name || 'KRISHNA FIBERS'}
        </div>
        <div className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-orange-100 text-orange-800">
          FY: {currentFinancialYear}
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-1">
          Main Menu
        </div>
        {mainNav.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#FF9800] text-white shadow-sm shadow-orange-500/20'
                    : item.isHighlight
                    ? 'bg-orange-50 text-orange-800 hover:bg-orange-100/70 font-bold'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-4 h-4 stroke-[2.2]" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <div className="pt-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-1">
          Operations & Reports
        </div>
        {quickLinks.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#FF9800] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-4 h-4 stroke-[2.2]" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
        <NavLink to="/profile/security" className="flex items-center gap-1.5 hover:text-orange-600 font-medium">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{isPinLocked ? 'PIN Locked' : 'PIN Security'}</span>
        </NavLink>
        <span>v1.0 Web</span>
      </div>
    </aside>
  );
};
