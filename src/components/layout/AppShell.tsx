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
  const isSplash =
    location.pathname === '/' ||
    location.pathname === '/splash' ||
    location.pathname === '/login' ||
    location.pathname === '/verify-otp';

  if (isSplash) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: palette.primary }}>
        <PinLockModal />
        <Outlet />
      </main>
    );
  }

  // Standalone Company Setup Screen for New Users (No sidebar, top header, or bottom nav)
  if (location.pathname === '/create-first-company') {
    return (
      <main className="min-h-screen bg-[#F5F7FA] dark:bg-[#0B1120] text-gray-900 dark:text-gray-100">
        <Outlet />
      </main>
    );
  }

  return (
    <div className="relative flex h-screen max-h-screen overflow-hidden bg-[#F8FAFC] dark:bg-[#0C1222] text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Dynamic Animated Main App Background (Crisp HD & User-Requested Light Black Layer) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none" aria-hidden="true">
        {/* Base HD Wallpaper Layer - Razor Sharp 2560x1338 (No CSS scaling transforms, 100% crisp) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 dark:opacity-90 opacity-25"
          style={{
            backgroundImage: "url('/main-bg.png')",
          }}
        />

        {/* Light Black Layer (User Requested: Softens & tones down background while keeping graphics crisp in HD) */}
        <div className="absolute inset-0 bg-black/30 dark:bg-black/40 pointer-events-none" />

        {/* Dynamic Subtle Theme Tint Wash (Soft hue adaptation, zero blur) */}
        <div
          className="absolute inset-0 transition-colors duration-700 pointer-events-none mix-blend-color opacity-10 dark:opacity-15"
          style={{ backgroundColor: palette.primary }}
        />

        {/* Smooth Ambient Light Pulse (Pure opacity breathing without blurring wallpaper) */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-screen animate-ambient-pulse"
          style={{
            background: `radial-gradient(circle at 12% 22%, ${palette.primary} 0%, transparent 45%), radial-gradient(circle at 88% 88%, ${palette.primary} 0%, transparent 45%)`,
          }}
        />

        {/* Light Mode Soft Frosted Veil (Maintains pristine contrast and text readability in light mode) */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/85 dark:opacity-0 transition-opacity duration-500 pointer-events-none" />

        {/* Ultra-soft Radial Vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/10 dark:to-black/20 pointer-events-none" />
      </div>

      <PinLockModal />
      
      {/* Desktop Sidebar (Fixed Left Column) */}
      <DesktopSidebar />

      {/* Main Right Column (Fixed Header + Scrollable Middle Viewport) */}
      <div className="relative flex-1 flex flex-col h-screen max-h-screen min-w-0 overflow-hidden">
        <TopHeader />
        
        {/* Isolated Scrollable Viewport - Only this container scrolls */}
        <main className="relative z-10 flex-1 overflow-y-auto min-w-0 w-full scroll-smooth pb-24 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Dock */}
      <MobileBottomNav />
    </div>
  );
};
