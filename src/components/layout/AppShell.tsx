import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { DesktopSidebar } from './DesktopSidebar';
import { TopHeader } from './TopHeader';
import { MobileBottomNav } from './MobileBottomNav';
import { PinLockModal } from '../common/PinLockModal';
import { useTheme } from '../../context/ThemeContext';

export const AppShell: React.FC = () => {
  const location = useLocation();
  const { palette } = useTheme();
  const isSplash = location.pathname === '/' || location.pathname === '/splash';

  if (isSplash) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: palette.primary }}>
        <PinLockModal />
        <Outlet />
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F5F7FA] dark:bg-[#0B1120] text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <PinLockModal />
      <DesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <TopHeader />
        
        <main className="flex-1 max-w-5xl w-full mx-auto p-0 md:p-6">
          <Outlet />
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};
