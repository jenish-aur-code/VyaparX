import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { DesktopSidebar } from './DesktopSidebar';
import { TopHeader } from './TopHeader';
import { MobileBottomNav } from './MobileBottomNav';
import { PinLockModal } from '../common/PinLockModal';

export const AppShell: React.FC = () => {
  const location = useLocation();
  const isSplash = location.pathname === '/' || location.pathname === '/splash';

  if (isSplash) {
    return (
      <main className="min-h-screen bg-[#FF9800]">
        <PinLockModal />
        <Outlet />
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
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
