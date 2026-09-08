import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, Users, ReceiptText, Building2, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const navItems = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/items', label: 'Items', icon: Package },
    { to: '/parties', label: 'Parties', icon: Users },
    { to: '/sauda', label: 'Sauda', icon: ReceiptText },
    { to: '/companies', label: 'Comp.', icon: Building2 },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200/80 px-2 py-1.5 safe-area-bottom shadow-lg">
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
                    ? 'text-[#FF9800]'
                    : 'text-gray-400 hover:text-gray-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`w-9 h-6 flex items-center justify-center rounded-full transition-colors ${
                      isActive ? 'bg-[#FFF3E0]' : 'bg-transparent'
                    }`}
                  >
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span
                    className={`text-[11px] font-semibold mt-0.5 tracking-tight ${
                      isActive ? 'text-[#FF9800]' : 'text-gray-500'
                    }`}
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
