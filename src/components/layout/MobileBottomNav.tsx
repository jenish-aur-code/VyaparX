import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, Users, ReceiptText, Building2, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export const MobileBottomNav: React.FC = () => {
  const { palette } = useTheme();
  const { t } = useLanguage();

  const navItems = [
    { to: '/home', label: t('nav.home', 'Home'), icon: Home },
    { to: '/items', label: t('nav.itemsShort', 'Items'), icon: Package },
    { to: '/parties', label: t('nav.partiesShort', 'Parties'), icon: Users },
    { to: '/vyapar', label: t('nav.saudaShort', 'Vyapar'), icon: ReceiptText },
    { to: '/companies', label: t('nav.comp', 'Comp.'), icon: Building2 },
    { to: '/profile', label: t('nav.profile', 'Profile'), icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200/80 dark:border-gray-800 px-2 py-1.5 safe-area-bottom shadow-lg transition-colors">
      <div className="flex items-center justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 ${
                  isActive
                    ? ''
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`
              }
              style={({ isActive }) => (isActive ? { color: palette.primary } : {})}
            >
              {({ isActive }) => (
                <>
                  <div
                    className="w-9 h-6 flex items-center justify-center rounded-full transition-colors"
                    style={isActive ? { backgroundColor: palette.light } : { backgroundColor: 'transparent' }}
                  >
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span
                    className="text-[11px] font-semibold mt-0.5 tracking-tight"
                    style={isActive ? { color: palette.primary } : {}}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
